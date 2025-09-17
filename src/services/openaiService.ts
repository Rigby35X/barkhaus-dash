// OpenAI Service for generating social media content
import { z } from 'zod';

// Types for social media content generation
export interface SocialMediaPost {
  id: string;
  title: string;
  content: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'all';
  hashtags: string[];
  imagePrompt?: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledDate?: string;
  createdDate: string;
  animalId?: string;
  postType: 'adoption_success' | 'new_arrival' | 'fundraiser' | 'volunteer_need' | 'event' | 'general';
}

export interface ContentGenerationRequest {
  postType: SocialMediaPost['postType'];
  platform: SocialMediaPost['platform'];
  animalData?: {
    name: string;
    species: string;
    breed: string;
    age: string;
    description: string;
    personality: string[];
    specialNeeds?: string;
  };
  eventData?: {
    name: string;
    date: string;
    location: string;
    description: string;
  };
  organizationInfo: {
    name: string;
    mission: string;
    tone: 'professional' | 'friendly' | 'playful' | 'urgent';
  };
  customPrompt?: string;
}

// Zod schemas for OpenAI responses
const SocialPostSchema = z.object({
  content: z.string().describe('The main social media post content'),
  hashtags: z.array(z.string()).describe('Relevant hashtags without # symbol'),
  imagePrompt: z.string().optional().describe('Description for AI image generation'),
  title: z.string().describe('Short title for the post'),
  callToAction: z.string().optional().describe('Specific call to action'),
});

const MultiPlatformPostSchema = z.object({
  facebook: SocialPostSchema,
  instagram: SocialPostSchema,
  twitter: SocialPostSchema,
  linkedin: SocialPostSchema,
});

type SocialPostResponse = z.infer<typeof SocialPostSchema>;
type MultiPlatformResponse = z.infer<typeof MultiPlatformPostSchema>;

class OpenAIService {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1';

  constructor() {
    // Try environment variable first, then localStorage
    const envKey = import.meta.env.VITE_OPENAI_API_KEY;
    const localKey = localStorage.getItem('openai_api_key');

    this.apiKey = envKey || localKey || '';

    console.log('🔍 OpenAI Service Debug:');
    console.log('  Environment key:', envKey ? `${envKey.substring(0, 7)}...` : 'NOT FOUND');
    console.log('  LocalStorage key:', localKey ? `${localKey.substring(0, 7)}...` : 'NOT FOUND');
    console.log('  Final key:', this.apiKey ? `${this.apiKey.substring(0, 7)}...` : 'NOT FOUND');

    if (!this.apiKey) {
      console.warn('⚠️ OpenAI API key not found. Set VITE_OPENAI_API_KEY environment variable or configure in dashboard settings.');
    } else {
      console.log('✅ OpenAI API key loaded successfully');
    }
  }

  private async makeOpenAIRequest(messages: any[], schema: z.ZodSchema, maxRetries = 2): Promise<any> {
    // Refresh API key from localStorage in case it was updated
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || localStorage.getItem('openai_api_key') || '';

    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured. Please set your API key in the dashboard settings.');
    }

