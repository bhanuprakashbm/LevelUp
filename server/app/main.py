from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import uuid
import subprocess
import json
from pathlib import Path
from typing import Optional
import uvicorn

# Configuration
UPLOAD_DIR = "uploads"
RESULTS_DIR = "results"
OPENPOSE_PATH = "../../openpose"  # Adjust this path based on your OpenPose installation

# Create necessary directories
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

app = FastAPI(title="LevelUp Video Analysis API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory
app.mount("/static", StaticFiles(directory=RESULTS_DIR), name="static")

import mediapipe as mp
import cv2

def process_video_with_openpose(video_path: str, output_dir: str):
    """Process video using MediaPipe Pose."""
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(static_image_mode=False, model_complexity=1)
    cap = cv2.VideoCapture(video_path)
    
    results = []
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        # Convert BGR to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Process the frame
        pose_results = pose.process(frame_rgb)
        
        if pose_results.pose_landmarks:
            # Convert landmarks to list of [x, y, visibility] for each point
            frame_keypoints = []
            for landmark in pose_results.pose_landmarks.landmark:
                frame_keypoints.append([
                    landmark.x,
                    landmark.y,
                    landmark.visibility if hasattr(landmark, 'visibility') else 1.0
                ])
            results.append(frame_keypoints)
    
    cap.release()
    return {"status": "success", "keypoints": results}


@app.post("/api/analyze-video")
async def analyze_video(
    video: UploadFile = File(...),
    athlete_id: Optional[str] = None,
    test_type: Optional[str] = None
):
    # Validate file type
    if not video.filename.lower().endswith((".mp4", ".webm", ".mov", ".avi")):
        raise HTTPException(status_code=400, detail="Only MP4, WebM, and MOV files are supported")
    
    # Create a unique directory for this analysis
    analysis_id = str(uuid.uuid4())
    analysis_dir = os.path.join(RESULTS_DIR, analysis_id)
    os.makedirs(analysis_dir, exist_ok=True)
    
    # Save the uploaded video
    video_path = os.path.join(analysis_dir, video.filename)
    with open(video_path, "wb") as buffer:
        buffer.write(await video.read())
    
    try:
        # Process the video with OpenPose
        result = process_video_with_openpose(video_path, analysis_dir)
        
        # Add metadata
        result.update({
            "analysis_id": analysis_id,
            "original_filename": video.filename,
            "athlete_id": athlete_id,
            "test_type": test_type
        })
        
        return result
        
    except Exception as e:
        # Clean up on error
        import shutil
        shutil.rmtree(analysis_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Video processing failed: {str(e)}")

@app.get("/")
async def read_root():
    return {"message": "LevelUp Video Analysis API is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
