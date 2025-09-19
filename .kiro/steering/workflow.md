# Development Workflow & Rules

## Package Manager Requirements

**CRITICAL: ONLY USE PNPM - NEVER USE NPM**

### Why pnpm Only?

- Project is configured exclusively for pnpm
- Dependency resolution optimized for pnpm
- Lock file is pnpm-lock.yaml (not package-lock.json)
- Using npm will break the build and cause conflicts

### Correct Commands

```bash
# ✅ CORRECT - Use these commands
pnpm install              # Install dependencies
pnpm dev                  # Start development
pnpm build                # Build for production
pnpm add <package>        # Add new package
pnpm remove <package>     # Remove package

# ❌ WRONG - Never use these
npm install               # Will cause conflicts
npm run dev               # Will fail
npm install <package>     # Will break dependencies
```

## Supabase Integration

**Supabase is installed with environment variables set - NEEDS FULL CONFIGURATION**

### Current Status

- ✅ Supabase package installed
- ✅ Environment variables set in .env and .env.local
- ❌ Database schema not created
- ❌ Authentication not configured
- ❌ Storage buckets not set up
- ❌ Supabase client not implemented

### What Needs Configuration

- Create database schema and tables
- Set up authentication flows
- Configure storage buckets if needed
- Implement Supabase client in the app
- Generate TypeScript types from schema
- Set up real-time subscriptions if needed

## Context7 MCP Server

**MANDATORY: Always ensure Context7 MCP server is running for external operations**

### When to Use Context7

- Fetching external documentation
- API integrations
- Data enrichment operations
- Any external service calls

### Integration Requirements

- Context7 MCP server must be active before external operations
- Use Context7 for enhanced context and data access
- Don't bypass Context7 for external integrations
- Verify Context7 connection before proceeding with data operations

## Development Checklist

Before starting any development task:

1. ✅ Verify pnpm is being used (not npm)
2. ✅ Confirm Supabase credentials are loaded
3. ✅ Ensure Context7 MCP server is running
4. ✅ Check environment variables are properly set
