
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Camera, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  Star, 
  Upload,
  Eye,
  CheckCircle,
  XCircle,
  MapPin,
  Palette
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ArtistAvailability {
  id: string;
  status: 'available' | 'busy' | 'offline';
  allows_group_sessions: boolean;
  max_group_size: number;
  hourly_rate: number;
}

interface Booking {
  id: string;
  booking_date: string;
  status: string;
  total_amount: number;
  client_id: string;
  is_group_session: boolean;
  location: string;
  notes: string;
  profiles?: {
    full_name: string;
  };
}

interface PortfolioItem {
  id: string;
  image_url: string;
  title: string;
  description: string;
  service_category: string;
  is_featured: boolean;
  created_at: string;
}

const ArtistDashboard = () => {
  const { profile } = useAuth();
  const { balance, transactions } = useWallet();
  const { toast } = useToast();
  
  const [availability, setAvailability] = useState<ArtistAvailability | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    image_url: '',
    title: '',
    description: '',
    service_category: '',
    is_featured: false
  });
  const [profileUpdates, setProfileUpdates] = useState({
    bio: profile?.bio || '',
    location: profile?.location || ''
  });

  useEffect(() => {
    if (profile) {
      fetchArtistData();
    }
  }, [profile]);

  const fetchArtistData = async () => {
    if (!profile) return;

    try {
      // Fetch availability
      const { data: availData } = await supabase
        .from('artist_availability')
        .select('*')
        .eq('artist_id', profile.id)
        .single();

      if (availData) {
        setAvailability(availData as ArtistAvailability);
      }

      // Fetch bookings with proper join
      const { data: bookingData } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_date,
          status,
          total_amount,
          client_id,
          is_group_session,
          location,
          notes,
          profiles:client_id (
            full_name
          )
        `)
        .eq('provider_id', profile.id)
        .order('booking_date', { ascending: false });

      if (bookingData) {
        setBookings(bookingData.map(booking => ({
          ...booking,
          profiles: Array.isArray(booking.profiles) ? booking.profiles[0] : booking.profiles
        })) as Booking[]);
      }

      // Fetch portfolio
      const { data: portfolioData } = await supabase
        .from('artist_portfolio')
        .select('*')
        .eq('artist_id', profile.id)
        .order('created_at', { ascending: false });

      if (portfolioData) {
        setPortfolio(portfolioData);
      }
    } catch (error) {
      console.error('Error fetching artist data:', error);
    }
  };

  const updateAvailability = async (updates: Partial<ArtistAvailability>) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('artist_availability')
        .upsert({
          artist_id: profile.id,
          ...availability,
          ...updates
        });

      if (error) throw error;

      setAvailability(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Availability Updated",
        description: "Your availability settings have been saved"
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update availability",
        variant: "destructive"
      });
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );

      toast({
        title: "Booking Updated",
        description: `Booking has been ${status}`
      });
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const addPortfolioItem = async () => {
    if (!profile || !newPortfolioItem.image_url || !newPortfolioItem.title) return;

    try {
      const { error } = await supabase
        .from('artist_portfolio')
        .insert({
          artist_id: profile.id,
          ...newPortfolioItem
        });

      if (error) throw error;

      setNewPortfolioItem({
        image_url: '',
        title: '',
        description: '',
        service_category: '',
        is_featured: false
      });

      await fetchArtistData();
      
      toast({
        title: "Portfolio Updated",
        description: "New work has been added to your portfolio"
      });
    } catch (error) {
      console.error('Error adding portfolio item:', error);
    }
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2',
    'https://images.unsplash.com/photo-1583000520395-7e30d4e2fc88',
    'https://images.unsplash.com/photo-1571875257727-4ddc5cf765d6'
  ];

  const todaysEarnings = transactions
    .filter(t => t.type === 'booking' && new Date(t.created_at).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Artist Control Panel</h1>
              <p className="text-xl text-gray-600">Manage your artistry empire</p>
            </div>
            
            {availability && (
              <div className="flex items-center space-x-4">
                <Badge 
                  variant={availability.status === 'available' ? 'default' : 'secondary'}
                  className="text-lg px-4 py-2"
                >
                  {availability.status.charAt(0).toUpperCase() + availability.status.slice(1)}
                </Badge>
                <Select
                  value={availability.status}
                  onValueChange={(value: 'available' | 'busy' | 'offline') => 
                    updateAvailability({ status: value })
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                    <p className="text-2xl font-bold text-green-600">KSh {todaysEarnings}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                    <p className="text-2xl font-bold text-orange-600">{pendingBookings}</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-blue-600">{completedBookings}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Portfolio Items</p>
                    <p className="text-2xl font-bold text-purple-600">{portfolio.length}</p>
                  </div>
                  <Palette className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No bookings yet</p>
                    ) : (
                      bookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <div>
                                <p className="font-semibold">{booking.profiles?.full_name || 'Unknown Client'}</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(booking.booking_date).toLocaleDateString()} - KSh {booking.total_amount}
                                </p>
                                {booking.location && (
                                  <p className="text-sm text-gray-500 flex items-center mt-1">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {booking.location}
                                  </p>
                                )}
                              </div>
                              <Badge variant={
                                booking.status === 'completed' ? 'default' :
                                booking.status === 'pending' ? 'secondary' : 'outline'
                              }>
                                {booking.status}
                              </Badge>
                              {booking.is_group_session && (
                                <Badge variant="outline">
                                  <Users className="w-3 h-3 mr-1" />
                                  Group Session
                                </Badge>
                              )}
                            </div>
                            {booking.notes && (
                              <p className="text-sm text-gray-600 mt-2">{booking.notes}</p>
                            )}
                          </div>
                          
                          {booking.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>My Portfolio</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Upload className="w-4 h-4 mr-2" />
                        Add Work
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Portfolio Item</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Choose Image</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {sampleImages.map((img, index) => (
                              <div
                                key={index}
                                className={`cursor-pointer border-2 rounded-lg overflow-hidden ${
                                  newPortfolioItem.image_url === img ? 'border-purple-500' : 'border-gray-200'
                                }`}
                                onClick={() => setNewPortfolioItem(prev => ({ ...prev, image_url: img }))}
                              >
                                <img src={img} alt={`Sample ${index + 1}`} className="w-full h-20 object-cover" />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={newPortfolioItem.title}
                            onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Work title..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newPortfolioItem.description}
                            onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe your work..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="category">Service Category</Label>
                          <Select
                            value={newPortfolioItem.service_category}
                            onValueChange={(value) => setNewPortfolioItem(prev => ({ ...prev, service_category: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Hair">Hair</SelectItem>
                              <SelectItem value="Nails">Nails</SelectItem>
                              <SelectItem value="Makeup">Makeup</SelectItem>
                              <SelectItem value="Braids">Braids</SelectItem>
                              <SelectItem value="Cuts">Cuts</SelectItem>
                              <SelectItem value="Massage">Massage</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="featured"
                            checked={newPortfolioItem.is_featured}
                            onCheckedChange={(checked) => setNewPortfolioItem(prev => ({ ...prev, is_featured: checked }))}
                          />
                          <Label htmlFor="featured">Feature this work</Label>
                        </div>

                        <Button onClick={addPortfolioItem} className="w-full">
                          Add to Portfolio
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {portfolio.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="relative h-48">
                          <img 
                            src={item.image_url} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          {item.is_featured && (
                            <Badge className="absolute top-2 right-2 bg-yellow-500">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <Badge variant="outline" className="mt-2">
                            {item.service_category}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Availability Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {availability && (
                      <>
                        <div className="flex items-center justify-between">
                          <Label>Accept Group Sessions</Label>
                          <Switch
                            checked={availability.allows_group_sessions}
                            onCheckedChange={(checked) => updateAvailability({ allows_group_sessions: checked })}
                          />
                        </div>

                        <div>
                          <Label htmlFor="maxGroup">Max Group Size</Label>
                          <Input
                            id="maxGroup"
                            type="number"
                            value={availability.max_group_size}
                            onChange={(e) => updateAvailability({ max_group_size: parseInt(e.target.value) })}
                            min="2"
                            max="10"
                          />
                        </div>

                        <div>
                          <Label htmlFor="hourlyRate">Hourly Rate (KSh)</Label>
                          <Input
                            id="hourlyRate"
                            type="number"
                            value={availability.hourly_rate || ''}
                            onChange={(e) => updateAvailability({ hourly_rate: parseFloat(e.target.value) })}
                            placeholder="Enter your hourly rate..."
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileUpdates.bio}
                        onChange={(e) => setProfileUpdates(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell clients about yourself..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileUpdates.location}
                        onChange={(e) => setProfileUpdates(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Your location..."
                      />
                    </div>

                    <Button className="w-full">
                      Update Profile
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="earnings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">KSh {balance}</p>
                      <p className="text-sm text-gray-600">Current Balance</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">KSh {todaysEarnings}</p>
                      <p className="text-sm text-gray-600">Today's Earnings</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{completedBookings}</p>
                      <p className="text-sm text-gray-600">Completed Sessions</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">Recent Transactions</h3>
                    {transactions.slice(0, 10).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{new Date(transaction.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={transaction.amount > 0 ? 'default' : 'secondary'}>
                          {transaction.amount > 0 ? '+' : ''}KSh {transaction.amount}
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

export default ArtistDashboard;
