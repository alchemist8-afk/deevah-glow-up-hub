
import { Layout } from "@/components/Layout";

const MassagePage = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <section className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white py-20">
          <div className="relative z-10 container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Massage Therapy
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Relax and rejuvenate with therapeutic massage services. Wellness for body and mind.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default MassagePage;
