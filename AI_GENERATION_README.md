# CurioTales AI Story Generation

## Overview
CurioTales now features live AI-powered story generation using free Large Language Models (LLMs). Stories are generated dynamically based on user-selected topics, categories, and age ranges.

## Features

### 🤖 Live AI Generation
- Stories are generated in real-time using free LLM APIs
- No static content - every story is unique and fresh
- Multiple API fallbacks ensure reliability
- **NEW**: Content is 20% longer for all age ranges
- **NEW**: Flexible selection - choose age or topic first

### 🎯 Age-Appropriate Content
- Content automatically adjusts based on selected age range (1-14 years)
- Language complexity and concepts tailored to reading level
- Educational and engaging for each age group
- **NEW**: Enhanced word counts with 20% increase:
  - 1-3 years: 120 words (was 100)
  - 3-5 years: 180 words (was 150)
  - 5-7 years: 300 words (was 250)
  - 7-9 years: 480 words (was 400)
  - 9-12 years: 720 words (was 600)
  - 12-14 years: 960 words (was 800)

### 🔄 Multiple API Support
- **Primary**: Free LLM API (no authentication required)
- **Secondary**: Groq API (free tier with high performance)
- **Fallback**: Hugging Face Inference API (free tier)
- **Backup**: Curated fallback stories if APIs are unavailable

## Technical Implementation

### Files Added/Modified
- `services/storyGenerator.ts` - Main story generation service
- `services/apiConfig.ts` - API configuration and fallback setup
- `app/(tabs)/index.tsx` - Updated to use live generation
- `app/(tabs)/explore.tsx` - Updated documentation

### API Configuration
The system uses multiple free APIs with automatic fallback:

1. **Hugging Face Inference API**
   - Models: microsoft/DialoGPT-medium, gpt2, distilgpt2
   - Free tier: 1000 requests/month
   - No authentication required for basic usage

2. **Alternative APIs**
   - FreeAI API
   - MLVoca API
   - Other free LLM services

### Story Generation Process
1. User selects age range and topic/category
2. System creates age-appropriate prompt
3. API call made to primary service
4. If primary fails, tries fallback APIs
5. Content cleaned and formatted
6. If all APIs fail, returns curated fallback story

## Usage

### For Users
1. **NEW**: Select either an age range OR a topic first (flexible order!)
2. Choose the remaining option (topic if you selected age, or age if you selected topic)
3. Story generates automatically when both are selected
4. Use "🤖 Generate New AI Story" to create different versions

### For Developers
```typescript
import { StoryGenerator } from '@/services/storyGenerator';

const story = await StoryGenerator.generateStory({
  topic: 'dinosaurs',
  category: 'Science',
  ageRange: '5-7 years'
});
```

## Benefits

### For Parents/Educators
- **Free**: No subscription or API costs
- **Educational**: Age-appropriate content that teaches
- **Engaging**: Interactive and personalized stories
- **Safe**: Content filtered for appropriate age levels

### For Children
- **Personalized**: Stories about topics they're interested in
- **Appropriate**: Content matches their reading level
- **Surprising**: Each story is unique and unexpected
- **Fun**: Engaging and entertaining learning experience

## Future Enhancements
- Save favorite generated stories
- Share stories with friends
- Audio narration of stories
- More detailed topic customization
- Story illustrations and visuals
- Progress tracking and learning analytics

## Technical Notes
- All API calls include timeout handling (10 seconds)
- Error handling with user-friendly messages
- Fallback content ensures app always works
- No user data is stored or transmitted
- Respects API rate limits and terms of service

## Troubleshooting
If story generation fails:
1. Check internet connection
2. Try generating a different topic
3. The app will automatically use fallback content
4. Restart the app if issues persist

The system is designed to be robust and always provide content, even when external APIs are unavailable.
