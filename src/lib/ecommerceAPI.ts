// E-commerce API Service for Amazon, Flipkart, and JioMart
// Provides fake but realistic data for demonstrations

import { API_KEYS, API_ENDPOINTS, ECOMMERCE_PLATFORMS, type EcommercePlatform } from '@/config/apiKeys';
import { callOpenRouterViaBackend } from './openRouterBackend';
import { OPENROUTER_FREE_MODELS } from '@/config/apiKeys';

export type EcommercePlatform = 'amazon' | 'flipkart' | 'jiomart';

export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  platform: EcommercePlatform;
  rating: number; // 1-5
  title: string;
  content: string;
  author: string;
  date: string;
  helpful: number;
  verified: boolean;
  sentimentScore: number; // -1 to 1
  sentimentLabel: 'positive' | 'negative' | 'neutral';
}

export interface ProductInfo {
  id: string;
  name: string;
  platform: EcommercePlatform;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  productUrl: string;
  availability: 'in_stock' | 'out_of_stock' | 'limited';
  category: string;
  brand: string;
}

export interface SearchResult {
  products: ProductInfo[];
  totalResults: number;
  searchQuery: string;
  platform: EcommercePlatform;
}

interface Product {
  id: string;
  name: string;
  productUrl: string;
}

// Fake product data for demonstrations
const FAKE_PRODUCTS: Record<EcommercePlatform, ProductInfo[]> = {
  amazon: [
    {
      id: 'amz-001',
      name: 'Echo Dot (4th Gen) | Smart speaker with Alexa',
      price: 2499,
      originalPrice: 3999,
      rating: 4.2,
      reviewCount: 12450,
      imageUrl: 'https://fake-amazon-images.demo.com/echo-dot.jpg',
      productUrl: 'https://www.amazon.in/dp/B07XJ8C8F5',
      availability: 'in_stock' as const,
      category: 'Electronics',
      brand: 'Amazon'
    },
    {
      id: 'amz-002',
      name: 'OnePlus Nord CE 5G (Charcoal Ink, 8GB RAM, 128GB Storage)',
      price: 24999,
      originalPrice: 26999,
      rating: 4.1,
      reviewCount: 8920,
      imageUrl: 'https://fake-amazon-images.demo.com/oneplus-nord.jpg',
      productUrl: 'https://www.amazon.in/dp/B08V83JKK9',
      availability: 'in_stock' as const,
      category: 'Electronics',
      brand: 'OnePlus'
    },
    {
      id: 'amz-003',
      name: 'Boat Airdopes 131 Wireless Earbuds',
      price: 1499,
      originalPrice: 2999,
      rating: 4.0,
      reviewCount: 15680,
      imageUrl: 'https://fake-amazon-images.demo.com/boat-airdopes.jpg',
      productUrl: 'https://www.amazon.in/dp/B07XJ8C8F6',
      availability: 'limited' as const,
      category: 'Electronics',
      brand: 'Boat'
    }
  ],
  flipkart: [
    {
      id: 'flp-001',
      name: 'Samsung Galaxy M32 (Black, 6GB RAM, 128GB Storage)',
      price: 15999,
      originalPrice: 18999,
      rating: 4.3,
      reviewCount: 10230,
      imageUrl: 'https://fake-flipkart-images.demo.com/samsung-m32.jpg',
      productUrl: 'https://www.flipkart.com/p/samsung-galaxy-m32',
      availability: 'in_stock' as const,
      category: 'Electronics',
      brand: 'Samsung'
    },
    {
      id: 'flp-002',
      name: 'Mi 4A PRO 80 cm (32 inch) HD Ready LED Smart Android TV',
      price: 12999,
      originalPrice: 15999,
      rating: 4.0,
      reviewCount: 8750,
      imageUrl: 'https://fake-flipkart-images.demo.com/mi-tv.jpg',
      productUrl: 'https://www.flipkart.com/p/mi-4a-pro-tv',
      availability: 'in_stock' as const,
      category: 'Electronics',
      brand: 'Mi'
    },
    {
      id: 'flp-003',
      name: 'Puma Men's Softride Enzo NXT Running Shoes',
      price: 2499,
      originalPrice: 3999,
      rating: 4.2,
      reviewCount: 6340,
      imageUrl: 'https://fake-flipkart-images.demo.com/puma-shoes.jpg',
      productUrl: 'https://www.flipkart.com/p/puma-running-shoes',
      availability: 'limited' as const,
      category: 'Fashion',
      brand: 'Puma'
    }
  ],
  jiomart: [
    {
      id: 'jio-001',
      name: 'Britannia Good Day Cashew Cookies, 300g',
      price: 45,
      originalPrice: 60,
      rating: 4.1,
      reviewCount: 2340,
      imageUrl: 'https://fake-jiomart-images.demo.com/britannia-cookies.jpg',
      productUrl: 'https://www.jiomart.com/p/britannia-good-day-cookies',
      availability: 'in_stock' as const,
      category: 'Grocery',
      brand: 'Britannia'
    },
    {
      id: 'jio-002',
      name: 'Dabur Honey 100% Pure, 500g',
      price: 185,
      originalPrice: 220,
      rating: 4.3,
      reviewCount: 1890,
      imageUrl: 'https://fake-jiomart-images.demo.com/dabur-honey.jpg',
      productUrl: 'https://www.jiomart.com/p/dabur-honey',
      availability: 'in_stock' as const,
      category: 'Grocery',
      brand: 'Dabur'
    },
    {
      id: 'jio-003',
      name: 'Tata Premium Tea, 250g',
      price: 95,
      originalPrice: 120,
      rating: 4.0,
      reviewCount: 3420,
      imageUrl: 'https://fake-jiomart-images.demo.com/tata-tea.jpg',
      productUrl: 'https://www.jiomart.com/p/tata-premium-tea',
      availability: 'limited' as const,
      category: 'Grocery',
      brand: 'Tata'
    }
  ]
};

