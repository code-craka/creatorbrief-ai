// workflows/generate-brief.ts
import { AIServiceWithCache } from '@/lib/ai-service';

const aiService = new AIServiceWithCache({
  provider: process.env.AI_PROVIDER as 'openai' | 'anthropic' | 'gemini' || 'openai',
});

const BRIEF_GENERATION_PROMPT_TEMPLATE = `
<persona>
You are "CreatorBrief AI," an expert viral marketing strategist with 10+ years of experience in influencer marketing, content creation, and brand partnerships. You specialize in creating data-driven campaign briefs that maximize engagement and conversion rates across all social media platforms.
</persona>

<instructions>
Your task is to generate a comprehensive creator campaign brief based exclusively on the product information provided in the <context> tags below. 

The brief should include:
1. Campaign objectives with measurable KPIs
2. Content format recommendations (video, carousel, stories, etc.)
3. Platform-specific strategies
4. Messaging pillars and key talking points
5. Creative direction and visual guidelines
6. Timeline and deliverables
7. Performance benchmarks

Focus on creating actionable, specific guidance that creators can immediately implement.
</instructions>

<output_format>
Return ONLY a valid JSON object with this exact structure (no markdown formatting, no additional text):

{
  "campaignTitle": "string",
  "objective": "string",
  "platforms": ["string"],
  "contentFormats": ["string"],
  "messagingPillars": ["string"],
  "creativeDirection": {
    "visualStyle": "string",
    "toneOfVoice": "string",
    "mustHaveElements": ["string"]
  },
  "deliverables": {
    "primaryContent": number,
    "stories": number,
    "timeline": "string"
  },
  "kpis": {
    "primaryMetric": "string",
    "targetEngagementRate": "string",
    "expectedReach": "string"
  },
  "callToAction": "string",
  "complianceNotes": ["string"],
  "hashtags": ["string"],
  "budgetRecommendations": {
    "creatorFee": "string",
    "adSpend": "string"
  }
}
</output_format>

<rules>
- Base all recommendations on the provided product and audience data
- Ensure platform-specific optimization (Instagram vs TikTok vs YouTube)
- Include FTC compliance guidelines for sponsored content
- Provide specific, actionable creative direction
- Set realistic but ambitious performance targets
- Consider seasonal trends and current social media best practices
- Generate relevant hashtags for each platform
- Output ONLY valid JSON - no additional text or formatting
- Ensure all string values are properly escaped for JSON
</rules>

<context>
  <productDescription>
    {{productDescription}}
  </productDescription>
  <targetAudience>
    {{targetAudience}}
  </targetAudience>
  <campaignGoals>
    {{campaignGoals}}
  </campaignGoals>
  <budget>
    {{budget}}
  </budget>
  <platforms>
    {{platforms}}
  </platforms>
  <timeframe>
    {{timeframe}}
  </timeframe>
</context>
`;

