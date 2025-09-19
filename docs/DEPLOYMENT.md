# Deployment Guide

## Overview

This guide covers deploying CreatorBrief AI to production with Supabase authentication and database integration.

## Prerequisites

- Node.js 22.15.0 or higher
- pnpm package manager
- Supabase account and project
- Vercel account (recommended) or other hosting platform
- AI provider API keys (OpenAI, Anthropic, or Google)

## Environment Setup

### 1. Supabase Configuration

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Configure Authentication**
   - Enable email authentication
   - Configure OAuth providers (Google, LinkedIn)
   - Set up redirect URLs for your domain

3. **Run Database Migrations**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Login to Supabase
   supabase login

   # Link to your project
   supabase link --project-ref your-project-ref

   # Run migrations
   supabase db push
   ```

### 2. Environment Variables

Create production environment variables:

```env
# AI Providers
AI_PROVIDER=gemini
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_API_KEY=your_google_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database (for migrations)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   - Import your GitHub repository to Vercel
   - Select the main branch for production

2. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure `NEXT_PUBLIC_*` variables are properly set

3. **Deploy**
   - Vercel will automatically build and deploy
   - Configure custom domain if needed

4. **Configure OAuth Redirects**
   - Update Supabase auth settings with your domain
   - Add redirect URLs: `https://yourdomain.com/auth/callback`

### Option 2: Railway

1. **Create New Project**
   - Connect your GitHub repository
   - Select the main branch

2. **Add Environment Variables**
   - Configure all required environment variables
   - Railway will automatically detect Next.js

3. **Deploy**
   - Railway will build and deploy automatically
   - Note the generated domain

### Option 3: DigitalOcean App Platform

1. **Create App**
   - Connect your GitHub repository
   - Select Node.js environment

2. **Configure Build Settings**
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
     envs:
     - key: AI_PROVIDER
       value: gemini
     # Add other environment variables
   ```

## Database Setup

### 1. Schema Migration

Run the database migrations in order:

```bash
# 1. Initial schema
psql $DATABASE_URL -f supabase/migrations/001_initial_schema.sql

# 2. RLS policies
psql $DATABASE_URL -f supabase/migrations/002_rls_policies.sql

# 3. Indexes and triggers
psql $DATABASE_URL -f supabase/migrations/003_indexes_triggers.sql
```

### 2. Verify Setup

Check that all tables are created:

```sql
-- Connect to your database
\dt public.*

-- Should show:
-- profiles, projects, campaigns, briefs, content_ideas, creators, etc.
```

### 3. Test Authentication

1. Visit your deployed app
2. Try signing up with email
3. Check that profile is created in database
4. Test OAuth providers

## Security Configuration

### 1. Row Level Security

Ensure RLS is enabled on all tables:

```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### 2. API Security

- All API endpoints require authentication
- Rate limiting is enforced per user
- Sensitive data is encrypted at rest

### 3. Environment Security

- Never commit `.env` files
- Use platform-specific secret management
- Rotate API keys regularly

## Monitoring and Maintenance

### 1. Health Checks

Monitor these endpoints:
- `GET /` - Landing page
- `GET /api/health` - API health (if implemented)
- Database connectivity

### 2. Performance Monitoring

- Monitor AI API usage and costs
- Track database query performance
- Monitor user authentication flows

### 3. Backup Strategy

- Supabase provides automatic backups
- Export user data regularly
- Test restore procedures

## Troubleshooting

### Common Issues

1. **Authentication Redirect Loops**
   - Check OAuth redirect URLs in Supabase
   - Verify environment variables are set correctly

2. **Database Connection Errors**
   - Verify DATABASE_URL format
   - Check Supabase project status
   - Ensure IP allowlisting if required

3. **AI API Errors**
   - Verify API keys are valid
   - Check rate limits and quotas
   - Monitor AI provider status

4. **Build Failures**
   - Ensure pnpm is used (not npm)
   - Check TypeScript errors
   - Verify all dependencies are installed

### Debug Commands

```bash
# Check build locally
pnpm build

# Test database connection
pnpm db:migrate

# Generate fresh types
pnpm db:generate-types

# Check TypeScript
pnpm type-check

# Lint code
pnpm lint
```

## Scaling Considerations

### 1. Database Scaling

- Monitor connection pool usage
- Consider read replicas for heavy read workloads
- Implement database query optimization

### 2. AI API Scaling

- Implement request queuing for high volume
- Consider multiple AI provider fallbacks
- Monitor and optimize token usage

### 3. Application Scaling

- Use CDN for static assets
- Implement Redis for session storage
- Consider horizontal scaling with load balancers

## Support

For deployment support:
- 📧 **Email:** devops@creatorbrief-ai.com
- 📖 **Documentation:** [docs.creatorbrief-ai.com](https://docs.creatorbrief-ai.com)
- 🐛 **Issues:** [GitHub Issues](https://github.com/code-craka/creatorbrief-ai/issues)