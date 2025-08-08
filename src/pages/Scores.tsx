import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Minus,
  ExternalLink,
  Download,
  RefreshCw,
  Sparkles,
  Star
} from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  platform: string;
  rating: number;
  reviewCount: number;
  price: string;
  url: string;
}

interface SentimentScore {
  productId: string;
  overallScore: number;
  positivePercentage: number;
  negativePercentage: number;
  neutralPercentage: number;
  reviewsAnalyzed: number;
  keyPositives: string[];
  keyNegatives: string[];
  recommendation: string;
}

const Scores = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scores, setScores] = useState<SentimentScore[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const productsData = location.state?.products as Product[] | null;

  useEffect(() => {
    if (!productsData || productsData.length === 0) {
      navigate("/");
      return;
    }

    // Simulate AI sentiment analysis
    const analyzeProducts = async () => {
      setIsAnalyzing(true);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Mock sentiment analysis results
      const mockScores: SentimentScore[] = productsData.map((product, index) => ({
        productId: product.id,
        overallScore: 75 + Math.random() * 20, // 75-95
        positivePercentage: 60 + Math.random() * 25, // 60-85
        negativePercentage: 5 + Math.random() * 15, // 5-20
        neutralPercentage: 10 + Math.random() * 20, // 10-30
        reviewsAnalyzed: Math.floor(product.reviewCount * 0.8),
        keyPositives: [
          "Excellent build quality",
          "Great value for money",
          "Fast delivery",
          "User-friendly interface"
        ].slice(0, 2 + Math.floor(Math.random() * 2)),
        keyNegatives: [
          "Battery life could be better",
          "Packaging issues",
          "Customer service response time"
        ].slice(0, 1 + Math.floor(Math.random() * 2)),
        recommendation: index % 3 === 0 ? "Highly Recommended" : 
                        index % 3 === 1 ? "Recommended" : "Consider Alternatives"
      }));

      setTimeout(() => {
        setAnalysisProgress(100);
        setScores(mockScores);
        setIsAnalyzing(false);
        toast.success("Sentiment analysis completed!");
      }, 3000);
    };

    analyzeProducts();
  }, [productsData, navigate]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-positive";
    if (score >= 60) return "text-neutral";
    return "text-negative";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-positive to-green-400";
    if (score >= 60) return "from-neutral to-yellow-400";
    return "from-negative to-red-400";
  };

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation === "Highly Recommended") return "bg-positive/20 text-positive border-positive/30";
    if (recommendation === "Recommended") return "bg-neutral/20 text-neutral border-neutral/30";
    return "bg-negative/20 text-negative border-negative/30";
  };

  const getSentimentIcon = (score: number) => {
    if (score >= 80) return TrendingUp;
    if (score >= 60) return Minus;
    return TrendingDown;
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="max-w-md w-full sentiment-card">
          <CardContent className="p-8 text-center">
            <div className="relative mb-6">
              <Sparkles className="h-16 w-16 text-primary mx-auto animate-sparkle" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Analyzing Sentiment...</h3>
            <p className="text-muted-foreground mb-6">
              Our AI is processing thousands of reviews to provide accurate sentiment scores
            </p>
            <div className="space-y-3">
              <Progress value={analysisProgress} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {analysisProgress}% Complete
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="relative overflow-hidden bg-animated min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sentiment Analysis Results
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI-powered analysis of {scores.length} product(s) with detailed sentiment insights and recommendations.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-analyze
            </Button>
          </div>

          {/* Scores Grid */}
          <div className="space-y-6">
            {scores.map((score, index) => {
              const product = productsData?.find(p => p.id === score.productId);
              const SentimentIcon = getSentimentIcon(score.overallScore);
              return (
                <Card 
                  key={score.productId} 
                  className="sentiment-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{product?.name}</CardTitle>
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline">{product?.platform}</Badge>
                          <Badge className={getRecommendationColor(score.recommendation)}>
                            {score.recommendation}
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(product?.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Product
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Overall Score */}
                    <div className="text-center">
                      <div className={`text-6xl font-bold bg-gradient-to-r ${getScoreGradient(score.overallScore)} bg-clip-text text-transparent`}>
                        {Math.round(score.overallScore)}
                      </div>
                      <p className="text-sm text-gray-600">Overall Sentiment Score</p>
                    </div>
                    {/* Sentiment Breakdown */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round(score.positivePercentage)}%
                        </div>
                        <p className="text-sm text-gray-600">Positive</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {Math.round(score.neutralPercentage)}%
                        </div>
                        <p className="text-sm text-gray-600">Neutral</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {Math.round(score.negativePercentage)}%
                        </div>
                        <p className="text-sm text-gray-600">Negative</p>
                      </div>
                    </div>
                    {/* Key Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold">Key Positives</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {score.keyPositives.map((positive, idx) => (
                            <Badge key={idx} variant="secondary" className="text-green-700 bg-green-100">
                              {positive}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Key Negatives</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {score.keyNegatives.map((negative, idx) => (
                            <Badge key={idx} variant="secondary" className="text-red-700 bg-red-100">
                              {negative}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Analysis Summary */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <Label className="text-sm font-semibold">Analysis Summary</Label>
                      <p className="text-sm text-gray-600 mt-2">
                        Analyzed {score.reviewsAnalyzed} reviews with {Math.round(score.overallScore)}% overall sentiment score. 
                        {score.recommendation === "Highly Recommended" ? " This product shows excellent customer satisfaction." :
                         score.recommendation === "Recommended" ? " This product shows good customer satisfaction." :
                         " This product shows areas for improvement."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scores;