// Fake review data
const FAKE_REVIEWS: Record<EcommercePlatform, ProductReview[]> = {
  amazon: [
    {
      id: 'rev-amz-001',
      productId: 'amz-001',
      productName: 'Echo Dot (4th Gen) | Smart speaker with Alexa',
      platform: 'amazon' as const,
      rating: 5,
      title: 'Excellent smart speaker!',
      content: 'This Echo Dot is amazing! Alexa responds quickly and the sound quality is great for its size. Perfect for my bedroom.',
      author: 'Rahul K.',
      date: '2024-01-15',
      helpful: 45,
      verified: true,
      sentimentScore: 0.9,
      sentimentLabel: 'positive' as const
    },
    {
      id: 'rev-amz-002',
      productId: 'amz-001',
      productName: 'Echo Dot (4th Gen) | Smart speaker with Alexa',
      platform: 'amazon' as const,
      rating: 3,
      title: 'Good but could be better',
      content: 'The speaker works fine but the microphone sometimes doesn't pick up my voice clearly. Overall decent product.',
      author: 'Priya S.',
      date: '2024-01-10',
      helpful: 12,
      verified: true,
      sentimentScore: 0.2,
      sentimentLabel: 'neutral' as const
    },
    {
      id: 'rev-amz-003',
      productId: 'amz-002',
      productName: 'OnePlus Nord CE 5G',
      platform: 'amazon' as const,
      rating: 4,
      title: 'Great phone for the price',
      content: 'Battery life is excellent and camera quality is good. The 5G works perfectly in my area. Worth the money!',
      author: 'Amit P.',
      date: '2024-01-12',
      helpful: 67,
      verified: true,
      sentimentScore: 0.8,
      sentimentLabel: 'positive' as const
    }
  ],
  flipkart: [
    {
      id: 'rev-flp-001',
      productId: 'flp-001',
      productName: 'Samsung Galaxy M32',
      platform: 'flipkart' as const,
      rating: 5,
      title: 'Best phone under 20k!',
      content: 'Amazing camera, great battery life, and smooth performance. Samsung has done a great job with this one.',
      author: 'Neha R.',
      date: '2024-01-14',
      helpful: 89,
      verified: true,
      sentimentScore: 0.95,
      sentimentLabel: 'positive' as const
    },
    {
      id: 'rev-flp-002',
      productId: 'flp-002',
      productName: 'Mi 4A PRO Smart TV',
      platform: 'flipkart' as const,
      rating: 4,
      title: 'Good smart TV',
      content: 'Picture quality is decent and Android TV works well. Remote could be better but overall satisfied.',
      author: 'Vikram M.',
      date: '2024-01-08',
      helpful: 34,
      verified: true,
      sentimentScore: 0.6,
      sentimentLabel: 'positive' as const
    }
  ],
  jiomart: [
    {
      id: 'rev-jio-001',
      productId: 'jio-001',
      productName: 'Britannia Good Day Cashew Cookies',
      platform: 'jiomart' as const,
      rating: 4,
      title: 'Tasty cookies',
      content: 'Fresh and crispy cookies with good cashew content. Family loves them!',
      author: 'Sunita K.',
      date: '2024-01-16',
      helpful: 23,
      verified: true,
      sentimentScore: 0.7,
      sentimentLabel: 'positive' as const
    },
    {
      id: 'rev-jio-002',
      productId: 'jio-002',
      productName: 'Dabur Honey 100% Pure',
      platform: 'jiomart' as const,
      rating: 5,
      title: 'Pure and natural honey',
      content: 'Authentic honey, great taste. Perfect for tea and health benefits. Highly recommended!',
      author: 'Rajesh P.',
      date: '2024-01-13',
      helpful: 56,
      verified: true,
      sentimentScore: 0.9,
      sentimentLabel: 'positive' as const
    }
  ]
};

