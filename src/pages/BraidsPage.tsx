
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, Heart, User, Award } from "lucide-react";

const featuredArtists = [
  {
    id: 1,
    name: "Maya Johnson",
    specialties: ["Box Braids", "Cornrows", "Protective Styles"],
    rating: 4.9,
    reviews: 127,
    price: "From $80",
    location: "Downtown",
    availability: "Available Today",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b1c5",
    verified: true
  },
  {
    id: 2,
    name: "Zara Williams",
    specialties: ["Goddess Braids", "Feed-in Braids", "Knotless Braids"],
    rating: 4.8,
    reviews: 89,
    price: "From $120",
    location: "Uptown",
    availability: "Next Available: Tomorrow",
    image: "https://images.unsplash.com/photo-1664575602276-acd073f104c1",
    verified: true
  },
  {
    id: 3,
    name: "Keisha Brown",
    specialties: ["Tribal Braids", "Fulani Braids", "Micro Braids"],
    rating: 4.7,
    reviews: 156,
    price: "From $95",
    location: "Midtown",
    availability: "Available This Week",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    verified: true
  }
];

const braidStyles = [
  {
    name: "Box Braids",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    duration: "4-6 hours",
    priceRange: "$80-$150",
    popularity: "Most Popular"
  },
  {
    name: "Knotless Braids",
    image: "https://images.unsplash.com/photo-1594736797933-d0c6dbcf912a",
    duration: "5-7 hours",
    priceRange: "$120-$200",
    popularity: "Trending"
  },
  {
    name: "Cornrows",
    image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179",
    duration: "2-4 hours",
    priceRange: "$60-$100",
    popularity: "Classic"
  },
  {
    name: "Goddess Braids",
    image: "https://images.unsplash.com/photo-1618367163421-69eb96406e26",
    duration: "3-5 hours",
    priceRange: "$90-$140",
    popularity: "Elegant"
  }
];

const customerReviews = [
  {
    name: "Sarah M.",
    rating: 5,
    review: "Maya did an amazing job on my box braids! They lasted 8 weeks and looked flawless.",
    service: "Box Braids",
    date: "2 days ago"
  },
  {
    name: "Angela D.",
    rating: 5,
    review: "Best knotless braids I've ever had. Zara is incredibly skilled and professional.",
    service: "Knotless Braids", 
    date: "1 week ago"
  }
];

const BraidsPage = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Braids & Protective Styles
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Master braiders creating beautiful, protective styles that celebrate your natural beauty and heritage.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                <User className="w-5 h-5 mr-2" />
                Find Your Braider
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                <Award className="w-5 h-5 mr-2" />
                View Styles
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-12">
          {/* Featured Braid Styles */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Popular Braid Styles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {braidStyles.map((style, index) => (
                <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={style.image} 
                      alt={style.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-orange-500 text-white">{style.popularity}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold mb-2">{style.name}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{style.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-green-600">{style.priceRange}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                      Book This Style
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Featured Artists */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Master Braiders</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArtists.map((artist) => (
                <Card key={artist.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={artist.image} 
                      alt={artist.name}
                      className="w-full h-48 object-cover"
                    />
                    {artist.verified && (
                      <div className="absolute top-4 right-4 bg-blue-500 text-white rounded-full p-2">
                        <Award className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold">{artist.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{artist.rating}</span>
                        <span className="text-sm text-gray-500">({artist.reviews})</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {artist.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{artist.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-green-600">{artist.availability}</span>
                        </div>
                        <div className="font-semibold text-lg text-orange-600">{artist.price}</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                        Book Now
                      </Button>
                      <Button variant="outline" size="icon">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Customer Reviews */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">What Our Clients Say</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {customerReviews.map((review, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">{review.name}</h4>
                      <p className="text-sm text-gray-600">{review.service} • {review.date}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{review.review}"</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready for Your Perfect Braids?</h2>
            <p className="text-xl mb-6">Join thousands of satisfied clients who trust our master braiders</p>
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Start Your Booking Journey
            </Button>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default BraidsPage;
