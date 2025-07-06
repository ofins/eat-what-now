#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build server
echo "🔨 Building server..."
npm run build --workspace=server

# Run migrations
echo "🗄️ Running database migrations..."
cd server
npm run migrate:up

# Restart PM2
echo "🔄 Restarting application..."
pm2 restart ewn-backend

# Reload Nginx
echo "🌐 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Deployment completed successfully!"

# Show status
pm2 status