// Local Storage utilities for Social Media Sentiment Analysis

export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface SocialMediaContent {
  id: string;
  userId: string;
  platform: 'twitter' | 'reddit' | 'facebook' | 'instagram' | 'linkedin' | 'youtube';
  contentType: 'text' | 'video' | 'audio' | 'image';
  contentText: string;
  contentUrl?: string;
  author: string;
  postDate: string;
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface SentimentResult {
  id: string;
  contentId: string;
  userId: string;
  sentimentScore: number;
  sentimentLabel: 'positive' | 'negative' | 'neutral';
  confidenceScore: number;
  positivePercentage: number;
  negativePercentage: number;
  neutralPercentage: number;
  keyEmotions: string[];
  analysisSummary: string;
  aiModelUsed: string;
  processingTimeMs: number;
  createdAt: string;
}

export interface BatchAnalysis {
  id: string;
  userId: string;
  sessionName: string;
  totalContentAnalyzed: number;
  averageSentiment: number;
  dominantSentiment: 'positive' | 'negative' | 'neutral';
  platformsAnalyzed: string[];
  dateRangeStart: string;
  dateRangeEnd: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  completedAt?: string;
  createdAt: string;
}

// Storage utilities
const STORAGE_KEYS = {
  USERS: 'sentiview_users',
  CURRENT_USER: 'sentiview_current_user',
  CONTENT: 'sentiview_content',
  SENTIMENT_RESULTS: 'sentiview_sentiment_results',
  BATCH_ANALYSES: 'sentiview_batch_analyses'
};

// User storage
export const userStorage = {
  saveUser: (userData: Omit<User, 'id' | 'createdAt'>): User => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  },

  getUserByEmail: (email: string): User | null => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    return users.find((user: User) => user.email === email) || null;
  },

  getCurrentUser: (): User | null => {
    const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return currentUser ? JSON.parse(currentUser) : null;
  },

  setCurrentUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }
};

// Content storage
export const contentStorage = {
  saveContent: (contentData: Omit<SocialMediaContent, 'id' | 'createdAt'>): SocialMediaContent => {
    const content = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTENT) || '[]');
    const newContent: SocialMediaContent = {
      ...contentData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    content.push(newContent);
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(content));
    return newContent;
  },

  getContent: (userId: string): SocialMediaContent[] => {
    const content = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTENT) || '[]');
    return content.filter((item: SocialMediaContent) => item.userId === userId);
  },

  getContentById: (id: string): SocialMediaContent | null => {
    const content = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTENT) || '[]');
    return content.find((item: SocialMediaContent) => item.id === id) || null;
  },

  deleteContent: (id: string): boolean => {
    const content = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTENT) || '[]');
    const filteredContent = content.filter((item: SocialMediaContent) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(filteredContent));
    return true;
  }
};

