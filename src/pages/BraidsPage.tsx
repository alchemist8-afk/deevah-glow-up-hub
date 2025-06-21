
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, Heart, Share2, Filter, Sparkles } from "lucide-react";

const braidStyles = [
  {
    name: "Box Braids",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    duration: "4-6 hours",
    price: "$120-180",
    trending: true
  },
  {
    name: "Goddess Braids",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    duration: "3-4 hours", 
    price: "$100-150",
    trending: false
  },
  {
    name: "Cornrows",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    duration: "2-3 hours",
    price: "$80-120",
    trending: true
  }
];

const featuredArtists = [
  {
    name: "Zara Williams",
    specialty: "Box Braids & Protective Styles",
    rating: 4.9,
    reviews: 156,
    location: "Downtown",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    verified: true,
    featured: true
  },
  {
    name: "Amara Johnson",
    specialty: "Natural Hair & Cornrows",
    rating: 4.8,
    reviews: 89,
    location: "Midtown",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    verified: true,
    featured: false
  }
];

const BraidsPage = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1649972904349-6e44c42644a7')] bg-cover bg-center opacity-20"></div>
          
          <div className="relative z-10 container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Braids & Protective Styles
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              From classic box braids to intricate goddess styles, discover expert braiders who celebrate and protect your natural beauty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                Book Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Filter className="w-5 h-5 mr-2" />
                Filter Styles
              </Button>
            </div>
          </div>
        </section>

        {/* Popular Styles */}
        <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">Popular Braid Styles</h2>
              <p className="text-xl text-gray-600">Trending styles that protect and beautify</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {braidStyles.map((style, index) => (
                <Card key={style.name} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={style.image} 
                      alt={style.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {style.trending && (
                      <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{style.name}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{style.duration}</span>
                      </span>
                      <span className="font-semibold text-orange-600">{style.price}</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                      Book This Style
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Artists */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">Master Braiders</h2>
              <p className="text-xl text-gray-600">Verified experts in protective styling</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {featuredArtists.map((artist, index) => (
                <Card key={artist.name} className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img 
                        src={artist.image} 
                        alt={artist.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      {artist.featured && (
                        <Badge className="absolute -top-2 -right-2 bg-gold text-white text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-bold">{artist.name}</h3>
                        {artist.verified && (
                          <Badge variant="secondary" className="text-xs">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-2">{artist.specialty}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{artist.rating} ({artist.reviews} reviews)</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{artist.location}</span>
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                          Book Now
                        </Button>
                        <Button variant="outline" size="sm">
                          View Portfolio
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Care Tips Section */}
        <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-8 text-gray-900">Braid Care Tips</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Gentle Cleansing</h3>
                <p className="text-gray-600">Use diluted shampoo and focus on your scalp to keep braids fresh.</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Moisture is Key</h3>
                <p className="text-gray-600">Keep your scalp and hair moisturized with light oils and leave-in conditioners.</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Protection at Night</h3>
                <p className="text-gray-600">Sleep with a silk scarf or pillowcase to reduce friction and frizz.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default BraidsPage;
