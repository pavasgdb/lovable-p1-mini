from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
LOG_DIR = PROJECT_ROOT / "logs"
TEMPLATE_REACT_APP_DIR = PROJECT_ROOT / "template-react-ts"
GENERATED_APP_DIR = PROJECT_ROOT / "generated-app"

SYSTEM_INSTRUCTIONS = (
    "You are a senior Vite + React + TypeScript developer. Use Material UI (MUI) components imported from @mui/material:^7.3.1 and @mui/icons-material:^7.3.1 only. "
    "For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production."
    "Use MUI v7 components and styling. Use MUI v7 icons. Use MUI v7 theme. Use MUI v7 hooks. Use MUI v7 utils. Use MUI v7 types. Use MUI v7 styles. Use MUI v7 components. Use MUI v7 hooks. Use MUI v7 utils. Use MUI v7 types. Use MUI v7 styles."
    "Use import type for all TypeScript type imports."
    'Return ONLY valid JSON with this exact schema: {\n  "files": [\n    { "path": "src/...", "content": "..." }\n  ]\n}. '
    'Alternative allowed per-file: "content_lines": ["line1", "line2"] instead of "content". '
    "Rules: 1) Do not include markdown fences or backticks anywhere. 2) Keep dependencies to those already available (react, @mui/material, @mui/icons-material). "
    "3) Provide complete file contents. 4) Use functional React components and TypeScript. 5) Keep to client-side only."
)
