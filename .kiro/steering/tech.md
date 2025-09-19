# Technology Stack & Development Guidelines

## Core Technologies
- **Framework**: Next.js 15.5.3 with App Router and Turbopack
- **Language**: TypeScript 5.0 (strict mode enabled)
- **Runtime**: Node.js >=22.15.0
- **Package Manager**: pnpm >=10.17.0 (REQUIRED - DO NOT USE NPM)

## CRITICAL PACKAGE MANAGER RULE
**ALWAYS USE PNPM - NEVER USE NPM**
- This project is configured for pnpm exclusively
- All scripts and dependencies are optimized for pnpm
- Using npm will cause dependency conflicts and build issues
- If you need to install packages: `pnpm add <package>`
- If you need to run scripts: `pnpm <script-name>`

## Frontend Stack
- **UI Framework**: React 19.1.0
- **Styling**: Tailwind CSS 4.0 with utility-first approach
- **UI Components**: shadcn/ui + Radix UI primitives
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **State Management**: React hooks (no external state library)

## AI Integration
- **Primary Provider**: Google Gemini 2.0 Flash Experimental
- **Fallback Providers**: OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet
- **Implementation**: Custom AIService class with caching and rate limiting
- **Rate Limits**: 10 requests per hour per user
- **Cache Duration**: 1 hour for AI responses

## Development Commands
```bash
# Development
pnpm dev              # Start dev server with Turbopack
pnpm build            # Production build with Turbopack
pnpm start            # Start production server

# Code Quality
pnpm lint             # ESLint with Next.js config
pnpm type-check       # TypeScript compilation check
pnpm format           # Prettier formatting

# Markdown Linting
pnpm lint:md          # Check markdown files
pnpm lint:md:fix      # Auto-fix markdown issues
```

## Build Configuration
- **Bundler**: Turbopack for development and production
- **TypeScript**: Strict mode with path aliases (`@/*`)
- **ESLint**: Next.js recommended config
- **Image Optimization**: Next.js Image component with remote patterns

## Database & Backend
- **Database**: Supabase (PostgreSQL) - NEEDS CONFIGURATION
- **Status**: Supabase installed with environment variables set
- **Remaining Setup**: Database schema, auth setup, storage configuration needed
- **Client Integration**: Supabase client needs to be implemented

## Environment Variables
**Environment variables are set in .env and .env.local**
```env
# AI Providers
AI_PROVIDER=gemini                    # Primary AI provider
OPENAI_API_KEY=configured            # OpenAI integration
ANTHROPIC_API_KEY=configured         # Anthropic integration  
GOOGLE_API_KEY=configured            # Google Gemini integration

# Supabase (Environment variables only - needs full setup)
NEXT_PUBLIC_SUPABASE_URL=set
NEXT_PUBLIC_SUPABASE_ANON_KEY=set
SUPABASE_SERVICE_ROLE_KEY=set
```

## Context7 MCP Server Integration
**IMPORTANT: Always use Context7 MCP server for data fetching and external integrations**
- Context7 MCP server is configured and should be used automatically
- When fetching external data, documentation, or APIs, ensure Context7 MCP is running
- This provides enhanced context and data access capabilities
- Do not bypass Context7 for external data operations

## Performance Standards
- First Load JS: ~147kB target
- Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
- Mobile-first responsive design
- Optimized with Next.js 15 and Turbopack