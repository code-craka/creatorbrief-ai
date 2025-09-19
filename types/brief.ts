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
  contentIdeas?: ContentIdea[];
}

// Enhanced Content Ideation Types for Task 3
export interface ContentIdea {
  id: string;
  brief_id?: number;
  title: string;
  platform: string;
  content_type: 'video' | 'carousel' | 'story' | 'reel' | 'post' | 'short' | 'live';
  hook: string;
  concept: string;
  cta: string;
  duration?: string;
  creative_details: CreativeDetails;
  visual_mockup?: VisualMockup;
  trending_elements: TrendingElements;
  performance_prediction?: PerformancePrediction;
  tags: string[];
  created_at: string;
  updated_at?: string;
}

export interface CreativeDetails {
  visual_style: string;
  tone_of_voice: string;
  key_elements: string[];
  color_palette?: string[];
  typography_suggestions?: string[];
  shot_types?: string[];
  editing_style?: string;
  music_mood?: string;
  text_overlay_suggestions?: string[];
}

export interface VisualMockup {
  thumbnail_description: string;
  scene_breakdown: SceneBreakdown[];
  visual_references?: string[];
  brand_integration_points: string[];
  accessibility_notes?: string[];
}

export interface SceneBreakdown {
  scene_number: number;
  duration: string;
  description: string;
  visual_elements: string[];
  text_overlay?: string;
  voiceover?: string;
  transitions?: string;
}

export interface TrendingElements {
  hashtags: TrendingHashtag[];
  audio_trends?: AudioTrend[];
  visual_trends: VisualTrend[];
  platform_features: PlatformFeature[];
  seasonal_relevance?: SeasonalRelevance;
}

export interface TrendingHashtag {
  hashtag: string;
  trend_score: number;
  reach_potential: 'low' | 'medium' | 'high' | 'viral';
  competition_level: 'low' | 'medium' | 'high';
  relevance_score: number;
}

export interface AudioTrend {
  audio_name: string;
  trend_score: number;
  genre: string;
  mood: string;
  usage_instructions: string;
}

export interface VisualTrend {
  trend_name: string;
  description: string;
  trend_score: number;
  difficulty_level: 'easy' | 'medium' | 'hard';
  equipment_needed?: string[];
}

export interface PlatformFeature {
  feature_name: string;
  platform: string;
  description: string;
  engagement_boost: number;
  implementation_tips: string[];
}

export interface SeasonalRelevance {
  season: string;
  holidays?: string[];
  seasonal_hooks: string[];
  timing_recommendations: string[];
}

export interface PerformancePrediction {
  engagement_rate_prediction: {
    low: number;
    medium: number;
    high: number;
  };
  reach_potential: {
    organic: number;
    paid: number;
  };
  viral_potential_score: number;
  confidence_level: number;
  key_success_factors: string[];
  optimization_suggestions: string[];
}

// Content Generation Request Types
export interface ContentIdeaGenerationRequest {
  brief_data: CreatorBriefFormData;
  idea_count?: number;
  platforms?: string[];
  content_types?: string[];
  creativity_level?: 'conservative' | 'balanced' | 'experimental';
  trend_integration?: boolean;
  user_preferences?: UserContentPreferences;
}

export interface UserContentPreferences {
  preferred_content_types: string[];
  avoided_elements: string[];
  brand_voice_keywords: string[];
  previous_feedback?: ContentFeedback[];
}

export interface ContentFeedback {
  content_idea_id: string;
  rating: number; // 1-5
  feedback_type: 'positive' | 'negative' | 'neutral';
  specific_feedback?: string;
  improvement_suggestions?: string[];
  timestamp: string;
}

// Content Variation and A/B Testing
export interface ContentVariation {
  id: string;
  parent_idea_id: string;
  variation_type: 'hook' | 'visual' | 'cta' | 'platform_adaptation';
  changes_description: string;
  content_idea: ContentIdea;
  created_at: string;
}

export interface ABTestingSetup {
  test_name: string;
  ideas_to_test: ContentIdea[];
  test_metrics: string[];
  test_duration: string;
  hypothesis: string;
  success_criteria: string;
}