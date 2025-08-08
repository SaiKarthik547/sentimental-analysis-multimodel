import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar,
  ExternalLink,
  Search,
  Filter,
  BarChart3,
  Clock,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  RefreshCw,
  History as HistoryIcon
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface HistoryItem {
  id: string;
  productName: string;
  platform: string;
  sentimentScore: number;
  recommendation: string;
  analyzedAt: Date;
  productUrl: string;
  reviewsAnalyzed: number;
  positivePercentage: number;
  negativePercentage: number;
}

const History = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock history data - in real implementation, this would come from the database
    const mockHistory: HistoryItem[] = [
      {
        id: "1",
        productName: "iPhone 15 Pro - Premium Model",
        platform: "Amazon",
        sentimentScore: 87,
        recommendation: "Highly Recommended",
        analyzedAt: new Date(2024, 0, 25),
        productUrl: "https://amazon.com/product/1",
        reviewsAnalyzed: 12340,
        positivePercentage: 78,
        negativePercentage: 12
      },
      {
        id: "2",
        productName: "Samsung Galaxy S24 - Standard Edition",
        platform: "Flipkart",
        sentimentScore: 73,
        recommendation: "Recommended",
        analyzedAt: new Date(2024, 0, 23),
        productUrl: "https://flipkart.com/product/2",
        reviewsAnalyzed: 8900,
        positivePercentage: 68,
        negativePercentage: 18
      },
      {
        id: "3",
        productName: "MacBook Pro M3 - Pro Version",
        platform: "Amazon",
        sentimentScore: 91,
        recommendation: "Highly Recommended",
        analyzedAt: new Date(2024, 0, 20),
        productUrl: "https://amazon.com/product/3",
        reviewsAnalyzed: 15670,
        positivePercentage: 85,
        negativePercentage: 8
      },
      {
        id: "4",
        productName: "Sony WH-1000XM5 Headphones",
        platform: "JioMart",
        sentimentScore: 82,
        recommendation: "Highly Recommended",
        analyzedAt: new Date(2024, 0, 18),
        productUrl: "https://jiomart.com/product/4",
        reviewsAnalyzed: 7250,
        positivePercentage: 76,
        negativePercentage: 14
      },
      {
        id: "5",
        productName: "Dell XPS 13 Laptop",
        platform: "Flipkart",
        sentimentScore: 65,
        recommendation: "Consider Alternatives",
        analyzedAt: new Date(2024, 0, 15),
        productUrl: "https://flipkart.com/product/5",
        reviewsAnalyzed: 4320,
        positivePercentage: 58,
        negativePercentage: 28
      }
    ];

    setTimeout(() => {
      setHistoryItems(mockHistory);
      setFilteredItems(mockHistory);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = historyItems;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by platform
    if (filterPlatform !== "all") {
      filtered = filtered.filter(item =>
        item.platform.toLowerCase() === filterPlatform.toLowerCase()
      );
    }

    setFilteredItems(filtered);
  }, [searchTerm, filterPlatform, historyItems]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-positive";
    if (score >= 60) return "text-neutral";
    return "text-negative";
  };

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation === "Highly Recommended") return "bg-positive/20 text-positive border-positive/30";
    if (recommendation === "Recommended") return "bg-neutral/20 text-neutral border-neutral/30";
    return "bg-negative/20 text-negative border-negative/30";
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      "Amazon": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "Flipkart": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "JioMart": "bg-purple-500/20 text-purple-400 border-purple-500/30"
    };
    return colors[platform as keyof typeof colors] || "bg-gray-500/20 text-gray-400";
  };

  const getSentimentIcon = (score: number) => {
    if (score >= 80) return TrendingUp;
    if (score >= 60) return Minus;
    return TrendingDown;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16">
        <div className="relative overflow-hidden bg-animated min-h-screen flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="relative text-center">
            <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Loading History...</h3>
            <p className="text-muted-foreground">
              Fetching your analysis history
            </p>
          </div>
        </div>
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
              Analysis History
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your past sentiment analysis results and product evaluations with detailed insights.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export History
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-md text-sm"
            >
              <option value="all">All Platforms</option>
              <option value="amazon">Amazon</option>
              <option value="flipkart">Flipkart</option>
              <option value="jiomart">JioMart</option>
            </select>
          </div>

          {/* History Items */}
          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <Card className="sentiment-card">
                <CardContent className="p-8 text-center">
                  <HistoryIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Analysis History</h3>
                  <p className="text-muted-foreground mb-4">
                    Start analyzing products to see your history here
                  </p>
                  <Button onClick={() => navigate("/products")}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analyze Products
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredItems.map((item, index) => {
                const SentimentIcon = getSentimentIcon(item.sentimentScore);
                
                return (
                  <Card 
                    key={item.id} 
                    className="sentiment-card animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{item.productName}</CardTitle>
                          <div className="flex items-center space-x-4">
                            <Badge className={getPlatformColor(item.platform)}>
                              {item.platform}
                            </Badge>
                            <Badge className={getRecommendationColor(item.recommendation)}>
                              {item.recommendation}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(item.productUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Product
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Sentiment Score */}
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getScoreColor(item.sentimentScore)}`}>
                          {Math.round(item.sentimentScore)}
                        </div>
                        <p className="text-sm text-gray-600">Sentiment Score</p>
                      </div>

                      {/* Sentiment Breakdown */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {Math.round(item.positivePercentage)}%
                          </div>
                          <p className="text-xs text-gray-600">Positive</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-600">
                            {Math.round(100 - item.positivePercentage - item.negativePercentage)}%
                          </div>
                          <p className="text-xs text-gray-600">Neutral</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">
                            {Math.round(item.negativePercentage)}%
                          </div>
                          <p className="text-xs text-gray-600">Negative</p>
                        </div>
                      </div>

                      {/* Analysis Details */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Reviews Analyzed: {item.reviewsAnalyzed}</span>
                        <span>{item.analyzedAt.toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;