// OpenRouter API Integration for Social Media Sentiment Analysis
// Uses only free models to avoid costs

import { callOpenRouterViaBackend } from './openRouterBackend';
import { OPENROUTER_FREE_MODELS, ROBERTA_SENTIMENT_MODELS } from '@/config/apiKeys';

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const POSITIVE_WORDS = new Set(['good', 'great', 'excellent', 'amazing', 'love', 'like', 'happy', 'wonderful', 'fantastic', 'awesome']);
const NEGATIVE_WORDS = new Set(['bad', 'terrible', 'awful', 'hate', 'dislike', 'sad', 'horrible', 'worst', 'disappointing', 'annoying']);

// OpenRouter API client
export class OpenRouterAPI {
  private getRandomFreeModel(): string {
    const randomIndex = Math.floor(Math.random() * OPENROUTER_FREE_MODELS.length);
    return OPENROUTER_FREE_MODELS[randomIndex];
  }

  private getRoBERTaModel(): string {
    // Prioritize RoBERTa models for sentiment analysis
    const robertaModels = OPENROUTER_FREE_MODELS.filter(model => 
      model.toLowerCase().includes('roberta') || 
      model.toLowerCase().includes('sentiment')
    );
    return robertaModels.length > 0 ? robertaModels[0] : this.getRandomFreeModel();
  }

  async analyzeSentiment(
    content: string,
    contentType: 'text' | 'video' | 'audio' | 'image' = 'text'
  ): Promise<{
    sentimentScore: number;
    sentimentLabel: 'positive' | 'negative' | 'neutral';
    confidence: number;
    emotions: string[];
    reasoning: string;
  }> {
    const model = this.getRoBERTaModel();
    const prompt = this.buildSentimentPrompt(content, contentType);
    try {
      const result = await callOpenRouterViaBackend({
        model,
        messages: [
          { role: 'system', content: 'You are an expert sentiment analyst specializing in social media content. Analyze the sentiment and provide structured JSON responses. Use RoBERTa-based analysis for accurate sentiment detection.' },
          { role: 'user', content: prompt }
        ]
      });
      return this.parseSentimentResponse(result.content || result);
    } catch (error) {
      console.error('OpenRouter API error:', error);
      return this.fallbackAnalysis(content);
    }
  }

  // Build prompt for sentiment analysis
  private buildSentimentPrompt(content: string, contentType: string): string {
    return `Analyze the sentiment of this ${contentType} content and provide a JSON response with the following structure:

Content: "${content}"

Please analyze the sentiment and return a JSON object with:
{
  "sentimentScore": <number between -1 and 1, where -1 is very negative, 0 is neutral, and 1 is very positive>,
  "sentimentLabel": "<positive|negative|neutral>",
  "confidence": <number between 0 and 1 indicating confidence in the analysis>,
  "emotions": ["<list of detected emotions>"],
  "reasoning": "<brief explanation of the sentiment analysis>"
}

Focus on social media context and use RoBERTa-based analysis for accurate sentiment detection.`;
  }

  // Parse sentiment response from OpenRouter
  private parseSentimentResponse(response: string | { sentimentScore?: number; sentimentLabel?: 'positive' | 'negative' | 'neutral'; confidence?: number; emotions?: string[]; reasoning?: string; }): {
    sentimentScore: number;
    sentimentLabel: 'positive' | 'negative' | 'neutral';
    confidence: number;
    emotions: string[];
    reasoning: string;
  } {
    try {
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      return {
        sentimentScore: parsed.sentimentScore || 0,
        sentimentLabel: parsed.sentimentLabel || 'neutral',
        confidence: parsed.confidence || 0.5,
        emotions: parsed.emotions || [],
        reasoning: parsed.reasoning || 'No reasoning provided'
      };
    } catch (error) {
      // Fallback response if parsing fails
      return {
        sentimentScore: 0,
        sentimentLabel: 'neutral',
        confidence: 0.5,
        emotions: ['unknown'],
        reasoning: 'Failed to parse AI response'
      };
    }
  }

  // Normalize sentiment score to -1 to 1 range
  private normalizeSentimentScore(score: unknown): number {
    const num = parseFloat(String(score));
    if (isNaN(num)) return 0;
    return Math.max(-1, Math.min(1, num));
  }

  // Normalize sentiment label
  private normalizeSentimentLabel(
    label: string, 
    score: number
  ): 'positive' | 'negative' | 'neutral' {
    const normalizedLabel = label?.toLowerCase();
    if (normalizedLabel === 'positive' || normalizedLabel === 'negative' || normalizedLabel === 'neutral') {
      return normalizedLabel;
    }
    
    // Fallback based on score
    if (score > 0.1) return 'positive';
    if (score < -0.1) return 'negative';
    return 'neutral';
  }

  // Fallback analysis when API fails
  private fallbackAnalysis(content: string): {
    sentimentScore: number;
    sentimentLabel: 'positive' | 'negative' | 'neutral';
    confidence: number;
    emotions: string[];
    reasoning: string;
  } {
    // Clean and split words for more accurate matching
    const words = content.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);

    let score = 0;
    let sentimentWordCount = 0;

