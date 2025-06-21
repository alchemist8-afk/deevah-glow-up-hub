
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/contexts/BookingContext";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
              
              {/* Protected Routes */}
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
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </BookingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
