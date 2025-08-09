from utils import load_api_key
from constants import SYSTEM_INSTRUCTIONS

from logger import logging


def call_gemini(prompt: str, model: str) -> str:
    try:
        # Import here to allow --raw-response-file mode without the SDK installed
        from google import genai  # type: ignore
    except Exception as exc:  # pragma: no cover
        raise SystemExit("google-genai is not installed. Run: pip install -r requirements.txt") from exc

    client = genai.Client(api_key=load_api_key())
    response = client.models.generate_content(
        model=model,
        contents=f"{SYSTEM_INSTRUCTIONS}\n\nUser requirements:\n{prompt}",
        config={
            "response_mime_type": "application/json",
        },
    )
    text = getattr(response, "text", None)
    if not text:
        logging.error("Empty response from Gemini.")
        raise SystemExit("Empty response from Gemini.")
    logging.info(f"Gemini response: {text}")
    logging.info(f"Gemini response type: {type(text)}")
    return text
