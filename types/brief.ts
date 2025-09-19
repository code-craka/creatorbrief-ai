// This file centralizes your type definitions.

export interface CreatorBriefFormData {
  productDescription: string;
  targetAudience: string;
  campaignGoals: string;
  budget: string;
  platforms: string[];
  timeframe: string;
}

// NOTE: This includes a User type for the avatar example. 
// If you don't have a user system, you can remove it.
export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface CreatorBriefOutput {
  campaignTitle: string;
  objective: string;
  platforms: string[];
  contentFormats: string[];
  messagingPillars: string[];
  creativeDirection: {
    visualStyle: string;
    toneOfVoice: string;
    mustHaveElements: string[];
  };
  deliverables: {
    primaryContent: number;
    stories: number;
    timeline: string;
  };
  kpis: {
    primaryMetric: string;
    targetEngagementRate: string;
    expectedReach: string;
  };
  callToAction: string;
  complianceNotes: string[];
  hashtags: string[];
  budgetRecommendations: {
    creatorFee: string;
    adSpend: string;
  };
}