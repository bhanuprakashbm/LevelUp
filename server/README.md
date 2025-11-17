# LevelUp Video Analysis Backend

This is the backend service for processing athlete assessment videos using OpenPose.

## Prerequisites

1. Python 3.8+
2. OpenPose installed and properly configured
3. Required Python packages (install with `pip install -r requirements.txt`)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nsta_web
   ```

2. Install dependencies:
   ```bash
   cd server
   pip install -r requirements.txt
   ```

3. Configure OpenPose path:
   - Update the `OPENPOSE_PATH` in `app/main.py` to point to your OpenPose installation directory.

## Running the Server

```bash
cd server
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `POST /api/analyze-video` - Upload and process a video
- `GET /` - Check if the API is running

## Environment Variables

- `OPENPOSE_PATH`: Path to the OpenPose installation directory (default: `../../openpose`)

## Development

For development, you can use the included `run.ps1` script to start the server with hot-reload:

```bash
./run.ps1
```

## Production

For production, you should use a production-ready ASGI server like Gunicorn with Uvicorn workers:

```bash
pip install gunicorn
cd server
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

## License

This project is licensed under the MIT License.
