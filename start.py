#!/usr/bin/env python3
"""
Railway start script
"""
import os
import sys
import subprocess

# Change to backend directory
os.chdir('backend')

# Run the FastAPI app
if __name__ == "__main__":
    subprocess.run([sys.executable, "run.py"])
