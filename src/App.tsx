
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
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
          <Route path="/business" element={<BusinessDashboard />} />
          <Route path="/artist-dashboard" element={<ArtistDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
