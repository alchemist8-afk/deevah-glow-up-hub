
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { MoodProvider } from "@/contexts/MoodContext";
import { BookingProvider } from "@/contexts/BookingContext";
import { GlowFeedProvider } from "@/contexts/GlowFeedContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/NotFound";

// Service Pages
import ServicesPage from "@/pages/ServicesPage";
import BraidsPage from "@/pages/BraidsPage";
import DreadlocksPage from "@/pages/DreadlocksPage";
import NailsPage from "@/pages/NailsPage";
import MassagePage from "@/pages/MassagePage";
import CutsPage from "@/pages/CutsPage";

// Feature Pages
import GlowFeedPage from "@/pages/GlowFeedPage";
import ProductsPage from "@/pages/ProductsPage";
import FoodPage from "@/pages/FoodPage";
import RestaurantPage from "@/pages/RestaurantPage";
import WalletPage from "@/pages/WalletPage";
import ReferralPage from "@/pages/ReferralPage";
import RidesPage from "@/pages/RidesPage";

// Dashboard Pages
import ClientDashboard from "@/pages/ClientDashboard";
import ArtistDashboard from "@/pages/ArtistDashboard";
import BusinessDashboard from "@/pages/BusinessDashboard";
import TransportDashboard from "@/pages/TransportDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MoodProvider>
          <BookingProvider>
            <GlowFeedProvider>
              <WalletProvider>
                <Router>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<AuthPage />} />
                    
                    {/* Service Routes */}
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/services/braids" element={<BraidsPage />} />
                    <Route path="/services/dreadlocks" element={<DreadlocksPage />} />
                    <Route path="/services/nails" element={<NailsPage />} />
                    <Route path="/services/massage" element={<MassagePage />} />
                    <Route path="/services/cuts" element={<CutsPage />} />
                    
                    {/* Feature Routes */}
                    <Route path="/glow-feed" element={<GlowFeedPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/food" element={<FoodPage />} />
                    <Route path="/restaurants/:id" element={<RestaurantPage />} />
                    
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
                      path="/rides" 
                      element={
                        <ProtectedRoute>
                          <RidesPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/bookings" 
                      element={
                        <ProtectedRoute>
                          <RidesPage />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Dashboard Routes */}
                    <Route 
                      path="/dashboard/client" 
                      element={
                        <ProtectedRoute allowedRoles={['client']}>
                          <ClientDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard/artist" 
                      element={
                        <ProtectedRoute allowedRoles={['artist']}>
                          <ArtistDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard/business" 
                      element={
                        <ProtectedRoute allowedRoles={['business']}>
                          <BusinessDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard/transport" 
                      element={
                        <ProtectedRoute allowedRoles={['transport']}>
                          <TransportDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  
                  <Toaster />
                  <HotToaster />
                </Router>
              </WalletProvider>
            </GlowFeedProvider>
          </BookingProvider>
        </MoodProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
