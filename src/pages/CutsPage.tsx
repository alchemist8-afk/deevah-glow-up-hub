import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/BookingModal";
import { Star, Clock, MapPin, Scissors, TrendingUp, Crown, Zap } from "lucide-react";
import { useState } from "react";

const trendingStyles = [
  {
    id: '1',
    name: 'Fresh Fade',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1',
    bookings: 89,
    trend: '+15%'
  },
  {
    id: '2',
    name: 'Classic Pompadour',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    bookings: 76,
    trend: '+8%'
  },
  {
    id: '3',
    name: 'Modern Quiff',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    bookings: 63,
    trend: '+12%'
  }
];

const featuredBarbers = [
  {
    id: 'barber1',
    name: 'Marcus "The Blade" Johnson',
    specialties: ['Fades', 'Beard Sculpting', 'Classic Cuts'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    rating: 4.9,
    reviews: 234,
    location: 'Downtown Studio',
    experience: '8 years',
    price: 45,
    status: 'Available Today'
  },
  {
    id: 'barber2',
    name: 'Tony "Precision" Martinez',
    specialties: ['Hot Towel Shaves', 'Mustache Styling', 'Line-ups'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    rating: 4.8,
    reviews: 189,
    location: 'Westside Barbershop',
    experience: '12 years',
    price: 55,
    status: 'Booking Tomorrow'
  },
  {
    id: 'barber3',
    name: 'Andre "The Artist" Williams',
    specialties: ['Design Cuts', 'Hair Tattoos', 'Afro Styling'],
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1',
    rating: 4.9,
    reviews: 156,
    location: 'Uptown Cuts',
    experience: '6 years',
    price: 50,
    status: 'Available Now'
  }
];

const popularServices = [
  {
    id: 'service1',
    name: 'Signature Fade + Beard Trim',
    provider: 'Marcus Johnson',
    providerId: 'barber1',
    price: 65,
    duration: 45, // Changed from "45 min" to 45
    description: 'Complete grooming experience with precision fade and beard sculpting',
    category: 'Cuts'
  },
  {
    id: 'service2',
    name: 'Classic Hot Towel Shave',
    provider: 'Tony Martinez',
    providerId: 'barber2',
    price: 40,
    duration: 30, // Changed from "30 min" to 30
    description: 'Traditional barbershop experience with hot towel and straight razor',
    category: 'Cuts'
  },
  {
    id: 'service3',
    name: 'Design Cut + Line-up',
    provider: 'Andre Williams',
    providerId: 'barber3',
    price: 70,
    duration: 60, // Changed from "1 hour" to 60
    description: 'Custom hair design with sharp line-up and styling',
    category: 'Cuts'
  }
];

const CutsPage = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1')] bg-cover bg-center opacity-20"></div>
          
          <div className="relative z-10 container mx-auto px-6 text-center">
            <div className="flex items-center justify-center mb-6">
              <Scissors className="w-12 h-12 mr-4 text-yellow-500" />
              <h1 className="text-5xl md:text-7xl font-bold">
                Deevah Cuts
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Where legends are made. Premium barbering for the modern gentleman.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400">
                <Crown className="w-5 h-5 mr-2" />
                Book Master Barber
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                <TrendingUp className="w-5 h-5 mr-2" />
                View Trending Styles
              </Button>
            </div>
          </div>
        </section>

        {/* Trending Styles */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                <TrendingUp className="w-10 h-10 inline-block mr-3 text-yellow-500" />
                Trending This Week
              </h2>
              <p className="text-xl text-gray-600">The cuts everyone's talking about</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {trendingStyles.map((style, index) => (
                <Card key={style.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={style.image} 
                      alt={style.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 right-4 bg-yellow-500 text-black">
                      #{index + 1} Trending
                    </Badge>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2">
                        <p className="font-bold">{style.bookings} bookings</p>
                        <p className="text-sm text-green-400">{style.trend} this week</p>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-2">{style.name}</h3>
                    <Button className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900">
                      Request This Style
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Master Barbers */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                <Crown className="w-10 h-10 inline-block mr-3 text-yellow-500" />
                Master Barbers
              </h2>
              <p className="text-xl text-gray-600">Legends behind the chair</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {featuredBarbers.map((barber) => (
                <Card key={barber.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={barber.image} 
                      alt={barber.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge 
                      className={`absolute top-4 left-4 ${
                        barber.status === 'Available Now' ? 'bg-green-500' : 
                        barber.status === 'Available Today' ? 'bg-yellow-500 text-black' : 
                        'bg-orange-500'
                      }`}
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      {barber.status}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{barber.name}</h3>
                      <span className="text-2xl font-bold text-yellow-600">${barber.price}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                        {barber.rating} ({barber.reviews})
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {barber.location}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">{barber.experience} experience</p>
                      <div className="flex flex-wrap gap-1">
                        {barber.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <BookingModal service={{
                      id: `barber-${barber.id}`,
                      name: `Session with ${barber.name}`,
                      price: barber.price,
                      category: 'Cuts'
                    }}>
                      <Button className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900">
                        Book {barber.name}
                      </Button>
                    </BookingModal>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Services */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">Popular Services</h2>
              <p className="text-xl text-gray-600">Signature experiences crafted by masters</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {popularServices.map((service) => (
                <Card key={service.id} className="hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold">{service.name}</h3>
                      <span className="text-xl font-bold text-yellow-600">${service.price}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span>by {service.provider}</span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.duration}
                      </span>
                    </div>
                    
                    <BookingModal service={service}>
                      <Button className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900">
                        Book Service
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

export default CutsPage;
