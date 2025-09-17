# 🚀 AI-Powered Social Media Manager Setup Guide

## Overview

Your Barkhaus dashboard now includes a comprehensive AI-powered social media management system that can:

- ✨ **Generate content with OpenAI** - Create platform-optimized posts using AI
- 📅 **Schedule posts** - Automatically publish at optimal times
- 🎯 **Multi-platform support** - Facebook, Instagram, Twitter, LinkedIn
- 🐾 **Animal-focused content** - Specialized templates for rescue organizations
- 📊 **Analytics tracking** - Monitor engagement and performance

## 🔧 Setup Instructions

### 1. Get Your OpenAI API Key

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-`)

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```bash
# Required for AI content generation
VITE_OPENAI_API_KEY=sk-your-actual-openai-key-here

# Optional: Production URL for embed widgets
VITE_PRODUCTION_URL=https://your-domain.com

# Optional: Social media API keys for direct publishing
VITE_FACEBOOK_API_KEY=your-facebook-key
VITE_INSTAGRAM_API_KEY=your-instagram-key
VITE_TWITTER_API_KEY=your-twitter-key
VITE_LINKEDIN_API_KEY=your-linkedin-key
```

### 3. Access the Social Media Manager

1. Start your development server: `npm run dev`
2. Navigate to **Communications** in your dashboard
3. Click the **Social Media** tab
4. You'll see the AI-powered social media manager

## 🎯 How to Use

### Creating AI-Generated Posts

1. **Click "Create Post"** in the Social Media Manager
2. **Choose post type:**
   - New Animal Arrival
   - Adoption Success Story
   - Fundraising Campaign
   - Volunteer Recruitment
   - Event Promotion
   - General Post

3. **Select platform(s):**
   - Individual platforms (Facebook, Instagram, Twitter, LinkedIn)
   - All platforms (generates optimized content for each)

4. **Configure settings:**
   - Select an animal (for animal-related posts)
   - Choose tone (Friendly, Professional, Playful, Urgent)
   - Add custom prompts for general posts

5. **Generate with AI** - Click the magic wand button
6. **Review and edit** the generated content
7. **Schedule or publish** immediately

### Managing Posts

- **Draft posts** - Save for later editing
- **Schedule posts** - Set specific publish times
- **Edit posts** - Modify content, regenerate with AI
- **Duplicate posts** - Create variations quickly
- **Track performance** - View engagement metrics

### Connecting Social Accounts

1. Click **Accounts** in the Social Media Manager
2. Connect your social media accounts
3. Configure API keys for direct publishing
4. Test connections and sync data

## 🤖 AI Features

### Content Generation

The AI system creates platform-optimized content:

- **Facebook**: Community-focused, conversational tone
- **Instagram**: Visual-first, emoji-rich, hashtag-heavy
- **Twitter**: Concise, punchy, trending hashtags
- **LinkedIn**: Professional, impact-focused

### Smart Templates

Pre-built templates for common rescue scenarios:

- **New Arrivals**: "Meet [Pet Name]! This [age] [breed] just arrived..."
- **Success Stories**: "🎉 ADOPTED! [Pet Name] found their forever home..."
- **Fundraising**: "🙏 Help us reach our goal to save more animals..."
- **Volunteer Needs**: "Join our amazing volunteer team..."

### Image Suggestions

AI generates image prompts for each post to help you create compelling visuals.

## 📊 Analytics & Tracking

Monitor your social media performance:

- **Total Posts**: Track content creation
- **Published Posts**: See successful publications
- **Scheduled Posts**: Manage upcoming content
- **Engagement Rate**: Monitor audience interaction
- **Reach Metrics**: Track content visibility

## 🔒 Security & Privacy

- **API keys stored locally** in browser storage
- **No data sent to third parties** except OpenAI for content generation
- **Secure token-based authentication** for embed widgets
- **CORS-protected** API endpoints

## 🚀 Production Deployment

### Environment Variables for Production

Set these in your hosting platform (Vercel, Netlify, etc.):

```bash
VITE_OPENAI_API_KEY=your-production-openai-key
VITE_PRODUCTION_URL=https://your-actual-domain.com
VITE_DEV_MODE=false
```

### Social Media API Setup (Optional)

For direct publishing, you'll need to set up:

1. **Facebook**: Facebook App + Page Access Token
2. **Instagram**: Instagram Basic Display API
3. **Twitter**: Twitter API v2 Bearer Token
4. **LinkedIn**: LinkedIn API Access Token

## 🆘 Troubleshooting

### Common Issues

**"OpenAI API key not configured"**
- Check your `.env` file has `VITE_OPENAI_API_KEY`
- Restart your development server after adding the key

**"Failed to generate content"**
- Verify your OpenAI API key is valid
- Check you have sufficient OpenAI credits
- Try a simpler prompt

**Posts not publishing**
- This is expected in demo mode
- Connect real social media accounts for actual publishing
- Check API keys and permissions

### Getting Help

1. Check browser console for error messages
2. Verify all environment variables are set
3. Test OpenAI connection in the API Keys modal
4. Review the setup guide above

## 🎉 You're Ready!

Your AI-powered social media manager is now ready to help you:

- Create engaging content for your animal rescue
- Schedule posts for optimal engagement
- Maintain consistent social media presence
- Drive more adoptions and donations
- Build stronger community connections

Start by creating your first AI-generated post and watch your social media engagement grow! 🐾✨
