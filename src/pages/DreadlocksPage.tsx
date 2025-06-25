
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/BookingModal";
import { Star, Clock, MapPin, Heart, User, Award, Sparkles, Users } from "lucide-react";
import { useState } from "react";

const dreadlockArtists = [
  {
    id: 'locs1',
    name: 'Marcus Loc Master',
    specialties: ['Starter Locs', 'Loc Maintenance', 'Loc Retwist'],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    rating: 4.9,
    reviews: 167,
    location: 'Eastlands',
    experience: '12 years',
    price: 120,
    status: 'Available Now',
    mood: ['calm', 'social']
  },
  {
    id: 'locs2',
    name: 'Sister Locks Studio',
    specialties: ['Sister Locks', 'Microlocks', 'Loc Extensions'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    rating: 4.8,
    reviews: 134,
    location: 'Westlands',
    experience: '8 years',
    price: 150,
    status: 'Available Today',
    mood: ['calm', 'private']
  },
  {
    id: 'locs3',
    name: 'Natural Crown Locs',
    specialties: ['Freeform Locs', 'Comb Twist', 'Loc Styling'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    rating: 4.7,
    reviews: 198,
    location: 'Karen',
    experience: '10 years',
    price: 100,
    status: 'Booking Tomorrow',
    mood: ['calm', 'social']
  }
];

const dreadlockServices = [
  {
    id: 'loc-service1',
    name: 'Starter Locs Package',
    provider: 'Marcus Loc Master',
    providerId: 'locs1',
    price: 120,
    duration: '4-6 hours',
    description: 'Complete starter loc installation with consultation and aftercare guide',
    category: 'Dreadlocks'
  },
  {
    id: 'loc-service2',
    name: 'Loc Maintenance & Retwist',
    provider: 'Sister Locks Studio',
    providerId: 'locs2',
    price: 80,
    duration: '2-3 hours',
    description: 'Professional loc maintenance, retwist, and scalp treatment',
    category: 'Dreadlocks'
  },
  {
    id: 'loc-service3',
    name: 'Loc Styling & Design',
    provider: 'Natural Crown Locs',
    providerId: 'locs3',
    price: 65,
    duration: '1-2 hours',
    description: 'Creative loc styling for special occasions and everyday wear',
    category: 'Dreadlocks'
  }
];

const DreadlocksPage = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  const moodOptions = [
    { id: 'calm', label: '🌿 Calm', color: 'bg-green-100 text-green-800' },
    { id: 'social', label: '💃 Social', color: 'bg-pink-100 text-pink-800' },
    { id: 'private', label: '🤫 Private', color: 'bg-purple-100 text-purple-800' }
  ];

  const filteredArtists = selectedMood 
    ? dreadlockArtists.filter(artist => artist.mood.includes(selectedMood))
    : dreadlockArtists;

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Dreadlocks & Locs
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Professional loc installation, maintenance, and styling. Embrace your natural journey with expert lockticians.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <User className="w-5 h-5 mr-2" />
                Find Locktician
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                <Award className="w-5 h-5 mr-2" />
                View Loc Styles
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

          {/* Featured Lockticians */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Expert Lockticians</h2>
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
                      <span className="text-2xl font-bold text-green-600">KSh {artist.price}+</span>
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
                        category: 'Dreadlocks'
                      }}>
                        <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                          Book Session
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
            <h2 className="text-3xl font-bold text-center mb-8">Popular Loc Services</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {dreadlockServices.map((service) => (
                <Card key={service.id} className="hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold">{service.name}</h3>
                      <span className="text-xl font-bold text-green-600">KSh {service.price}</span>
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
                      <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                        Book Service
                      </Button>
                    </BookingModal>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Loc Journey Info */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Your Loc Journey</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="font-semibold mb-2">Starter Phase</h3>
                <p className="text-sm text-gray-600">First 3-6 months of your loc journey</p>
              </Card>
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="font-semibold mb-2">Budding Phase</h3>
                <p className="text-sm text-gray-600">6 months to 1 year of growth</p>
              </Card>
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌳</span>
                </div>
                <h3 className="font-semibold mb-2">Teen Phase</h3>
                <p className="text-sm text-gray-600">1-2 years of maturation</p>
              </Card>
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👑</span>
                </div>
                <h3 className="font-semibold mb-2">Mature Locs</h3>
                <p className="text-sm text-gray-600">2+ years of beautiful locs</p>
              </Card>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Loc Journey?</h2>
            <p className="text-xl mb-6">Connect with expert lockticians who understand your vision</p>
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Sparkles className="w-5 h-5 mr-2" />
              Begin Your Transformation
            </Button>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default DreadlocksPage;
