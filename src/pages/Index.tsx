
import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/HeroSection";
import { MoodPicker, Mood } from "@/components/MoodPicker";
import { GlowFeed } from "@/components/GlowFeed";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, Users, TrendingUp, Gift, Zap } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<Mood>();

  const featuredArtists = [
    {
      id: '1',
      name: 'Maya Styles',
      specialty: 'Braids & Protective Styles',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb',
      distance: '0.8 mi',
      price: 'From $75',
      verified: true
    },
    {
      id: '2',
      name: 'Golden Touch Nails',
      specialty: 'Nail Art & Manicures',
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15',
      distance: '1.2 mi',
      price: 'From $45',
      verified: true
    },
    {
      id: '3',
      name: 'Zen Massage Co.',
      specialty: 'Relaxation & Wellness',
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874',
      distance: '0.5 mi',
      price: 'From $90',
      verified: true
    }
  ];

  const glowSessions = [
    {
      id: '1',
      title: 'Sunday Glow Session',
      artist: 'Maya & Team',
      mood: 'social' as Mood,
      openSlots: 3,
      distance: '1.1 mi',
      time: '2:00 PM',
      price: '$65/person'
    },
    {
      id: '2', 
      title: 'Private Zen Hour',
      artist: 'Wellness Studio',
      mood: 'calm' as Mood,
      openSlots: 1,
      distance: '0.7 mi',
      time: '4:30 PM',
      price: '$120'
    }
  ];

  const todaysSpecials = [
    {
      id: '1',
      title: 'Jollof Rice Special',
      restaurant: 'Mama Adea Kitchen',
      price: '$18',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b',
      rating: 4.7
    },
    {
      id: '2',
      title: 'Glow Smoothie Bowl',
      restaurant: 'Beauty Bites',
      price: '$12',
      image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38',
      rating: 4.9
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        <HeroSection />
        
        {/* Mood Picker Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <MoodPicker selectedMood={selectedMood} onMoodSelect={setSelectedMood} />
          </div>
        </section>

        {/* Glow Sessions Near You */}
        <section className="py-16 px-6 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Glow Sessions Near You</h2>
              <p className="text-xl text-gray-600">Join live sessions happening in your area</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {glowSessions.map((session) => (
                <Card key={session.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{session.title}</h3>
                        <p className="text-gray-600">by {session.artist}</p>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {session.mood}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {session.distance}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {session.time}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {session.openSlots} spots left
                      </div>
                      <div className="flex items-center font-semibold text-green-600">
                        {session.price}
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                      Join Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Artists */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Artists</h2>
              <p className="text-xl text-gray-600">Book with our top-rated beauty professionals</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredArtists.map((artist) => (
                <Card key={artist.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src={artist.avatar} />
                      <AvatarFallback>{artist.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex items-center justify-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{artist.name}</h3>
                      {artist.verified && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{artist.specialty}</p>
                    
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        {artist.rating}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {artist.distance}
                      </div>
                    </div>
                    
                    <p className="font-semibold text-green-600 mb-4">{artist.price}</p>
                    
                    <Button className="w-full">Book Now</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Today's Chef Special */}
        <section className="py-16 px-6 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Today's Chef Special</h2>
              <p className="text-xl text-gray-600">Delicious meals to fuel your glow session</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {todaysSpecials.map((special) => (
                <Card key={special.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex">
                    <img 
                      src={special.image} 
                      alt={special.title}
                      className="w-32 h-32 object-cover"
                    />
                    <CardContent className="flex-1 p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{special.title}</h3>
                      <p className="text-gray-600 mb-2">{special.restaurant}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          <span className="text-sm">{special.rating}</span>
                        </div>
                        <span className="font-bold text-green-600">{special.price}</span>
                      </div>
                      <Button size="sm" className="w-full mt-3">
                        Order Now
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Stats & CTA */}
        <section className="py-16 px-6 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Join the Glow Revolution</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-8 h-8 text-purple-400 mr-2" />
                  <span className="text-3xl font-bold">2,500+</span>
                </div>
                <p className="text-gray-300">Happy Clients</p>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-pink-400 mr-2" />
                  <span className="text-3xl font-bold">500+</span>
                </div>
                <p className="text-gray-300">Verified Artists</p>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Gift className="w-8 h-8 text-yellow-400 mr-2" />
                  <span className="text-3xl font-bold">$50K+</span>
                </div>
                <p className="text-gray-300">In Rewards Earned</p>
              </div>
            </div>

            <div className="space-x-4">
              {!user ? (
                <>
                  <Link to="/auth">
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
                      Start Your Glow Journey
                    </Button>
                  </Link>
                  <Link to="/glow-feed">
                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                      Explore Glow Feed
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="space-y-4">
                  <p className="text-xl">Welcome back, {user.name}! 🌟</p>
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="font-semibold">{user.glowCoins} GlowCoins</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <GlowFeed />
      </div>
    </Layout>
  );
};

export default Index;
