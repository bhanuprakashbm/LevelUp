# Run the FastAPI server with hot-reload
$env:PYTHONPATH = "."
uvicorn app.main:app --reload
