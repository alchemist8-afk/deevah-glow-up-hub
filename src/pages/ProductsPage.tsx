
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Star, Search, Filter } from 'lucide-react';
import { useProducts, useCart } from '@/hooks/useProducts';
import { useMood } from '@/contexts/MoodContext';
import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
  const navigate = useNavigate();
  const { selectedMood } = useMood();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { products, isLoading } = useProducts(
    selectedCategory || undefined, 
    selectedMood || undefined
  );
  const { addToCart, cartItems } = useCart();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ['Skincare', 'Haircare', 'Makeup', 'Tools', 'Accessories'];

  const handleAddToCart = (productId: string) => {
    addToCart.mutate({ productId });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              <div className="animate-pulse">Loading products...</div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Deevah Shop
              </h1>
              <p className="text-xl mb-8">
                {selectedMood 
                  ? `${filteredProducts.length} products for your ${selectedMood} mood`
                  : 'Premium beauty products from trusted sellers'
                }
              </p>
              {cartItems.length > 0 && (
                <Button 
                  onClick={() => navigate('/cart')}
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  View Cart ({cartItems.length})
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No products found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-xl transition-all duration-300">
                    <div className="aspect-square relative overflow-hidden rounded-t-lg">
                      <img 
                        src={product.image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348'} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 text-gray-900">
                          <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                          4.8
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        by {product.profiles?.full_name || 'Deevah Seller'}
                      </p>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-purple-600">
                          KSh {product.price.toLocaleString()}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addToCart.isPending}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProductsPage;
