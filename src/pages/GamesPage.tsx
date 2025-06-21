
import { Layout } from "@/components/Layout";

const GamesPage = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <section className="relative bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 text-white py-20">
          <div className="relative z-10 container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Game Night
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Fun activities, challenges, and games while you wait. Turn your beauty session into an experience.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default GamesPage;
