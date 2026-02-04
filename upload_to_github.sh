#!/bin/bash

echo "🚀 Starting upload to GitHub..."

# Initialize git
echo "📦 Initializing Git repository..."
git init

# Add all files
echo "➕ Adding all files..."
git add .

# Create commit
echo "💾 Creating commit..."
git commit -m "Initial commit: Sweet Language Learning Platform"

# Add remote
echo "🔗 Connecting to GitHub..."
git remote add origin https://github.com/sweet-language/sweet.git

# Rename branch
echo "🌿 Setting main branch..."
git branch -M main

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
echo "You will be prompted for your credentials:"
echo "Username: sweet-language"
echo "Password: Use your Personal Access Token"
git push -u origin main

echo "✅ Done! Check https://github.com/sweet-language/sweet"
