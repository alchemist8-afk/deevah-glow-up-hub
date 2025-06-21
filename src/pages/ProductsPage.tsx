
import { Layout } from "@/components/Layout";

const ProductsPage = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <section className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white py-20">
          <div className="relative z-10 container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Beauty Products
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Premium beauty products from trusted brands. Everything you need for your beauty routine.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProductsPage;
