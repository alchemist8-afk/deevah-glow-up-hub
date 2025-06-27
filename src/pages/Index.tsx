
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
import { WalletCard } from "@/components/WalletCard";
import { CreatePostModal } from "@/components/CreatePostModal";
import { DeevahRidesSection } from "@/components/DeevahRidesSection";
import { useMood } from "@/contexts/MoodContext";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { selectedMood } = useMood();
  const { isAuthenticated, profile } = useAuth();

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

        {/* Quick Actions for Authenticated Users */}
        {isAuthenticated && (
          <section className="py-8 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                <WalletCard />
                <div className="md:col-span-2 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Welcome back, {profile?.full_name}!
                    </h3>
                    <div className="flex gap-4 justify-center flex-wrap">
                      {profile?.user_role === 'artist' && <CreatePostModal />}
                      <a href={`/dashboard/${profile?.user_role}`}>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                          Go to Dashboard
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="bg-gradient-to-b from-white to-gray-50">
          {/* Always show core sections */}
          <ServicesCategories />
          
          {/* Deevah Rides Section - Always visible */}
          <DeevahRidesSection />
          
          {/* Dynamic Content Based on Mood */}
          {selectedMood ? (
            <div className="space-y-8">
              <GrabABiteSection />
              <DeevahShopSection />
              <GlowFeed />
            </div>
          ) : (
            <div className="space-y-8">
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
