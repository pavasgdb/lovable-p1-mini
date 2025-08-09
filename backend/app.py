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

from src.logger import setup_logging
from flask import Flask, request, jsonify
from pathlib import Path


app = Flask(__name__)


# Define the generate_app function as provided by the user
def generate_app(
    prompt: str,
    model: str,
    app_dir: Path,
    out_root: Path,
    allow_public: bool,
    overwrite: bool,
    dry_run: bool,
    auto_install: bool,
    raw_response_file: str,
) -> None:
    """
    This is a placeholder function for your application generation logic.
    It simulates an operation using the provided parameters.
    In a real application, this function would contain the core logic to generate an application based on the prompt and other settings.
    """
    from src.generate_app import generate_app as generate_app_impl

    generate_app_impl(
        prompt, model, app_dir, out_root, allow_public, overwrite, dry_run, auto_install, raw_response_file
    )
    print(f"--- Calling generate_app with the following parameters ---")
    print(f"Prompt: {prompt}")
    print(f"Model: {model}")
    print(f"App Directory: {app_dir}")
    print(f"Output Root: {out_root}")
    print(f"Allow Public: {allow_public}")
    print(f"Overwrite: {overwrite}")
    print(f"Dry Run: {dry_run}")
    print(f"Auto Install: {auto_install}")
    print(f"Raw Response File: {raw_response_file}")

    # Example: Create dummy directories to show Path objects are used
    try:
        if not dry_run:
            if not app_dir.exists():
                app_dir.mkdir(parents=True, exist_ok=True)
                print(f"Created app_dir: {app_dir}")
            if not out_root.exists():
                out_root.mkdir(parents=True, exist_ok=True)
                print(f"Created out_root: {out_root}")

            # Simulate writing to a raw_response_file
            if raw_response_file:
                # Ensure the directory for raw_response_file exists
                raw_response_path = Path(raw_response_file)
                raw_response_path.parent.mkdir(parents=True, exist_ok=True)
                with open(raw_response_path, "w") as f:
                    f.write(f"Generated app for prompt: '{prompt}' using model: '{model}'.\n")
                    f.write(f"Parameters: {locals()}\n")
                print(f"Wrote dummy content to: {raw_response_file}")

        print(f"--- generate_app function simulated successfully ---")
    except Exception as e:
        print(f"Error in generate_app simulation: {e}")
        # In a real scenario, you might raise this exception or log it more robustly.


@app.route("/generate", methods=["POST"])
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
        model = data.get("model")
        # Path objects need to be created from strings
        app_dir = Path(data.get("app_dir", "."))  # Default to current directory if not provided
        out_root = Path(data.get("out_root", "."))  # Default to current directory if not provided

        # Booleans need explicit conversion from potential string/int representations
        allow_public = bool(data.get("allow_public", False))
        overwrite = bool(data.get("overwrite", False))
        dry_run = bool(data.get("dry_run", False))
        auto_install = bool(data.get("auto_install", False))

        raw_response_file = data.get("raw_response_file")

        # Basic validation for essential parameters
        if prompt is None or model is None:
            return jsonify({"error": "Missing 'prompt' or 'model' in request"}), 400

        # Call the generate_app function with the extracted parameters
        generate_app(
            prompt=prompt,
            model=model,
            app_dir=app_dir,
            out_root=out_root,
            allow_public=allow_public,
            overwrite=overwrite,
            dry_run=dry_run,
            auto_install=auto_install,
            raw_response_file=raw_response_file,
        )

        return jsonify({"message": "App generation request processed successfully", "parameters_received": data}), 200

    except Exception as e:
        # Catch any errors during parameter extraction or function call
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# Run the Flask application
if __name__ == "__main__":
    # Use debug=True for development to get detailed error messages
    # For production, set debug=False and use a production-ready WSGI server like Gunicorn
    setup_logging(filename="app.log")
    app.run(debug=True, port=5000)
