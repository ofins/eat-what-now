#!/bin/bash
set -e

echo "🚀 Starting full-stack deployment..."

# Navigate to project directory
cd /var/www/eat-what-now

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build server
echo "🔨 Building server..."
npm run build:server

# Build client
echo "🎨 Building client..."
npm run build:client

# Run database migrations
echo "🗄️ Running database migrations..."
cd server
npm run migrate:up
cd ..

# Restart backend with PM2
echo "🔄 Restarting backend..."
pm2 restart ewn-backend || pm2 start server/ecosystem.config.js

# Reload Nginx to serve new client build
echo "🌐 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Full-stack deployment completed successfully!"

# Show status
pm2 status
echo "🌍 Frontend: https://your-domain.com"
echo "🔧 API: https://your-domain.com/api"
echo "📚 Docs: https://your-domain.com/docs"