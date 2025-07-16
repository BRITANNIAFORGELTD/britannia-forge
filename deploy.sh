#!/bin/bash

# Britannia Forge Deployment Script
# This script handles the deployment process for the Britannia Forge platform

set -e

echo "🚀 Starting Britannia Forge deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required commands exist
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check dependencies
print_status "Checking dependencies..."
if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js 18 or later."
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
print_status "Node.js version: $NODE_VERSION"

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Copying from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        print_warning "Please update the .env file with your actual configuration values."
    else
        print_error ".env.example file not found. Please create a .env file with your configuration."
        exit 1
    fi
fi

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Run TypeScript check
print_status "Running TypeScript check..."
npm run check

# Build the project
print_status "Building the project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    print_error "Build failed. dist directory not found."
    exit 1
fi

print_status "Build completed successfully!"

# Run database migrations
print_status "Running database migrations..."
npm run db:push

# Create admin user (if needed)
read -p "Do you want to create an admin user? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Creating admin user..."
    npm run create-admin
fi

# Start the application
print_status "Starting the application..."
if [ "$1" = "production" ]; then
    print_status "Starting in production mode..."
    npm start
else
    print_status "Starting in development mode..."
    npm run dev
fi

print_status "Deployment completed successfully! 🎉"
print_status "Application is running on http://localhost:5000"
print_status "Admin dashboard: http://localhost:5000/britannia1074/admin/login"