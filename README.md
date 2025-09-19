# CreatorBrief AI 🚀

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge)](https://github.com/yourusername/creatorbrief-ai/graphs/commit-activity)

> **AI-Powered Creator Campaign Brief Generator** - Generate comprehensive creator campaign briefs powered by multiple AI providers. Perfect for brands, agencies, and marketing teams to create data-driven influencer marketing campaigns.

## ✨ Features

- 🤖 **Multi-AI Provider Support** - OpenAI GPT-4, Anthropic Claude, Google Gemini 2.0
- 📝 **Comprehensive Brief Generation** - Complete campaign briefs with all essential sections
- 🎯 **Platform-Specific Strategies** - Instagram, TikTok, YouTube, LinkedIn, and more
- 💰 **Budget Recommendations** - Smart budget allocation for creators and ad spend
- 📊 **KPI Tracking** - Measurable goals and performance benchmarks
- 🔄 **Caching & Rate Limiting** - Optimized performance and cost management
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- 📤 **Export Options** - Copy, download, and print generated briefs

## 🚀 Quick Start

### Prerequisites

- Node.js 22.15.0 or higher
- pnpm 10.17.0 or higher
- API key from at least one AI provider (OpenAI, Anthropic, or Google)

### Installation

1. **Clone the repository**
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
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   AI_PROVIDER=openai  # options: openai, anthropic, gemini
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   GOOGLE_API_KEY=your_google_api_key_here
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### AI Providers

The app supports three AI providers. Configure your preferred provider in `.env.local`:

| Provider | Model | API Key Required |
|----------|-------|------------------|
| **OpenAI** | GPT-4o | `OPENAI_API_KEY` |
| **Anthropic** | Claude 3.5 Sonnet | `ANTHROPIC_API_KEY` |
| **Google Gemini** | Gemini 2.0 Flash | `GOOGLE_API_KEY` |

### Getting API Keys

- **OpenAI**: [platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)
- **Anthropic**: [console.anthropic.com](https://console.anthropic.com/)
- **Google AI**: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

## 📖 Usage

### Basic Usage

1. **Fill out the form** with your product description and target audience
2. **Select platforms** where you want to run the campaign
3. **Set budget and timeline** for your campaign
4. **Click "Generate Creator Brief"** to create your comprehensive brief
5. **Review and export** your generated brief

### Advanced Configuration

You can customize the AI service programmatically:

```typescript
import { AIServiceWithCache } from '@/lib/ai-service';

const aiService = new AIServiceWithCache({
  provider: 'gemini',
  model: 'gemini-2.0-flash-exp',
  maxTokens: 4000,
  temperature: 0.7
});
```

## 🏗️ Project Structure

```
creatorbrief-ai/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── generate-brief/ # Brief generation endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── creator-brief-form.tsx # Main form component
├── lib/                  # Utility libraries
│   ├── ai-service.ts     # AI provider integrations
│   └── utils.ts          # Utility functions
├── workflows/            # Business logic
│   └── generate-brief.ts # Brief generation workflow
└── types/               # TypeScript type definitions
```

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript checks
pnpm format           # Format code with Prettier

# Markdown Linting
pnpm lint:md          # Lint markdown files
pnpm lint:md:fix      # Fix markdown issues
```

### Tech Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **AI SDKs**: OpenAI, Anthropic, Google Generative AI
- **Package Manager**: pnpm

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/creatorbrief-ai)

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Netlify**: Use `@netlify/plugin-nextjs`
- **Railway**: Direct deployment support
- **DigitalOcean App Platform**: Node.js app
- **AWS Amplify**: Full-stack deployment

## 📊 Performance

- ⚡ **Fast Loading**: Optimized with Next.js 15 and Turbopack
- 🔄 **Smart Caching**: AI responses cached for 1 hour
- 🛡️ **Rate Limiting**: 10 requests per hour per user
- 📱 **Mobile Optimized**: Responsive design for all devices

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [OpenAI](https://openai.com/), [Anthropic](https://anthropic.com/), and [Google](https://ai.google/) for their powerful AI APIs

## 📞 Support

- 📧 **Email**: support@creatorbrief-ai.com
- 💬 **Discord**: [Join our community](https://discord.gg/creatorbrief-ai)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/creatorbrief-ai/issues)
- 📖 **Documentation**: [Full Documentation](https://docs.creatorbrief-ai.com)

---

<div align="center">
  <p>Made with ❤️ by the CreatorBrief AI Team</p>
  <p>
    <a href="https://github.com/yourusername/creatorbrief-ai">⭐ Star us on GitHub</a> •
    <a href="https://twitter.com/creatorbrief_ai">🐦 Follow on Twitter</a> •
    <a href="https://creatorbrief-ai.com">🌐 Visit Website</a>
  </p>
</div>
