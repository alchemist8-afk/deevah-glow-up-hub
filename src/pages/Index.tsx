
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
      <div className="min-h-screen">
        <HeroSection />
        
        {/* Mood Picker Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <MoodPicker />
          </div>
        </section>

        <ServicesCategories />
        <FeaturedArtists />
        <GlowFeed />
        <Testimonials />
        <Footer />
      </div>
    </Layout>
  );
};

export default Index;
