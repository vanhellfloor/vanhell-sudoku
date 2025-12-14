#!/bin/bash

# Deployment Helper Script

echo "----------------------------------------------------------------"
echo "       GitHub Deployment Helper"
echo "----------------------------------------------------------------"
echo ""
echo "Since the 'gh' CLI tool is not installed, we need to do this manually."
echo ""
echo "STEP 1: Go to https://github.com/new"
echo "STEP 2: Create a new repository (name it 'vanhell-sudoku' or similar)."
echo "STEP 3: Copy the HTTPS URL of the new repository."
echo "        It should look like: https://github.com/YOUR_USERNAME/REPO_NAME.git"
echo ""
read -p "Paste the Repository URL here: " REPO_URL

if [ -z "$REPO_URL" ]; then
  echo "Error: No URL provided. Exiting."
  exit 1
fi

echo ""
echo "Configuring git..."
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"
git branch -M main

echo "Pushing code to GitHub..."
echo "Note: You may be asked for your GitHub username and password (or token)."
git push -u origin main

echo ""
echo "----------------------------------------------------------------"
if [ $? -eq 0 ]; then
  echo "✅ Deployment to GitHub successfully initiated!"
else
  echo "❌ Push failed. Please check your credentials or URL."
fi
echo "----------------------------------------------------------------"
