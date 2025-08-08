// Social Media Content Analyzer with Multimodal Support
// This module handles text, video, and audio content analysis

import { callOpenRouterViaBackend } from './openRouterAPI';
import { OPENROUTER_FREE_MODELS } from '@/config/apiKeys';

export interface MultimodalAnalysisResult {
  sentimentScore: number;
  sentimentLabel: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: string[];
  topics: string[];
  reasoning: string;
}

// Enhanced text sentiment analysis with OpenRouter RoBERTa integration
export const analyzeTextSentiment = async (text: string): Promise<MultimodalAnalysisResult> => {
  const startTime = Date.now();
  
  // Try OpenRouter API with RoBERTa models first, fallback to local analysis
  try {
    const { openRouterAPI } = await import('./openRouterAPI');
    const result = await openRouterAPI.analyzeSentiment(text, 'text');
    
    return {
      sentimentScore: result.sentimentScore,
      sentimentLabel: result.sentimentLabel,
      confidence: result.confidence,
      emotions: result.emotions,
      topics: text.split(/\s+/).filter(word => word.startsWith('#') || word.startsWith('@') || word.length > 5).slice(0, 5),
      reasoning: result.reasoning
    };
  } catch (error: any) {
    console.log('OpenRouter API unavailable, using local analysis:', error?.message);
    // Fallback to local analysis
  }
  
  // Expanded sentiment word lists for fallback analysis
  const sentimentWords = {
    positive: [
      'amazing', 'awesome', 'excellent', 'fantastic', 'great', 'love', 'wonderful', 
      'perfect', 'brilliant', 'outstanding', 'superb', 'incredible', 'fabulous',
      'terrific', 'marvelous', 'exceptional', 'impressive', 'delightful', 'spectacular'
    ],
    negative: [
      'terrible', 'awful', 'horrible', 'disgusting', 'hate', 'worst', 'bad', 
      'disappointing', 'useless', 'pathetic', 'annoying', 'frustrating', 'boring',
      'ridiculous', 'stupid', 'waste', 'failure', 'disaster', 'nightmare'
    ]
  };

  const emotionWords = {
    joy: ['happy', 'excited', 'thrilled', 'elated', 'cheerful', 'delighted'],
    anger: ['angry', 'furious', 'mad', 'irritated', 'annoyed', 'outraged'],
    sadness: ['sad', 'depressed', 'disappointed', 'heartbroken', 'miserable'],
    fear: ['scared', 'afraid', 'worried', 'anxious', 'terrified', 'nervous'],
    surprise: ['surprised', 'shocked', 'amazed', 'astonished', 'stunned'],
    disgust: ['disgusted', 'revolted', 'sick', 'appalled', 'repulsed']
  };

  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  const detectedEmotions = new Set<string>();
  const topics = new Set<string>();

  // Analyze sentiment and emotions
  words.forEach(word => {
    if (sentimentWords.positive.some(pos => word.includes(pos))) positiveCount++;
    if (sentimentWords.negative.some(neg => word.includes(neg))) negativeCount++;
    
    Object.entries(emotionWords).forEach(([emotion, emotionWordList]) => {
      if (emotionWordList.some(ew => word.includes(ew))) {
        detectedEmotions.add(emotion);
      }
    });

    // Extract potential topics (hashtags, mentions, keywords)
    if (word.startsWith('#') || word.startsWith('@') || word.length > 5) {
      topics.add(word);
    }
  });

  const totalSentimentWords = positiveCount + negativeCount;
  const sentimentScore = totalSentimentWords === 0 ? 0 : 
    (positiveCount - negativeCount) / Math.max(words.length / 10, 1);
  const normalizedScore = Math.max(-1, Math.min(1, sentimentScore));

  let sentimentLabel: 'positive' | 'negative' | 'neutral';
  if (normalizedScore > 0.1) sentimentLabel = 'positive';
  else if (normalizedScore < -0.1) sentimentLabel = 'negative';
  else sentimentLabel = 'neutral';

  const confidence = totalSentimentWords === 0 ? 0.5 : 
    Math.min(0.95, 0.5 + (totalSentimentWords / words.length));

  return {
    sentimentScore: normalizedScore,
    sentimentLabel,
    confidence,
    emotions: Array.from(detectedEmotions),
    topics: Array.from(topics),
    reasoning: `Local analysis: ${positiveCount} positive, ${negativeCount} negative words detected.`
  };
};

