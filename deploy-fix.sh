#!/bin/bash

# Deployment fix script for Britannia Forge
echo "🔧 Fixing deployment issues..."

# Clean up old files
echo "Removing deprecated files..."
find . -name "*-old.ts" -type f -delete
find . -name "*-old.js" -type f -delete
find . -name "*-backup.*" -type f -delete

# Build the project
echo "Building project..."
npm run build

# Check TypeScript compilation
echo "Checking TypeScript..."
npm run check

echo "✅ Deployment fix completed"