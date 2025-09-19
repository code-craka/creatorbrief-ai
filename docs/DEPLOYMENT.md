# Deployment Guide

This guide covers deploying CreatorBrief AI to various platforms.

## Prerequisites

- Node.js 22.15.0 or higher
- pnpm 10.17.0 or higher
- API keys for at least one AI provider
- Git repository

## Environment Variables

Before deploying, ensure you have these environment variables configured:

```env
# Required
AI_PROVIDER=openai  # or anthropic, gemini
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_API_KEY=your_google_api_key_here

# Optional
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Vercel (Recommended)

Vercel provides the best experience for Next.js applications.

### Automatic Deployment

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   - In project settings, go to "Environment Variables"
   - Add all required environment variables
   - Set `NODE_ENV=production`

3. **Deploy**
   - Vercel automatically builds and deploys
   - Your app will be available at `https://your-project.vercel.app`

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Custom Domain

1. Go to project settings in Vercel dashboard
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

## Netlify

### Automatic Deployment

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository

2. **Build Settings**
   ```
   Build command: pnpm build
   Publish directory: .next
   ```

3. **Environment Variables**
   - Go to Site settings > Environment variables
   - Add all required environment variables

4. **Install Next.js Plugin**
   - Add `@netlify/plugin-nextjs` to your `netlify.toml`:
   ```toml
   [[plugins]]
   package = "@netlify/plugin-nextjs"
   ```

### Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
pnpm build

# Deploy
netlify deploy --prod --dir=.next
```

## Railway

Railway provides simple deployment with automatic HTTPS.

### Deployment Steps

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Connect your GitHub repository

2. **Configure Environment Variables**
   - In project settings, add environment variables
   - Railway automatically detects Next.js projects

3. **Custom Domain**
   - Go to project settings
   - Add your custom domain
   - Configure DNS records

### Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

## DigitalOcean App Platform

### Deployment Steps

1. **Create App**
   - Go to DigitalOcean App Platform
   - Click "Create App"
   - Connect your repository

2. **Configure Build**
   ```yaml
   name: creatorbrief-ai
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/creatorbrief-ai
       branch: main
     run_command: pnpm start
     build_command: pnpm build
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     routes:
     - path: /
   ```

3. **Environment Variables**
   - Add all required environment variables in app settings

## AWS Amplify

### Deployment Steps

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Click "New app" > "Host web app"
   - Connect your repository

2. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install -g pnpm
           - pnpm install
       build:
         commands:
           - pnpm build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables**
   - Add environment variables in app settings

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm && pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  creatorbrief-ai:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - AI_PROVIDER=openai
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - GOOGLE_API_KEY=${GOOGLE_API_KEY}
    restart: unless-stopped
```

### Build and Run

```bash
# Build the image
docker build -t creatorbrief-ai .

# Run the container
docker run -p 3000:3000 \
  -e AI_PROVIDER=openai \
  -e OPENAI_API_KEY=your_key_here \
  creatorbrief-ai
```

## Kubernetes

### Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: creatorbrief-ai
spec:
  replicas: 3
  selector:
    matchLabels:
      app: creatorbrief-ai
  template:
    metadata:
      labels:
        app: creatorbrief-ai
    spec:
      containers:
      - name: creatorbrief-ai
        image: your-registry/creatorbrief-ai:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: AI_PROVIDER
          value: "openai"
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: ai-secrets
              key: openai-api-key
---
apiVersion: v1
kind: Service
metadata:
  name: creatorbrief-ai-service
spec:
  selector:
    app: creatorbrief-ai
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

## Performance Optimization

### Build Optimization

```bash
# Enable output tracing for smaller Docker images
echo "output: 'standalone'" >> next.config.js

# Optimize bundle size
pnpm build --analyze
```

### Caching Strategy

- **Static Assets**: Cache for 1 year
- **API Responses**: Cache for 1 hour
- **HTML Pages**: Cache for 1 hour with revalidation

### CDN Configuration

Configure your CDN to cache:
- Static assets: `/_next/static/*` (1 year)
- Images: `/images/*` (1 month)
- API responses: `/api/*` (1 hour)

## Monitoring and Logging

### Vercel Analytics

```bash
# Install Vercel Analytics
pnpm add @vercel/analytics

# Add to your app
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Error Tracking

```bash
# Install Sentry
pnpm add @sentry/nextjs

# Configure in next.config.js
const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig({
  // Your Next.js config
})
```

## Security Considerations

### Environment Variables

- Never commit API keys to version control
- Use platform-specific secret management
- Rotate API keys regularly
- Use different keys for different environments

### HTTPS

- Always use HTTPS in production
- Configure proper SSL certificates
- Enable HSTS headers

### Rate Limiting

- Implement proper rate limiting
- Use IP-based and user-based limits
- Monitor for abuse patterns

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   pnpm clean
   rm -rf .next node_modules
   pnpm install
   pnpm build
   ```

2. **API Key Issues**
   - Verify API keys are correctly set
   - Check API key permissions
   - Ensure proper environment variable names

3. **Memory Issues**
   - Increase Node.js memory limit: `NODE_OPTIONS="--max-old-space-size=4096"`
   - Optimize bundle size
   - Use dynamic imports

### Health Checks

Create a health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
}
```

## Support

For deployment support:
- 📧 **Email:** deploy@creatorbrief-ai.com
- 💬 **Discord:** [Join our community](https://discord.gg/creatorbrief-ai)
- 📖 **Docs:** [docs.creatorbrief-ai.com](https://docs.creatorbrief-ai.com)