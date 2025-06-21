
import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/HeroSection";
import { ServicesCategories } from "@/components/ServicesCategories";
import { FeaturedArtists } from "@/components/FeaturedArtists";
import { DeevahCuts } from "@/components/DeevahCuts";
import { GlowFeed } from "@/components/GlowFeed";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <HeroSection />
        <ServicesCategories />
        <FeaturedArtists />
        <DeevahCuts />
        <GlowFeed />
        <Testimonials />
        <Footer />
      </div>
    </Layout>
  );
};

export default Index;
