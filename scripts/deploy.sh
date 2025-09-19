#!/bin/bash

# CreatorBrief AI - Deployment Script
set -e

echo "🚀 CreatorBrief AI Deployment Script"
echo "======================================"

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Check if we have uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    echo "⚠️  You have uncommitted changes. Please commit or stash them first."
    git status --short
    exit 1
fi

# Function to deploy to production
deploy_production() {
    echo "🏭 Deploying to PRODUCTION..."
    echo "⚠️  This will deploy to the live production site!"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        vercel --prod
        echo "✅ Production deployment complete!"
        echo "🌐 Live at: https://creatorbrief-ai-techsci.vercel.app"
    else
        echo "❌ Production deployment cancelled."
    fi
}

# Function to deploy to preview
deploy_preview() {
    echo "🔍 Deploying to PREVIEW..."
    vercel
    echo "✅ Preview deployment complete!"
}

# Main deployment logic
case $CURRENT_BRANCH in
    "main")
        echo "🎯 Main branch detected"
        deploy_production
        ;;
    "development")
        echo "🔧 Development branch detected"
        deploy_preview
        ;;
    *)
        echo "🌿 Feature branch detected: $CURRENT_BRANCH"
        deploy_preview
        ;;
esac

echo ""
echo "📊 View all deployments: vercel ls"
echo "🔧 Manage environment variables: vercel env ls"
echo "📈 View project dashboard: https://vercel.com/techsci/creatorbrief-ai"