#!/bin/bash

# Push to GitHub Repository Script for Britannia Forge

echo "🚀 Pushing files to GitHub repository..."

# Add all files to git
git add .

# Commit with deployment message
git commit -m "Deploy complete Britannia Forge platform

Complete website deployment - Intelligent boiler quotation system with admin dashboard and customer portal

Features:
- 6-step intelligent quotation system
- Admin dashboard with pricing controls
- Customer portal with job tracking
- Engineer marketplace
- Secure Stripe payment integration
- Mobile-responsive design
- Role-based access control

Tech stack: React + TypeScript, Node.js + Express, PostgreSQL, Vercel deployment"

# Push to GitHub
git push origin main

echo "✅ Files pushed to GitHub successfully!"