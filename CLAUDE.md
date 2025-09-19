# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CreatorBrief AI is a Next.js 15 application that generates comprehensive creator campaign briefs using multiple AI providers (OpenAI GPT-4, Anthropic Claude, Google Gemini 2.0). The app features a multi-step interface: landing page → dashboard form → AI generation → results display with export options.

## Development Commands

```bash
# Development server with Turbopack
pnpm dev

# Production build
pnpm build
pnpm start

# Code quality
pnpm lint
pnpm type-check
pnpm format

# Database operations (Supabase)
pnpm db:generate-types
pnpm db:reset
pnpm db:migrate

# Markdown linting
pnpm lint:md
pnpm lint:md:fix
```

## Environment Setup

Copy `.env.local.example` to `.env.local` and configure:
- `AI_PROVIDER`: Choose 'openai', 'anthropic', or 'gemini' (default: gemini)
- Provider-specific API keys: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`
- Optional tuning: `MAX_TOKENS`, `TEMPERATURE`, `CACHE_TTL`, `RATE_LIMIT_PER_HOUR`

## Architecture

### Core Flow
1. **app/page.tsx** → Main entry point rendering `CreatorBriefApp`
2. **components/CreatorBriefApp.tsx** → State manager for view transitions (landing → dashboard → generating → results)
3. **components/Dashboard.tsx** → Form for campaign inputs
4. **app/api/generate-brief/route.ts** → API endpoint handling brief generation
5. **workflows/generate-brief.ts** → Business logic orchestrating AI service calls
6. **lib/ai-service.ts** → Multi-provider AI abstraction with caching and rate limiting

### Key Components
- **LandingPage**: Welcome screen with feature overview
- **Dashboard**: Comprehensive form with validation (product, audience, platforms, budget)
- **GeneratingSpinner**: Loading state with progress indication
- **ResultsPage**: Tabbed interface displaying video ideas, creator recommendations, outreach templates
- **BriefResultDisplay**: Individual brief section with export functionality

### AI Service Architecture
- **AIService**: Base class handling provider-specific implementations
- **AIServiceWithCache**: Extends base with Redis-compatible caching (1-hour TTL)
- **Rate limiting**: 10 requests/hour per user IP
- **Error handling**: Provider fallbacks and graceful degradation

### Type System
All types centralized in `types/brief.ts`:
- **CreatorBriefFormData**: Input form structure
- **CreatorBriefOutput**: Standardized AI response format
- **User**: Authentication placeholder

## Tech Stack Specifics

- **Framework**: Next.js 15.5.3 with App Router and Turbopack
- **Styling**: Tailwind CSS 4.0 + shadcn/ui components
- **AI SDKs**: @anthropic-ai/sdk, openai, @google/generative-ai
- **Forms**: react-hook-form + @hookform/resolvers + zod validation
- **Icons**: lucide-react
- **Package Manager**: pnpm (locked to 10.17.0)

## Deployment Configuration

The project is configured for Vercel deployment:
- **vercel.json**: Specifies Node.js 22.15.0, branch-specific deployments (main, development)
- **Build command**: Uses Turbopack for optimized builds
- **Environment variables**: Set in Vercel dashboard for production/preview

## Development Notes

- Uses Turbopack for faster development builds (`--turbopack` flag)
- TypeScript strict mode enabled with path aliases (`@/*`)
- AI responses cached for performance and cost optimization
- Rate limiting implemented for API protection
- All AI providers return standardized JSON structure for consistent UI rendering