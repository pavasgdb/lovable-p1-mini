import json
import subprocess
import uuid
from pathlib import Path
from datetime import datetime
import logging
import argparse

from .constants import DEFAULT_TEMPLATE_REACT_APP_DIR, DEFAULT_GENERATED_APP_DIR, DEFAULT_MODEL
from .utils import extract_json_block, sanitize_backtick_json, copy_template_to_uid, write_files
from .gemini_handler import call_gemini
from .logger import setup_logging


def generate_app(
    prompt: str,
    model: str,
    app_dir: Path,
    out_root: Path,
    allow_public: bool = True,
    dry_run: bool = False,
    auto_install: bool = False,
    raw_response_file: str = None,
) -> None:

    prompt = prompt or "Create a sample page that says hello using Material UI Button."

    app_dir = Path(app_dir).resolve()
    if not app_dir.exists():
        raise SystemExit(f"App dir not found: {app_dir}")

    # Prepare unique output dir with timestamp and short uid
    uid_short = uuid.uuid4().hex[:8]
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    uid = f"{timestamp}-{uid_short}"
    out_root = Path(out_root).resolve()
    out_root.mkdir(parents=True, exist_ok=True)
    target_dir = (out_root / uid).resolve()

    logging.info(f"Template: {app_dir}")
    logging.info(f"Target: {target_dir}")

    if raw_response_file:
        logging.info(f"Using raw response file: {raw_response_file}")
        raw = Path(raw_response_file).read_text(encoding="utf-8")
    else:
        logging.info("Calling Gemini ...")
        raw = call_gemini(prompt, model)
    try:
        json_text = extract_json_block(raw)
        try:
            data = json.loads(json_text)
        except Exception:
            # Fallback for backtick-delimited content blocks inside JSON
            data = sanitize_backtick_json(json_text)
    except Exception as exc:
        logging.error(f"Model response (raw):\n{raw}")
        raise SystemExit(f"Failed to parse JSON from model response: {exc}")

    # Always save the raw response for auditing
    responses_dir = Path(__file__).resolve().parents[1] / "gemini-responses"
    responses_dir.mkdir(parents=True, exist_ok=True)
    response_path = responses_dir / f"{uid}.json"
    response_path.write_text(json.dumps(data, indent=4))
    logging.info(f"Saved raw response: {response_path}")

    if dry_run:
        files = data.get("files", [])
        logging.info(f"Would write {len(files)} files")
        for f in files:
            logging.info(f" - {f.get('path')}")
        return

    # Copy template to unique target and then write files inside it
    copy_template_to_uid(app_dir, target_dir)
    written = write_files(target_dir, data, allow_public=allow_public, overwrite=True)

    if auto_install:
        logging.info(f"Running npm install in {target_dir}")
        try:
            subprocess.run(["npm", "install", "--no-audit", "--no-fund"], cwd=str(target_dir), check=True)
        except subprocess.CalledProcessError as exc:
            logging.error(f"npm install failed: {exc}")

    if not written:
        logging.warning("No files were written.")
    else:
        logging.info(f"Wrote {len(written)} files: {written}")
        for p in written:
            rel = p.relative_to(target_dir)
            logging.info(f" - {rel}")

    rows = []
    for file in data.get("files", []):
        file_name = file["path"].split("/")[-1]
        file_type = "component"
        if "pages" in file_name:
            file_type = "page"
        elif ".css" in file_name:
            file_type = "style"
        elif ".json" in file_name:
            file_type = "config"
        content = file.get("content", "")
        if not content:
            content = file.get("content_lines", [])
            content = "\n".join(str(line) for line in content)

        row = {
            "name": file_name,
            "path": file["path"],
            "type": file_type,
            "content": content,
        }
        rows.append(row)

    response = {
        "uid": uid,
        "target_dir": str(target_dir),
        "files": rows,
    }
    return response


def parse_args() -> argparse.Namespace:

    parser = argparse.ArgumentParser(description="Generate React code into a Material UI template using Google Gemini.")
    parser.add_argument("--prompt", help="User requirement text", required=False)
    parser.add_argument("--model", default=DEFAULT_MODEL, help=f"Gemini model name (default: {DEFAULT_MODEL})")
    parser.add_argument(
        "--app-dir",
        default=str(DEFAULT_TEMPLATE_REACT_APP_DIR),
        help=f"Path to the React template root (default: {DEFAULT_TEMPLATE_REACT_APP_DIR})",
    )
    parser.add_argument(
        "--out-root",
        default=str(DEFAULT_GENERATED_APP_DIR),
        help="Output base dir to place generated app under a unique id",
    )
    parser.add_argument("--allow-public", action="store_true", help="Allow writing under public/ as well as src/")
    parser.add_argument("--dry-run", action="store_true", help="Only print the files that would be written")
    parser.add_argument(
        "--auto-install",
        action="store_true",
        help="Run npm install inside the generated app directory after writing files",
    )
    parser.add_argument(
        "--raw-response-file",
        help="Debug: path to a file that contains the raw model response text (skips API call)",
    )
    parser.add_argument("--verbose", action="store_true", help="Enable debug logging")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    setup_logging(filename="generate_app.log", verbose=args.verbose)
    response = generate_app(
        args.prompt,
        args.model,
        args.app_dir,
        args.out_root,
        args.allow_public,
        args.dry_run,
        args.auto_install,
        args.raw_response_file,
    )
    logging.info(f"App generated at {response['target_dir']}")
    print(f"uid: {response['uid']}")
    print(f"Steps:")
    print(f"Go to folder `cd {response['target_dir']}`")
    print(f"run `npm install` to install dependencies")
    print(f"run `npm run dev` to start the app")