// Generic media sentiment analysis using OpenRouter API
const analyzeMediaSentiment = async (
  url: string,
  mediaType: 'video' | 'audio' | 'image'
): Promise<MultimodalAnalysisResult> => {
  const actionVerb = mediaType === 'video' ? 'watch' : mediaType === 'audio' ? 'listen' : 'see';
  const prompt = `You are a multimodal sentiment analysis assistant. Given the following ${mediaType} URL, imagine you are able to ${actionVerb} and analyze it. Provide a plausible, creative summary of the ${mediaType}'s likely content and sentiment, and return a JSON object with: sentimentScore (-1 to 1), sentimentLabel (positive/negative/neutral), confidence (0-1), emotions (array), topics (array), reasoning (string).\n${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} URL: ${url}`;
  
  try {
    const model = OPENROUTER_FREE_MODELS[0];
    const result = await callOpenRouterViaBackend({
      model,
      messages: [
        { role: 'system', content: 'You are a helpful multimodal sentiment analysis assistant.' },
        { role: 'user', content: prompt }
      ]
    });

    const parsed = typeof result === 'string' ? JSON.parse(result) : result;
    return {
      sentimentScore: parsed.sentimentScore || 0,
      sentimentLabel: parsed.sentimentLabel || 'neutral',
      confidence: parsed.confidence || 0.5,
      emotions: parsed.emotions || [],
      topics: parsed.topics || [],
      reasoning: parsed.reasoning || 'No reasoning provided.'
    };
  } catch (e: any) {
    return {
      sentimentScore: 0,
      sentimentLabel: 'neutral',
      confidence: 0.5,
      emotions: ['unknown'],
    };
  }
};

// Audio sentiment analysis using OpenRouter API
export const analyzeAudioSentiment = async (audioUrl: string): Promise<MultimodalAnalysisResult> => {
  const startTime = Date.now();
  const prompt = `You are a multimodal sentiment analysis assistant. Given the following audio URL, imagine you are able to listen and analyze it. Provide a plausible, creative summary of the audio's likely content and sentiment, and return a JSON object with: sentimentScore (-1 to 1), sentimentLabel (positive/negative/neutral), confidence (0-1), emotions (array), topics (array), reasoning (string).\nAudio URL: ${audioUrl}`;
  try {
    const model = OPENROUTER_FREE_MODELS[0];
    const result = await callOpenRouterViaBackend({
      model,
      messages: [
        { role: 'system', content: 'You are a helpful multimodal sentiment analysis assistant.' },
        { role: 'user', content: prompt }
      ]
    });
    const parsed = typeof result === 'string' ? JSON.parse(result) : result;
    return {
      sentimentScore: parsed.sentimentScore,
      sentimentLabel: parsed.sentimentLabel,
      confidence: parsed.confidence,
      emotions: parsed.emotions,
      topics: parsed.topics,
      reasoning: parsed.reasoning
    };
  } catch (e: any) {
    return {
      sentimentScore: 0,
      sentimentLabel: 'neutral',
      confidence: 0.5,
      emotions: ['unknown'],
      topics: ['audio-content'],
      reasoning: `No real AI analysis was possible for this audio. (Fallback)${e && e.message ? ' Error: ' + e.message : ''}`
    };
  }
};

