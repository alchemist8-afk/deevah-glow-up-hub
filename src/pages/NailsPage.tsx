
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, Heart, Sparkles, Palette } from "lucide-react";

const NailsPage = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <section className="relative bg-gradient-to-br from-pink-500 via-rose-500 to-purple-500 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Nail Art & Manicures
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Express yourself with stunning nail designs. From classic elegance to bold artistic statements.
            </p>
            <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
              <Palette className="w-5 h-5 mr-2" />
              Book Your Design
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default NailsPage;
