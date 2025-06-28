import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingModal } from "@/components/BookingModal";
import { 
  Calendar, 
  DollarSign, 
  MapPin, 
  Clock, 
  Star,
  Heart,
  Car,
  Home,
  Users,
  Gift,
  ShoppingCart,
  Coffee,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { useBookings } from "@/hooks/useBookings";
import { useServices } from "@/hooks/useServices";
import { useProducts } from "@/hooks/useProducts";
import { useMood, MoodType } from "@/contexts/MoodContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RideBooking {
  pickup: string;
  destination: string;
  estimatedFare: number;
  estimatedTime: number;
}

const EnhancedClientDashboard = () => {
  const { profile } = useAuth();
  const { balance, transactions } = useWallet();
  const { bookings } = useBookings();
  const { services } = useServices();
  const { products } = useProducts();
  const { selectedMood, setSelectedMood } = useMood();

  const [showRideModal, setShowRideModal] = useState(false);
  const [rideBooking, setRideBooking] = useState<RideBooking>({
    pickup: '',
    destination: '',
    estimatedFare: 0,
    estimatedTime: 0
  });

  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [nearbyServices, setNearbyServices] = useState([]);
  const [cart, setCart] = useState([]);

  const myBookings = bookings.filter(b => b.client_id === profile?.id);
  const upcomingBookings = myBookings.filter(b => 
    new Date(b.booking_date) > new Date() && b.status !== 'cancelled'
  );
  const pastBookings = myBookings.filter(b => b.status === 'completed');

  const moodOptions = [
    { id: 'calm' as MoodType, label: '🌿 Calm', color: 'bg-green-100 text-green-800' },
    { id: 'fast' as MoodType, label: '⚡ Fast', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'social' as MoodType, label: '💃 Social', color: 'bg-pink-100 text-pink-800' },
    { id: 'private' as MoodType, label: '🤫 Private', color: 'bg-purple-100 text-purple-800' }
  ];

  const filteredServices = selectedMood 
    ? services.filter(s => s.mood_tags?.includes(selectedMood))
    : services.slice(0, 6);

  const filteredProducts = selectedMood 
    ? products.filter(p => p.mood_tags?.includes(selectedMood))
    : products.slice(0, 6);

  const calculateRideFare = () => {
    if (!rideBooking.pickup || !rideBooking.destination) return;
    
    // Mock calculation - in real app would use mapping API
    const baseFare = 100;
    const distanceMultiplier = 15;
    const estimatedDistance = Math.random() * 20 + 2; // 2-22 km
    const fare = baseFare + (estimatedDistance * distanceMultiplier);
    const time = Math.round(estimatedDistance * 3 + 10); // rough time estimate
    
    setRideBooking(prev => ({
      ...prev,
      estimatedFare: Math.round(fare),
      estimatedTime: time
    }));
  };

  const bookRide = async () => {
    try {
      const { error } = await supabase
        .from('rides')
        .insert({
          passenger_id: profile?.id,
          pickup_location: rideBooking.pickup,
          dropoff_location: rideBooking.destination,
          fare: rideBooking.estimatedFare,
          estimated_duration: rideBooking.estimatedTime,
          status: 'requested'
        });

      if (error) throw error;
      
      toast.success('Ride booked successfully! Finding you a driver...');
      setShowRideModal(false);
      setRideBooking({ pickup: '', destination: '', estimatedFare: 0, estimatedTime: 0 });
    } catch (error) {
      toast.error('Failed to book ride');
    }
  };

  const totalSpent = transactions
    .filter(t => t.type === 'booking' && t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Welcome Back!</h1>
              <p className="text-xl text-gray-600">Your beauty journey awaits</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowRideModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Car className="w-4 h-4 mr-2" />
                Book Ride
              </Button>
            </div>
          </div>

          {/* Mood Picker */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What's your vibe today?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-wrap">
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
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Wallet Balance</p>
                    <p className="text-2xl font-bold text-green-600">KSh {balance}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Upcoming Sessions</p>
                    <p className="text-2xl font-bold text-blue-600">{upcomingBookings.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-purple-600">KSh {totalSpent}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cart Items</p>
                    <p className="text-2xl font-bold text-orange-600">{cart.length}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="discover" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="shop">Shop</TabsTrigger>
              <TabsTrigger value="meals">Grab A Bite</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Services matching mood */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      {selectedMood ? `${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Services` : 'Recommended Services'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {filteredServices.map((service) => (
                        <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          {service.image_url && (
                            <div className="h-32 overflow-hidden">
                              <img 
                                src={service.image_url} 
                                alt={service.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-sm">{service.name}</h4>
                              <span className="text-lg font-bold text-purple-600">KSh {service.price}</span>
                            </div>
                            <Badge variant="outline" className="mb-2 text-xs">{service.category}</Badge>
                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                            
                            <div className="flex space-x-2">
                              <BookingModal 
                                service={service}
                                artist={service.profiles ? {
                                  id: service.provider_id || '',
                                  full_name: service.profiles.full_name,
                                  avatar_url: service.profiles.avatar_url
                                } : undefined}
                              >
                                <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                                  Book Now
                                </Button>
                              </BookingModal>
                              
                              <Button size="sm" variant="outline">
                                <Heart className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setShowRideModal(true)}
                    >
                      <Car className="w-4 h-4 mr-2" />
                      Book a Ride
                    </Button>
                    
                    <Button className="w-full justify-start" variant="outline">
                      <Home className="w-4 h-4 mr-2" />
                      At-Home Service
                    </Button>
                    
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Join Group Session
                    </Button>
                    
                    <Button className="w-full justify-start" variant="outline">
                      <Gift className="w-4 h-4 mr-2" />
                      Refer Friends
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingBookings.length === 0 ? (
                        <div className="text-center py-8">
                          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 mb-4">No upcoming bookings</p>
                          <BookingModal service={{
                            id: 'quick-book',
                            name: 'Quick Booking',
                            price: 0,
                            category: 'Any'
                          }}>
                            <Button className="bg-purple-600 hover:bg-purple-700">
                              Book Your Next Session
                            </Button>
                          </BookingModal>
                        </div>
                      ) : (
                        upcomingBookings.map((booking) => (
                          <Card key={booking.id} className="border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">{booking.services?.name || 'Service'}</h4>
                                <Badge className="bg-blue-100 text-blue-800">{booking.status}</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                {new Date(booking.booking_date).toLocaleDateString()} at {new Date(booking.booking_date).toLocaleTimeString()}
                              </p>
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{booking.location_details}</span>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-lg font-bold text-green-600">KSh {booking.total_amount}</span>
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="outline">
                                    Reschedule
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pastBookings.slice(0, 5).map((booking) => (
                        <Card key={booking.id} className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{booking.services?.name || 'Service'}</h4>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                                <span className="text-sm">Rate</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {new Date(booking.booking_date).toLocaleDateString()}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-green-600">KSh {booking.total_amount}</span>
                              <Button size="sm" variant="outline">
                                Book Again
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="shop" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedMood 
                      ? `${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Products` 
                      : 'Featured Products'
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                      <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        {product.image_url && (
                          <div className="h-32 overflow-hidden">
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm">{product.name}</h4>
                            <span className="text-lg font-bold text-green-600">KSh {product.price}</span>
                          </div>
                          <Badge variant="outline" className="mb-2 text-xs">{product.category}</Badge>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                          
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                setCart([...cart, product]);
                                toast.success('Added to cart!');
                              }}
                            >
                              Add to Cart
                            </Button>
                            <Button size="sm" variant="outline">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="meals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Coffee className="w-5 h-5 mr-2" />
                    Grab A Bite
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Coffee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Delicious meals coming soon!</p>
                    <p className="text-sm text-gray-400">
                      Business owners can add their meal offerings which will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wallet" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Wallet Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6 bg-green-50 rounded-lg mb-6">
                      <p className="text-3xl font-bold text-green-600 mb-2">KSh {balance}</p>
                      <p className="text-sm text-gray-600">Available Balance</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">
                        Deposit Funds
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Withdraw
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {transactions.slice(0, 8).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-gray-500">{new Date(transaction.created_at).toLocaleDateString()}</p>
                          </div>
                          <Badge variant={transaction.amount > 0 ? 'default' : 'secondary'}>
                            {transaction.amount > 0 ? '+' : ''}KSh {Math.abs(transaction.amount)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Ride Booking Modal */}
          {showRideModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-lg mx-4">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Car className="w-5 h-5 mr-2" />
                    Book a Ride
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Pickup Location</label>
                    <Input
                      value={rideBooking.pickup}
                      onChange={(e) => setRideBooking(prev => ({...prev, pickup: e.target.value}))}
                      placeholder="Enter pickup location"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Destination</label>
                    <Input
                      value={rideBooking.destination}
                      onChange={(e) => setRideBooking(prev => ({...prev, destination: e.target.value}))}
                      placeholder="Enter destination"
                      onBlur={calculateRideFare}
                    />
                  </div>

                  {rideBooking.estimatedFare > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Estimated Fare</span>
                        <span className="text-xl font-bold text-blue-600">KSh {rideBooking.estimatedFare}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Estimated time: {rideBooking.estimatedTime} minutes</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={bookRide} 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={!rideBooking.pickup || !rideBooking.destination}
                    >
                      Book Ride
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowRideModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EnhancedClientDashboard;
