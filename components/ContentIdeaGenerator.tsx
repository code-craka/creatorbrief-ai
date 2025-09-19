'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sparkles,
  Video,
  Image,
  TrendingUp,
  Clock,
  Eye,
  ThumbsUp,
  RefreshCw,
  Download,
  Share2,
  Star,
  Lightbulb
} from 'lucide-react';
import {
  ContentIdea,
  ContentIdeaGenerationRequest,
  CreatorBriefFormData,
  UserContentPreferences,
  ContentFeedback
} from '@/types/brief';

interface ContentIdeaGeneratorProps {
  briefData: CreatorBriefFormData;
  onContentIdeasGenerated?: (ideas: ContentIdea[]) => void;
  userPreferences?: UserContentPreferences;
  className?: string;
}

const ContentIdeaGenerator: React.FC<ContentIdeaGeneratorProps> = ({
  briefData,
  onContentIdeasGenerated,
  userPreferences,
  className = ''
}) => {
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null);
  const [generationSettings, setGenerationSettings] = useState<{
    idea_count: number;
    creativity_level: 'conservative' | 'balanced' | 'experimental';
    platforms: string[];
    content_types: string[];
    trend_integration: boolean;
  }>({
    idea_count: 5,
    creativity_level: 'balanced',
    platforms: briefData.platforms || ['Instagram', 'TikTok'],
    content_types: ['video', 'carousel', 'story'],
    trend_integration: true
  });

  const generateContentIdeas = useCallback(async () => {
    setIsGenerating(true);
    try {
      const request: ContentIdeaGenerationRequest = {
        brief_data: briefData,
        ...generationSettings,
        user_preferences: userPreferences
      };

      const response = await fetch('/api/content-ideas/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content ideas');
      }

      const result = await response.json();
      const ideas = result.data || result.content_ideas || [];

      setContentIdeas(ideas);
      onContentIdeasGenerated?.(ideas);
    } catch (error) {
      console.error('Error generating content ideas:', error);
      // Show fallback ideas for better UX
      const fallbackIdeas = generateFallbackIdeas();
      setContentIdeas(fallbackIdeas);
      onContentIdeasGenerated?.(fallbackIdeas);
    } finally {
      setIsGenerating(false);
    }
  }, [briefData, generationSettings, userPreferences, onContentIdeasGenerated]);

  const provideFeedback = async (ideaId: string, rating: number, feedbackType: 'positive' | 'negative' | 'neutral') => {
    try {
      const feedback: ContentFeedback = {
        content_idea_id: ideaId,
        rating,
        feedback_type: feedbackType,
        timestamp: new Date().toISOString()
      };

      await fetch('/api/content-ideas/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const generateVariations = async (idea: ContentIdea, variationType: 'hook' | 'visual' | 'cta' | 'platform_adaptation') => {
    try {
      const response = await fetch('/api/content-ideas/variations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          original_idea: idea,
          variation_type: variationType,
          count: 3
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate variations');
      }

      const result = await response.json();
      const variations = result.data || [];

      // Add variations to the content ideas list
      setContentIdeas(prev => [...prev, ...variations]);
    } catch (error) {
      console.error('Error generating variations:', error);
    }
  };

  const generateFallbackIdeas = (): ContentIdea[] => {
    return [
      {
        id: 'fallback_1',
        title: 'Product Showcase Video',
        platform: 'Instagram',
        content_type: 'video',
        hook: 'See how this product changed my daily routine',
        concept: 'Before and after demonstration showing product benefits',
        cta: 'Get yours today with link in bio!',
        duration: '30-60 seconds',
        creative_details: {
          visual_style: 'Clean and modern',
          tone_of_voice: 'Conversational and authentic',
          key_elements: ['Product demonstration', 'Personal testimonial'],
          color_palette: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
          shot_types: ['Close-up', 'Wide shot'],
          editing_style: 'Quick cuts with smooth transitions',
          music_mood: 'Upbeat and energetic'
        },
        trending_elements: {
          hashtags: [
            {
              hashtag: '#productreview',
              trend_score: 75,
              reach_potential: 'medium',
              competition_level: 'medium',
              relevance_score: 90
            }
          ],
          visual_trends: [
            {
              trend_name: 'Quick transitions',
              description: 'Fast-paced editing between scenes',
              trend_score: 80,
              difficulty_level: 'medium'
            }
          ],
          platform_features: [
            {
              feature_name: 'Reels',
              platform: 'Instagram',
              description: 'Use Instagram Reels for maximum reach',
              engagement_boost: 30,
              implementation_tips: ['Use trending audio', 'Add captions']
            }
          ]
        },
        tags: ['product-demo', 'lifestyle', 'testimonial'],
        created_at: new Date().toISOString()
      }
    ];
  };

  const exportIdea = (idea: ContentIdea) => {
    const exportData = {
      title: idea.title,
      platform: idea.platform,
      content_type: idea.content_type,
      hook: idea.hook,
      concept: idea.concept,
      cta: idea.cta,
      creative_details: idea.creative_details,
      visual_mockup: idea.visual_mockup,
      trending_elements: idea.trending_elements
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content_idea_${idea.title.replace(/\s+/g, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Content Idea Generator
          </CardTitle>
          <CardDescription>
            Generate AI-powered content ideas with trending elements and visual mockups
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Number of Ideas</label>
              <select
                value={generationSettings.idea_count}
                onChange={(e) => setGenerationSettings(prev => ({ ...prev, idea_count: parseInt(e.target.value) }))}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value={3}>3 Ideas</option>
                <option value={5}>5 Ideas</option>
                <option value={10}>10 Ideas</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Creativity Level</label>
              <select
                value={generationSettings.creativity_level}
                onChange={(e) => setGenerationSettings(prev => ({ ...prev, creativity_level: e.target.value as 'conservative' | 'balanced' | 'experimental' }))}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="conservative">Conservative</option>
                <option value="balanced">Balanced</option>
                <option value="experimental">Experimental</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={generateContentIdeas}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Lightbulb className="h-4 w-4 mr-2" />
                )}
                {isGenerating ? 'Generating...' : 'Generate Ideas'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Ideas Grid */}
      {contentIdeas.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {contentIdeas.map((idea) => (
            <ContentIdeaCard
              key={idea.id}
              idea={idea}
              onSelect={() => setSelectedIdea(idea)}
              onFeedback={provideFeedback}
              onGenerateVariations={generateVariations}
              onExport={exportIdea}
              isSelected={selectedIdea?.id === idea.id}
            />
          ))}
        </div>
      )}

      {/* Detailed View */}
      {selectedIdea && (
        <ContentIdeaDetailView
          idea={selectedIdea}
          onClose={() => setSelectedIdea(null)}
        />
      )}
    </div>
  );
};

interface ContentIdeaCardProps {
  idea: ContentIdea;
  onSelect: () => void;
  onFeedback: (ideaId: string, rating: number, type: 'positive' | 'negative' | 'neutral') => void;
  onGenerateVariations: (idea: ContentIdea, type: 'hook' | 'visual' | 'cta' | 'platform_adaptation') => void;
  onExport: (idea: ContentIdea) => void;
  isSelected: boolean;
}

const ContentIdeaCard: React.FC<ContentIdeaCardProps> = ({
  idea,
  onSelect,
  onFeedback,
  onGenerateVariations,
  onExport,
  isSelected
}) => {
  const [showActions, setShowActions] = useState(false);

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
      case 'reel':
      case 'short':
        return <Video className="h-4 w-4" />;
      case 'carousel':
      case 'post':
        return <Image className="h-4 w-4" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'tiktok':
        return 'bg-black';
      case 'youtube':
        return 'bg-red-500';
      case 'linkedin':
        return 'bg-blue-600';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-purple-500' : ''
      }`}
      onClick={onSelect}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {idea.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className={`text-white ${getPlatformColor(idea.platform)}`}>
                {idea.platform}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                {getContentTypeIcon(idea.content_type)}
                {idea.content_type}
              </Badge>
              {idea.duration && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {idea.duration}
                </Badge>
              )}
            </div>
          </div>
          {showActions && (
            <div className="flex gap-1 ml-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onExport(idea);
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.share?.({ title: idea.title, text: idea.concept });
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-sm text-gray-600 mb-1">Hook</h4>
          <p className="text-sm line-clamp-2">{idea.hook}</p>
        </div>

        <div>
          <h4 className="font-medium text-sm text-gray-600 mb-1">Concept</h4>
          <p className="text-sm line-clamp-3">{idea.concept}</p>
        </div>

        {idea.trending_elements?.hashtags?.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-600 mb-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Trending Hashtags
            </h4>
            <div className="flex flex-wrap gap-1">
              {idea.trending_elements.hashtags.slice(0, 4).map((hashtag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {hashtag.hashtag}
                </Badge>
              ))}
              {idea.trending_elements.hashtags.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{idea.trending_elements.hashtags.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {idea.performance_prediction && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-500" />
              <span>Reach: {idea.performance_prediction.reach_potential.organic.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-green-500" />
              <span>Engagement: {idea.performance_prediction.engagement_rate_prediction.medium}%</span>
            </div>
          </div>
        )}

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={(e) => {
                  e.stopPropagation();
                  onFeedback(idea.id, rating, rating > 3 ? 'positive' : rating < 3 ? 'negative' : 'neutral');
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Star className="h-3 w-3 text-gray-400 hover:text-yellow-500" />
              </button>
            ))}
          </div>

          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onGenerateVariations(idea, 'hook');
              }}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Variations
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ContentIdeaDetailViewProps {
  idea: ContentIdea;
  onClose: () => void;
}

const ContentIdeaDetailView: React.FC<ContentIdeaDetailViewProps> = ({ idea, onClose }) => {
  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{idea.title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visual Mockup */}
        {idea.visual_mockup && (
          <div>
            <h3 className="font-semibold mb-3">Visual Mockup</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Thumbnail Description:</p>
              <p className="text-sm mb-4">{idea.visual_mockup.thumbnail_description}</p>

              {idea.visual_mockup.scene_breakdown && (
                <div>
                  <p className="text-sm font-medium mb-2">Scene Breakdown:</p>
                  <div className="space-y-2">
                    {idea.visual_mockup.scene_breakdown.map((scene, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">Scene {scene.scene_number}</Badge>
                          <span className="text-sm text-gray-500">{scene.duration}</span>
                        </div>
                        <p className="text-sm">{scene.description}</p>
                        {scene.text_overlay && (
                          <p className="text-xs text-gray-600 mt-1">Text: "{scene.text_overlay}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Creative Details */}
        <div>
          <h3 className="font-semibold mb-3">Creative Direction</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Visual Style</p>
              <p className="text-sm text-gray-600">{idea.creative_details.visual_style}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Tone of Voice</p>
              <p className="text-sm text-gray-600">{idea.creative_details.tone_of_voice}</p>
            </div>
            {idea.creative_details.color_palette && (
              <div>
                <p className="text-sm font-medium mb-1">Color Palette</p>
                <div className="flex gap-1">
                  {idea.creative_details.color_palette.map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
            {idea.creative_details.key_elements && (
              <div>
                <p className="text-sm font-medium mb-1">Key Elements</p>
                <div className="flex flex-wrap gap-1">
                  {idea.creative_details.key_elements.map((element, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {element}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Performance Prediction */}
        {idea.performance_prediction && (
          <div>
            <h3 className="font-semibold mb-3">Performance Prediction</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <p className="text-2xl font-bold text-blue-600">
                  {idea.performance_prediction.engagement_rate_prediction.medium}%
                </p>
                <p className="text-sm text-gray-600">Expected Engagement</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <p className="text-2xl font-bold text-green-600">
                  {idea.performance_prediction.reach_potential.organic.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Organic Reach</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded">
                <p className="text-2xl font-bold text-purple-600">
                  {idea.performance_prediction.viral_potential_score}
                </p>
                <p className="text-sm text-gray-600">Viral Potential</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentIdeaGenerator;