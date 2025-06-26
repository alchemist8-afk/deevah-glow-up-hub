
import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/HeroSection";
import { MoodPicker } from "@/components/MoodPicker";
import { ServicesCategories } from "@/components/ServicesCategories";
import { FeaturedArtists } from "@/components/FeaturedArtists";
import { GlowFeed } from "@/components/GlowFeed";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { GrabABiteSection } from "@/components/GrabABiteSection";
import { TrendingCutsSection } from "@/components/TrendingCutsSection";
import { DeevahShopSection } from "@/components/DeevahShopSection";
import { PastGlowsSection } from "@/components/PastGlowsSection";
import { useMood } from "@/contexts/MoodContext";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { selectedMood } = useMood();
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <HeroSection />
        
        {/* Mood Picker Section */}
        <section className="py-12 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                What's your vibe today?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Let us personalize your beauty journey based on how you're feeling
              </p>
            </div>
            <MoodPicker />
          </div>
        </section>

        <div className="bg-gradient-to-b from-white to-gray-50">
          {/* Dynamic Content Based on Mood */}
          {selectedMood ? (
            <div className="space-y-8">
              <ServicesCategories />
              <GrabABiteSection />
              <DeevahShopSection />
            </div>
          ) : (
            <div className="space-y-8">
              <ServicesCategories />
              <TrendingCutsSection />
              <GrabABiteSection />
              <DeevahShopSection />
              {isAuthenticated && <PastGlowsSection />}
              <FeaturedArtists />
              <GlowFeed />
            </div>
          )}
          
          <Testimonials />
        </div>
        
        <Footer />
      </div>
    </Layout>
  );
};

export default Index;
