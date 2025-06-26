
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { BookingProvider } from "@/contexts/BookingContext";
import { MoodProvider } from "@/contexts/MoodContext";
import { GlowFeedProvider } from "@/contexts/GlowFeedContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import ServicesPage from "./pages/ServicesPage";
import ProductsPage from "./pages/ProductsPage";
import BraidsPage from "./pages/BraidsPage";
import DreadlocksPage from "./pages/DreadlocksPage";
import MassagePage from "./pages/MassagePage";
import NailsPage from "./pages/NailsPage";
import CutsPage from "./pages/CutsPage";
import FoodPage from "./pages/FoodPage";
import WalletPage from "./pages/WalletPage";
import ArtistDashboard from "./pages/ArtistDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import TransportDashboard from "./pages/TransportDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <WalletProvider>
          <BookingProvider>
            <MoodProvider>
              <GlowFeedProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/braids" element={<BraidsPage />} />
                    <Route path="/dreadlocks" element={<DreadlocksPage />} />
                    <Route path="/massage" element={<MassagePage />} />
                    <Route path="/nails" element={<NailsPage />} />
                    <Route path="/cuts" element={<CutsPage />} />
                    <Route path="/food" element={<FoodPage />} />
                    
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
                </TooltipProvider>
              </GlowFeedProvider>
            </MoodProvider>
          </BookingProvider>
        </WalletProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
