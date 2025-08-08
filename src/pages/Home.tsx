import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  TrendingUp, 
  Shield, 
  Zap, 
  ArrowRight,
  Sparkles,
  BarChart3,
  Users,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Home = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!productName.trim()) {
      toast.error("Please enter content to analyze");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      navigate("/social-media", { 
        state: { 
          contentText: productName, 
          contentDescription: productDescription 
        } 
      });
      toast.success("Analyzing social media content...");
    }, 1500);
  };

  const features = [
    {
      icon: Search,
      title: "Multimodal Analysis",
      description: "Analyze text, video, audio, and image content across social media platforms"
    },
    {
      icon: BarChart3,
      title: "AI Sentiment Analysis",
      description: "Advanced AI models analyze social media content to provide accurate sentiment scores"
    },
    {
      icon: Shield,
      title: "Real-time Insights",
      description: "Get instant sentiment analysis across Twitter, Reddit, Facebook, Instagram, LinkedIn, and YouTube"
    },
    {
      icon: Zap,
      title: "Smart Processing",
      description: "Leverage OpenRouter's free AI models for professional-grade sentiment analysis"
    }
  ];

  const stats = [
    { label: "Posts Analyzed", value: "50K+", icon: Star },
    { label: "Happy Users", value: "10K+", icon: Users },
    { label: "Accuracy Rate", value: "98%", icon: TrendingUp },
    { label: "Platforms", value: "6+", icon: Search }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-animated py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="text-glow">Discover</span>
                <br />
                <span className="text-foreground">Social Media Sentiment</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
                Harness the power of AI to analyze social media content and understand sentiment patterns across platforms
              </p>
            </div>

            {/* Search Form */}
            <Card className="max-w-2xl mx-auto sentiment-card animate-slide-in-left">
              <CardHeader>
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <span>Start Your Analysis</span>
                </CardTitle>
                <CardDescription>
                  Enter social media content to begin sentiment analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="content-text">Social Media Content *</Label>
                  <Input
                    id="content-text"
                    placeholder="e.g., Tweet text, Reddit post, Facebook comment..."
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="bg-input/50 border-border/50 focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content-description">
                    Additional Context (Optional)
                  </Label>
                  <Textarea
                    id="content-description"
                    placeholder="Add context about the post, platform, or additional information..."
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="bg-input/50 border-border/50 focus:border-primary transition-colors"
                    rows={4}
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="btn-hero w-full"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Analyze Social Media Sentiment
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose SentiView?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI-powered sentiment analysis for social media content understanding
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="product-card bg-card/50 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4">
                    <feature.icon className="h-12 w-12 text-primary mx-auto animate-float" />
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center animate-slide-in-right"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative mb-4">
                  <stat.icon className="h-8 w-8 text-primary mx-auto" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Analyze Social Media?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who trust SentiView for their social media sentiment analysis
          </p>
          <Button 
            onClick={() => navigate("/social-media")}
            className="btn-hero"
          >
            Start Analyzing Now
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;