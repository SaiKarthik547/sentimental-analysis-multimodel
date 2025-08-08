import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { analyzeContent, type MultimodalAnalysisResult } from '@/lib/socialMediaAnalyzer';
import { contentStorage, sentimentStorage } from '@/lib/localStorage';
import { useAuth } from '@/components/auth/AuthContext';
import { SOCIAL_PLATFORMS } from '@/config/apiKeys';
import { Twitter, MessageSquare, Facebook, Instagram, Linkedin, Youtube, Play, Mic, Image, FileText, Loader2, BarChart3, Sparkles } from 'lucide-react';

const SocialMedia = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MultimodalAnalysisResult | null>(null);
  
  const [formData, setFormData] = useState({
    platform: '',
    contentType: 'text',
    contentText: '',
    contentUrl: '',
    author: ''
  });

  const platformIcons = {
    twitter: <Twitter className="w-4 h-4" />,
    reddit: <MessageSquare className="w-4 h-4" />,
    facebook: <Facebook className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
    youtube: <Youtube className="w-4 h-4" />
  };

  const contentTypeIcons = {
    text: <FileText className="w-4 h-4" />,
    video: <Play className="w-4 h-4" />,
    audio: <Mic className="w-4 h-4" />,
    image: <Image className="w-4 h-4" />
  };

  const handleAnalyze = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to analyze content.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.platform || 
        (formData.contentType === 'text' && !formData.contentText) ||
        (formData.contentType !== 'text' && !formData.contentUrl)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Save content to storage
      const savedContent = contentStorage.saveContent({
        userId: user.id,
        platform: formData.platform as any,
        contentType: formData.contentType as any,
        contentText: formData.contentText,
        contentUrl: formData.contentUrl,
        author: formData.author || 'Anonymous',
        postDate: new Date().toISOString(),
        likesCount: Math.floor(Math.random() * 1000),
        sharesCount: Math.floor(Math.random() * 100),
        commentsCount: Math.floor(Math.random() * 50)
      });

      // Analyze sentiment
      const result = await analyzeContent(
        formData.contentType as any,
        formData.contentText || formData.contentUrl
      );

      // Save analysis result
      const savedResult = sentimentStorage.saveResult({
        contentId: savedContent.id,
        userId: user.id,
        sentimentScore: result.sentimentScore,
        sentimentLabel: result.sentimentLabel,
        confidenceScore: result.confidence,
        positivePercentage: result.sentimentScore > 0 ? (result.sentimentScore + 1) * 50 : 0,
        negativePercentage: result.sentimentScore < 0 ? Math.abs(result.sentimentScore) * 100 : 0,
        neutralPercentage: Math.abs(result.sentimentScore) < 0.1 ? 90 : 10,
        keyEmotions: result.emotions,
        analysisSummary: result.summary,
        aiModelUsed: 'Social Media Analyzer v1.0',
        processingTimeMs: result.processingTime
      });

      setAnalysis(result);
      
      toast({
        title: "Analysis Complete",
        description: `Sentiment: ${result.sentimentLabel} (${Math.round(result.sentimentScore * 100)}%)`,
      });

    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="relative overflow-hidden bg-animated min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Social Media Sentiment Analysis
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Analyze sentiment from social media posts across multiple platforms and content types using advanced AI models.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="sentiment-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Content Input
                </CardTitle>
                <CardDescription>
                  Enter social media content for sentiment analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="platform">Social Media Platform</Label>
                  <Select value={formData.platform} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, platform: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {SOCIAL_PLATFORMS.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          <div className="flex items-center gap-2">
                            {platformIcons[platform]}
                            <span className="capitalize">{platform}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select value={formData.contentType} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, contentType: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">
                        <div className="flex items-center gap-2">
                          {contentTypeIcons.text}
                          Text Post
                        </div>
                      </SelectItem>
                      <SelectItem value="video">
                        <div className="flex items-center gap-2">
                          {contentTypeIcons.video}
                          Video Content
                        </div>
                      </SelectItem>
                      <SelectItem value="audio">
                        <div className="flex items-center gap-2">
                          {contentTypeIcons.audio}
                          Audio Content
                        </div>
                      </SelectItem>
                      <SelectItem value="image">
                        <div className="flex items-center gap-2">
                          {contentTypeIcons.image}
                          Image Content
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="author">Author (Optional)</Label>
                  <Input
                    id="author"
                    placeholder="@username or display name"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  />
                </div>

                {formData.contentType === 'text' ? (
                  <div>
                    <Label htmlFor="contentText">Content Text</Label>
                    <Textarea
                      id="contentText"
                      placeholder="Enter the social media post content..."
                      value={formData.contentText}
                      onChange={(e) => setFormData(prev => ({ ...prev, contentText: e.target.value }))}
                      rows={4}
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="contentUrl">Content URL</Label>
                    <Input
                      id="contentUrl"
                      placeholder="Enter URL to the content..."
                      value={formData.contentUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, contentUrl: e.target.value }))}
                    />
                  </div>
                )}

                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <BarChart3 className="w-4 h-4 mr-2" />
                  )}
                  {isAnalyzing ? "Analyzing..." : "Analyze Sentiment"}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {analysis && (
                <Card className="sentiment-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Sentiment Score */}
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">
                        <span className={getSentimentColor(analysis.sentimentLabel)}>
                          {Math.round((analysis.sentimentScore + 1) * 50)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Sentiment Score: {analysis.sentimentScore.toFixed(2)}
                      </p>
                    </div>

                    {/* Sentiment Label */}
                    <div className="text-center">
                      <Badge 
                        variant={analysis.sentimentLabel === 'positive' ? 'default' : 
                                analysis.sentimentLabel === 'negative' ? 'destructive' : 'secondary'}
                        className="text-lg px-4 py-2"
                      >
                        {analysis.sentimentLabel.charAt(0).toUpperCase() + analysis.sentimentLabel.slice(1)}
                      </Badge>
                    </div>

                    {/* Confidence */}
                    <div className="space-y-2">
                      <Label>Confidence</Label>
                      <Progress value={analysis.confidence * 100} className="h-3" />
                      <p className="text-sm text-gray-600">
                        {Math.round(analysis.confidence * 100)}% confident
                      </p>
                    </div>

                    {/* Emotions */}
                    {analysis.emotions.length > 0 && (
                      <div>
                        <Label>Detected Emotions</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {analysis.emotions.map((emotion, index) => (
                            <Badge key={index} variant="outline">
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    <div>
                      <Label>Analysis Summary</Label>
                      <p className="text-sm text-gray-600 mt-2">
                        {analysis.summary}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Demo Content */}
              {!analysis && (
                <Card className="sentiment-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Try These Examples
                    </CardTitle>
                    <CardDescription>
                      Click on any example to analyze its sentiment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      "Just got the new iPhone and I'm absolutely loving it! The camera quality is amazing and the battery life is incredible. Best purchase ever! 😍",
                      "This restaurant was terrible. Food was cold, service was slow, and the prices were ridiculous. Never going back again.",
                      "The new movie was okay. Not great, not bad. Some good scenes but overall pretty average."
                    ].map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full text-left justify-start h-auto p-3"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            contentText: example,
                            contentType: 'text'
                          }));
                        }}
                      >
                        <div className="text-sm line-clamp-2">{example}</div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;