import { API_CONFIG, STORY_CONFIG } from './apiConfig';

interface StoryRequest {
  topic: string;
  category?: string;
  ageRange: string;
}

interface StoryResponse {
  id: string;
  title: string;
  content: string;
  category: string;
  ageRange: string;
  icon?: string;
}

export class StoryGenerator {
  private static async makeAPICall(url: string, options: RequestInit, timeout: number = STORY_CONFIG.timeout): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private static getPromptForAge(topic: string, category: string, ageRange: string): string {
    const basePrompt = `Write a fascinating, educational story about ${topic} that is appropriate for ${ageRange} children. `;
    
    const ageSpecificGuidance = {
      '1-3 years': 'Use very simple words, short sentences (3-5 words), and lots of repetition. Include sounds like "whoosh" and "pop". Focus on colors, shapes, and simple actions. Make it very engaging with onomatopoeia.',
      '3-5 years': 'Use simple sentences and familiar words. Include some fun facts explained in simple terms. Make it interactive with questions like "Can you imagine that?" Use descriptive language that helps children visualize.',
      '5-7 years': 'Use clear language with some challenging words that are explained in context. Include interesting details and encourage curiosity. Make it educational but fun with relatable examples.',
      '7-9 years': 'Use more complex vocabulary and detailed explanations. Include scientific concepts explained clearly. Encourage critical thinking with "why" and "how" questions.',
      '9-12 years': 'Use advanced vocabulary and detailed explanations. Include scientific principles and encourage deeper thinking about the topic. Connect concepts to real-world applications.',
      '12-14 years': 'Use sophisticated language and complex concepts. Include detailed scientific explanations and encourage analytical thinking. Discuss implications and connections to other fields.'
    };

    const guidance = ageSpecificGuidance[ageRange] || ageSpecificGuidance['9-12 years'];
    
    // Calculate word count based on age
    const baseWordCounts = {
      '1-3 years': 100,
      '3-5 years': 150,
      '5-7 years': 250,
      '7-9 years': 400,
      '9-12 years': 600,
      '12-14 years': 800
    };
    
    const baseWords = baseWordCounts[ageRange] || 400;
    const targetWords = Math.round(baseWords * (STORY_CONFIG.contentLengthMultiplier || 1.2));
    
    return `${basePrompt}${guidance} 

Make the story approximately ${targetWords} words long. Include specific, fascinating facts about ${topic}. Make it engaging, surprising, and memorable. Structure it as a proper story with a beginning, middle, and end. Avoid generic statements and include unique, interesting details that children would want to share with friends.

Important: Write ONLY the story content, no introduction, no "Here's a story" prefix, just start directly with the story.`;
  }