// E-commerce API client
export class EcommerceAPI {
  constructor() {}

  // Helper to call OpenRouter for real product search
  private async fetchProductsFromOpenRouter(query: string, platform?: EcommercePlatform): Promise<SearchResult[]> {
    try {
      const model = OPENROUTER_FREE_MODELS[0]; // Use a free model, or randomize if needed
      const prompt = `You are a product search assistant. Given a product query, return a JSON array of up to 5 real products from ${platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Amazon, Flipkart, and JioMart'}. Each product should include:\n- id (unique string)\n- name (product title)\n- price (number, in INR)\n- originalPrice (optional, number, in INR)\n- rating (number, 1-5)\n- reviewCount (number)\n- imageUrl (direct link to product image)\n- productUrl (direct link to product page)\n- availability ('in_stock' | 'out_of_stock' | 'limited')\n- category (e.g., 'Electronics', 'Fashion', 'Grocery')\n- brand\n\nQuery: "${query}"\n\nRespond ONLY with a valid JSON array of ProductInfo objects.`;
      const result = await callOpenRouterViaBackend({
        model,
        messages: [
          { role: 'system', content: 'You are a product search assistant.' },
          { role: 'user', content: prompt }
        ]
      });
      const products: ProductInfo[] = JSON.parse(typeof result === 'string' ? result : result.content);
      // Normalize to SearchResult[]
      const platforms = platform ? [platform] : ECOMMERCE_PLATFORMS;
      return platforms.map(plat => ({
        products: products.filter((p: ProductInfo) => p.platform === plat),
        totalResults: products.filter((p: ProductInfo) => p.platform === plat).length,
        searchQuery: query,
        platform: plat
      }));
    } catch (e) {
      console.error('OpenRouter product search failed, falling back to fake data:', e);
      // fallback to fake data
      const platforms = platform ? [platform] : ECOMMERCE_PLATFORMS;
      return platforms.map(plat => {
        const products = FAKE_PRODUCTS[plat].filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        );
        return {
          products: products.map(p => ({ ...p, platform: plat })),
          totalResults: products.length,
          searchQuery: query,
          platform: plat
        };
      });
    }
  }

  // Helper to call OpenRouter for real reviews
  private async fetchReviewsFromOpenRouter(product: ProductInfo): Promise<ProductReview[]> {
    const model = OPENROUTER_FREE_MODELS[0];
    const prompt = `You are a review assistant. Given the product "${product.name}" (URL: ${product.productUrl}), return a JSON array of up to 5 realistic user reviews. Each review should include:\n- id (unique string)\n- productId (matching the product's ID)\n- productName (matching the product's name)\n- platform (e.g., 'amazon', 'flipkart', 'jiomart')\n- rating (number, 1-5)\n- title (review title)\n- content (review text)\n- author (reviewer name)\n- date (YYYY-MM-DD)\n- helpful (number of helpful votes)\n- verified (boolean)\n- sentimentScore (number, -1 to 1)\n- sentimentLabel ('positive' | 'negative' | 'neutral')\n\nEnsure the reviews are diverse in sentiment and realistic. Respond ONLY with a valid JSON array of ProductReview objects.`;
    try {
      const result = await callOpenRouterViaBackend({
        model,
        messages: [
          { role: 'system', content: 'You are a review assistant.' },
          { role: 'user', content: prompt }
        ]
      });
      const reviews: ProductReview[] = JSON.parse(typeof result === 'string' ? result : result.content);
      return reviews;
    } catch (error) {
      // fallback to fake data
      return [];
    }
  }

  // Search products across platforms
  async searchProducts(
    query: string, 
    platform?: EcommercePlatform
  ): Promise<SearchResult[]> {
    return this.fetchProductsFromOpenRouter(query, platform);
  }

  // Get product reviews
  async getProductReviews(
    productId: string, 
    platform: EcommercePlatform
  ): Promise<ProductReview[]> {
    try {
      const productInfo = FAKE_PRODUCTS[platform].find(p => p.id === productId); // Get product name for prompt
      if (!productInfo) {
        throw new Error(`Product with ID ${productId} not found on ${platform}`);
      }
      
      const model = OPENROUTER_FREE_MODELS[0];
      const prompt = `You are a review assistant. Given the product "${productInfo.name}" (URL: ${productInfo.productUrl}), return a JSON array of up to 5 realistic user reviews. Each review should include:\n- id (unique string)\n- productId (matching the product's ID)\n- productName (matching the product's name)\n- platform (e.g., 'amazon', 'flipkart', 'jiomart')\n- rating (number, 1-5)\n- title (review title)\n- content (review text)\n- author (reviewer name)\n- date (YYYY-MM-DD)\n- helpful (number of helpful votes)\n- verified (boolean)\n- sentimentScore (number, -1 to 1)\n- sentimentLabel ('positive' | 'negative' | 'neutral')\n\nEnsure the reviews are diverse in sentiment and realistic. Respond ONLY with a valid JSON array of ProductReview objects.`;
      
      const result = await callOpenRouterViaBackend({
        model,
        messages: [
          { role: 'system', content: 'You are a review assistant.' },
          { role: 'user', content: prompt }
        ]
      });
      
      const reviews: ProductReview[] = JSON.parse(typeof result === 'string' ? result : result.content);
      return reviews;
    } catch (error) {
      console.error('OpenRouter review fetch failed, falling back to fake data:', error);
      // fallback to fake data
      return FAKE_REVIEWS[platform].filter(r => r.productId === productId);
    }
  }

  // Get product information
  async getProductInfo(
    productId: string, 
    platform: EcommercePlatform
  ): Promise<ProductInfo | null> {
    const product = FAKE_PRODUCTS[platform].find(p => p.id === productId);
    
    if (!product) return null;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return { ...product, platform };
  }

  // Get trending products
  async getTrendingProducts(platform: EcommercePlatform): Promise<ProductInfo[]> {
    const products = FAKE_PRODUCTS[platform].slice(0, 5);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return products.map(p => ({ ...p, platform }));
  }

  // Analyze reviews sentiment
  async analyzeReviewsSentiment(reviews: ProductReview[]): Promise<{
    averageSentiment: number;
    sentimentDistribution: { positive: number; negative: number; neutral: number };
    topEmotions: string[];
    summary: string;
  }> {
    if (reviews.length === 0) {
      return {
        averageSentiment: 0,
        sentimentDistribution: { positive: 0, negative: 0, neutral: 0 },
        topEmotions: [],
        summary: 'No reviews available for analysis.'
      };
    }

    const totalSentiment = reviews.reduce((sum, review) => sum + review.sentimentScore, 0);
    const averageSentiment = totalSentiment / reviews.length;
    
    const sentimentCounts = reviews.reduce((acc, review) => {
      acc[review.sentimentLabel]++;
      return acc;
    }, { positive: 0, negative: 0, neutral: 0 });
    
    const totalReviews = reviews.length;
    const sentimentDistribution = {
      positive: (sentimentCounts.positive / totalReviews) * 100,
      negative: (sentimentCounts.negative / totalReviews) * 100,
      neutral: (sentimentCounts.neutral / totalReviews) * 100
    };
    
    // Extract common emotions from review content
    const emotions = this.extractEmotionsFromReviews(reviews);
    
    const summary = this.generateSentimentSummary(averageSentiment, sentimentDistribution, reviews.length);
    
    return {
      averageSentiment,
      sentimentDistribution,
      topEmotions: emotions.slice(0, 5),
      summary
    };
  }

  // Extract emotions from review content
  private extractEmotionsFromReviews(reviews: ProductReview[]): string[] {
    const emotionWords = {
      joy: ['amazing', 'excellent', 'great', 'love', 'perfect', 'wonderful', 'fantastic'],
      satisfaction: ['good', 'satisfied', 'happy', 'pleased', 'content'],
      disappointment: ['disappointed', 'bad', 'poor', 'terrible', 'awful'],
      frustration: ['frustrated', 'annoyed', 'angry', 'upset', 'dissatisfied']
    };
    
    const emotionCounts: { [key: string]: number } = {};
    
    reviews.forEach(review => {
      const content = review.content.toLowerCase();
      Object.entries(emotionWords).forEach(([emotion, words]) => {
        words.forEach(word => {
          if (content.includes(word)) {
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
          }
        });
      });
    });
    
    return Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([emotion]) => emotion);
  }

  // Generate sentiment summary
  private generateSentimentSummary(
    averageSentiment: number,
    distribution: { positive: number; negative: number; neutral: number },
    totalReviews: number
  ): string {
    let summary = `Analysis of ${totalReviews} reviews: `;
    
    if (averageSentiment > 0.5) {
      summary += `Very positive sentiment (${averageSentiment.toFixed(2)}). ${distribution.positive.toFixed(1)}% positive reviews.`;
    } else if (averageSentiment > 0.1) {
      summary += `Positive sentiment (${averageSentiment.toFixed(2)}). ${distribution.positive.toFixed(1)}% positive reviews.`;
    } else if (averageSentiment < -0.5) {
      summary += `Very negative sentiment (${averageSentiment.toFixed(2)}). ${distribution.negative.toFixed(1)}% negative reviews.`;
    } else if (averageSentiment < -0.1) {
      summary += `Negative sentiment (${averageSentiment.toFixed(2)}). ${distribution.negative.toFixed(1)}% negative reviews.`;
    } else {
      summary += `Neutral sentiment (${averageSentiment.toFixed(2)}). Mixed reviews with ${distribution.neutral.toFixed(1)}% neutral.`;
    }
    
    return summary;
  }
}

// Export singleton instance
export const ecommerceAPI = new EcommerceAPI();