// Sentiment results storage
export const sentimentStorage = {
  saveResult: (resultData: Omit<SentimentResult, 'id' | 'createdAt'>): SentimentResult => {
    const results = JSON.parse(localStorage.getItem(STORAGE_KEYS.SENTIMENT_RESULTS) || '[]');
    const newResult: SentimentResult = {
      ...resultData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    results.push(newResult);
    localStorage.setItem(STORAGE_KEYS.SENTIMENT_RESULTS, JSON.stringify(results));
    return newResult;
  },

  getResults: (userId: string): SentimentResult[] => {
    const results = JSON.parse(localStorage.getItem(STORAGE_KEYS.SENTIMENT_RESULTS) || '[]');
    return results.filter((result: SentimentResult) => result.userId === userId);
  },

  getLatestResults: (userId: string, limit: number): SentimentResult[] => {
    const results = sentimentStorage.getResults(userId);
    return results
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
};

// Batch analysis storage
export const batchStorage = {
  saveBatch: (batchData: Omit<BatchAnalysis, 'id' | 'createdAt'>): BatchAnalysis => {
    const batches = JSON.parse(localStorage.getItem(STORAGE_KEYS.BATCH_ANALYSES) || '[]');
    const newBatch: BatchAnalysis = {
      ...batchData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    batches.push(newBatch);
    localStorage.setItem(STORAGE_KEYS.BATCH_ANALYSES, JSON.stringify(batches));
    return newBatch;
  },

  updateBatch: (id: string, updateData: Partial<Omit<BatchAnalysis, 'id' | 'createdAt'>>): void => {
    const batches = JSON.parse(localStorage.getItem(STORAGE_KEYS.BATCH_ANALYSES) || '[]');
    const batchIndex = batches.findIndex((batch: BatchAnalysis) => batch.id === id);
    if (batchIndex !== -1) {
      batches[batchIndex] = { ...batches[batchIndex], ...updateData };
      localStorage.setItem(STORAGE_KEYS.BATCH_ANALYSES, JSON.stringify(batches));
    }
  },

  getBatches: (userId: string): BatchAnalysis[] => {
    const batches = JSON.parse(localStorage.getItem(STORAGE_KEYS.BATCH_ANALYSES) || '[]');
    return batches.filter((batch: BatchAnalysis) => batch.userId === userId);
  }
};

// Clear all data (for testing/reset)
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Demo accounts seeding
export const seedDemoAccounts = (): void => {
  const demoUsers = [
    { email: 'demo1@example.com', fullName: 'Demo User 1' },
    { email: 'demo2@example.com', fullName: 'Demo User 2' },
    { email: 'admin@example.com', fullName: 'Admin User' }
  ];

  demoUsers.forEach(userData => {
    const existingUser = userStorage.getUserByEmail(userData.email);
    if (!existingUser) {
      userStorage.saveUser(userData);
    }
  });
};

// Export sample data for testing
export const seedSampleData = (userId: string): void => {
  const sampleContent: Omit<SocialMediaContent, 'id' | 'createdAt'>[] = [
    {
      userId,
      platform: 'twitter',
      contentType: 'text',
      contentText: 'Just tried the new iPhone 15! The camera quality is absolutely amazing 📸✨ #iPhone15 #Apple',
      author: '@techreview123',
      postDate: new Date().toISOString(),
      likesCount: 45,
      sharesCount: 12,
      commentsCount: 8
    },
    {
      userId,
      platform: 'reddit',
      contentType: 'text',
      contentText: 'Disappointed with the latest Tesla Model S update. The interface is confusing and battery life seems worse.',
      author: 'u/carenthusiast',
      postDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      likesCount: 23,
      sharesCount: 5,
      commentsCount: 15
    },
    {
      userId,
      platform: 'facebook',
      contentType: 'text',
      contentText: 'Had an amazing vacation in Bali! The beaches are pristine and the people are so friendly 🏖️☀️',
      author: 'Sarah Johnson',
      postDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      likesCount: 127,
      sharesCount: 34,
      commentsCount: 42
    },
    {
      userId,
      platform: 'instagram',
      contentType: 'image',
      contentText: 'Coffee and coding session ☕💻 #developer #coffee',
      author: '@codelife_daily',
      postDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      likesCount: 89,
      sharesCount: 12,
      commentsCount: 23
    },
    {
      userId,
      platform: 'linkedin',
      contentType: 'text',
      contentText: 'Excited to announce my promotion to Senior Software Engineer! Thank you to my amazing team for the support.',
      author: 'John Smith',
      postDate: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      likesCount: 203,
      sharesCount: 45,
      commentsCount: 67
    },
    {
      userId,
      platform: 'youtube',
      contentType: 'video',
      contentText: 'How to build React apps in 2024 - Complete tutorial',
      contentUrl: 'https://youtube.com/watch?v=example',
      author: 'TechTutorials Pro',
      postDate: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
      likesCount: 1547,
      sharesCount: 234,
      commentsCount: 89
    }
  ];
  
  sampleContent.forEach(content => contentStorage.saveContent(content));
};