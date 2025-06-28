
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/BookingModal";
import { Star, Clock, MapPin, Heart, User, Award, Sparkles, Palette } from "lucide-react";
import { useState } from "react";

const nailArtists = [
  {
    id: 'nails1',
    name: 'Priscilla Nails',
    specialties: ['Gel Extensions', 'Nail Art', 'French Manicure'],
    image: 'https://images.unsplash.com/photo-1604902396830-aca29e19b067',
    rating: 4.9,
    reviews: 234,
    location: 'Westlands',
    experience: '5 years',
    price: 35,
    status: 'Available Now',
    mood: ['fast', 'social']
  },
  {
    id: 'nails2',
    name: 'Crystal Nail Studio',
    specialties: ['Acrylic Nails', '3D Art', 'Ombre Design'],
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53',
    rating: 4.8,
    reviews: 189,
    location: 'Karen',
    experience: '7 years',
    price: 50,
    status: 'Available Today',
    mood: ['social', 'fast']
  },
  {
    id: 'nails3',
    name: 'Elegant Touch',
    specialties: ['Classic Manicure', 'Pedicure', 'Nail Care'],
    image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc',
    rating: 4.7,
    reviews: 156,
    location: 'Kilimani',
    experience: '4 years',
    price: 30,
    status: 'Booking Tomorrow',
    mood: ['calm', 'private']
  }
];

const nailServices = [
  {
    id: 'nail-service1',
    name: 'Gel Manicure & Art',
    provider: 'Priscilla Nails',
    providerId: 'nails1',
    price: 45,
    duration: 60, // Changed from "60 min" to 60
    description: 'Long-lasting gel manicure with custom nail art design',
    category: 'Nails'
  },
  {
    id: 'nail-service2',
    name: 'Acrylic Extensions',
    provider: 'Crystal Nail Studio',
    providerId: 'nails2',
    price: 65,
    duration: 90, // Changed from "90 min" to 90
    description: 'Full set acrylic extensions with shape and length of choice',
    category: 'Nails'
  },
  {
    id: 'nail-service3',
    name: 'Luxury Spa Pedicure',
    provider: 'Elegant Touch',
    providerId: 'nails3',
    price: 40,
    duration: 45, // Changed from "45 min" to 45
    description: 'Complete pedicure with exfoliation, massage, and polish',
    category: 'Nails'
  }
];

const NailsPage = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  const moodOptions = [
    { id: 'fast', label: '⚡ Fast', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'social', label: '💃 Social', color: 'bg-pink-100 text-pink-800' },
    { id: 'calm', label: '🌿 Calm', color: 'bg-green-100 text-green-800' },
    { id: 'private', label: '🤫 Private', color: 'bg-purple-100 text-purple-800' }
  ];

  const filteredArtists = selectedMood 
    ? nailArtists.filter(artist => artist.mood.includes(selectedMood))
    : nailArtists;

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 container mx-auto px-6 text-center">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-12 h-12 mr-4 text-yellow-300" />
              <h1 className="text-5xl md:text-7xl font-bold">
                Nail Art & Manicures
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Creative nail designs and professional manicure services by certified nail artists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
                <Palette className="w-5 h-5 mr-2" />
                Find Nail Artist
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600">
                <Award className="w-5 h-5 mr-2" />
                View Gallery
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-12">
          {/* Mood Filter */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Vibe</h2>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button 
                variant={selectedMood === null ? "default" : "outline"}
                onClick={() => setSelectedMood(null)}
                className="rounded-full"
              >
                All Moods
              </Button>
              {moodOptions.map((mood) => (
                <Button
                  key={mood.id}
                  variant={selectedMood === mood.id ? "default" : "outline"}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`rounded-full ${selectedMood === mood.id ? mood.color : ''}`}
                >
                  {mood.label}
                </Button>
              ))}
            </div>
          </section>

          {/* Featured Nail Artists */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Expert Nail Artists</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {filteredArtists.map((artist) => (
                <Card key={artist.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={artist.image} 
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge 
                      className={`absolute top-4 left-4 ${
                        artist.status === 'Available Now' ? 'bg-green-500' : 
                        artist.status === 'Available Today' ? 'bg-yellow-500 text-black' : 
                        'bg-orange-500'
                      }`}
                    >
                      {artist.status}
                    </Badge>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">{artist.rating}</span>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{artist.name}</h3>
                      <span className="text-2xl font-bold text-pink-600">KSh {artist.price}+</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                        {artist.rating} ({artist.reviews})
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {artist.location}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">{artist.experience} experience</p>
                      <div className="flex flex-wrap gap-1">
                        {artist.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <BookingModal service={{
                        id: `artist-${artist.id}`,
                        name: `Session with ${artist.name}`,
                        price: artist.price,
                        category: 'Nails'
                      }}>
                        <Button className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                          Book Appointment
                        </Button>
                      </BookingModal>
                      <Button variant="outline" size="icon">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Popular Services */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Popular Nail Services</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {nailServices.map((service) => (
                <Card key={service.id} className="hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold">{service.name}</h3>
                      <span className="text-xl font-bold text-pink-600">KSh {service.price}</span>
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
                      <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                        Book Service
                      </Button>
                    </BookingModal>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Nail Art Gallery Preview */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Recent Nail Art</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'https://images.unsplash.com/photo-1604902396830-aca29e19b067',
                'https://images.unsplash.com/photo-1632345031435-8727f6897d53',
                'https://images.unsplash.com/photo-1610992015732-2449b76344bc',
                'https://images.unsplash.com/photo-1619734703914-1b8c1e0b9b5a'
              ].map((img, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg group cursor-pointer">
                  <img 
                    src={img} 
                    alt={`Nail art ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready for Perfect Nails?</h2>
            <p className="text-xl mb-6">Book your nail appointment today and express your style</p>
            <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Your Nail Journey
            </Button>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default NailsPage;
