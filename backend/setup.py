from pathlib import Path
from setuptools import setup


def load_requirements(requirements_path: Path) -> list[str]:
    if not requirements_path.exists():
        return []
    lines: list[str] = []
    for raw in requirements_path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        # Ignore editable installs or local paths for this simple setup
        if line.startswith("-e ") or line.startswith("--"):
            continue
        lines.append(line)
    return lines


root = Path(__file__).resolve().parent
install_requires = load_requirements(root / "requirements.txt")

setup(
    name="lovable-p1-mini",
    version="0.1.0",
    author="Pavas",
    author_email="pavasgdb@gmail.com",
    url="https://github.com/pavasgdb/lovable-p1-mini",
    description="Lovable P1 Mini",
    install_requires=install_requires,
)
