
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MoodProvider } from "@/contexts/MoodContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { GlowFeedProvider } from "@/contexts/GlowFeedContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ServicesPage from "./pages/ServicesPage";
import CutsPage from "./pages/CutsPage";
import BraidsPage from "./pages/BraidsPage";
import NailsPage from "./pages/NailsPage";
import MassagePage from "./pages/MassagePage";
import DreadlocksPage from "./pages/DreadlocksPage";
import ProductsPage from "./pages/ProductsPage";
import FoodPage from "./pages/FoodPage";
import RidesPage from "./pages/RidesPage";
import BookingsPage from "./pages/BookingsPage";
import WalletPage from "./pages/WalletPage";
import GlowFeedPage from "./pages/GlowFeedPage";
import NotFound from "./pages/NotFound";

// Dashboard imports
import ClientDashboard from "./pages/ClientDashboard";
import ArtistDashboard from "./pages/ArtistDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import RiderDashboard from "./pages/RiderDashboard";
import EnhancedClientDashboard from "./pages/EnhancedClientDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MoodProvider>
          <WalletProvider>
            <GlowFeedProvider>
              <TooltipProvider>
                <Toaster />
                <BrowserRouter>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/services/cuts" element={<CutsPage />} />
                    <Route path="/services/braids" element={<BraidsPage />} />
                    <Route path="/services/nails" element={<NailsPage />} />
                    <Route path="/services/massage" element={<MassagePage />} />
                    <Route path="/services/dreadlocks" element={<DreadlocksPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/food" element={<FoodPage />} />
                    <Route path="/glow-feed" element={<GlowFeedPage />} />

                    {/* Role-based dashboard routes */}
                    <Route 
                      path="/dashboard/client" 
                      element={
                        <ProtectedRoute allowedRoles={['client']} requireAuth>
                          <EnhancedClientDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard/artist" 
                      element={
                        <ProtectedRoute allowedRoles={['artist']} requireAuth>
                          <ArtistDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard/business" 
                      element={
                        <ProtectedRoute allowedRoles={['business']} requireAuth>
                          <BusinessDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard/transport" 
                      element={
                        <ProtectedRoute allowedRoles={['transport']} requireAuth>
                          <RiderDashboard />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Protected routes */}
                    <Route 
                      path="/rides" 
                      element={
                        <ProtectedRoute requireAuth>
                          <RidesPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/bookings" 
                      element={
                        <ProtectedRoute requireAuth>
                          <BookingsPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/wallet" 
                      element={
                        <ProtectedRoute requireAuth>
                          <WalletPage />
                        </ProtectedRoute>
                      } 
                    />

                    {/* 404 Catch-all route - MUST be last */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </GlowFeedProvider>
          </WalletProvider>
        </MoodProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
