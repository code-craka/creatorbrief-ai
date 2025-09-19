"use client";

import React, { useState } from 'react';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import GeneratingSpinner from './GeneratingSpinner';
import ResultsPage from './ResultsPage';
import UpgradePage from './UpgradePage';
import { User, CreatorBriefFormData } from '@/types/brief';

type ViewState = 'landing' | 'dashboard' | 'generating' | 'results' | 'upgrade';

interface GeneratedBrief {
  projectName: string;
  createdAt: string;
  videoIdeas: Array<{
    id: string;
    title: string;
    hook: string;
    concept: string;
    cta: string;
    duration: string;
    platform: string;
  }>;
  creators: Array<{
    id: string;
    profile: string;
    platform: string;
    followers: string;
    engagement: string;
    niche: string;
    why: string;
  }>;
  outreach: Array<{
    creator: string;
    subject: string;
    message: string;
  }>;
}

const CreatorBriefApp = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState(3);
  const [isPro, setIsPro] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState<GeneratedBrief | null>(null);

  const handleSignIn = () => {
    setTimeout(() => {
      setUser({
        name: 'Demo User',
        email: 'demo@example.com',
        avatar: '/avatar.svg'
      });
      setCurrentView('dashboard');
    }, 1000);
  };

  const generateMockBrief = (): GeneratedBrief => {
    return {
      projectName: 'Campaign Brief',
      createdAt: new Date().toLocaleDateString(),
      videoIdeas: [
        {
          id: '1',
          title: "The 'Before & After' Transformation",
          hook: "POV: You used to spend 3 hours on [task] until you found this...",
          concept: "Show the painful manual process vs. the seamless experience with your product",
          cta: "Link in bio to try it free for 14 days",
          duration: "15-30 seconds",
          platform: "TikTok/Instagram Reels"
        },
        {
          id: '2',
          title: "Day in the Life: Productivity Hack",
          hook: "How I 10x my productivity in 2024 (you won't believe #3)",
          concept: "Creator walks through their daily routine, naturally incorporating your product",
          cta: "Use my code CREATOR20 for 20% off",
          duration: "30-60 seconds",
          platform: "YouTube Shorts/TikTok"
        },
        {
          id: '3',
          title: "Problem-Solution Story",
          hook: "I was struggling with [problem] until I discovered this game-changer",
          concept: "Personal story format connecting emotionally with the target pain point",
          cta: "Get started free at [website]",
          duration: "30-45 seconds",
          platform: "All platforms"
        }
      ],
      creators: [
        {
          id: '1',
          profile: "Ex-software engineer turned productivity coach",
          platform: "TikTok",
          followers: "50K-100K",
          engagement: "8-12%",
          niche: "Tech productivity, developer tools",
          why: "Perfect blend of technical credibility and relatable content style"
        },
        {
          id: '2',
          profile: "College student documenting study/work optimization",
          platform: "Instagram",
          followers: "25K-50K",
          engagement: "12-18%",
          niche: "Study tips, productivity apps, student life",
          why: "Authentic voice that resonates with young professionals"
        }
      ],
      outreach: [
        {
          creator: "Ex-software engineer turned productivity coach",
          subject: "Partnership opportunity for productivity creators",
          message: `Hi [Creator Name]!

I've been following your content about developer productivity tools and love your authentic approach to reviewing tech products.

I'm working with a startup that's built something I think your audience would genuinely find valuable - it's an AI tool that helps teams generate creator marketing campaigns in under 60 seconds.

Given your background in software and your focus on productivity tools, I'd love to send you early access to try it out. No strings attached - just curious to get your thoughts.

If it resonates with you and you think it'd be valuable to your audience, we'd be excited to discuss a potential partnership.

Would you be open to a quick 10-minute call this week?

Best regards,
Demo User`
        }
      ]
    };
  };

  const handleFormSubmit = async (formData: CreatorBriefFormData) => {
    if (credits === 0 && !isPro) {
      setCurrentView('upgrade');
      return;
    }
    
    setCurrentView('generating');
    
    try {
      const response = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to generate brief');
      }

      // Transform API response to match our interface
      const brief: GeneratedBrief = {
        projectName: 'AI Generated Campaign Brief',
        createdAt: new Date().toLocaleDateString(),
        videoIdeas: result.data.contentFormats?.map((format: string, index: number) => ({
          id: (index + 1).toString(),
          title: format,
          hook: result.data.messagingPillars?.[0] || 'Engaging hook',
          concept: result.data.creativeDirection?.visualStyle || 'Creative concept',
          cta: result.data.callToAction || 'Call to action',
          duration: '30-60 seconds',
          platform: formData.platforms[0] || 'All platforms'
        })) || [],
        creators: [{
          id: '1',
          profile: 'AI-recommended creator profile',
          platform: formData.platforms[0] || 'Instagram',
          followers: '50K-100K',
          engagement: '8-12%',
          niche: 'Relevant to your audience',
          why: 'Perfect match for your campaign goals'
        }],
        outreach: [{
          creator: 'Recommended Creator',
          subject: 'Partnership Opportunity',
          message: `Hi there!\n\nI'd love to collaborate on a campaign for ${formData.productDescription.slice(0, 50)}...\n\nBest regards!`
        }]
      };

      setGeneratedBrief(brief);
      setCredits(prev => Math.max(0, prev - 1));
      setCurrentView('results');
    } catch (error) {
      console.error('Error generating brief:', error);
      // Fallback to mock data if API fails
      const mockBrief = generateMockBrief();
      setGeneratedBrief(mockBrief);
      setCredits(prev => Math.max(0, prev - 1));
      setCurrentView('results');
    }
  };

  const handleUpgrade = () => {
    setIsPro(true);
    setCredits(999);
    setCurrentView('dashboard');
  };

  const handleNewCampaign = () => {
    setGeneratedBrief(null);
    setCurrentView('dashboard');
  };

  const handleUpgradeClick = () => {
    setCurrentView('upgrade');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // Render based on current view
  switch (currentView) {
    case 'landing':
      return <LandingPage onSignIn={handleSignIn} />;
    
    case 'dashboard':
      return (
        <Dashboard
          user={user!}
          credits={credits}
          isPro={isPro}
          onSubmit={handleFormSubmit}
          onUpgradeClick={handleUpgradeClick}
        />
      );
    
    case 'generating':
      return <GeneratingSpinner />;
    
    case 'results':
      return (
        <ResultsPage
          user={user!}
          brief={generatedBrief!}
          credits={credits}
          isPro={isPro}
          onNewCampaign={handleNewCampaign}
        />
      );
    
    case 'upgrade':
      return (
        <UpgradePage
          onUpgrade={handleUpgrade}
          onBack={handleBackToDashboard}
        />
      );
    
    default:
      return <LandingPage onSignIn={handleSignIn} />;
  }
};

export default CreatorBriefApp;