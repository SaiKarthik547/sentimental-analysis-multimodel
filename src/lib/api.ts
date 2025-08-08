import { 
  type User,
  type SocialMediaContent,
  type BatchAnalysis,
  userStorage,
  contentStorage,
  sentimentStorage,
  batchStorage
} from './localStorage';
import { API_KEYS, API_ENDPOINTS, DEMO_ACCOUNTS } from '@/config/apiKeys';

// Export User type for use in other components
export type { User };

// Define the data types for social media sentiment analysis
export interface ContentSearchParams {
  query: string;
  platforms?: string[];
  contentTypes?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy?: 'date' | 'engagement' | 'sentiment';
}

export interface SentimentAnalysisParams {
  contentIds: string[];
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

export interface SentimentTrend {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  total: number;
}

// Initialize demo accounts on app start
const seedDemoAccounts = () => {
  // Seed demo accounts if they don't exist
  Object.values(DEMO_ACCOUNTS).forEach(account => {
    const existingUser = userStorage.getUserByEmail(account.email);
    if (!existingUser) {
      userStorage.saveUser({
        email: account.email,
        fullName: account.fullName
      });
    }
  });
};

// Call seed function on module load
seedDemoAccounts();

// SocialMediaAPI - Handles social media content operations
export const SocialMediaAPI = {
  // Fetch social media content from demo APIs
  fetchFromPlatform: async (platform: string, query: string): Promise<SocialMediaContent[]> => {
    // This is a mock implementation since we're using fake APIs
    // In a real app, you would make actual API calls to social media platforms
    console.log(`Fetching from ${platform} with query: ${query}`);
    
    // Generate mock data based on platform and query
    const mockPosts: Omit<SocialMediaContent, 'id' | 'userId' | 'createdAt'>[] = [
      {
        platform: platform as any,
        contentType: 'text',
        contentText: `Great product review about ${query}! Really impressed with the quality and features. #${query} #review`,
        author: `@${platform}_user_${Math.floor(Math.random() * 1000)}`,
        postDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        likesCount: Math.floor(Math.random() * 100),
        sharesCount: Math.floor(Math.random() * 20),
        commentsCount: Math.floor(Math.random() * 30)
      },
      {
        platform: platform as any,
        contentType: 'text',
        contentText: `Not satisfied with ${query}. Expected better performance and user experience. Disappointed.`,
        author: `@${platform}_critic_${Math.floor(Math.random() * 1000)}`,
        postDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        likesCount: Math.floor(Math.random() * 50),
        sharesCount: Math.floor(Math.random() * 5),
        commentsCount: Math.floor(Math.random() * 15)
      }
    ];
    
    // Save to local storage and return
    const currentUser = userStorage.getCurrentUser();
    if (currentUser) {
      return mockPosts.map(post => contentStorage.saveContent({
        ...post,
        userId: currentUser.id
      }));
    }
    
    return [];
  },

  // Search for social media content
  searchContent: async (params: ContentSearchParams): Promise<SocialMediaContent[]> => {
    try {
      const currentUser = userStorage.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const allContent = contentStorage.getContent(currentUser.id);
      
      // Filter by query if provided
      let filteredContent = allContent;
      if (params.query) {
        const query = params.query.toLowerCase();
        filteredContent = allContent.filter(content => 
          content.contentText.toLowerCase().includes(query) ||
          content.author.toLowerCase().includes(query)
        );
      }

      // Filter by platforms
      if (params.platforms && params.platforms.length > 0) {
        filteredContent = filteredContent.filter(content => 
          params.platforms!.includes(content.platform)
        );
      }

      // Filter by content types
      if (params.contentTypes && params.contentTypes.length > 0) {
        filteredContent = filteredContent.filter(content => 
          params.contentTypes!.includes(content.contentType)
        );
      }

      // Filter by date range
      if (params.dateRange) {
        const startDate = new Date(params.dateRange.start);
        const endDate = new Date(params.dateRange.end);
        filteredContent = filteredContent.filter(content => {
          const contentDate = new Date(content.postDate);
          return contentDate >= startDate && contentDate <= endDate;
        });
      }

      // Sort results
      switch (params.sortBy) {
        case 'date':
          filteredContent.sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime());
          break;
        case 'engagement':
          filteredContent.sort((a, b) => 
            (b.likesCount + b.sharesCount + b.commentsCount) - 
            (a.likesCount + a.sharesCount + a.commentsCount)
          );
          break;
        default:
          // Keep original order for relevance
          break;
      }

      return filteredContent;
    } catch (error) {
      console.error('Error searching content:', error);
      throw error;
    }
  },

