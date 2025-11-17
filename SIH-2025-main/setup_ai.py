#!/usr/bin/env python3
"""
Setup script for AI video analysis dependencies
"""
import subprocess
import sys
import os

def install_requirements():
    """Install required Python packages"""
    try:
        print("Installing Python dependencies for AI video analysis...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Successfully installed all dependencies!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        return False

def test_imports():
    """Test if all required packages can be imported"""
    try:
        print("Testing package imports...")
        import cv2
        import mediapipe as mp
        import numpy as np
        print("✅ All packages imported successfully!")
        
        # Test MediaPipe pose detection
        mp_pose = mp.solutions.pose
        pose = mp_pose.Pose()
        print("✅ MediaPipe pose detection initialized successfully!")
        
        return True
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False

def create_directories():
    """Create necessary directories"""
    directories = ['uploads', 'scripts']
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"✅ Created directory: {directory}")
        else:
            print(f"📁 Directory already exists: {directory}")

def main():
    print("🚀 Setting up AI Video Analysis System...")
    print("=" * 50)
    
    # Create directories
    create_directories()
    
    # Install requirements
    if not install_requirements():
        print("❌ Setup failed during package installation")
        return False
    
    # Test imports
    if not test_imports():
        print("❌ Setup failed during import testing")
        return False
    
    print("\n" + "=" * 50)
    print("🎉 AI Video Analysis setup completed successfully!")
    print("\nNext steps:")
    print("1. Start your Next.js development server: npm run dev")
    print("2. Navigate to the video analysis page")
    print("3. Upload a video to test the AI analysis")
    print("\nNote: Make sure Python is in your system PATH")
    
    return True

if __name__ == "__main__":
    main()
