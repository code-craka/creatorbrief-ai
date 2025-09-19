# Project Structure & Organization

## Directory Layout
```
creatorbrief-ai/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── generate-brief/ # Brief generation endpoint
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout component
│   └── page.tsx          # Home page (main entry)
├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   ├── *Form.tsx         # Form-related components
│   ├── *Page.tsx         # Page-level components
│   └── *Display.tsx      # Display/result components
├── lib/                  # Utility libraries
│   ├── ai-service.ts     # AI provider integrations
│   └── utils.ts          # Shared utility functions
├── types/               # TypeScript definitions
│   └── brief.ts         # Core type definitions
├── workflows/           # Business logic workflows
│   └── generate-brief.ts # Brief generation workflow
└── public/              # Static assets
```

## Component Architecture

### Page Components
- `LandingPage.tsx` - Welcome/marketing page
- `Dashboard.tsx` - Main form interface
- `ResultsPage.tsx` - Generated brief display
- `UpgradePage.tsx` - Pricing/subscription

### Form Components
- `BriefGeneratorForm.tsx` - Main form logic
- `creator-brief-form.tsx` - Alternative form implementation

### Display Components
- `BriefResultDisplay.tsx` - Brief output formatting
- `GeneratingSpinner.tsx` - Loading states

### Core App
- `CreatorBriefApp.tsx` - Main application orchestrator

## File Naming Conventions
- **Components**: PascalCase (e.g., `BriefGeneratorForm.tsx`)
- **Pages**: PascalCase with descriptive names
- **Utilities**: camelCase (e.g., `ai-service.ts`)
- **Types**: camelCase files, PascalCase interfaces
- **API Routes**: kebab-case directories

## Import Patterns
- Use `@/` path alias for all internal imports
- Group imports: external libraries, then internal modules
- Prefer named exports over default exports for utilities
- Use default exports for React components

## State Management
- Local component state with `useState`
- Form state with React Hook Form
- No global state management library
- Props drilling for shared state between components

## API Structure
- RESTful endpoints under `/api/`
- Route handlers in `route.ts` files
- Consistent error handling and response formats
- Environment-based configuration