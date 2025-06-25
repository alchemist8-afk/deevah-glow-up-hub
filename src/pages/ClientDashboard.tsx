
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingModal } from "@/components/BookingModal";
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  Star, 
  Heart,
  MapPin,
  Gift,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserBooking {
  id: string;
  booking_date: string;
  status: string;
  total_amount: number;
  location: string;
  notes: string;
  is_group_session: boolean;
  service_name?: string;
  provider_name?: string;
}

interface FavoriteArtist {
  id: string;
  name: string;
  service: string;
  rating: number;
  last_booking: string;
  image: string;
}

const ClientDashboard = () => {
  const { profile } = useAuth();
  const { balance, transactions } = useWallet();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralEarnings, setReferralEarnings] = useState<number>(0);

  // Mock data for demonstration
  const favoriteArtists: FavoriteArtist[] = [
    {
      id: '1',
      name: 'Maya Johnson',
      service: 'Box Braids',
      rating: 4.9,
      last_booking: '2 weeks ago',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c5'
    },
    {
      id: '2',
      name: 'Sarah Wellness',
      service: 'Deep Tissue Massage',
      rating: 4.8,
      last_booking: '1 month ago',
      image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948'
    },
    {
      id: '3',
      name: 'Priscilla Nails',
      service: 'Gel Manicure',
      rating: 4.9,
      last_booking: '3 weeks ago',
      image: 'https://images.unsplash.com/photo-1604902396830-aca29e19b067'
    }
  ];

  const upcomingBookings = bookings.filter(b => 
    new Date(b.booking_date) > new Date() && b.status !== 'cancelled'
  );
  
  const recentBookings = bookings.filter(b => 
    b.status === 'completed'
  ).slice(0, 5);

  useEffect(() => {
    if (profile) {
      fetchUserBookings();
      generateReferralCode();
      fetchReferralEarnings();
    }
  }, [profile]);

  const fetchUserBookings = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services(name),
          profiles!bookings_provider_id_fkey(full_name)
        `)
        .eq('client_id', profile.id)
        .order('booking_date', { ascending: false });

      if (error) throw error;

      const formattedBookings = data?.map(booking => ({
        ...booking,
        service_name: booking.services?.name || 'Service',
        provider_name: booking.profiles?.full_name || 'Provider'
      })) as UserBooking[];

      setBookings(formattedBookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const generateReferralCode = () => {
    if (profile) {
      const code = `GLOW${profile.id.slice(0, 8).toUpperCase()}`;
      setReferralCode(code);
    }
  };

  const fetchReferralEarnings = async () => {
    if (!profile) return;

    try {
      const { data } = await supabase
        .from('referrals')
        .select('reward_amount')
        .eq('referrer_id', profile.id)
        .eq('status', 'completed');

      const total = data?.reduce((sum, ref) => sum + (ref.reward_amount || 0), 0) || 0;
      setReferralEarnings(total);
    } catch (error) {
      console.error('Error fetching referral earnings:', error);
    }
  };

  const rebookWithArtist = (artistId: string, artistName: string) => {
    toast({
      title: "Rebooking",
      description: `Opening booking for ${artistName}...`
    });
  };

  const inviteFriend = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Deevah Glow Hub',
        text: `Use my referral code ${referralCode} and get KSh 25 off your first booking!`,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(`Use my referral code ${referralCode} and get KSh 25 off your first booking! ${window.location.origin}`);
      toast({
        title: "Referral Link Copied!",
        description: "Share with friends to earn rewards"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
              <h1 className="text-4xl font-bold text-gray-900">My Glow Dashboard</h1>
              <p className="text-xl text-gray-600">Your beauty journey, your way</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500">
                <Sparkles className="w-4 h-4 mr-2" />
                VIP Member
              </Badge>
            </div>
          </div>

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
                    <p className="text-sm font-medium text-gray-600">Upcoming Bookings</p>
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
                    <p className="text-sm font-medium text-gray-600">Referral Earnings</p>
                    <p className="text-2xl font-bold text-orange-600">KSh {referralEarnings}</p>
                  </div>
                  <Gift className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="favorites">My Artists</TabsTrigger>
              <TabsTrigger value="referrals">Earn Rewards</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Upcoming Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                      Upcoming Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingBookings.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No upcoming bookings</p>
                        <BookingModal service={{
                          id: 'quick-book',
                          name: 'Quick Booking',
                          price: 0,
                          category: 'Any'
                        }}>
                          <Button>Book Your Next Session</Button>
                        </BookingModal>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {upcomingBookings.map((booking) => (
                          <div key={booking.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{booking.service_name}</h4>
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">with {booking.provider_name}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-2">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                              {booking.location && (
                                <>
                                  <MapPin className="w-4 h-4 ml-4 mr-1" />
                                  <span>{booking.location}</span>
                                </>
                              )}
                            </div>
                            {booking.is_group_session && (
                              <Badge variant="outline" className="mt-2">
                                <Users className="w-3 h-3 mr-1" />
                                Group Session
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="w-5 h-5 mr-2 text-purple-600" />
                      Recent Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentBookings.map((booking) => (
                        <div key={booking.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{booking.service_name}</h4>
                            <span className="text-green-600 font-semibold">KSh {booking.total_amount}</span>
                          </div>
                          <p className="text-sm text-gray-600">with {booking.provider_name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(booking.booking_date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                      {recentBookings.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No completed bookings yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    Your Favorite Artists
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {favoriteArtists.map((artist) => (
                      <Card key={artist.id} className="overflow-hidden">
                        <div className="relative h-32">
                          <img 
                            src={artist.image} 
                            alt={artist.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-1">{artist.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{artist.service}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                              {artist.rating}
                            </span>
                            <span className="text-gray-500">{artist.last_booking}</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full mt-3"
                            onClick={() => rebookWithArtist(artist.id, artist.name)}
                          >
                            Book Again
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="referrals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gift className="w-5 h-5 mr-2 text-orange-500" />
                    Invite Friends & Earn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">KSh {referralEarnings}</h3>
                      <p className="text-gray-600">Total Referral Earnings</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6">
                      <h4 className="font-semibold mb-2">Your Referral Code</h4>
                      <div className="text-2xl font-bold text-purple-600 mb-4">{referralCode}</div>
                      <p className="text-sm text-gray-600 mb-4">
                        Share this code with friends. They get KSh 25 off, you earn KSh 25!
                      </p>
                      <Button onClick={inviteFriend} className="bg-gradient-to-r from-purple-500 to-pink-500">
                        <Gift className="w-4 h-4 mr-2" />
                        Invite Friends
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-center">
                      <div className="p-4">
                        <h5 className="font-semibold">Step 1</h5>
                        <p className="text-sm text-gray-600">Share your code</p>
                      </div>
                      <div className="p-4">
                        <h5 className="font-semibold">Step 2</h5>
                        <p className="text-sm text-gray-600">Friend books service</p>
                      </div>
                      <div className="p-4">
                        <h5 className="font-semibold">Step 3</h5>
                        <p className="text-sm text-gray-600">You both earn rewards!</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wallet" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">KSh {balance}</p>
                      <p className="text-sm text-gray-600">Available Balance</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">KSh {totalSpent}</p>
                      <p className="text-sm text-gray-600">Total Spent</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">Recent Transactions</h3>
                    {transactions.slice(0, 8).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{new Date(transaction.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={transaction.amount > 0 ? 'default' : 'secondary'}>
                          {transaction.amount > 0 ? '+' : ''}KSh {Math.abs(transaction.amount)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ClientDashboard;