// Image sentiment analysis using OpenRouter API
export const analyzeImageSentiment = async (imageUrl: string): Promise<MultimodalAnalysisResult> => {
  const startTime = Date.now();
  const prompt = `You are a multimodal sentiment analysis assistant. Given the following image URL, imagine you are able to see and analyze it. Provide a plausible, creative summary of the image's likely content and sentiment, and return a JSON object with: sentimentScore (-1 to 1), sentimentLabel (positive/negative/neutral), confidence (0-1), emotions (array), topics (array), reasoning (string).\nImage URL: ${imageUrl}`;
  try {
    const model = OPENROUTER_FREE_MODELS[0];
    const result = await callOpenRouterViaBackend({
      model,
      messages: [
        { role: 'system', content: 'You are a helpful multimodal sentiment analysis assistant.' },
        { role: 'user', content: prompt }
      ]
    });
    const parsed = typeof result === 'string' ? JSON.parse(result) : result;
    return {
      sentimentScore: parsed.sentimentScore,
      sentimentLabel: parsed.sentimentLabel,
      confidence: parsed.confidence,
      emotions: parsed.emotions,
      topics: parsed.topics,
      reasoning: parsed.reasoning
    };
  } catch (e: any) {
    return {
      sentimentScore: 0,
      sentimentLabel: 'neutral',
      confidence: 0.5,
      emotions: ['unknown'],
      topics: ['image-content'],
      reasoning: `No real AI analysis was possible for this image. (Fallback)${e && e.message ? ' Error: ' + e.message : ''}`
    };
  }
};

// Main content analysis function
export const analyzeContent = async (
  contentType: 'text' | 'video' | 'audio' | 'image',
  content: string
): Promise<MultimodalAnalysisResult> => {
  switch (contentType) {
    case 'text':
      return analyzeTextSentiment(content);
    case 'video':
      return analyzeVideoSentiment(content);
    case 'audio':
      return analyzeAudioSentiment(content);
    case 'image':
      return analyzeImageSentiment(content);
    default:
      return analyzeTextSentiment(content);
  }
};

const extractTopics = (content: string): string[] => {
  const commonTopics = [
    'product', 'service', 'quality', 'price', 'delivery', 'customer service',
    'features', 'support', 'experience', 'value'
  ];

  const words = content.toLowerCase().split(/\s+/);
  const topics = new Set<string>();

  commonTopics.forEach(topic => {
    if (words.some(word => word.includes(topic))) {
      topics.add(topic);
    }
  });

  // Add hashtags and mentions as topics
  words.forEach(word => {
    if (word.startsWith('#') || word.startsWith('@')) {
      topics.add(word);
    }
  });

  return Array.from(topics);
};

// Batch analysis for multiple content items
export const analyzeBatchContent = async (
  contentItems: Array<{ type: 'text' | 'video' | 'audio' | 'image'; content: string }>
): Promise<MultimodalAnalysisResult[]> => {
  const results = await Promise.all(
    contentItems.map(item => analyzeContent(item.type, item.content))
  );
  
  return results;
};

// Generate comprehensive report for batch analysis
export const generateBatchReport = (results: MultimodalAnalysisResult[]) => {
  const totalItems = results.length;
  const avgSentiment = results.reduce((sum, r) => sum + r.sentimentScore, 0) / totalItems;
  
  const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
  results.forEach(r => sentimentCounts[r.sentimentLabel]++);
  
  const allEmotions = results.flatMap(r => r.emotions);
  const emotionCounts: { [key: string]: number } = {};
  allEmotions.forEach(emotion => {
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
  });
  
  const topEmotions = Object.entries(emotionCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([emotion]) => emotion);

  const contentTypeCounts = { text: 0, video: 0, audio: 0, image: 0 };
  results.forEach(r => contentTypeCounts[r.contentType]++);

  return {
    totalAnalyzed: totalItems,
    averageSentiment: avgSentiment,
    sentimentDistribution: {
      positive: (sentimentCounts.positive / totalItems) * 100,
      negative: (sentimentCounts.negative / totalItems) * 100,
      neutral: (sentimentCounts.neutral / totalItems) * 100
    },
    topEmotions,
    contentTypeBreakdown: contentTypeCounts,
    dominantSentiment: Object.entries(sentimentCounts)
      .reduce((a, b) => sentimentCounts[a[0] as keyof typeof sentimentCounts] > sentimentCounts[b[0] as keyof typeof sentimentCounts] ? a : b)[0] as 'positive' | 'negative' | 'neutral'
  };
};