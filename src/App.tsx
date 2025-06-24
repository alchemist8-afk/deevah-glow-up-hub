
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/contexts/BookingContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { ReferralProvider } from "@/contexts/ReferralContext";
import { GlowFeedProvider } from "@/contexts/GlowFeedContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ServicesPage from "./pages/ServicesPage";
import ProductsPage from "./pages/ProductsPage";
import FoodPage from "./pages/FoodPage";
import GamesPage from "./pages/GamesPage";
import CutsPage from "./pages/CutsPage";
import AuthPage from "./pages/AuthPage";
import BraidsPage from "./pages/BraidsPage";
import NailsPage from "./pages/NailsPage";
import DreadlocksPage from "./pages/DreadlocksPage";
import MassagePage from "./pages/MassagePage";
import BusinessDashboard from "./pages/BusinessDashboard";
import ArtistDashboard from "./pages/ArtistDashboard";
import TransportDashboard from "./pages/TransportDashboard";
import WalletPage from "./pages/WalletPage";
import ReferralPage from "./pages/ReferralPage";
import GlowFeedPage from "./pages/GlowFeedPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <WalletProvider>
        <ReferralProvider>
          <GlowFeedProvider>
            <BookingProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/food" element={<FoodPage />} />
                    <Route path="/games" element={<GamesPage />} />
                    <Route path="/cuts" element={<CutsPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/braids" element={<BraidsPage />} />
                    <Route path="/nails" element={<NailsPage />} />
                    <Route path="/dreadlocks" element={<DreadlocksPage />} />
                    <Route path="/massage" element={<MassagePage />} />
                    <Route path="/glow-feed" element={<GlowFeedPage />} />
                    
                    {/* Protected Routes */}
                    <Route 
                      path="/wallet" 
                      element={
                        <ProtectedRoute>
                          <WalletPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/referrals" 
                      element={
                        <ProtectedRoute>
                          <ReferralPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/business" 
                      element={
                        <ProtectedRoute allowedRoles={['business']}>
                          <BusinessDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/artist-dashboard" 
                      element={
                        <ProtectedRoute allowedRoles={['artist']}>
                          <ArtistDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/transport-dashboard" 
                      element={
                        <ProtectedRoute allowedRoles={['transport']}>
                          <TransportDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </BookingProvider>
          </GlowFeedProvider>
        </ReferralProvider>
      </WalletProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