    console.log('🔑 Using API key:', this.apiKey.substring(0, 7) + '...');

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🤖 OpenAI Request (attempt ${attempt + 1}/${maxRetries + 1})`);
        console.log('📝 Messages:', JSON.stringify(messages, null, 2));

        const requestBody = {
          model: 'gpt-4o-mini',
          messages,
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 1500,
        };

        console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        console.log('📥 Response status:', response.status, response.statusText);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ OpenAI API Error Response:', errorText);

          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { message: errorText };
          }

          throw new Error(`OpenAI API error (${response.status}): ${errorData.error?.message || errorData.message || response.statusText}`);
        }

        const data = await response.json();
        console.log('📥 OpenAI Response:', JSON.stringify(data, null, 2));

        const content = data.choices[0]?.message?.content;

        if (!content) {
          throw new Error('No content returned from OpenAI');
        }

        console.log('📝 Generated content:', content);

        // Parse and validate JSON
        let parsed;
        try {
          parsed = JSON.parse(content);
        } catch (parseError) {
          console.error('❌ JSON Parse Error:', parseError);
          console.error('❌ Raw content:', content);
          throw new Error(`Failed to parse OpenAI response as JSON: ${parseError}`);
        }

        const validated = schema.parse(parsed);

        console.log('✅ OpenAI Response validated successfully');
        return validated;

      } catch (error) {
        console.error(`❌ OpenAI Request Error (attempt ${attempt + 1}):`, error);

        if (attempt === maxRetries) {
          throw error; // Throw the original error, not a wrapped one
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  async generateSocialMediaPost(request: ContentGenerationRequest): Promise<SocialPostResponse> {
    const { postType, platform, animalData, eventData, organizationInfo, customPrompt } = request;

    let contextPrompt = '';
    
    // Build context based on post type
    switch (postType) {
      case 'new_arrival':
        if (!animalData) throw new Error('Animal data required for new arrival posts');
        contextPrompt = `Create a social media post announcing a new animal arrival:
        - Animal: ${animalData.name} (${animalData.species}, ${animalData.breed})
        - Age: ${animalData.age}
        - Description: ${animalData.description}
        - Personality: ${animalData.personality.join(', ')}
        ${animalData.specialNeeds ? `- Special needs: ${animalData.specialNeeds}` : ''}`;
        break;

      case 'adoption_success':
        if (!animalData) throw new Error('Animal data required for adoption success posts');
        contextPrompt = `Create a celebratory social media post about a successful adoption:
        - Animal: ${animalData.name} (${animalData.species}, ${animalData.breed})
        - Focus on the happy ending and encourage others to adopt`;
        break;

      case 'fundraiser':
        contextPrompt = `Create a compelling fundraising social media post that:
        - Explains the urgent need for donations
        - Shows impact of donations
        - Includes clear call to action`;
        break;

      case 'volunteer_need':
        contextPrompt = `Create a social media post recruiting volunteers that:
        - Highlights the importance of volunteers
        - Mentions specific volunteer opportunities
        - Makes volunteering sound rewarding and accessible`;
        break;

      case 'event':
        if (!eventData) throw new Error('Event data required for event posts');
        contextPrompt = `Create a social media post promoting an event:
        - Event: ${eventData.name}
        - Date: ${eventData.date}
        - Location: ${eventData.location}
        - Description: ${eventData.description}`;
        break;

      case 'general':
        contextPrompt = customPrompt || 'Create a general social media post for an animal rescue organization';
        break;
    }

    const platformGuidelines = this.getPlatformGuidelines(platform);

    const messages = [
      {
        role: 'system',
        content: `You are a social media expert specializing in animal rescue organizations. Create engaging, heartwarming content that drives action while maintaining authenticity.

Organization: ${organizationInfo.name}
Mission: ${organizationInfo.mission}
Tone: ${organizationInfo.tone}

${platformGuidelines}

Return ONLY valid JSON matching this exact schema:
{
  "content": "string - the main post content",
  "hashtags": ["array", "of", "hashtag", "strings", "without", "hash", "symbols"],
  "imagePrompt": "string - optional description for AI image generation",
  "title": "string - short title for the post",
  "callToAction": "string - optional specific call to action"
}`
      },
      {
        role: 'user',
        content: contextPrompt
      }
    ];

    return await this.makeOpenAIRequest(messages, SocialPostSchema);
  }

  async generateMultiPlatformPost(request: ContentGenerationRequest): Promise<MultiPlatformResponse> {
    const baseRequest = { ...request, platform: 'all' as const };
    
    const messages = [
      {
        role: 'system',
        content: `You are a social media expert. Create platform-optimized versions of the same content for Facebook, Instagram, Twitter, and LinkedIn.

Organization: ${request.organizationInfo.name}
Mission: ${request.organizationInfo.mission}
Tone: ${request.organizationInfo.tone}

Platform Guidelines:
- Facebook: 1-2 paragraphs, conversational, community-focused
- Instagram: Visual-first, emoji-rich, story-driven, hashtag-heavy
- Twitter: Concise (under 280 chars), punchy, trending hashtags
- LinkedIn: Professional tone, impact-focused, longer form acceptable

Return ONLY valid JSON with this structure:
{
  "facebook": { "content": "...", "hashtags": [...], "imagePrompt": "...", "title": "...", "callToAction": "..." },
  "instagram": { "content": "...", "hashtags": [...], "imagePrompt": "...", "title": "...", "callToAction": "..." },
  "twitter": { "content": "...", "hashtags": [...], "imagePrompt": "...", "title": "...", "callToAction": "..." },
  "linkedin": { "content": "...", "hashtags": [...], "imagePrompt": "...", "title": "...", "callToAction": "..." }
}`
      },
      {
        role: 'user',
        content: this.buildContextPrompt(request)
      }
    ];

    return await this.makeOpenAIRequest(messages, MultiPlatformPostSchema);
  }

  private getPlatformGuidelines(platform: string): string {
    const guidelines = {
      facebook: 'Facebook: 1-2 paragraphs, conversational tone, community-focused, moderate hashtag use',
      instagram: 'Instagram: Visual-first content, emoji-rich, story-driven, hashtag-heavy (10-15 hashtags)',
      twitter: 'Twitter: Concise content under 280 characters, punchy language, 2-3 trending hashtags',
      linkedin: 'LinkedIn: Professional tone, impact and mission-focused, longer form content acceptable',
      all: 'Multi-platform: Adaptable content that works across all social media platforms'
    };

    return guidelines[platform] || guidelines.all;
  }

  private buildContextPrompt(request: ContentGenerationRequest): string {
    const { postType, animalData, eventData, customPrompt } = request;

    switch (postType) {
      case 'new_arrival':
        return `New animal arrival: ${animalData?.name} (${animalData?.species}, ${animalData?.breed}), ${animalData?.age}. ${animalData?.description}`;
      case 'adoption_success':
        return `Adoption success story for ${animalData?.name}. Create celebratory content encouraging others to adopt.`;
      case 'fundraiser':
        return 'Create compelling fundraising content with clear donation call-to-action.';
      case 'volunteer_need':
        return 'Recruit volunteers by highlighting opportunities and impact.';
      case 'event':
        return `Event promotion: ${eventData?.name} on ${eventData?.date} at ${eventData?.location}. ${eventData?.description}`;
      default:
        return customPrompt || 'Create engaging animal rescue social media content.';
    }
  }

  // Update API key dynamically
  updateApiKey(newApiKey: string): void {
    this.apiKey = newApiKey;
    if (newApiKey) {
      localStorage.setItem('openai_api_key', newApiKey);
      console.log('✅ OpenAI API key updated successfully');
    } else {
      localStorage.removeItem('openai_api_key');
      console.log('🗑️ OpenAI API key removed');
    }
  }

  // Get current API key status
  getApiKeyStatus(): { hasKey: boolean; source: string } {
    const envKey = import.meta.env.VITE_OPENAI_API_KEY;
    const localKey = localStorage.getItem('openai_api_key');

    if (envKey) {
      return { hasKey: true, source: 'environment' };
    } else if (localKey) {
      return { hasKey: true, source: 'localStorage' };
    } else {
      return { hasKey: false, source: 'none' };
    }
  }

  // Test connection to OpenAI
  async testConnection(): Promise<boolean> {
    try {
      const testRequest: ContentGenerationRequest = {
        postType: 'general',
        platform: 'facebook',
        organizationInfo: {
          name: 'Test Rescue',
          mission: 'Saving animals',
          tone: 'friendly'
        },
        customPrompt: 'Create a simple test post about animal rescue work.'
      };

      await this.generateSocialMediaPost(testRequest);
      return true;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      return false;
    }
  }
}

export const openaiService = new OpenAIService();
export default openaiService;
