
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, ChefHat, Flame, Heart } from "lucide-react";

const todaysSpecials = [
  {
    name: "Glow Bowl",
    chef: "Chef Maria Santos",
    description: "Quinoa, avocado, grilled chicken, and superfood mix",
    price: 18,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    rating: 4.9,
    prepTime: "15 min",
    special: true
  },
  {
    name: "Beauty Smoothie",
    chef: "Chef David Kim", 
    description: "Antioxidant-rich berries, collagen peptides, and coconut",
    price: 12,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    rating: 4.7,
    prepTime: "5 min",
    special: true
  }
];

const menuCategories = [
  {
    name: "Healthy Beauty Meals",
    items: 24,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    color: "from-green-500 to-emerald-600"
  },
  {
    name: "Refreshing Drinks",
    items: 18,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158", 
    color: "from-blue-500 to-cyan-600"
  },
  {
    name: "Comfort Classics",
    items: 15,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    color: "from-orange-500 to-red-600"
  },
  {
    name: "Sweet Treats",
    items: 12,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    color: "from-pink-500 to-purple-600"
  }
];

const FoodPage = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1649972904349-6e44c42644a7')] bg-cover bg-center opacity-20"></div>
          
          <div className="relative z-10 container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Grab a Bite
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Nourish your body while you beautify. Fresh, healthy meals and treats during your service.
            </p>
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              <ChefHat className="w-5 h-5 mr-2" />
              View Today's Menu
            </Button>
          </div>
        </section>

        {/* Today's Specials */}
        <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                <Flame className="w-10 h-10 inline-block mr-3 text-orange-500" />
                Today's Chef Specials
              </h2>
              <p className="text-xl text-gray-600">Freshly prepared for your wellness journey</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {todaysSpecials.map((special, index) => (
                <Card key={special.name} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={special.image} 
                      alt={special.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
                      <Flame className="w-3 h-3 mr-1" />
                      Chef's Special
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{special.name}</h3>
                      <span className="text-2xl font-bold text-orange-600">${special.price}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{special.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center space-x-1">
                        <ChefHat className="w-4 h-4" />
                        <span>{special.chef}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{special.rating}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{special.prepTime}</span>
                      </span>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                      Order Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Menu Categories */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">Full Menu</h2>
              <p className="text-xl text-gray-600">Explore our carefully curated selections</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {menuCategories.map((category, index) => (
                <Card 
                  key={category.name} 
                  className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-70`}></div>
                  </div>
                  
                  <CardContent className="p-4 text-center">
                    <h3 className="text-lg font-bold mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.items} items</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Business Owner Upload Section */}
        <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-8 text-gray-900">Restaurant Partners</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our network of wellness-focused eateries. Upload your menu and reach clients during their beauty sessions.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
              <ChefHat className="w-5 h-5 mr-2" />
              Become a Partner Restaurant
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default FoodPage;
