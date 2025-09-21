#!/bin/bash
echo "🚀 Starting AI Career Toolkit API..."
cd backend
gunicorn -c ../gunicorn.conf.py main:app
