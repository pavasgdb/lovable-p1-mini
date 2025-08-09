#!/usr/bin/env python3
"""
Gemini-powered generator for the Vite + React + Material UI template.

Usage:
  export GOOGLE_API_KEY=your_key
  python3 scripts/generate_app_from_gemini.py --prompt "Build a todo app with filters and localStorage"

This writes files ONLY under the provided app dir's `src/` unless you pass --allow-public.
Response contract required from the model:
{
  "files": [
    { "path": "src/feature/File.tsx", "content": "..." },
    ...
  ]
}
"""
import argparse
import logging
from src.constants import DEFAULT_TEMPLATE_REACT_APP_DIR, DEFAULT_GENERATED_APP_DIR, DEFAULT_MODEL
from src.logger import setup_logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path


app = Flask("lovable-p1-mini")
CORS(app)


# Define the generate_app function as provided by the user
def generate_app(
    prompt: str,
    model: str,
    app_dir: Path,
    out_root: Path,
    raw_response_file: str,
) -> None:
    """
    This is a placeholder function for your application generation logic.
    It simulates an operation using the provided parameters.
    In a real application, this function would contain the core logic to generate an application based on the prompt and other settings.
    """
    from src.generate_app import generate_app as generate_app_impl

    logging.info(f"--- Calling generate_app with the following parameters ---")
    logging.info(f"Prompt: {prompt}")
    logging.info(f"Model: {model}")
    logging.info(f"App Directory: {app_dir}")
    logging.info(f"Output Root: {out_root}")
    logging.info(f"Raw Response File: {raw_response_file}")
    return generate_app_impl(
        prompt=prompt,
        model=model,
        app_dir=app_dir,
        out_root=out_root,
        raw_response_file=raw_response_file,
    )


@app.route("/api/generate", methods=["POST"])
def handle_generate_request():
    """
    Handles POST requests to the /generate endpoint.
    Expects a JSON body with all the parameters required by generate_app.
    """
    # Ensure the request content type is application/json
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()

    # Extract parameters from the JSON data
    # Use .get() to safely retrieve values, providing a default or handling missing ones
    try:
        prompt = data.get("prompt")
        model = data.get("model", DEFAULT_MODEL)
        # Path objects need to be created from strings
        app_dir = Path(
            data.get("app_dir", DEFAULT_TEMPLATE_REACT_APP_DIR)
        )  # Default to current directory if not provided
        out_root = Path(data.get("out_root", DEFAULT_GENERATED_APP_DIR))  # Default to current directory if not provided
        raw_response_file = data.get("raw_response_file", None)
        # Basic validation for essential parameters
        if prompt is None:
            return jsonify({"error": "Missing 'prompt' or 'model' in request"}), 400

        # Call the generate_app function with the extracted parameters
        response = generate_app(
            prompt=prompt,
            model=model,
            app_dir=app_dir,
            out_root=out_root,
            raw_response_file=raw_response_file,
        )

        return jsonify(response), 200

    except Exception as e:
        logging.exception(e)
        # Catch any errors during parameter extraction or function call
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


def parse_args():
    parser = argparse.ArgumentParser(
        description="Backend for Gemini-powered generator for the Vite + React + Material UI template."
    )
    parser.add_argument("--port", type=int, default=5000, help="Port to run the server on")
    parser.add_argument("--verbose", action="store_true", help="Verbose logging")
    return parser.parse_args()


# Run the Flask application
if __name__ == "__main__":
    args = parse_args()
    setup_logging(filename="app.log", verbose=args.verbose)
    app.run(port=args.port)
