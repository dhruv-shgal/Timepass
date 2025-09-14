#!/bin/bash

# GitHub repo URL
repo_url="https://github.com/dhruv-shgal/KAREERIST.git"

# Check if git is initialized
if [ ! -d .git ]; then
    echo "Initializing Git..."
    git init
else
    echo "Git already initialized."
fi

# Add remote origin
git remote add origin "$repo_url" 2>/dev/null || git remote set-url origin "$repo_url"

# Create and switch to staging branch
git checkout -B staging

# Add and commit all files
git add .
git commit -m "Initial commit on staging branch"

# Push to GitHub
git push -u origin staging

echo "✅ Project connected and pushed to GitHub (staging branch)!"
