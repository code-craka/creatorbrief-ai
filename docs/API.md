# API Documentation

## Overview

CreatorBrief AI provides a RESTful API for generating AI-powered creator campaign briefs. The API supports multiple AI providers and returns comprehensive campaign strategies.

## Base URL

```
https://your-domain.com/api
```

## Authentication

Currently, the API uses rate limiting based on IP address and user identification headers. No API key is required for basic usage.

## Endpoints

### Generate Creator Brief

Generate a comprehensive creator campaign brief using AI.

**Endpoint:** `POST /api/generate-brief`

**Headers:**
```http
Content-Type: application/json
X-User-ID: optional-user-identifier
```

**Request Body:**
```json
{
  "productDescription": "string (required, max 1000 chars)",
  "targetAudience": "string (required, max 500 chars)",
  "campaignGoals": "string (optional, default: 'Increase brand awareness and drive conversions')",
  "budget": "string (optional, default: 'Not specified')",
  "platforms": ["string"] (optional, default: ["Instagram", "TikTok"]),
  "timeframe": "string (optional, default: '30 days')"
}
```

**Example Request:**
```json
{
  "productDescription": "Eco-friendly water bottles made from recycled materials. Features include leak-proof design, 24-hour temperature retention, and stylish minimalist aesthetics.",
  "targetAudience": "Environmentally conscious millennials and Gen Z, aged 18-35, interested in sustainability, fitness, and outdoor activities.",
  "campaignGoals": "Increase brand awareness and drive online sales",
  "budget": "$5,000 - $10,000",
  "platforms": ["Instagram", "TikTok", "YouTube"],
  "timeframe": "60 days"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
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
      "primaryContent": "number",
      "stories": "number",
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
  },
  "message": "Creator brief generated successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "error_type",
  "message": "Human readable error message",
  "code": "ERROR_CODE"
}
```

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests (10/hour limit) |
| `AI_SERVICE_ERROR` | 503 | AI provider service unavailable |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

## Rate Limiting

- **Limit:** 10 requests per hour per IP/user
- **Headers:** Rate limit information is included in response headers
- **Reset:** Rate limits reset every hour

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1642694400
```

## Caching

- **Duration:** AI responses are cached for 1 hour
- **Key:** Based on request parameters hash
- **Behavior:** Identical requests return cached responses

## AI Providers

The API supports multiple AI providers:

| Provider | Models | Configuration |
|----------|--------|---------------|
| **OpenAI** | GPT-4o, GPT-4o-mini | `AI_PROVIDER=openai` |
| **Anthropic** | Claude 3.5 Sonnet | `AI_PROVIDER=anthropic` |
| **Google** | Gemini 2.0 Flash | `AI_PROVIDER=gemini` |

## Request Validation

### Product Description
- **Required:** Yes
- **Type:** String
- **Max Length:** 1000 characters
- **Validation:** Non-empty, trimmed

### Target Audience
- **Required:** Yes
- **Type:** String
- **Max Length:** 500 characters
- **Validation:** Non-empty, trimmed

### Campaign Goals
- **Required:** No
- **Type:** String
- **Default:** "Increase brand awareness and drive conversions"

### Budget
- **Required:** No
- **Type:** String
- **Options:** "Under $1,000", "$1,000 - $5,000", "$5,000 - $10,000", "$10,000 - $25,000", "$25,000 - $50,000", "Over $50,000"
- **Default:** "Not specified"

### Platforms
- **Required:** No
- **Type:** Array of strings
- **Options:** "Instagram", "TikTok", "YouTube", "Twitter/X", "LinkedIn", "Snapchat", "Pinterest"
- **Default:** ["Instagram", "TikTok"]

### Timeframe
- **Required:** No
- **Type:** String
- **Options:** "7 days", "14 days", "30 days", "60 days", "90 days"
- **Default:** "30 days"

## Response Schema

### CreatorBriefOutput

```typescript
interface CreatorBriefOutput {
  campaignTitle: string;           // Generated campaign name
  objective: string;               // Campaign objective statement
  platforms: string[];             // Recommended platforms
  contentFormats: string[];        // Content format recommendations
  messagingPillars: string[];      // Key messaging themes
  creativeDirection: {
    visualStyle: string;           // Visual style guidelines
    toneOfVoice: string;          // Brand voice description
    mustHaveElements: string[];    // Required creative elements
  };
  deliverables: {
    primaryContent: number;        // Number of main posts
    stories: number;              // Number of story posts
    timeline: string;             // Delivery timeline
  };
  kpis: {
    primaryMetric: string;        // Main success metric
    targetEngagementRate: string; // Expected engagement
    expectedReach: string;        // Projected reach
  };
  callToAction: string;           // Recommended CTA
  complianceNotes: string[];      // Legal/compliance requirements
  hashtags: string[];             // Recommended hashtags
  budgetRecommendations: {
    creatorFee: string;           // Suggested creator payment
    adSpend: string;              // Recommended ad budget
  };
}
```

## SDK Examples

### JavaScript/TypeScript

```typescript
interface GenerateBriefRequest {
  productDescription: string;
  targetAudience: string;
  campaignGoals?: string;
  budget?: string;
  platforms?: string[];
  timeframe?: string;
}

async function generateBrief(data: GenerateBriefRequest) {
  const response = await fetch('/api/generate-brief', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
```

### Python

```python
import requests
import json

def generate_brief(data):
    url = "https://your-domain.com/api/generate-brief"
    headers = {"Content-Type": "application/json"}
    
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    
    return response.json()

# Example usage
brief_data = {
    "productDescription": "Eco-friendly water bottles...",
    "targetAudience": "Environmentally conscious millennials...",
    "platforms": ["Instagram", "TikTok"]
}

result = generate_brief(brief_data)
```

### cURL

```bash
curl -X POST https://your-domain.com/api/generate-brief \
  -H "Content-Type: application/json" \
  -d '{
    "productDescription": "Eco-friendly water bottles made from recycled materials",
    "targetAudience": "Environmentally conscious millennials and Gen Z",
    "platforms": ["Instagram", "TikTok"],
    "budget": "$5,000 - $10,000"
  }'
```

## Webhooks

Currently, webhooks are not supported. All operations are synchronous.

## Versioning

The API follows semantic versioning. Current version: `v1`

Future versions will be available at:
- `/api/v2/generate-brief`
- `/api/v3/generate-brief`

## Support

For API support:
- 📧 **Email:** api-support@creatorbrief-ai.com
- 📖 **Documentation:** [docs.creatorbrief-ai.com](https://docs.creatorbrief-ai.com)
- 🐛 **Issues:** [GitHub Issues](https://github.com/yourusername/creatorbrief-ai/issues)