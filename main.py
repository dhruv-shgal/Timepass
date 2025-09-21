#!/usr/bin/env python3
"""
Main entry point for Railway/Render deployment
"""
import os
import sys
import subprocess

def main():
    print("🚀 Starting AI Career Toolkit API...")
    
    # Change to backend directory
    backend_dir = os.path.join(os.getcwd(), 'backend')
    if os.path.exists(backend_dir):
        os.chdir(backend_dir)
        print(f"📁 Changed to directory: {os.getcwd()}")
    else:
        print("❌ Backend directory not found!")
        sys.exit(1)
    
    # Start the FastAPI app
    try:
        print("🔥 Starting FastAPI server...")
        subprocess.run([sys.executable, "run.py"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("🛑 Server stopped by user")
        sys.exit(0)

if __name__ == "__main__":
    main()
