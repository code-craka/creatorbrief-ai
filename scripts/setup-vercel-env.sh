#!/bin/bash

# CreatorBrief AI - Vercel Environment Variables Setup
echo "🚀 Setting up Vercel environment variables..."
echo "⚠️  This script will prompt you to enter your API keys securely."
echo ""

# AI Provider
echo "Setting AI_PROVIDER..."
echo "gemini" | vercel env add AI_PROVIDER production
echo "gemini" | vercel env add AI_PROVIDER preview

# OpenAI API Key
echo "Setting OPENAI_API_KEY..."
echo "Please enter your OpenAI API key:"
read -s OPENAI_KEY
echo "$OPENAI_KEY" | vercel env add OPENAI_API_KEY production
echo "$OPENAI_KEY" | vercel env add OPENAI_API_KEY preview

# Google API Key
echo "Setting GOOGLE_API_KEY..."
echo "Please enter your Google API key:"
read -s GOOGLE_KEY
echo "$GOOGLE_KEY" | vercel env add GOOGLE_API_KEY production
echo "$GOOGLE_KEY" | vercel env add GOOGLE_API_KEY preview

# Anthropic API Key
echo "Setting ANTHROPIC_API_KEY..."
echo "Please enter your Anthropic API key (or press Enter to skip):"
read -s ANTHROPIC_KEY
if [ -n "$ANTHROPIC_KEY" ]; then
    echo "$ANTHROPIC_KEY" | vercel env add ANTHROPIC_API_KEY production
    echo "$ANTHROPIC_KEY" | vercel env add ANTHROPIC_API_KEY preview
else
    echo "your_anthropic_api_key_here" | vercel env add ANTHROPIC_API_KEY production
    echo "your_anthropic_api_key_here" | vercel env add ANTHROPIC_API_KEY preview
fi

echo "✅ Environment variables setup complete!"
echo "📋 Run 'vercel env ls' to verify all variables are set"