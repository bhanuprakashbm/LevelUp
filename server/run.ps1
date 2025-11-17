# Run the FastAPI server with hot-reload
$env:PYTHONPATH = "."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
