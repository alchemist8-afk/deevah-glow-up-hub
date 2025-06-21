
import { Layout } from "@/components/Layout";

const CutsPage = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <section className="relative bg-gradient-to-br from-gray-700 via-gray-800 to-black text-white py-20">
          <div className="relative z-10 container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Deevah Cuts
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Premium barbershop experience. Expert cuts, styling, and grooming for the modern gentleman.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default CutsPage;