    for (const word of words) {
      if (POSITIVE_WORDS.has(word)) {
        score++;
        sentimentWordCount++;
      } else if (NEGATIVE_WORDS.has(word)) {
        score--;
        sentimentWordCount++;
      }
    }

    const totalWords = words.length;
    if (totalWords === 0) {
      return {
        sentimentScore: 0,
        sentimentLabel: 'neutral',
        confidence: 0.5,
        emotions: [],
        reasoning: 'Fallback analysis: No content to analyze.'
      };
    }

    const sentimentScore = sentimentWordCount === 0 ? 0 : score / sentimentWordCount;
    const normalizedScore = this.normalizeSentimentScore(sentimentScore);
    const sentimentLabel = this.normalizeSentimentLabel('', normalizedScore);
    const confidence = Math.min(0.8, 0.5 + (sentimentWordCount / totalWords));

    return {
      sentimentScore: normalizedScore,
      sentimentLabel,
      confidence,
      emotions: this.detectEmotions(content),
      reasoning: `Fallback analysis: Found ${sentimentWordCount} sentiment-related words.`
    };
  }

  // Detect emotions from content
  private detectEmotions(content: string): string[] {
    const emotions = [];
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('happy') || lowerContent.includes('joy') || lowerContent.includes('excited')) {
      emotions.push('joy');
    }
    if (lowerContent.includes('angry') || lowerContent.includes('furious') || lowerContent.includes('mad')) {
      emotions.push('anger');
    }
    if (lowerContent.includes('sad') || lowerContent.includes('depressed') || lowerContent.includes('disappointed')) {
      emotions.push('sadness');
    }
    if (lowerContent.includes('scared') || lowerContent.includes('afraid') || lowerContent.includes('worried')) {
      emotions.push('fear');
    }
    if (lowerContent.includes('surprised') || lowerContent.includes('shocked') || lowerContent.includes('amazed')) {
      emotions.push('surprise');
    }
    
    return emotions;
  }

  // Generate insights from multiple sentiment analyses
  async generateInsights(
    sentimentData: Array<{
      platform: string;
      sentiment: number;
      content: string;
    }>
  ): Promise<string> {
    const model = this.getRandomFreeModel();
    const prompt = this.buildInsightsPrompt(sentimentData);

    try {
      const result = await callOpenRouterViaBackend({
        model,
        messages: [
          { role: 'system', content: 'You are an expert social media analyst. Generate insights from sentiment data across multiple platforms.' },
          { role: 'user', content: prompt }
        ]
      });
      return result.content || this.generateFallbackInsights(sentimentData);
    } catch (error) {
      console.log('OpenRouter API error for insights, using fallback:', error.message);
      return this.generateFallbackInsights(sentimentData);
    }
  }

  // Build prompt for insights generation
  private buildInsightsPrompt(sentimentData: Array<{
    platform: string;
    sentiment: number;
    content: string;
  }>): string {
    const dataSummary = sentimentData.map(item => 
      `Platform: ${item.platform}, Sentiment: ${item.sentiment.toFixed(2)}, Content: "${item.content.substring(0, 100)}..."`
    ).join('\n');

    return `Analyze this sentiment data across social media platforms and provide insights:

${dataSummary}

Please provide:
1. Overall sentiment trend
2. Platform-specific patterns
3. Key insights and recommendations
4. Potential areas of concern or opportunity

Format your response in a clear, actionable manner.`;
  }

  // Generate fallback insights
  private generateFallbackInsights(sentimentData: Array<{
    platform: string;
    sentiment: number;
    content: string;
  }>): string {
    const avgSentiment = sentimentData.reduce((sum, item) => sum + item.sentiment, 0) / sentimentData.length;
    const positiveCount = sentimentData.filter(item => item.sentiment > 0.1).length;
    const negativeCount = sentimentData.filter(item => item.sentiment < -0.1).length;
    const neutralCount = sentimentData.length - positiveCount - negativeCount;

    let overallTrend = 'neutral';
    if (avgSentiment > 0.2) overallTrend = 'positive';
    else if (avgSentiment < -0.2) overallTrend = 'negative';

    return `📊 Sentiment Analysis Insights

Overall Trend: ${overallTrend.toUpperCase()} (Average: ${avgSentiment.toFixed(2)})
Positive Posts: ${positiveCount}
Negative Posts: ${negativeCount}
Neutral Posts: ${neutralCount}

Platform Breakdown:
${sentimentData.map(item => `- ${item.platform}: ${item.sentiment > 0 ? '😊' : item.sentiment < 0 ? '😞' : '😐'} ${(item.sentiment * 100).toFixed(0)}%`).join('\n')}

Recommendations:
${avgSentiment > 0.3 ? '✅ Strong positive sentiment detected. Consider amplifying successful content.' : 
  avgSentiment < -0.3 ? '⚠️ Negative sentiment detected. Consider addressing concerns and improving engagement.' :
  '📈 Mixed sentiment. Focus on consistent, high-quality content to improve overall sentiment.'}`;
  }
}

// Export singleton instance
export const openRouterAPI = new OpenRouterAPI();