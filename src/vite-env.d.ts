/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Social Media API Keys
  readonly VITE_TWITTER_BEARER_TOKEN: string
  readonly VITE_REDDIT_CLIENT_ID: string
  readonly VITE_REDDIT_CLIENT_SECRET: string
  readonly VITE_FACEBOOK_ACCESS_TOKEN: string
  readonly VITE_INSTAGRAM_ACCESS_TOKEN: string
  readonly VITE_LINKEDIN_ACCESS_TOKEN: string
  readonly VITE_YOUTUBE_API_KEY: string

  // AI/ML API Keys
  readonly VITE_OPENROUTER_API_KEY: string
  readonly VITE_HUGGING_FACE_API_KEY: string

  // Product Review API Keys
  readonly VITE_RAPID_API_KEY: string

  // API URLs
  readonly VITE_TWITTER_API_URL: string
  readonly VITE_REDDIT_API_URL: string
  readonly VITE_FACEBOOK_API_URL: string
  readonly VITE_INSTAGRAM_API_URL: string
  readonly VITE_LINKEDIN_API_URL: string
  readonly VITE_YOUTUBE_API_URL: string
  readonly VITE_OPENROUTER_BASE_URL: string
  readonly VITE_HUGGING_FACE_BASE_URL: string
  readonly VITE_AMAZON_REVIEWS_API_URL: string
  readonly VITE_PRODUCT_SEARCH_API_URL: string

  // Demo Accounts
  readonly VITE_DEMO_USER_1_EMAIL: string
  readonly VITE_DEMO_USER_1_PASSWORD: string
  readonly VITE_DEMO_USER_1_NAME: string
  readonly VITE_DEMO_USER_2_EMAIL: string
  readonly VITE_DEMO_USER_2_PASSWORD: string
  readonly VITE_DEMO_USER_2_NAME: string
  readonly VITE_DEMO_ADMIN_EMAIL: string
  readonly VITE_DEMO_ADMIN_PASSWORD: string
  readonly VITE_DEMO_ADMIN_NAME: string

  // App Configuration
  readonly VITE_APP_ENV: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_ENABLE_OPENROUTER: string
  readonly VITE_ENABLE_SOCIAL_MEDIA_APIS: string
  readonly VITE_ENABLE_BATCH_ANALYSIS: string
  readonly VITE_ENABLE_EXPORT_FEATURES: string
  readonly VITE_RATE_LIMIT_REQUESTS: string
  readonly VITE_RATE_LIMIT_WINDOW: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_LOG_LEVEL: string

  // Environment
  readonly NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Ensure valid TypeScript code
declare module 'some-module' {
  // Module declarations
}