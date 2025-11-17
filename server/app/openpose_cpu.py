"""Lightweight OpenPose inference using OpenCV-DNN (CPU).
Reads BODY_25 Caffe model files from the repository's openpose/models folder.
Returns BODY_25 key-points for each frame as a list of lists: [[x, y, confidence], ...]
"""
from pathlib import Path
from typing import List, Dict, Any

import cv2
import numpy as np

# Paths to prototxt and caffemodel inside the repo
PROTO: Path = Path("openpose/models/pose/body_25/pose_deploy.prototxt")
MODEL: Path = Path("openpose/models/pose/body_25/pose_iter_584000.caffemodel")
NPOINTS: int = 25

if not PROTO.exists() or not MODEL.exists():
    raise FileNotFoundError(
        "OpenPose model files not found. Ensure the repository contains the BODY_25 prototxt and caffemodel "
        "under openpose/models/pose/body_25."
    )

def analyse(video_path: str) -> Dict[str, Any]:
    """Run inference on a video file and return BODY_25 key-points per frame."""
    net = cv2.dnn.readNetFromCaffe(str(PROTO), str(MODEL))
    cap = cv2.VideoCapture(video_path)

    ret, frame = cap.read()
    if not ret:
        cap.release()
        raise RuntimeError("Cannot read video")

    h, w = frame.shape[:2]
    inp_h, inp_w = 368, 656
    results: List[List[List[float]]] = []

    while ret:
        blob = cv2.dnn.blobFromImage(frame, 1 / 255.0, (inp_w, inp_h), (0, 0, 0), swapRB=False, crop=False)
        net.setInput(blob)
        out = net.forward()

        points: List[List[float]] = []
        for i in range(NPOINTS):
            prob_map = out[0, i, :, :]
            _, prob, _, point = cv2.minMaxLoc(prob_map)
            x = (w * point[0]) / out.shape[3]
            y = (h * point[1]) / out.shape[2]
            points.append([float(x), float(y), float(prob)])

        results.append(points)
        ret, frame = cap.read()

    cap.release()
    return {"status": "success", "keypoints": results}
