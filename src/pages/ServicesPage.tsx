
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Clock, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const serviceCategories = [
  {
    name: "Braids & Protective Styles",
    url: "/braids",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    description: "Expert braiding services from traditional to contemporary styles",
    providers: 45,
    avgRating: 4.8,
    startingPrice: 80,
    color: "from-amber-500 to-orange-600"
  },
  {
    name: "Nail Art & Manicures",
    url: "/nails",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    description: "Creative nail designs and professional manicure services",
    providers: 32,
    avgRating: 4.9,
    startingPrice: 35,
    color: "from-pink-500 to-rose-600"
  },
  {
    name: "Dreadlocks & Locs",
    url: "/dreadlocks",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    description: "Professional dreadlock installation and maintenance",
    providers: 28,
    avgRating: 4.7,
    startingPrice: 120,
    color: "from-green-500 to-emerald-600"
  },
  {
    name: "Massage Therapy",
    url: "/massage",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    description: "Relaxing therapeutic and wellness massage services",
    providers: 38,
    avgRating: 4.8,
    startingPrice: 90,
    color: "from-blue-500 to-indigo-600"
  }
];

const ServicesPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Beauty Services
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover expert beauticians and specialized services in your area. Each category is a world of its own.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {serviceCategories.map((category, index) => (
              <Card 
                key={category.name}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80`}></div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{category.avgRating}</span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Sparkles className="w-4 h-4" />
                        <span>{category.providers} providers</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>From ${category.startingPrice}</span>
                      </span>
                    </div>
                  </div>
                  
                  <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    <Link to={category.url}>
                      Explore {category.name}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServicesPage;
