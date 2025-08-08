// Environment Utilities for SentiView
// Handles environment variable validation and provides helpful error messages

import { API_KEYS } from '@/config/apiKeys';

export interface EnvValidationResult {
  isValid: boolean;
  missingKeys: string[];
  warnings: string[];
}

/**
 * Validates that all required environment variables are set
 */
export const validateEnvironment = (): EnvValidationResult => {
  const missingKeys: string[] = [];
  const warnings: string[] = [];

  // Check for required API keys
  const requiredKeys = [
    'VITE_TWITTER_BEARER_TOKEN',
    'VITE_REDDIT_CLIENT_ID',
    'VITE_FACEBOOK_ACCESS_TOKEN',
    'VITE_INSTAGRAM_ACCESS_TOKEN',
    'VITE_LINKEDIN_ACCESS_TOKEN',
    'VITE_YOUTUBE_API_KEY',
    'VITE_RAPID_API_KEY'
  ];

  requiredKeys.forEach(key => {
    const value = import.meta.env[key];
    if (!value || value === `your_${key.toLowerCase().replace('vite_', '')}_here`) {
      missingKeys.push(key);
    }
  });

  // Check for optional but recommended keys
  const optionalKeys = [
    'VITE_HUGGING_FACE_API_KEY'
  ];

  optionalKeys.forEach(key => {
    const value = import.meta.env[key];
    if (!value || value === `your_${key.toLowerCase().replace('vite_', '')}_here`) {
      warnings.push(`${key} is not set - some features may be limited`);
    }
  });

  return {
    isValid: missingKeys.length === 0,
    missingKeys,
    warnings
  };
};

/**
 * Gets a formatted list of missing environment variables
 */
export const getMissingEnvMessage = (missingKeys: string[]): string => {
  if (missingKeys.length === 0) return '';

  const keyDescriptions: { [key: string]: string } = {
    'VITE_TWITTER_BEARER_TOKEN': 'Twitter API bearer token for Twitter data',
    'VITE_REDDIT_CLIENT_ID': 'Reddit API client ID for Reddit data',
    'VITE_FACEBOOK_ACCESS_TOKEN': 'Facebook API access token for Facebook data',
    'VITE_INSTAGRAM_ACCESS_TOKEN': 'Instagram API access token for Instagram data',
    'VITE_LINKEDIN_ACCESS_TOKEN': 'LinkedIn API access token for LinkedIn data',
    'VITE_YOUTUBE_API_KEY': 'YouTube API key for YouTube data',
    'VITE_RAPID_API_KEY': 'RapidAPI key for product reviews',
    'VITE_HUGGING_FACE_API_KEY': 'Hugging Face API key for alternative AI models'
  };

  return missingKeys.map(key => {
    const description = keyDescriptions[key] || key;
    return `- ${key}: ${description}`;
  }).join('\n');
};

/**
 * Logs environment validation results to console
 */
export const logEnvironmentStatus = (): void => {
  console.group('🔧 SentiView Environment Configuration');
  console.log(`⚡ OpenRouter Enabled: ${isOpenRouterEnabled()}`);
  console.log(`🔧 Debug Mode: ${isDebugMode()}`);
  console.groupEnd();
};

/**
 * Checks if a specific API key is configured
 */
export const isApiKeyConfigured = (keyName: string): boolean => {
  const key = `VITE_${keyName.toUpperCase()}`;
  const value = import.meta.env[key];
  return !!(value && value !== `your_${keyName.toLowerCase()}_here`);
};

/**
 * Gets API key value with fallback
 */
export const getApiKey = (keyName: string, fallback?: string): string => {
  const key = `VITE_${keyName.toUpperCase()}`;
  const value = import.meta.env[key];
  
  if (!value || value === `your_${keyName.toLowerCase()}_here`) {
    if (fallback) return fallback;
    console.warn(`API key ${keyName} is not configured`);
    return '';
  }
  
  return value;
};

/**
 * Checks if the app is running in development mode
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.VITE_NODE_ENV === 'development';
};

/**
 * Checks if debug mode is enabled
 */
export const isDebugMode = (): boolean => {
  return import.meta.env.VITE_DEBUG_MODE === 'true';
};

/**
 * Logs debug information if debug mode is enabled
 */
export const debugLog = (message: string, data?: unknown): void => {
  if (isDebugMode()) {
    console.log(`🔍 [DEBUG] ${message}`, data || '');
  }
};

// Auto-log environment status on import
if (typeof window !== 'undefined') {
  // Only log in browser environment
  logEnvironmentStatus();
} 

// Remove all VITE_... env variable checks and warnings
// Instead, check for API_KEYS.OPENROUTER_API_KEY

export function isOpenRouterEnabled() {
  return !!API_KEYS.OPENROUTER_API_KEY;
} 