
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMood } from '@/contexts/MoodContext';
import { useProducts, useCart } from '@/hooks/useProducts';

export function DeevahShopSection() {
  const navigate = useNavigate();
  const { selectedMood } = useMood();
  const { products, isLoading } = useProducts(undefined, selectedMood || undefined);
  const { addToCart } = useCart();

  if (isLoading) {
    return (
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Deevah Shop
            </h2>
            <div className="animate-pulse">Loading products...</div>
          </div>
        </div>
      </section>
    );
  }

  const handleAddToCart = (productId: string) => {
    addToCart.mutate({ productId });
  };

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Deevah Shop
          </h2>
          <p className="text-lg text-gray-600">
            {selectedMood 
              ? `Beauty products perfect for your ${selectedMood} vibe`
              : 'Premium beauty products from trusted sellers'
            }
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products.slice(0, 8).map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                <img 
                  src={product.image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348'} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-purple-600">
                    KSh {product.price.toLocaleString()}
                  </span>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.8</span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => handleAddToCart(product.id)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            onClick={() => navigate('/products')}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Shop All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
