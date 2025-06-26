
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star, Sparkles, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useMood } from "@/contexts/MoodContext";

const products = [
  {
    id: '1',
    name: 'Glow Essence Oil Set',
    seller: 'Natural Beauty Co.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883',
    price: 35,
    originalPrice: 45,
    rating: 4.8,
    reviews: 156,
    category: 'Skincare',
    mood: ['calm', 'private'],
    badge: 'Bestseller',
    inStock: true
  },
  {
    id: '2',
    name: 'Professional Hair Tools Kit',
    seller: 'StylePro Equipment',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e',
    price: 120,
    rating: 4.9,
    reviews: 89,
    category: 'Hair Tools',
    mood: ['fast', 'social'],
    badge: 'Professional',
    inStock: true
  },
  {
    id: '3',
    name: 'Luxury Makeup Palette',
    seller: 'Glow Cosmetics',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
    price: 65,
    originalPrice: 80,
    rating: 4.7,
    reviews: 234,
    category: 'Makeup',
    mood: ['social', 'fast'],
    badge: 'Limited Edition',
    inStock: true
  },
  {
    id: '4',
    name: 'Relaxation Bath Set',
    seller: 'Zen Wellness',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b',
    price: 28,
    rating: 4.6,
    reviews: 92,
    category: 'Wellness',
    mood: ['calm', 'private'],
    badge: 'Organic',
    inStock: false
  },
  {
    id: '5',
    name: 'Hair Extensions - Premium',
    seller: 'Luxe Hair Studio',
    image: 'https://images.unsplash.com/photo-1559599238-1c2e12e2e40a',
    price: 180,
    rating: 4.9,
    reviews: 67,
    category: 'Hair Extensions',
    mood: ['social', 'fast'],
    badge: 'Premium',
    inStock: true
  },
  {
    id: '6',
    name: 'Natural Nail Care Kit',
    seller: 'Pure Nails',
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
    price: 42,
    rating: 4.5,
    reviews: 128,
    category: 'Nail Care',
    mood: ['calm', 'private'],
    badge: 'Eco-Friendly',
    inStock: true
  }
];

export function DeevahShopSection() {
  const { selectedMood } = useMood();

  const filteredProducts = selectedMood 
    ? products.filter(product => product.mood.includes(selectedMood)).slice(0, 4)
    : products.slice(0, 4);

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Deevah Shop
                {selectedMood && (
                  <span className="text-purple-600 ml-2">
                    for {selectedMood} vibes
                  </span>
                )}
              </h2>
            </div>
            <p className="text-gray-600">
              Premium beauty products curated by our expert community
            </p>
          </div>
          <Link to="/products">
            <Button className="hidden md:flex bg-purple-600 hover:bg-purple-700 text-white">
              Shop All
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge className={`${
                    product.badge === 'Bestseller' ? 'bg-orange-500' :
                    product.badge === 'Professional' ? 'bg-blue-500' :
                    product.badge === 'Limited Edition' ? 'bg-red-500' :
                    product.badge === 'Premium' ? 'bg-purple-500' :
                    'bg-green-500'
                  } text-white font-semibold`}>
                    {product.badge}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                </div>
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary" className="bg-white text-black">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                </div>
                
                <p className="text-sm text-gray-500 mb-2">by {product.seller}</p>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-purple-600">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Link to={`/product/${product.id}`}>
                    <Button 
                      variant="outline" 
                      className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      View Details
                    </Button>
                  </Link>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={!product.inStock}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/products">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
              <Sparkles className="w-5 h-5 mr-2" />
              Explore Deevah Shop
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
