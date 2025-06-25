import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/BookingModal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, Star, Heart, Search, Filter, TrendingUp, Package } from "lucide-react";
import { useState } from "react";

const featuredProducts = [
  {
    id: 'prod1',
    name: 'Premium Argan Hair Oil',
    brand: 'Deevah Essentials',
    providerId: 'business1',
    price: 28,
    originalPrice: 35,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b',
    rating: 4.8,
    reviews: 124,
    category: 'Hair Care',
    inStock: true,
    featured: true
  },
  {
    id: 'prod2',
    name: 'Hydrating Face Mask Set',
    brand: 'Glow Beauty Co.',
    providerId: 'business2',
    price: 22,
    originalPrice: 28,
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273',
    rating: 4.9,
    reviews: 89,
    category: 'Skincare',
    inStock: true,
    featured: true
  },
  {
    id: 'prod3',
    name: 'Luxury Nail Care Kit',
    brand: 'Nail Perfection',
    providerId: 'business3',
    price: 45,
    originalPrice: 60,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371',
    rating: 4.7,
    reviews: 156,
    category: 'Nails',
    inStock: true,
    featured: true
  }
];

const allProducts = [
  ...featuredProducts,
  {
    id: 'prod4',
    name: 'Curl Defining Cream',
    brand: 'Natural Curls',
    providerId: 'business1',
    price: 18,
    image: 'https://images.unsplash.com/photo-1556228578-dd5dd4066de9',
    rating: 4.6,
    reviews: 67,
    category: 'Hair Care',
    inStock: true,
    featured: false
  },
  {
    id: 'prod5',
    name: 'Vitamin C Serum',
    brand: 'Radiant Skin',
    providerId: 'business2',
    price: 32,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be',
    rating: 4.8,
    reviews: 203,
    category: 'Skincare',
    inStock: false,
    featured: false
  },
  {
    id: 'prod6',
    name: 'Professional Makeup Brushes',
    brand: 'Pro Beauty Tools',
    providerId: 'business4',
    price: 75,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796',
    rating: 4.9,
    reviews: 145,
    category: 'Makeup',
    inStock: true,
    featured: false
  }
];

const categories = ['All', 'Hair Care', 'Skincare', 'Makeup', 'Nails', 'Tools'];

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return b.featured ? 1 : -1;
    }
  });

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 container mx-auto px-6 text-center">
            <div className="flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 mr-4 text-yellow-300" />
              <h1 className="text-5xl md:text-7xl font-bold">
                Beauty Products
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Premium beauty products from trusted brands. Everything you need for your beauty routine.
            </p>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Package className="w-5 h-5 mr-2" />
              Shop Featured
            </Button>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                <TrendingUp className="w-10 h-10 inline-block mr-3 text-purple-600" />
                Featured Products
              </h2>
              <p className="text-xl text-gray-600">Handpicked favorites from our community</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-purple-600">
                      Featured
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    {product.originalPrice && (
                      <Badge className="absolute bottom-4 left-4 bg-red-500">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-2">
                      <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">by {product.brand}</p>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm ml-1">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-purple-600">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                      <Badge className={product.inStock ? 'bg-green-500' : 'bg-red-500'}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                    
                    <BookingModal service={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      category: product.category
                    }}>
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        disabled={!product.inStock}
                      >
                        {product.inStock ? 'Add to Cart' : 'Notify When Available'}
                      </Button>
                    </BookingModal>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* All Products */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">All Products</h2>
              <p className="text-gray-600">{sortedProducts.length} products found</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {product.featured && (
                      <Badge className="absolute top-2 left-2 bg-purple-600 text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                    </div>
                    
                    <h3 className="font-semibold mb-1 text-sm">{product.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">by {product.brand}</p>
                    
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs">{product.rating}</span>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-purple-600">${product.price}</span>
                      {!product.inStock && (
                        <Badge variant="secondary" className="text-xs">Out of Stock</Badge>
                      )}
                    </div>
                    
                    <BookingModal service={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      category: product.category
                    }}>
                      <Button 
                        size="sm" 
                        className="w-full"
                        disabled={!product.inStock}
                      >
                        {product.inStock ? 'Add to Cart' : 'Notify Me'}
                      </Button>
                    </BookingModal>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProductsPage;
