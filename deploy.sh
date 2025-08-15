#!/bin/bash
set -e

# Configuration - set your preferred conflict resolution strategy
CONFLICT_STRATEGY="${CONFLICT_STRATEGY:-manual}"  # Options: manual, remote, local, abort

echo "🚀 Starting full-stack deployment..."

# Navigate to project directory
cd /var/www/eat-what-now

# Pull latest changes
echo "📥 Pulling latest changes..."
if ! git pull origin main; then
    echo "❌ Git pull failed - likely due to merge conflicts"
    echo "🔍 Checking for merge conflicts..."
    
    if git status --porcelain | grep -q "^UU\|^AA\|^DD"; then
        echo "⚠️  Merge conflicts detected. Files with conflicts:"
        git status --porcelain | grep "^UU\|^AA\|^DD"
        echo ""
        
        case "$CONFLICT_STRATEGY" in
            "remote")
                echo "� Auto-resolving conflicts by favoring remote changes..."
                git reset --hard origin/main
                echo "✅ Conflicts resolved - continuing deployment"
                ;;
            "local")
                echo "🔄 Auto-resolving conflicts by favoring local changes..."
                git reset --hard HEAD
                echo "⚠️  Note: Local changes kept. You may want to push later."
                echo "✅ Conflicts resolved - continuing deployment"
                ;;
            "abort")
                echo "🛑 Aborting deployment due to conflicts (CONFLICT_STRATEGY=abort)"
                exit 1
                ;;
            *)
                echo "�️  Manual resolution required. Options:"
                echo "1. Fix conflicts in the listed files, then:"
                echo "   git add . && git commit -m 'Resolve merge conflicts'"
                echo ""
                echo "2. Or set environment variable for auto-resolution:"
                echo "   CONFLICT_STRATEGY=remote ./deploy.sh  # Use remote changes"
                echo "   CONFLICT_STRATEGY=local ./deploy.sh   # Use local changes"
                echo "   CONFLICT_STRATEGY=abort ./deploy.sh   # Stop on conflicts"
                echo ""
                echo "3. Or run manual git commands:"
                echo "   git reset --hard origin/main  # Use remote"
                echo "   git reset --hard HEAD         # Use local"
                exit 1
                ;;
        esac
    else
        echo "❌ Git pull failed for other reasons. Please check manually."
        git status
        exit 1
    fi
fi

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
echo "🌍 Frontend: https://eatwhatnow.net"