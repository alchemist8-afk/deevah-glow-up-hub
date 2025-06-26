
import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/HeroSection";
import { MoodPicker } from "@/components/MoodPicker";
import { ServicesCategories } from "@/components/ServicesCategories";
import { FeaturedArtists } from "@/components/FeaturedArtists";
import { GlowFeed } from "@/components/GlowFeed";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <HeroSection />
        
        {/* Mood Picker Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
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
          <ServicesCategories />
          <FeaturedArtists />
          <GlowFeed />
          <Testimonials />
        </div>
        
        <Footer />
      </div>
    </Layout>
  );
};

export default Index;