  private static async tryOpenRouterAPI(prompt: string): Promise<string> {
    const url = 'https://openrouter.ai/api/v1/chat/completions';
    
    // Check if API key is configured
    if (!API_CONFIG.OPENROUTER?.apiKey || API_CONFIG.OPENROUTER.apiKey === 'YOUR_OPENROUTER_API_KEY_HERE') {
      throw new Error('OpenRouter API key not configured');
    }
    
    const response = await this.makeAPICall(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.OPENROUTER.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Story Generator App'
      },
      body: JSON.stringify({
        model: API_CONFIG.OPENROUTER.model || 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.8,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  private static async tryGroqAPI(prompt: string): Promise<string> {
    const model = API_CONFIG.GROQ.models[0];
    const url = API_CONFIG.GROQ.baseUrl;
    
    // Skip if no API key is set
    if (!API_CONFIG.GROQ.apiKey || API_CONFIG.GROQ.apiKey === 'gsk_YOUR_API_KEY_HERE') {
      throw new Error('Groq API key not configured');
    }
    
    const response = await this.makeAPICall(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.GROQ.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.8,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  private static async tryHuggingFaceAPI(prompt: string): Promise<string> {
    // Using Hugging Face Inference API with a better model
    const url = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large';
    
    const response = await this.makeAPICall(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.HUGGINGFACE?.apiKey || 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}`
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 800,
          temperature: 0.8,
          do_sample: true,
          top_p: 0.9,
          repetition_penalty: 1.2,
          return_full_text: false
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    return data[0]?.generated_text || '';
  }

  static async generateStory(request: StoryRequest): Promise<StoryResponse> {
    const { topic, category = 'General', ageRange } = request;
    
    try {
      const prompt = this.getPromptForAge(topic, category, ageRange);
      console.log('🚀 Generating story for:', topic, 'Age:', ageRange);
      
      let content = '';
      let lastError: Error | null = null;
      
      // Try OpenRouter first (recommended)
      try {
        content = await this.tryOpenRouterAPI(prompt);
        console.log('✅ Successfully generated with OpenRouter API');
      } catch (error) {
        console.log('❌ OpenRouter API failed:', error);
        lastError = error as Error;
        
        // Try Groq as fallback
        try {
          content = await this.tryGroqAPI(prompt);
          console.log('✅ Successfully generated with Groq API');
        } catch (groqError) {
          console.log('❌ Groq API failed:', groqError);
          lastError = groqError as Error;
          
          // Try Hugging Face as last resort
          try {
            content = await this.tryHuggingFaceAPI(prompt);
            console.log('✅ Successfully generated with Hugging Face API');
          } catch (hfError) {
            console.log('❌ Hugging Face API failed:', hfError);
            lastError = hfError as Error;
          }
        }
      }
      
      // Clean up the response
      if (content) {
        // Remove any prompt repetition or unwanted prefixes
        content = content.replace(/^(Here's a story|Once upon a time, let me tell you|I'll write a story)/i, '').trim();
        
        // Ensure minimum content length
        if (content.length < 100) {
          throw new Error('Generated content too short');
        }
        
        // Clean up any formatting issues
        content = content.replace(/\n\n+/g, '\n\n').trim();
      }
      
      if (!content) {
        throw new Error('No content generated from any API');
      }
      
      const title = this.generateTitle(topic, category, ageRange);
      const icon = this.getIconForCategory(category);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        title,
        content,
        category,
        ageRange,
        icon,
      };
    } catch (error) {
      console.error('❌ Error generating story:', error);
      // Return a better fallback story
      return this.getEnhancedFallbackStory(topic, category, ageRange);
    }
  }

  private static generateTitle(topic: string, category: string, ageRange: string): string {
    const ageBasedTitles = {
      '1-3 years': [
        `My First ${topic} Story`,
        `${topic} Fun!`,
        `Little ${topic} Adventure`,
        `${topic} and Me`
      ],
      '3-5 years': [
        `The Amazing ${topic}`,
        `${topic} Discovery`,
        `My ${topic} Adventure`,
        `${topic} Surprise`
      ],
      '5-7 years': [
        `Discovering ${topic}`,
        `The Secret of ${topic}`,
        `${topic} Mysteries`,
        `Journey into ${topic}`
      ],
      '7-9 years': [
        `The Science of ${topic}`,
        `${topic} Explained`,
        `Exploring ${topic}`,
        `${topic}: The Inside Story`
      ],
      '9-12 years': [
        `The Fascinating World of ${topic}`,
        `${topic}: Uncovered`,
        `Advanced ${topic}`,
        `${topic}: Beyond the Basics`
      ],
      '12-14 years': [
        `The Complete Guide to ${topic}`,
        `${topic}: Deep Dive`,
        `Understanding ${topic}`,
        `${topic}: Scientific Perspectives`
      ]
    };
    
    const titles = ageBasedTitles[ageRange] || ageBasedTitles['9-12 years'];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  private static getIconForCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'Science': '🧪',
      'History': '🏺',
      'Technology': '💻',
      'Nature': '🌿',
      'Space': '🚀',
      'Arts': '🎨',
      'Culture': '🌍',
      'Animals': '🐾',
      'Ocean': '🌊',
      'Weather': '⛈️',
      'Food': '🍎',
      'Sports': '⚽',
      'Music': '🎵',
      'Random': '🎲',
      'General': '📖'
    };
    return categoryMap[category] || '📖';
  }

  private static getEnhancedFallbackStory(topic: string, category: string, ageRange: string): StoryResponse {
    // Much better fallback stories with actual narrative structure
    const fallbackStories = {
      '1-3 years': `Big ${topic}! Wow! Look at the pretty ${topic}. It goes "whoosh" and "zoom"! The ${topic} is red and blue and yellow. So pretty! Touch the ${topic}. Feel how smooth it is. The ${topic} likes to play. It jumps up high! "Boing, boing!" says the ${topic}. You can play with ${topic} too. It's your friend! The ${topic} makes you smile. Happy, happy ${topic}! Time to say bye-bye to ${topic}. Wave goodbye! "Bye-bye ${topic}!"`,
      
      '3-5 years': `Once there was a special ${topic} who lived in a magical place. This ${topic} had an amazing secret - it could do things that would surprise you! Every morning, the ${topic} would wake up and stretch. "Good morning, world!" it would say. The ${topic} loved to explore and learn new things. One day, it discovered something incredible that changed everything. Can you guess what it was? The ${topic} found out it had a superpower! It could help other creatures and make them happy. From that day on, the ${topic} became the hero of its home, spreading joy wherever it went.`,
      
      '5-7 years': `Sarah was walking through the park when she noticed something unusual about ${topic}. Unlike other children who just walked past, Sarah stopped to look closer. What she discovered amazed her! The ${topic} had special features that scientists had recently learned about. It could adapt to different situations in remarkable ways. Sarah decided to observe the ${topic} for a whole week. Each day, she wrote down what she saw in her nature journal. By the end of the week, Sarah had learned so much about ${topic} that she decided to become a scientist when she grew up. Her discovery taught her that amazing things are all around us - we just need to look carefully!`,
      
      '7-9 years': `Dr. Martinez had been studying ${topic} for five years when she made a breakthrough discovery. Her research team had been puzzled by unusual behavior they observed in ${topic}. Using special equipment, they discovered that ${topic} communicates in ways humans had never understood before. The team realized that ${topic} has complex social structures and problem-solving abilities. This discovery changed how scientists think about ${topic} and led to new conservation efforts. Dr. Martinez's work showed that ${topic} is much more intelligent and important to our ecosystem than anyone had previously imagined. Her research continues to reveal new secrets about these remarkable subjects.`,
      
      '9-12 years': `The research station in Antarctica buzzed with excitement as Dr. Chen analyzed the latest data about ${topic}. Her team had been using cutting-edge technology to study how ${topic} adapts to extreme environmental conditions. Their findings revealed sophisticated biological mechanisms that could revolutionize our understanding of survival strategies. The ${topic} demonstrated remarkable abilities to modify its behavior based on environmental pressures, showing a level of adaptability that surprised even veteran researchers. These discoveries have implications for climate change research and could help scientists develop new technologies inspired by nature's solutions. Dr. Chen's work represents a major breakthrough in our understanding of ${topic}.`,
      
      '12-14 years': `The interdisciplinary research team led by Professor Williams utilized advanced spectroscopic analysis and computational modeling to investigate the fundamental properties of ${topic}. Their comprehensive study integrated findings from molecular biology, physics, and environmental science to develop a new theoretical framework. The research revealed previously unknown mechanisms governing ${topic}'s behavior at both microscopic and macroscopic scales. Through sophisticated experimental design and statistical analysis, the team identified key variables that influence ${topic}'s response to environmental stimuli. These findings have been published in leading scientific journals and are expected to influence future research directions in multiple fields. The work demonstrates the importance of interdisciplinary approaches in advancing scientific knowledge about complex systems like ${topic}.`
    };

    const content = fallbackStories[ageRange] || fallbackStories['9-12 years'];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: this.generateTitle(topic, category, ageRange),
      content,
      category,
      ageRange,
      icon: this.getIconForCategory(category),
    };
  }
}