
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star, Heart, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock product data
  const products = [
    {
      id: 1,
      name: "Luxury Hair Oil",
      brand: "Glow Essentials",
      price: 1200,
      originalPrice: 1500,
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6",
      category: "Hair Care",
      inStock: true,
      description: "Nourishing hair oil with natural ingredients"
    },
    {
      id: 2,
      name: "Radiant Face Serum",
      brand: "Beauty Pro",
      price: 2500,
      originalPrice: 3000,
      rating: 4.9,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
      category: "Skincare",
      inStock: true,
      description: "Anti-aging serum with vitamin C"
    },
    {
      id: 3,
      name: "Premium Nail Kit",
      brand: "Nail Studio",
      price: 800,
      originalPrice: 1000,
      rating: 4.7,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371",
      category: "Nail Care",
      inStock: false,
      description: "Complete nail care kit with tools"
    },
    {
      id: 4,
      name: "Moisturizing Body Cream",
      brand: "Skin Love",
      price: 900,
      originalPrice: 1200,
      rating: 4.6,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b",
      category: "Body Care",
      inStock: true,
      description: "Deep moisturizing cream for all skin types"
    }
  ];

  const categories = ["All", "Hair Care", "Skincare", "Nail Care", "Body Care", "Makeup"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Beauty Products</h1>
              <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                Discover premium beauty products curated by our expert artists
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search products or brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-purple-600 hover:bg-purple-700" 
                    : "border-purple-200 text-purple-700 hover:bg-purple-50"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge variant="secondary" className="bg-red-500 text-white">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-700 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  {product.originalPrice > product.price && (
                    <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                      Save KSh {product.originalPrice - product.price}
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs text-purple-600 border-purple-200">
                      {product.category}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                  <p className="text-sm text-gray-500 mb-3">{product.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium ml-1">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-purple-600">KSh {product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">KSh {product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    disabled={!product.inStock}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
