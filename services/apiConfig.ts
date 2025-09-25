// For Create React App - apiConfig.ts
export const API_CONFIG = {
  OPENROUTER: {
    apiKey: process.env.REACT_APP_OPENROUTER_API_KEY || 'YOUR_OPENROUTER_API_KEY_HERE',
    model: 'anthropic/claude-3-haiku',
  },
  
  GROQ: {
    baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
    apiKey: process.env.REACT_APP_GROQ_API_KEY || 'YOUR_GROQ_API_KEY_HERE',
    models: ['llama3-8b-8192', 'mixtral-8x7b-32768']
  },
  
  HUGGINGFACE: {
    baseUrl: 'https://api-inference.huggingface.co/models',
    apiKey: process.env.REACT_APP_HUGGINGFACE_API_KEY || 'YOUR_HUGGINGFACE_API_KEY_HERE',
    models: ['microsoft/DialoGPT-large']
  }
};

// And your .env file should use REACT_APP_ prefix:
// REACT_APP_OPENROUTER_API_KEY=your_key_here