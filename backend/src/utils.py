import os
import re
import json
from typing import Any, Dict, List
from pathlib import Path
import shutil
import logging


def load_api_key() -> str:
    # support .env (optional)
    try:
        from dotenv import load_dotenv  # type: ignore

        load_dotenv()
    except Exception:
        pass
    api_key = os.environ.get("GOOGLE_API_KEY", "").strip()
    if not api_key:
        raise SystemExit("GOOGLE_API_KEY is not set. Export it or put it in a .env file.")
    return api_key


def extract_json_block(text: str) -> str:
    # Prefer a fenced json block if present
    code_block = re.search(r"```json\s*([\s\S]*?)```", text, re.IGNORECASE)
    if code_block:
        return code_block.group(1).strip()
    # Fallback: try raw JSON
    text = text.strip()
    if text.startswith("{") and text.endswith("}"):
        return text
    # Try to locate the first { ... } block heuristically
    first_brace = text.find("{")
    last_brace = text.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        return text[first_brace : last_brace + 1]
    raise SystemExit("Could not extract JSON from model response.")


def _unescape_backtick_block(s: str) -> str:
    """Convert a backtick-delimited pseudo-string body into real text.
    Handles sequences like backtick, newline, tab, backslash, used in template literals.
    """
    s = s.replace("\\`", "`")
    s = s.replace("\\n", "\n").replace("\\r", "\r").replace("\\t", "\t")
    # Unescape backslash first to avoid double-unescaping issues
    s = s.replace("\\\\", "\\")
    # Common over-escaping from model
    s = s.replace('\\"', '"').replace("\\'", "'")
    s = s.replace("\\${", "${")
    return s


def sanitize_backtick_json(raw_text: str) -> Dict[str, Any]:
    """Accepts model output where values like content use backtick strings.

    Transforms occurrences of "content": `...` into placeholders so we can
    parse JSON, then restores the original text into the parsed dict.
    """
    placeholder_map: Dict[str, str] = {}

    def repl(match: re.Match[str]) -> str:
        nonlocal placeholder_map
        prefix = match.group(1)  # includes "content": and whitespace
        body = match.group(2)
        key = f"__BT_{len(placeholder_map)}__"
        placeholder_map[key] = _unescape_backtick_block(body)
        return f'{prefix}"{key}"'

    # Replace unescaped backtick blocks for content only
    pattern = re.compile(r'("content"\s*:\s*)`((?:\\`|[^`])*)`')
    replaced = pattern.sub(repl, raw_text)

    try:
        data = json.loads(replaced)
    except Exception as exc:
        raise SystemExit(f"Failed to parse sanitized JSON: {exc}")

    def restore(obj: Any) -> Any:
        if isinstance(obj, dict):
            return {k: restore(v) for k, v in obj.items()}
        if isinstance(obj, list):
            return [restore(v) for v in obj]
        if isinstance(obj, str) and obj in placeholder_map:
            return placeholder_map[obj]
        return obj

    return restore(data)  # type: ignore[return-value]


def is_within(base: Path, target: Path) -> bool:
    try:
        target.resolve().relative_to(base.resolve())
        return True
    except Exception:
        return False


def _normalize_code_content(content: str, rel_path: str) -> str:
    # For code/text files, remove unnecessary escape sequences
    code_like = (".ts", ".tsx", ".js", ".jsx", ".css", ".html", ".md")
    if any(rel_path.endswith(ext) for ext in code_like):
        content = content.replace('\\"', '"').replace("\\'", "'")
        # Fix common MUI icon import mistakes
        content = _rewrite_mui_icon_imports(content)
    return content


def _rewrite_mui_icon_imports(source: str) -> str:
    """Rewrite named MUI icon imports to per-file default imports.

    Examples:
      import { ShoppingCart } from '@mui/icons-material';
        -> import ShoppingCart from '@mui/icons-material/ShoppingCart';
      import { ShoppingCart as Cart } from '@mui/icons-material';
        -> import Cart from '@mui/icons-material/ShoppingCart';
      import { Home, Search } from '@mui/icons-material';
        -> import Home from '@mui/icons-material/Home';\n           import Search from '@mui/icons-material/Search';
      import { Delete } from '@mui/icons-material/Delete';
        -> import Delete from '@mui/icons-material/Delete'; (drop braces)
    """
    # Case 1: named imports from the barrel '@mui/icons-material'
    pattern_barrel = re.compile(r"^\s*import\s*\{([^}]+)\}\s*from\s*['\"]@mui/icons-material['\"];?\s*$", re.MULTILINE)

    def repl_barrel(match: re.Match[str]) -> str:
        items_raw = match.group(1)
        parts = [p.strip() for p in items_raw.split(",") if p.strip()]
        lines: list[str] = []
        for part in parts:
            # supports "Name as Alias" or just "Name"
            if " as " in part:
                name, alias = [x.strip() for x in part.split(" as ", 1)]
                local = alias
                icon = name
            else:
                icon = part
                local = part
            lines.append(f"import {local} from '@mui/icons-material/{icon}';")
        return "\n".join(lines)

    source = pattern_barrel.sub(repl_barrel, source)

    # Case 2: named import from a specific icon path e.g. { Delete } from '@mui/icons-material/Delete'
    pattern_specific = re.compile(
        r"^\s*import\s*\{\s*([A-Za-z0-9_]+)\s*\}\s*from\s*['\"]@mui/icons-material/([A-Za-z0-9_]+)['\"];?\s*$",
        re.MULTILINE,
    )

    def repl_specific(match: re.Match[str]) -> str:
        local = match.group(1)
        icon = match.group(2)
        return f"import {local} from '@mui/icons-material/{icon}';"

    source = pattern_specific.sub(repl_specific, source)

    return source


def write_files(
    app_dir: Path, payload: Dict[str, Any], allow_public: bool = True, overwrite: bool = True
) -> List[Path]:
    files = payload.get("files")
    if not isinstance(files, list):
        raise SystemExit("Invalid JSON: 'files' must be a list")

    written: List[Path] = []
    for entry in files:
        if not isinstance(entry, dict):
            continue
        rel_path = str(entry.get("path", "")).strip()
        content: Any = entry.get("content", "")
        if not rel_path:
            continue
        if isinstance(entry.get("content_lines"), list):
            # join content_lines if provided
            try:
                lines = entry.get("content_lines")
                content = "\n".join(str(line) for line in lines)
            except Exception as e:
                logging.error(f"Error joining content_lines: {e}")
                content = ""
        if not isinstance(content, str):
            continue

        # constrain paths
        allowed = rel_path.startswith("src/") or (allow_public and rel_path.startswith("public/"))
        if not allowed:
            logging.warning(f"Skipping disallowed path: {rel_path}")
            continue

        abs_path = (app_dir / rel_path).resolve()
        if not is_within(app_dir, abs_path):
            logging.warning(f"Skipping non-contained path: {rel_path}")
            continue

        abs_path.parent.mkdir(parents=True, exist_ok=True)
        if abs_path.exists() and not overwrite:
            logging.info(f"Exists (skip): {rel_path}")
            continue
        content = _normalize_code_content(content, rel_path)
        abs_path.write_text(content, encoding="utf-8")
        written.append(abs_path)
    return written


def copy_template_to_uid(template_root: Path, uid_root: Path) -> None:
    if uid_root.exists():
        shutil.rmtree(uid_root)
    # Exclude build artifacts and package manager directories
    ignore = shutil.ignore_patterns("node_modules", "dist", ".next", ".turbo", ".parcel-cache", ".vite", "build")
    shutil.copytree(template_root, uid_root, ignore=ignore)
