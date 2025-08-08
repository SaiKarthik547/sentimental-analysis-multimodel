import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext";
import Navigation from "./components/layout/Navigation";
import Home from "./pages/Home";
import SocialMedia from "./pages/SocialMedia";
import Products from "./pages/Products";
import Scores from "./pages/Scores";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

// Import environment utilities to validate configuration
import "./lib/envUtils";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/social-media" element={<SocialMedia />} />
            <Route path="/products" element={<Products />} />
            <Route path="/scores" element={<Scores />} />
            <Route path="/history" element={<History />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