export interface CreatorBriefInput {
  productDescription: string;
  targetAudience: string;
  campaignGoals?: string;
  budget?: string;
  platforms?: string[];
  timeframe?: string;
  userId?: string; // For rate limiting
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

export async function generateCreatorBrief({
  productDescription,
  targetAudience,
  campaignGoals = "Increase brand awareness and drive conversions",
  budget = "Not specified",
  platforms = ["Instagram", "TikTok"],
  timeframe = "30 days",
  userId
}: CreatorBriefInput): Promise<CreatorBriefOutput> {
  try {
    // Input validation
    validateInputs({ productDescription, targetAudience });

    // Create cache key based on inputs
    const cacheKey = createCacheKey({
      productDescription,
      targetAudience,
      campaignGoals,
      budget,
      platforms,
      timeframe
    });

    // Generate prompt
    const prompt = buildPrompt({
      productDescription,
      targetAudience,
      campaignGoals,
      budget,
      platforms,
      timeframe
    });

    console.log('Generating creator brief...');
    
    // Call AI service with caching and rate limiting
    const response = await aiService.generateCompletionWithCache(
      prompt,
      cacheKey,
      userId
    );

    console.log('Raw AI Response:', response);

    // Parse and validate JSON response
    const brief = parseAndValidateResponse(response);
    
    console.log('Successfully generated creator brief');
    
    return brief;
  } catch (error) {
    console.error('Error generating creator brief:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    if (errorMessage.includes('Rate limit exceeded')) {
      throw new Error('Too many requests. Please try again in an hour.');
    }
    
    if (errorMessage.includes('JSON')) {
      throw new Error('Failed to process AI response. Please try again.');
    }
    
    throw new Error(`Failed to generate creator brief: ${errorMessage}`);
  }
}

// Helper functions
function validateInputs({ productDescription, targetAudience }: Pick<CreatorBriefInput, 'productDescription' | 'targetAudience'>): void {
  if (!productDescription?.trim()) {
    throw new Error("Product description is required and cannot be empty");
  }
  
  if (!targetAudience?.trim()) {
    throw new Error("Target audience is required and cannot be empty");
  }
  
  if (productDescription.length > 1000) {
    throw new Error("Product description must be less than 1000 characters");
  }
  
  if (targetAudience.length > 500) {
    throw new Error("Target audience must be less than 500 characters");
  }
}

function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML/XML tags
    .replace(/\n+/g, ' ') // Replace multiple newlines with space
    .replace(/"/g, '\\"') // Escape quotes for JSON safety
    .replace(/\\/g, '\\\\'); // Escape backslashes
}

function createCacheKey(inputs: Omit<CreatorBriefInput, 'userId'>): string {
  const keyData = JSON.stringify(inputs);
  // Simple hash function for cache key
  let hash = 0;
  for (let i = 0; i < keyData.length; i++) {
    const char = keyData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `brief_${Math.abs(hash)}`;
}

function buildPrompt(inputs: Omit<CreatorBriefInput, 'userId'>): string {
  const {
    productDescription,
    targetAudience,
    campaignGoals,
    budget,
    platforms,
    timeframe
  } = inputs;

  return BRIEF_GENERATION_PROMPT_TEMPLATE
    .replace('{{productDescription}}', sanitizeInput(productDescription))
    .replace('{{targetAudience}}', sanitizeInput(targetAudience))
    .replace('{{campaignGoals}}', sanitizeInput(campaignGoals!))
    .replace('{{budget}}', sanitizeInput(budget!))
    .replace('{{platforms}}', platforms!.join(', '))
    .replace('{{timeframe}}', sanitizeInput(timeframe!));
}

function parseAndValidateResponse(response: string): CreatorBriefOutput {
  let cleanResponse = response.trim();
  
  // Remove any markdown formatting that might be present
  cleanResponse = cleanResponse
    .replace(/^```json\s*/i, '')
    .replace(/\s*```$/, '')
    .replace(/^```\s*/, '')
    .trim();

  let brief: unknown;
  try {
    brief = JSON.parse(cleanResponse);
  } catch (parseError) {
    console.error('JSON Parse Error:', parseError);
    console.error('Response to parse:', cleanResponse);
    throw new Error('Invalid JSON response from AI service');
  }

  // Type guard to ensure brief is an object
  if (!brief || typeof brief !== 'object') {
    throw new Error('AI response must be a valid object');
  }

  const briefObj = brief as Record<string, unknown>;

  // Validate required fields
  const requiredFields = [
    'campaignTitle',
    'objective', 
    'platforms',
    'contentFormats',
    'messagingPillars'
  ];
  
  for (const field of requiredFields) {
    if (!briefObj[field]) {
      throw new Error(`Missing required field in AI response: ${field}`);
    }
  }
  
  // Validate array fields
  const arrayFields = ['platforms', 'contentFormats', 'messagingPillars'];
  for (const field of arrayFields) {
    if (!Array.isArray(briefObj[field]) || (briefObj[field] as unknown[]).length === 0) {
      throw new Error(`${field} must be a non-empty array`);
    }
  }

  // Validate nested objects
  if (!briefObj.creativeDirection || typeof briefObj.creativeDirection !== 'object') {
    throw new Error('creativeDirection must be an object');
  }

  if (!briefObj.deliverables || typeof briefObj.deliverables !== 'object') {
    throw new Error('deliverables must be an object');
  }

  if (!briefObj.kpis || typeof briefObj.kpis !== 'object') {
    throw new Error('kpis must be an object');
  }

  return briefObj as unknown as CreatorBriefOutput;
}

// Export for use in API routes and components
export { BRIEF_GENERATION_PROMPT_TEMPLATE };