
import { Layout } from "@/components/Layout";

const DreadlocksPage = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <section className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white py-20">
          <div className="relative z-10 container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Dreadlocks & Locs
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Professional loc installation, maintenance, and styling. Embrace your natural journey.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default DreadlocksPage;