  // Add new social media content
  addContent: async (content: Omit<SocialMediaContent, 'id' | 'userId' | 'createdAt'>): Promise<SocialMediaContent> => {
    try {
      const currentUser = userStorage.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      return contentStorage.saveContent({
        ...content,
        userId: currentUser.id
      });
    } catch (error) {
      console.error('Error adding content:', error);
      throw error;
    }
  },

  // Get content by ID
  getContentById: async (id: string): Promise<SocialMediaContent | null> => {
    return contentStorage.getContentById(id);
  },

  // Delete content
  deleteContent: async (id: string): Promise<boolean> => {
    return contentStorage.deleteContent(id);
  }
};

// SentimentAnalysisAPI - Handles multimodal sentiment analysis for social media content
export const SentimentAnalysisAPI = {
  // Enhanced multimodal sentiment analysis
  analyzeSentiment: async (
    content: string, 
    contentType: 'text' | 'video' | 'audio' | 'image' = 'text'
  ): Promise<{ score: number; label: 'positive' | 'negative' | 'neutral'; confidence: number; emotions: string[]; topics: string[] }> => {
    try {
      const { analyzeContent } = await import('./socialMediaAnalyzer');
      const result = await analyzeContent(contentType, content);
      
      return {
        score: result.sentimentScore,
        label: result.sentimentLabel,
        confidence: result.confidence,
        emotions: result.emotions,
        topics: result.topics
      };
    } catch (error) {
      console.error('Error in sentiment analysis:', error);
      // Fallback analysis
      return {
        score: 0,
        label: 'neutral',
        confidence: 0.5,
        emotions: ['neutral'],
        topics: ['general']
      };
    }
  },

  // Analyze sentiment for given content IDs
  analyzeContentSentiment: async (params: SentimentAnalysisParams): Promise<SentimentResult[]> => {
    try {
      const currentUser = userStorage.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const results: SentimentResult[] = [];
      const startTime = Date.now();

      for (const contentId of params.contentIds) {
        const content = contentStorage.getContentById(contentId);
        if (!content) continue;

        const sentimentAnalysis = await SentimentAnalysisAPI.analyzeSentiment(
          content.contentUrl || content.contentText, 
          content.contentType
        );
        
        // Calculate percentages
        const positivePercentage = sentimentAnalysis.label === 'positive' ? 
          Math.round(sentimentAnalysis.confidence * 100) : 
          Math.round((1 - Math.abs(sentimentAnalysis.score)) * 30);
        
        const negativePercentage = sentimentAnalysis.label === 'negative' ? 
          Math.round(sentimentAnalysis.confidence * 100) : 
          Math.round(Math.abs(sentimentAnalysis.score) * 30);
        
        const neutralPercentage = 100 - positivePercentage - negativePercentage;

        // Use emotions from multimodal analysis
        const keyEmotions = sentimentAnalysis.emotions.length > 0 ? 
          sentimentAnalysis.emotions : 
          sentimentAnalysis.label === 'positive' ? ['joy', 'satisfaction'] :
          sentimentAnalysis.label === 'negative' ? ['disappointment', 'frustration'] :
          ['neutral', 'informative'];

        const result = sentimentStorage.saveResult({
          contentId,
          userId: currentUser.id,
          sentimentScore: sentimentAnalysis.score,
          sentimentLabel: sentimentAnalysis.label,
          confidenceScore: sentimentAnalysis.confidence,
          positivePercentage,
          negativePercentage,
          neutralPercentage,
          keyEmotions,
          analysisSummary: `${content.contentType.toUpperCase()} content shows ${sentimentAnalysis.label} sentiment with ${Math.round(sentimentAnalysis.confidence * 100)}% confidence. Key emotions: ${keyEmotions.join(', ')}. Topics: ${sentimentAnalysis.topics.slice(0, 3).join(', ')}.`,
          aiModelUsed: `multimodal_${content.contentType}_analyzer`,
          processingTimeMs: Date.now() - startTime
        });

        results.push(result);
      }

      return results;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw error;
    }
  },

  // Get user's previous sentiment analyses
  getUserAnalyses: async (limit: number = 10): Promise<SentimentResult[]> => {
    try {
      const currentUser = userStorage.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      return sentimentStorage.getLatestResults(currentUser.id, limit);
    } catch (error) {
      console.error('Error fetching user analyses:', error);
      throw error;
    }
  },

  // Get sentiment trends over time
  getSentimentTrends: async (days: number = 30): Promise<SentimentTrend[]> => {
    try {
      const currentUser = userStorage.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const results = sentimentStorage.getResults(currentUser.id);
      const trends: { [date: string]: { positive: number; negative: number; neutral: number } } = {};

      // Initialize dates
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        trends[dateStr] = { positive: 0, negative: 0, neutral: 0 };
      }

      // Count sentiments by date
      results.forEach(result => {
        const date = result.createdAt.split('T')[0];
        if (trends[date]) {
          trends[date][result.sentimentLabel]++;
        }
      });

      // Convert to array format
      return Object.entries(trends).map(([date, counts]) => ({
        date,
        positive: counts.positive,
        negative: counts.negative,
        neutral: counts.neutral,
        total: counts.positive + counts.negative + counts.neutral
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error) {
      console.error('Error fetching sentiment trends:', error);
      throw error;
    }
  }
};

// AuthAPI - Handles user authentication with local storage
export const AuthAPI = {
  // Login user with email and password (includes demo account support)
  login: async (email: string, password: string): Promise<{ user: User }> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check for demo accounts first
      const demoAccount = Object.values(DEMO_ACCOUNTS).find(account => account.email === email);
      if (demoAccount && password === demoAccount.password) {
        const user = userStorage.getUserByEmail(email) || userStorage.saveUser({
          email: demoAccount.email,
          fullName: demoAccount.fullName
        });
        userStorage.setCurrentUser(user);
        console.log('Demo user logged in successfully:', user.email);
        return { user };
      }
      
      const user = userStorage.getUserByEmail(email);
      if (!user) {
        throw new Error('Invalid email or password. Try demo accounts: demo1@example.com, demo2@example.com, admin@example.com (password: demo123/admin123)');
      }

      // In a real app, you'd verify the password hash here
      // For demo purposes, we'll just check if password is not empty
      if (!password) {
        throw new Error('Password is required');
      }

      userStorage.setCurrentUser(user);
      console.log('User logged in successfully:', user.email);
      return { user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register new user
  register: async (email: string, password: string, name: string): Promise<{ user: User }> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user already exists
      const existingUser = userStorage.getUserByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = userStorage.saveUser({
        email,
        fullName: name
      });

      userStorage.setCurrentUser(newUser);
      console.log('User registered successfully:', newUser.email);
      return { user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout current user
  logout: async (): Promise<void> => {
    try {
      userStorage.setCurrentUser(null);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    return userStorage.getCurrentUser();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!userStorage.getCurrentUser();
  }
};

// BatchAnalysisAPI - Handles batch analysis operations
export const BatchAnalysisAPI = {
  // Create a new batch analysis
  createBatch: async (sessionName: string, contentIds: string[]): Promise<BatchAnalysis> => {
    try {
      const currentUser = userStorage.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Get platforms from content
      const platforms = new Set<string>();
      contentIds.forEach(id => {
        const content = contentStorage.getContentById(id);
        if (content) platforms.add(content.platform);
      });

      const batch = batchStorage.saveBatch({
        userId: currentUser.id,
        sessionName,
        totalContentAnalyzed: contentIds.length,
        averageSentiment: 0,
        dominantSentiment: 'neutral',
        platformsAnalyzed: Array.from(platforms),
        dateRangeStart: new Date().toISOString().split('T')[0],
        dateRangeEnd: new Date().toISOString().split('T')[0],
        status: 'pending'
      });

      // Process the batch analysis
      void BatchAnalysisAPI.processBatch(batch.id, contentIds);

      return batch;
    } catch (error) {
      console.error('Error creating batch:', error);
      throw error;
    }
  },

  // Process batch analysis in background
  processBatch: async (batchId: string, contentIds: string[]): Promise<void> => {
    try {
      batchStorage.updateBatch(batchId, { status: 'processing' });

      // Analyze all content
      const results = await SentimentAnalysisAPI.analyzeContentSentiment({ contentIds });
      
      // Calculate batch statistics
      const totalAnalyzed = results.length;
      const avgSentiment = results.reduce((sum, r) => sum + r.sentimentScore, 0) / totalAnalyzed;
      
      const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
      results.forEach(r => sentimentCounts[r.sentimentLabel]++);
      
      const dominantSentiment = Object.entries(sentimentCounts)
        .reduce((a, b) => sentimentCounts[a[0] as keyof typeof sentimentCounts] > sentimentCounts[b[0] as keyof typeof sentimentCounts] ? a : b)[0] as 'positive' | 'negative' | 'neutral';

      batchStorage.updateBatch(batchId, {
        status: 'completed',
        totalContentAnalyzed: totalAnalyzed,
        averageSentiment: avgSentiment,
        dominantSentiment,
        completedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error processing batch:', error);
      batchStorage.updateBatch(batchId, { status: 'failed' });
    }
  },

  // Get user's batch analyses
  getUserBatches: async (limit: number = 10): Promise<BatchAnalysis[]> => {
    try {
      const currentUser = userStorage.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      return batchStorage.getBatches(currentUser.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching user batches:', error);
      throw error;
    }
  }
};
