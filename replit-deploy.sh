#!/bin/bash

# Replit Direct Deployment Script for Britannia Forge
echo "🚀 Starting Britannia Forge Direct Deployment..."

# Clean any existing build artifacts
rm -rf dist/
rm -rf node_modules/.cache/

# Install dependencies fresh
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Create deployment configuration
echo "⚙️ Creating deployment configuration..."
cat > .replit << 'EOF'
run = "npm start"
entrypoint = "server/index.ts"
modules = ["nodejs-20"]

[nix]
channel = "stable-22_11"

[deployment]
run = ["npm", "start"]
deploymentTarget = "cloudrun"
ignorePorts = false

[languages.javascript]
pattern = "**/{*.js,*.jsx,*.ts,*.tsx}"
syntax = "javascript"

[languages.javascript.languageServer]
start = "typescript-language-server --stdio"
EOF

# Create production start script
cat > start-production.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// API routes
app.use('/api', require('./dist/index.js'));

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Britannia Forge deployed on port ${PORT}`);
});
EOF

echo "✅ Deployment configuration complete!"
echo "🌐 Ready for Replit deployment"