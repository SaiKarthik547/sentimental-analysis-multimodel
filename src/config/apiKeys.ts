// API Keys Configuration
// All API keys are now loaded from environment variables (.env file)

import { SECRET_KEYS } from './secretKeys';

export const API_KEYS = {
  OPENROUTER_API_KEY: SECRET_KEYS.OPENROUTER_API_KEY,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Social Media APIs
  TWITTER: import.meta.env.VITE_TWITTER_API_URL || 'https://api.twitter.com/2',
  REDDIT: import.meta.env.VITE_REDDIT_API_URL || 'https://www.reddit.com/api/v1',
  FACEBOOK: import.meta.env.VITE_FACEBOOK_API_URL || 'https://graph.facebook.com/v18.0',
  INSTAGRAM: import.meta.env.VITE_INSTAGRAM_API_URL || 'https://graph.instagram.com/v18.0',
  LINKEDIN: import.meta.env.VITE_LINKEDIN_API_URL || 'https://api.linkedin.com/v2',
  YOUTUBE: import.meta.env.VITE_YOUTUBE_API_URL || 'https://www.googleapis.com/youtube/v3',
  
  // AI/ML APIs
  OPENROUTER: 'https://openrouter.ai/api/v1',
  HUGGING_FACE: import.meta.env.VITE_HUGGING_FACE_BASE_URL || 'https://api-inference.huggingface.co',
  
  // E-commerce APIs (Fake endpoints for demo)
  AMAZON_REVIEWS: import.meta.env.VITE_AMAZON_REVIEWS_API_URL || 'https://fake-amazon-reviews-api.demo.com/v1',
  FLIPKART_REVIEWS: import.meta.env.VITE_FLIPKART_REVIEWS_API_URL || 'https://fake-flipkart-reviews-api.demo.com/v1',
  JIOMART_REVIEWS: import.meta.env.VITE_JIOMART_REVIEWS_API_URL || 'https://fake-jiomart-reviews-api.demo.com/v1',
  PRODUCT_SEARCH: import.meta.env.VITE_PRODUCT_SEARCH_API_URL || 'https://fake-product-search-api.demo.com/v1',
};

// OpenRouter Free Models (Updated with RoBERTa and other free models)
export const OPENROUTER_FREE_MODELS = [
  // RoBERTa models for sentiment analysis
  'cardiffnlp/twitter-roberta-base-sentiment-latest:free',
  'cardiffnlp/twitter-roberta-base-sentiment:free',
  'cardiffnlp/roberta-base-sentiment-latest:free',
  'cardiffnlp/roberta-base-sentiment:free',
  
  // Other free models for general analysis
  'google/gemma-2-9b-it:free',
  'microsoft/phi-3-medium-128k-instruct:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'huggingface/CodeLlama-34b-Instruct-hf:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'meta-llama/llama-3.1-70b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
  'openchat/openchat-7b:free',
  'gryphe/mythomist-7b:free',
];

// RoBERTa specific models for sentiment analysis
export const ROBERTA_SENTIMENT_MODELS = [
  'cardiffnlp/twitter-roberta-base-sentiment-latest:free',
  'cardiffnlp/twitter-roberta-base-sentiment:free',
  'cardiffnlp/roberta-base-sentiment-latest:free',
  'cardiffnlp/roberta-base-sentiment:free',
];

// E-commerce platforms
export const ECOMMERCE_PLATFORMS = [
  'amazon',
  'flipkart', 
  'jiomart'
] as const;

export type EcommercePlatform = typeof ECOMMERCE_PLATFORMS[number];

// Demo Accounts for Testing (loaded from environment variables)
export const DEMO_ACCOUNTS = {
  user1: {
    email: import.meta.env.VITE_DEMO_USER_1_EMAIL || 'demo1@example.com',
    password: import.meta.env.VITE_DEMO_USER_1_PASSWORD || 'demo123',
    fullName: import.meta.env.VITE_DEMO_USER_1_NAME || 'Demo User 1',
    id: 'demo_user_1'
  },
  user2: {
    email: import.meta.env.VITE_DEMO_USER_2_EMAIL || 'demo2@example.com', 
    password: import.meta.env.VITE_DEMO_USER_2_PASSWORD || 'demo123',
    fullName: import.meta.env.VITE_DEMO_USER_2_NAME || 'Demo User 2',
    id: 'demo_user_2'
  },
  admin: {
    email: import.meta.env.VITE_DEMO_ADMIN_EMAIL || 'admin@example.com',
    password: import.meta.env.VITE_DEMO_ADMIN_PASSWORD || 'admin123',
    fullName: import.meta.env.VITE_DEMO_ADMIN_NAME || 'Admin User',
    id: 'admin_user'
  }
};

// Supported Social Media Platforms
export const SOCIAL_PLATFORMS = [
  'twitter',
  'reddit', 
  'facebook',
  'instagram',
  'linkedin',
  'youtube'
] as const;

export type SocialPlatform = typeof SOCIAL_PLATFORMS[number];

// Environment configuration
export const ENV_CONFIG = {
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'SentiView',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  ENABLE_OPENROUTER: import.meta.env.VITE_ENABLE_OPENROUTER === 'true',
  ENABLE_SOCIAL_MEDIA_APIS: import.meta.env.VITE_ENABLE_SOCIAL_MEDIA_APIS === 'true',
  ENABLE_BATCH_ANALYSIS: import.meta.env.VITE_ENABLE_BATCH_ANALYSIS === 'true',
  ENABLE_EXPORT_FEATURES: import.meta.env.VITE_ENABLE_EXPORT_FEATURES === 'true',
  RATE_LIMIT_REQUESTS: parseInt(import.meta.env.VITE_RATE_LIMIT_REQUESTS || '100'),
  RATE_LIMIT_WINDOW: parseInt(import.meta.env.VITE_RATE_LIMIT_WINDOW || '60000'),
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info'
};
console.log('VITE_OPENROUTER_API_KEY:', import.meta.env.VITE_OPENROUTER_API_KEY);