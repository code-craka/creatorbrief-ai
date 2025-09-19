# Contributing to CreatorBrief AI

First off, thank you for considering contributing to CreatorBrief AI! It's people like you that make CreatorBrief AI such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Process

### Prerequisites

- Node.js 22.15.0 or higher
- pnpm 10.17.0 or higher
- Git

### Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/creatorbrief-ai.git
   cd creatorbrief-ai
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Add your API keys to .env.local
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**
   ```bash
   pnpm type-check
   pnpm lint
   pnpm build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

### Commit Message Guidelines

We follow the [Conventional Commits](https://conventionalcommits.org/) specification:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools

Examples:
```
feat: add Google Gemini AI provider support
fix: resolve API key validation issue
docs: update README with new installation steps
style: format code with prettier
refactor: extract AI service configuration logic
perf: implement response caching for AI requests
test: add unit tests for brief generation
chore: update dependencies to latest versions
```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type - use proper typing
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### React Components

- Use functional components with hooks
- Follow the existing component structure
- Use proper prop typing with interfaces
- Implement proper error boundaries
- Use React.memo for performance optimization when needed

### File Organization

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Feature-specific components
├── lib/                # Utility libraries
├── workflows/          # Business logic workflows
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

### Naming Conventions

- **Files**: kebab-case (`creator-brief-form.tsx`)
- **Components**: PascalCase (`CreatorBriefForm`)
- **Functions**: camelCase (`generateBrief`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: PascalCase (`CreatorBriefOutput`)

## Testing

### Running Tests

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Build test
pnpm build
```

### Writing Tests

- Write unit tests for utility functions
- Write integration tests for API endpoints
- Write component tests for React components
- Aim for good test coverage
- Use descriptive test names

## Documentation

- Update README.md for new features
- Add JSDoc comments for public APIs
- Update CHANGELOG.md for notable changes
- Include code examples in documentation
- Keep documentation up to date

## AI Provider Integration

When adding new AI providers:

1. **Extend the AIServiceConfig interface**
2. **Add provider-specific configuration**
3. **Implement the provider's completion method**
4. **Update the generateCompletion switch statement**
5. **Add environment variable documentation**
6. **Update the README with provider information**
7. **Test with the provider's API**

### Example AI Provider Addition

```typescript
// 1. Update interface
export interface AIServiceConfig {
  provider: 'openai' | 'anthropic' | 'gemini' | 'newprovider';
  // ...
}

// 2. Add to constructor
constructor(config: AIServiceConfig = { provider: 'openai' }) {
  let defaultModel: string;
  switch (config.provider) {
    // ... existing cases
    case 'newprovider':
      defaultModel = 'new-model-name';
      break;
  }
}

// 3. Add completion method
private async generateNewProviderCompletion(prompt: string): Promise<string> {
  // Implementation
}

// 4. Update generateCompletion
async generateCompletion(prompt: string): Promise<string> {
  switch (this.config.provider) {
    // ... existing cases
    case 'newprovider':
      return await this.generateNewProviderCompletion(prompt);
  }
}
```

## Release Process

1. **Update version in package.json**
2. **Update CHANGELOG.md**
3. **Create a release branch**
4. **Test thoroughly**
5. **Create a pull request**
6. **Tag the release after merge**

## Getting Help

- 💬 **Discord**: [Join our community](https://discord.gg/creatorbrief-ai)
- 📧 **Email**: dev@creatorbrief-ai.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/creatorbrief-ai/issues)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to CreatorBrief AI! 🚀