import logging

from .constants import LOG_DIR


def setup_logging(filename: str, verbose: bool = False) -> None:
    # Create logs directory if it doesn't exist
    LOG_DIR.mkdir(exist_ok=True)

    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(filename=LOG_DIR / filename, level=level, format="%(asctime)s: %(levelname)s: %(message)s")
