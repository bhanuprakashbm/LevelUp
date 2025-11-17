#!/usr/bin/env python3
import cv2
import mediapipe as mp
import numpy as np
import json
import sys
import math
from typing import List, Dict, Tuple

class VideoAnalyzer:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            smooth_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
    def calculate_angle(self, a: Tuple, b: Tuple, c: Tuple) -> float:
        """Calculate angle between three points"""
        a = np.array(a)
        b = np.array(b)
        c = np.array(c)
        
        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(radians * 180.0 / np.pi)
        
        if angle > 180.0:
            angle = 360 - angle
            
        return angle
    
    def calculate_distance(self, point1: Tuple, point2: Tuple) -> float:
        """Calculate Euclidean distance between two points"""
        return math.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2)
    
    def analyze_pose(self, landmarks) -> Dict:
        """Analyze pose landmarks and extract metrics"""
        if not landmarks:
            return {}
            
        # Get key landmarks
        left_hip = [landmarks[self.mp_pose.PoseLandmark.LEFT_HIP.value].x,
                   landmarks[self.mp_pose.PoseLandmark.LEFT_HIP.value].y]
        right_hip = [landmarks[self.mp_pose.PoseLandmark.RIGHT_HIP.value].x,
                    landmarks[self.mp_pose.PoseLandmark.RIGHT_HIP.value].y]
        left_knee = [landmarks[self.mp_pose.PoseLandmark.LEFT_KNEE.value].x,
                    landmarks[self.mp_pose.PoseLandmark.LEFT_KNEE.value].y]
        right_knee = [landmarks[self.mp_pose.PoseLandmark.RIGHT_KNEE.value].x,
                     landmarks[self.mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
        left_ankle = [landmarks[self.mp_pose.PoseLandmark.LEFT_ANKLE.value].x,
                     landmarks[self.mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
        right_ankle = [landmarks[self.mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,
                      landmarks[self.mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]
        left_shoulder = [landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                        landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
        right_shoulder = [landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
                         landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
        
        # Calculate joint angles
        left_knee_angle = self.calculate_angle(left_hip, left_knee, left_ankle)
        right_knee_angle = self.calculate_angle(right_hip, right_knee, right_ankle)
        left_hip_angle = self.calculate_angle(left_shoulder, left_hip, left_knee)
        right_hip_angle = self.calculate_angle(right_shoulder, right_hip, right_knee)
        
        # Calculate stride length (distance between feet)
        stride_length = self.calculate_distance(left_ankle, right_ankle)
        
        # Calculate body balance (shoulder level)
        shoulder_balance = abs(left_shoulder[1] - right_shoulder[1])
        
        return {
            'left_knee_angle': left_knee_angle,
            'right_knee_angle': right_knee_angle,
            'left_hip_angle': left_hip_angle,
            'right_hip_angle': right_hip_angle,
            'stride_length': stride_length,
            'shoulder_balance': shoulder_balance,
            'hip_center_y': (left_hip[1] + right_hip[1]) / 2
        }
    
    def analyze_video(self, video_path: str) -> Dict:
        """Analyze entire video and return comprehensive metrics"""
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            raise Exception(f"Could not open video file: {video_path}")
        
        frame_count = 0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        # Storage for analysis data
        knee_angles = []
        hip_angles = []
        stride_lengths = []
        balance_scores = []
        hip_heights = []
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            frame_count += 1
            
            # Convert BGR to RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Process frame with MediaPipe
            results = self.pose.process(rgb_frame)
            
            if results.pose_landmarks:
                # Analyze pose for this frame
                pose_data = self.analyze_pose(results.pose_landmarks.landmark)
                
                if pose_data:
                    knee_angles.append((pose_data['left_knee_angle'] + pose_data['right_knee_angle']) / 2)
                    hip_angles.append((pose_data['left_hip_angle'] + pose_data['right_hip_angle']) / 2)
                    stride_lengths.append(pose_data['stride_length'])
                    balance_scores.append(1 - pose_data['shoulder_balance'])  # Inverse for balance score
                    hip_heights.append(pose_data['hip_center_y'])
        
        cap.release()
        
        if not knee_angles:
            raise Exception("No pose landmarks detected in video")
        
        # Calculate final metrics
        avg_knee_angle = np.mean(knee_angles)
        avg_hip_angle = np.mean(hip_angles)
        avg_stride_length = np.mean(stride_lengths)
        balance_score = np.mean(balance_scores) * 100
        
        # Calculate jump height (variation in hip height)
        hip_height_variation = (max(hip_heights) - min(hip_heights)) * 100  # Convert to cm estimate
        
        # Calculate speed estimate (frames per second * stride changes)
        speed_estimate = len(stride_lengths) / (total_frames / fps) * avg_stride_length * 10  # Rough estimate
        
        # Calculate technique score based on consistency
        knee_consistency = 100 - (np.std(knee_angles) / np.mean(knee_angles) * 100)
        stride_consistency = 100 - (np.std(stride_lengths) / np.mean(stride_lengths) * 100)
        technique_score = (knee_consistency + stride_consistency) / 2
        
        # Calculate overall score
        overall_score = (balance_score + technique_score + min(speed_estimate * 5, 100)) / 3
        
        # Generate recommendations
        recommendations = []
        if avg_knee_angle < 140:
            recommendations.append("Work on knee drive - your knee angle is too acute during movement")
        if balance_score < 70:
            recommendations.append("Focus on core stability exercises to improve balance")
        if technique_score < 75:
            recommendations.append("Practice consistent movement patterns to improve technique")
        if speed_estimate < 8:
            recommendations.append("Incorporate speed training to improve overall velocity")
        if hip_height_variation < 10:
            recommendations.append("Work on explosive power training to increase jump height")
        
        if not recommendations:
            recommendations.append("Excellent form! Continue with current training regimen")
            recommendations.append("Consider advanced technique refinement")
        
        return {
            'jumpHeight': round(hip_height_variation, 1),
            'strideLength': round(avg_stride_length * 2, 2),  # Convert to meters estimate
            'jointAngles': {
                'knee': round(avg_knee_angle),
                'ankle': round(90 + (avg_knee_angle - 150) * 0.3),  # Estimated ankle angle
                'hip': round(avg_hip_angle)
            },
            'speed': round(speed_estimate, 1),
            'balance': round(balance_score),
            'technique': round(technique_score),
            'overallScore': round(overall_score),
            'summary': f"Analysis of {frame_count} frames shows {'excellent' if overall_score > 85 else 'good' if overall_score > 70 else 'developing'} athletic performance with specific areas for improvement.",
            'recommendations': recommendations,
            'frameCount': frame_count,
            'duration': round(total_frames / fps, 2)
        }

def main():
    if len(sys.argv) != 2:
        print("Usage: python video_analysis.py <video_path>")
        sys.exit(1)
    
    video_path = sys.argv[1]
    
    try:
        analyzer = VideoAnalyzer()
        result = analyzer.analyze_video(video_path)
        print(json.dumps(result))
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
