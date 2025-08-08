import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Star, 
  ShoppingCart, 
  ExternalLink, 
  TrendingUp,
  Filter,
  Check,
  Loader2,
  BarChart3,
  Search,
  Package,
  DollarSign,
  Users,
  ShoppingBag,
  Store,
  Globe
} from "lucide-react";
import { toast } from "sonner";
import { ecommerceAPI, type ProductInfo, type ProductReview } from "@/lib/ecommerceAPI";
import { ECOMMERCE_PLATFORMS, type EcommercePlatform } from "@/config/apiKeys";

interface ProductAnalysis {
  product: ProductInfo;
  reviews: ProductReview[];
  sentimentAnalysis: {
    averageSentiment: number;
    sentimentDistribution: { positive: number; negative: number; neutral: number };
    topEmotions: string[];
    summary: string;
  };
}

const Products = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<EcommercePlatform | 'all'>('all');
  const [analysisResults, setAnalysisResults] = useState<ProductAnalysis[]>([]);

  const platformIcons = {
    amazon: <Globe className="w-4 h-4" />,
    flipkart: <ShoppingBag className="w-4 h-4" />,
    jiomart: <Store className="w-4 h-4" />
  };

  const platformColors = {
    amazon: 'bg-orange-100 text-orange-800 border-orange-200',
    flipkart: 'bg-blue-100 text-blue-800 border-blue-200',
    jiomart: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a product name to search");
      return;
    }

    setIsSearching(true);
    setIsLoading(true);

    try {
      const platform = selectedPlatform === 'all' ? undefined : selectedPlatform;
      const searchResults = await ecommerceAPI.searchProducts(searchQuery, platform);
      
      const allProducts: ProductInfo[] = [];
      searchResults.forEach(result => {
        allProducts.push(...result.products);
      });

      setProducts(allProducts);
      
      if (allProducts.length === 0) {
        toast.info("No products found. Try a different search term.");
      } else {
        toast.success(`Found ${allProducts.length} products across ${searchResults.length} platforms`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Failed to search products. Please try again.");
    } finally {
      setIsSearching(false);
      setIsLoading(false);
    }
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAnalyzeSelected = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product to analyze");
      return;
    }

    setIsLoading(true);
    const results: ProductAnalysis[] = [];

    try {
      for (const productId of selectedProducts) {
        const product = products.find(p => p.id === productId);
        if (!product) continue;

        const reviews = await ecommerceAPI.getProductReviews(productId, product.platform);
        const sentimentAnalysis = await ecommerceAPI.analyzeReviewsSentiment(reviews);

        results.push({
          product,
          reviews,
          sentimentAnalysis
        });
      }

      setAnalysisResults(results);
      toast.success(`Analysis completed for ${results.length} products`);
      
      // Navigate to scores page with analysis results
      navigate("/scores", { 
        state: { 
          analysisResults: results,
          analysisType: 'product_reviews'
        } 
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Failed to analyze products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformColor = (platform: EcommercePlatform) => {
    return platformColors[platform] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
      <Star
        key={i}
          className={`w-4 h-4 ${
            i <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
      );
    }
    return stars;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="relative overflow-hidden bg-animated min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Product Review Sentiment Analysis
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Analyze customer reviews and sentiment across Amazon, Flipkart, and JioMart to understand product perception and customer satisfaction.
            </p>
          </div>

          {/* Search Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Products
              </CardTitle>
              <CardDescription>
                Search for products across multiple e-commerce platforms to analyze their reviews and sentiment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Product Name</Label>
                  <Input
                    id="search"
                    placeholder="Enter product name (e.g., smartphone, headphones, cookies)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="sm:w-48">
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={selectedPlatform} onValueChange={(value) => setSelectedPlatform(value as EcommercePlatform | 'all')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="amazon">Amazon</SelectItem>
                      <SelectItem value="flipkart">Flipkart</SelectItem>
                      <SelectItem value="jiomart">JioMart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:w-32">
                  <Label>&nbsp;</Label>
                  <Button 
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="w-full"
                  >
                    {isSearching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
        {products.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Search Results ({products.length} products)</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProducts([])}
                    >
                      Clear Selection
                    </Button>
                    <Button
                      onClick={handleAnalyzeSelected}
                      disabled={selectedProducts.length === 0 || isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <BarChart3 className="w-4 h-4 mr-2" />
                      )}
                      Analyze Selected ({selectedProducts.length})
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="relative hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {platformIcons[product.platform]}
                      <Badge className={getPlatformColor(product.platform)}>
                              {product.platform.charAt(0).toUpperCase() + product.platform.slice(1)}
                      </Badge>
                          </div>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleProductSelect(product.id)}
                      />
                    </div>
                        <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                  </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {renderStars(product.rating)}
                            </div>
                            <span className="text-sm text-gray-600">
                              ({product.reviewCount.toLocaleString()} reviews)
                            </span>
                    </div>

                          <div className="flex items-center justify-between">
                    <div>
                              <span className="text-2xl font-bold text-green-600">
                                {formatPrice(product.price)}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  {formatPrice(product.originalPrice)}
                        </span>
                              )}
                      </div>
                            <Badge 
                              variant={product.availability === 'in_stock' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {product.availability.replace('_', ' ')}
                            </Badge>
                    </div>

                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>{product.brand}</span>
                            <span>{product.category}</span>
                    </div>

                          <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                              onClick={() => window.open(product.productUrl, '_blank')}
                      >
                              <ExternalLink className="w-4 h-4 mr-2" />
                        View Product
                      </Button>
                          </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
              </CardContent>
            </Card>
          )}

          {/* Demo Products Section */}
          {products.length === 0 && !isSearching && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trending Products
                </CardTitle>
                <CardDescription>
                  Try searching for these popular products to see sentiment analysis in action.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold">Electronics</h3>
                    <p className="text-sm text-gray-600">Smartphones, headphones, TVs</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold">Fashion</h3>
                    <p className="text-sm text-gray-600">Shoes, clothing, accessories</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Store className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold">Grocery</h3>
                    <p className="text-sm text-gray-600">Food items, beverages, snacks</p>
                  </div>
          </div>
              </CardContent>
            </Card>
        )}
        </div>
      </div>
    </div>
  );
};

export default Products;