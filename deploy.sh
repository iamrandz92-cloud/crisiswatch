#!/bin/bash

# War Intelligence Platform - Quick Deploy Script
# This script helps you push changes to GitHub and trigger Netlify deployment

set -e

echo "🚀 War Intelligence Platform - Deploy Script"
echo "=============================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "⚠️  Git not initialized. Let's set it up!"
    echo ""
    echo "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git):"
    read REPO_URL

    echo ""
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - War Intelligence Platform"
    git branch -M main
    git remote add origin "$REPO_URL"

    echo ""
    echo "✅ Git initialized and remote added!"
    echo "📤 Pushing to GitHub..."
    git push -u origin main

    echo ""
    echo "🎉 First push complete!"
    echo "Now connect this repo to Netlify:"
    echo "1. Go to https://app.netlify.com/"
    echo "2. Click 'Add new site' → 'Import an existing project'"
    echo "3. Choose GitHub and select your repository"
    echo "4. Build command: npm run build"
    echo "5. Publish directory: .next"
    echo "6. Add environment variables from .env file"
else
    # Git already initialized, just push changes
    echo "📝 Git status:"
    git status --short
    echo ""

    # Check if there are changes
    if [[ -z $(git status --porcelain) ]]; then
        echo "✅ No changes to commit"
        echo "📤 Pushing to GitHub to trigger redeployment..."
        git push
    else
        echo "💾 Committing changes..."
        git add .

        echo "Enter commit message (or press Enter for default):"
        read COMMIT_MSG

        if [ -z "$COMMIT_MSG" ]; then
            COMMIT_MSG="Update: $(date '+%Y-%m-%d %H:%M:%S')"
        fi

        git commit -m "$COMMIT_MSG"

        echo ""
        echo "📤 Pushing to GitHub..."
        git push

        echo ""
        echo "🎉 Changes pushed successfully!"
        echo "Netlify will automatically detect and deploy your changes"
        echo "Check deployment status at: https://app.netlify.com/"
    fi
fi

echo ""
echo "=============================================="
echo "✨ Deploy script completed!"
