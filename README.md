# CreatorBrief AI 🚀

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge)](https://github.com/code-craka/creatorbrief-ai/graphs/commit-activity)

> **Enterprise B2B SaaS Platform** - AI-Powered Creator Campaign Brief Generator with comprehensive authentication, user management, and multi-tenant architecture. Perfect for brands, agencies, and marketing teams to create data-driven influencer marketing campaigns.

## ✨ Features

### 🔐 Authentication & User Management
- 🔑 **Comprehensive Auth System** - Email/password, Google OAuth, LinkedIn OAuth
- 👥 **User Profiles** - Company information, roles, and preferences
- 🛡️ **Role-Based Access Control** - Admin, Manager, Editor, Viewer roles
- 🔒 **Row Level Security** - Multi-tenant data isolation with Supabase RLS
- 📧 **Email Verification** - Secure account activation and password reset
- 🔔 **Notification Preferences** - Customizable email and in-app notifications

### 🤖 AI-Powered Campaign Generation
- 🤖 **Multi-AI Provider Support** - OpenAI GPT-4, Anthropic Claude, Google Gemini 2.0
- 📝 **Comprehensive Brief Generation** - Complete campaign briefs with all essential sections
- 🎯 **Platform-Specific Strategies** - Instagram, TikTok, YouTube, LinkedIn, and more
- 💰 **Budget Recommendations** - Smart budget allocation for creators and ad spend
- 📊 **KPI Tracking** - Measurable goals and performance benchmarks
- 💡 **Enhanced Content Ideation** - AI-powered content idea generation with trending hashtags
- 🎨 **Visual Mockups** - AI-generated visual mockup descriptions for content ideas
- 📈 **Performance Predictions** - AI-driven engagement and reach predictions
- 🔄 **Content Variations** - Generate multiple variations of successful ideas
- ⭐ **User Feedback Learning** - AI learns from user ratings to improve suggestions

### 🏢 Enterprise Features
- 🏗️ **Multi-Tenant Architecture** - Secure data isolation for organizations
- 👨‍💼 **Team Collaboration** - Invite team members with role-based permissions
- 📈 **Usage Tracking** - Monitor AI requests, campaigns, and briefs
- 💳 **Subscription Management** - Free, Pro, and Enterprise plans
- 📋 **Audit Logging** - Comprehensive activity tracking for compliance
- 🔄 **Version Control** - Track changes to briefs and campaigns

### 🎨 User Experience
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- 📤 **Export Options** - Copy, download, and print generated briefs
- 🔄 **Caching & Rate Limiting** - Optimized performance and cost management

## 🚀 Quick Start

### Prerequisites

- Node.js 22.15.0 or higher
- pnpm package manager (required - do not use npm)
- Supabase account and project
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
   ⚠️ **Important**: This project requires pnpm. Do not use npm as it will cause dependency conflicts.

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the database migrations:
     ```bash
     pnpm db:migrate
     ```
   - Generate TypeScript types:
     ```bash
     pnpm db:generate-types
     ```

4. **Set up environment variables**
   Create `.env.local` file in the root directory:
   ```env
   # AI Providers
   AI_PROVIDER=gemini  # options: openai, anthropic, gemini
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   GOOGLE_API_KEY=your_google_api_key_here

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## 🔧 Configuration

### AI Providers

The app supports three AI providers. Configure your preferred provider in `.env.local`:

| Provider | Model | API Key Required | Status |
|----------|-------|------------------|--------|
| **OpenAI** | GPT-4o | `OPENAI_API_KEY` | ✅ Supported |
| **Anthropic** | Claude 3.5 Sonnet | `ANTHROPIC_API_KEY` | ✅ Supported |
| **Google Gemini** | Gemini 2.0 Flash Exp | `GOOGLE_API_KEY` | ✅ **Default** |

### Getting API Keys

- **OpenAI**: [platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)
- **Anthropic**: [console.anthropic.com](https://console.anthropic.com/)
- **Google AI**: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

## 📖 Usage

### Application Flow

1. **Landing Page** - Welcome screen with feature overview
2. **Authentication** - Sign up/sign in with email or social providers (Google, LinkedIn)
3. **Email Verification** - Secure account activation
4. **Dashboard** - Authenticated user dashboard with comprehensive form:
   - Product description (required)
   - Target audience (required)
   - Campaign goals
   - Platform selection (required)
   - Budget range
   - Campaign duration
5. **AI Generation** - Real-time brief creation using Gemini AI
6. **Results Page** - Tabbed interface showing:
   - Video brief ideas
   - Creator recommendations
   - Outreach templates
7. **Profile Management** - User settings, company info, and preferences
8. **Export Options** - Copy, download, or print generated briefs

### Key Features

- **Real AI Integration**: Powered by Google Gemini 2.0 Flash
- **Comprehensive Forms**: Detailed input for better AI results
- **Multi-Platform Support**: Instagram, TikTok, YouTube, LinkedIn, etc.
- **Professional UI**: Built with shadcn/ui and Tailwind CSS
- **Responsive Design**: Works on desktop and mobile
- **Error Handling**: Graceful fallbacks and user feedback

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
│   │   ├── generate-brief/ # Brief generation endpoint
│   │   ├── content-ideas/  # Content ideation API endpoints
│   │   │   ├── generate/   # Generate content ideas
│   │   │   ├── feedback/   # Submit user feedback
│   │   │   └── variations/ # Generate content variations
│   │   ├── projects/       # Project management API
│   │   ├── campaigns/      # Campaign management API
│   │   ├── briefs/         # Brief management API
│   │   ├── dashboard/      # Dashboard stats API
│   │   ├── activity/       # Activity tracking API
│   │   └── team/           # Team management API
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Sign in page
│   │   ├── signup/        # Sign up page
│   │   ├── forgot-password/ # Password reset
│   │   ├── reset-password/  # New password
│   │   └── callback/      # OAuth callback
│   ├── dashboard/         # Protected dashboard
│   ├── profile/           # User profile settings
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with AuthProvider
│   └── page.tsx          # Home page with auth redirect
├── components/            # React components
│   ├── auth/             # Authentication components
│   │   ├── AuthProvider.tsx   # Auth context provider
│   │   ├── SignIn.tsx         # Sign in form
│   │   ├── SignUp.tsx         # Sign up form
│   │   └── ForgotPassword.tsx # Password reset form
│   ├── profile/          # Profile management
│   │   └── ProfileSettings.tsx # User settings
│   ├── ui/               # shadcn/ui components
│   ├── BriefGeneratorForm.tsx # Main form component
│   ├── Dashboard.tsx          # Dashboard with form
│   ├── LandingPage.tsx        # Welcome page
│   ├── GeneratingSpinner.tsx  # Loading component
│   ├── ResultsPage.tsx        # Results display
│   ├── BriefResultDisplay.tsx # Brief display component
│   ├── ContentIdeaGenerator.tsx # Enhanced content ideation system
│   ├── ProjectDashboard.tsx   # Project management dashboard
│   ├── ProjectForm.tsx        # Project creation/editing
│   ├── ProjectCard.tsx        # Project display component
│   ├── CampaignForm.tsx       # Campaign creation/editing
│   ├── CampaignCard.tsx       # Campaign display component
│   ├── ActivityFeed.tsx       # Activity tracking component
│   └── TeamManagement.tsx     # Team collaboration features
├── lib/                  # Utility libraries
│   ├── supabase/         # Supabase client utilities
│   │   ├── client.ts     # Browser client
│   │   └── server.ts     # Server client
│   ├── ai-service.ts     # AI provider integrations
│   └── utils.ts          # Utility functions
├── supabase/             # Database migrations
│   └── migrations/       # SQL migration files
├── types/               # TypeScript type definitions
│   ├── brief.ts         # Brief type definitions
│   └── database.ts      # Database type definitions
├── workflows/            # Business logic
│   └── generate-brief.ts # Brief generation workflow
├── middleware.ts         # Auth middleware
└── public/              # Static assets
```

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production with Turbopack
pnpm start            # Start production server

# Database
pnpm db:migrate       # Run Supabase migrations
pnpm db:reset         # Reset database
pnpm db:generate-types # Generate TypeScript types from schema

# Code Quality
pnpm lint             # Run ESLint with Next.js config
pnpm type-check       # Run TypeScript compilation check
pnpm format           # Run Prettier formatting
pnpm lint:md          # Lint markdown files
pnpm lint:md:fix      # Auto-fix markdown issues
```

### Development Status

- ✅ **Authentication System**: Complete with Supabase Auth
- ✅ **Database Schema**: Comprehensive multi-tenant architecture
- ✅ **User Management**: Profile settings and role-based access
- ✅ **Core Features**: Complete and functional
- ✅ **AI Integration**: Google Gemini 2.0 Flash working
- ✅ **Enhanced Content Ideation**: Task 3 implementation complete
- ✅ **Project Management**: Full CRUD operations with dashboard
- ✅ **Campaign Management**: Complete campaign lifecycle management
- ✅ **Activity Tracking**: User activity feed and audit logging
- ✅ **Team Management**: Role-based collaboration features
- ✅ **UI Components**: All components implemented and styled
- ✅ **TypeScript**: Fully typed with strict mode, all errors resolved
- ✅ **ESLint**: All linting errors fixed, code quality optimized
- ✅ **Build**: Production build successful with zero warnings
- ✅ **Responsive**: Mobile and desktop optimized
- ✅ **Security**: Row Level Security and comprehensive audit logging

### Tech Stack

- **Framework**: Next.js 15.5.3 with App Router and Turbopack
- **Language**: TypeScript 5.0 (strict mode)
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with social providers
- **Styling**: Tailwind CSS 4.0
- **UI Components**: shadcn/ui + Radix UI primitives
- **Icons**: Lucide React
- **AI SDKs**: OpenAI, Anthropic, Google Generative AI
- **Package Manager**: pnpm (required)

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

## 📊 Performance & Features

### Performance
- ⚡ **Fast Loading**: Optimized with Next.js 15 and Turbopack
- 🔄 **Smart Caching**: AI responses cached for 1 hour
- 🛡️ **Rate Limiting**: 10 requests per hour per user
- 📱 **Mobile Optimized**: Responsive design for all devices
- 🏗️ **Build Size**: ~147kB first load JS

### Current Implementation
- 🔐 **Authentication**: Complete auth system with email/social login
- 👥 **User Management**: Profile settings and role-based access
- 🏗️ **Database**: Multi-tenant architecture with RLS policies
- 🎯 **Landing Page**: Professional welcome screen
- 📝 **Comprehensive Form**: Multi-step form with validation
- 🤖 **AI Generation**: Real Gemini AI integration
- 📊 **Results Display**: Tabbed interface with export options
- 🔄 **Error Handling**: Graceful fallbacks and user feedback
- 📋 **Audit Logging**: Comprehensive activity tracking

### Technical Architecture
- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Supabase with PostgreSQL
- **Authentication**: Supabase Auth with OAuth providers
- **Database**: Row Level Security for multi-tenancy
- **Styling**: Tailwind CSS 4.0, shadcn/ui
- **AI**: Google Gemini 2.0 Flash Experimental
- **Icons**: Lucide React
- **Build**: Turbopack for fast development

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

## 🚀 Deployment Status

### Current Branch: Development
- ✅ Complete authentication system with Supabase
- ✅ Multi-tenant database architecture
- ✅ User profile management and RBAC
- ✅ All components implemented and working
- ✅ AI integration with Gemini 2.0 Flash
- ✅ TypeScript errors resolved
- ✅ Build successful
- ✅ Ready for production deployment

### Phase 2 Implementation Complete
1. ✅ Supabase integration and authentication
2. ✅ Comprehensive user management system
3. ✅ Database schema with RLS policies
4. ✅ Role-based access control
5. ✅ Audit logging and compliance features

### Next Steps (Phase 3)
1. Campaign and project management
2. Creator database and matching
3. Advanced analytics and reporting
4. Team collaboration features
5. Payment processing and subscriptions

---

<div align="center">
  <p>Made with ❤️ by the CreatorBrief AI Team</p>
  <p>
    <a href="https://github.com/code-craka/creatorbrief-ai">⭐ Star us on GitHub</a> •
    <a href="https://creatorbrief-ai.com">🌐 Visit Website</a>
  </p>
</div>
