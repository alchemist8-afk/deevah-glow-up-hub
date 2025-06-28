
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ImageUpload";
import { 
  Camera, 
  DollarSign, 
  Calendar, 
  Star, 
  Users,
  MapPin,
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useServices, useCreateService } from "@/hooks/useServices";
import { useGlowPosts } from "@/hooks/useGlowPosts";
import { useBookings } from "@/hooks/useBookings";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ArtistDashboard = () => {
  const { profile, updateProfile } = useAuth();
  const { services } = useServices();
  const { posts } = useGlowPosts();
  const { bookings, updateBookingStatus } = useBookings();
  const { createPost } = useGlowPosts();
  const createService = useCreateService();

  const [isAvailable, setIsAvailable] = useState(true);
  const [allowsGroupSessions, setAllowsGroupSessions] = useState(true);
  const [bio, setBio] = useState(profile?.bio || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [hourlyRate, setHourlyRate] = useState(50);
  const [profileImage, setProfileImage] = useState(profile?.avatar_url || '');
  
  // New service form
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    duration: '',
    image_url: '',
    mood_tags: [] as string[]
  });

  const myServices = services.filter(s => s.provider_id === profile?.id);
  const myPosts = posts.filter(p => p.artist_id === profile?.id);
  const myBookings = bookings.filter(b => b.artist_id === profile?.id);

  const categories = ['Hair', 'Braids', 'Nails', 'Beauty', 'Massage', 'Lashes', 'Makeup'];
  const moods = ['calm', 'fast', 'social', 'private'];

  const pendingBookings = myBookings.filter(b => b.status === 'pending');
  const completedBookings = myBookings.filter(b => b.status === 'completed');
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);

  const updateAvailability = async () => {
    try {
      const { error } = await supabase
        .from('artist_availability')
        .upsert({
          artist_id: profile?.id,
          status: isAvailable ? 'available' : 'unavailable',
          allows_group_sessions: allowsGroupSessions,
          hourly_rate: hourlyRate
        });

      if (error) throw error;
      toast.success('Availability updated successfully!');
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await updateProfile({
        bio,
        location,
        avatar_url: profileImage
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCreateService = async () => {
    try {
      await createService.mutateAsync({
        name: newService.name,
        category: newService.category,
        description: newService.description,
        price: parseFloat(newService.price),
        duration: parseInt(newService.duration),
        image_url: newService.image_url,
        mood_tags: newService.mood_tags
      });
      
      setNewService({
        name: '',
        category: '',
        description: '',
        price: '',
        duration: '',
        image_url: '',
        mood_tags: []
      });
      setShowServiceForm(false);
      toast.success('Service created successfully!');
    } catch (error) {
      toast.error('Failed to create service');
    }
  };

  const handleBookingResponse = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    try {
      await updateBookingStatus.mutateAsync({ bookingId, status });
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Artist Dashboard</h1>
              <p className="text-xl text-gray-600">Control your brand and grow your business</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Available</span>
                <Switch 
                  checked={isAvailable}
                  onCheckedChange={(checked) => {
                    setIsAvailable(checked);
                    updateAvailability();
                  }}
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-600">KSh {totalEarnings}</p>
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
                    <p className="text-2xl font-bold text-orange-600">{pendingBookings.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Services</p>
                    <p className="text-2xl font-bold text-blue-600">{myServices.length}</p>
                  </div>
                  <Star className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Portfolio Posts</p>
                    <p className="text-2xl font-bold text-purple-600">{myPosts.length}</p>
                  </div>
                  <Camera className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Profile Picture</label>
                      <ImageUpload
                        onImageUpload={setProfileImage}
                        currentImage={profileImage}
                        className="max-w-sm"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Bio</label>
                        <Textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell clients about yourself and your expertise..."
                          rows={4}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Location</label>
                        <Input
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g., Westlands, Nairobi"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleProfileUpdate} className="bg-purple-600 hover:bg-purple-700">
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>My Services</CardTitle>
                    <Button 
                      onClick={() => setShowServiceForm(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showServiceForm && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>Create New Service</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Service Name</label>
                            <Input
                              value={newService.name}
                              onChange={(e) => setNewService({...newService, name: e.target.value})}
                              placeholder="e.g., Deep Tissue Massage"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <Select value={newService.category} onValueChange={(value) => setNewService({...newService, category: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Description</label>
                          <Textarea
                            value={newService.description}
                            onChange={(e) => setNewService({...newService, description: e.target.value})}
                            placeholder="Describe your service..."
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Price (KSh)</label>
                            <Input
                              type="number"
                              value={newService.price}
                              onChange={(e) => setNewService({...newService, price: e.target.value})}
                              placeholder="50"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                            <Input
                              type="number"
                              value={newService.duration}
                              onChange={(e) => setNewService({...newService, duration: e.target.value})}
                              placeholder="60"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Service Image</label>
                          <ImageUpload
                            onImageUpload={(url) => setNewService({...newService, image_url: url})}
                            currentImage={newService.image_url}
                          />
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button onClick={handleCreateService} className="bg-green-600 hover:bg-green-700">
                            Create Service
                          </Button>
                          <Button variant="outline" onClick={() => setShowServiceForm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {myServices.map((service) => (
                      <Card key={service.id} className="overflow-hidden">
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
                            <h3 className="font-semibold">{service.name}</h3>
                            <span className="text-lg font-bold text-green-600">KSh {service.price}</span>
                          </div>
                          <Badge variant="outline" className="mb-2">{service.category}</Badge>
                          <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                          {service.duration && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              {service.duration} min
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingBookings.map((booking) => (
                      <Card key={booking.id} className="border-l-4 border-l-orange-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{booking.services?.name || 'Service'}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(booking.booking_date).toLocaleDateString()} at {new Date(booking.booking_date).toLocaleTimeString()}
                              </p>
                              <p className="text-sm text-gray-600">{booking.location_details}</p>
                              {booking.notes && (
                                <p className="text-sm text-gray-500 mt-1">Note: {booking.notes}</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <span className="text-xl font-bold text-green-600">KSh {booking.total_amount}</span>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleBookingResponse(booking.id, 'confirmed')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Accept
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleBookingResponse(booking.id, 'cancelled')}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Decline
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {pendingBookings.length === 0 && (
                      <div className="text-center py-8">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No pending booking requests</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>My Work Portfolio</CardTitle>
                    <p className="text-sm text-gray-600">
                      Posts appear on Glow Feed and in service category pages
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {myPosts.map((post) => (
                      <Card key={post.id} className="overflow-hidden">
                        <div className="relative h-48">
                          <img 
                            src={post.image_url} 
                            alt="Portfolio work"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span className="text-xs">{post.likes_count || 0}</span>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          {post.caption && (
                            <p className="text-sm text-gray-700 mb-2">{post.caption}</p>
                          )}
                          {post.service_used && (
                            <Badge variant="secondary" className="text-xs">
                              {post.service_used}
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Artist Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Allow Group Sessions</h4>
                      <p className="text-sm text-gray-600">Let clients book you for group sessions</p>
                    </div>
                    <Switch 
                      checked={allowsGroupSessions}
                      onCheckedChange={(checked) => {
                        setAllowsGroupSessions(checked);
                        updateAvailability();
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Hourly Rate (KSh)</label>
                    <Input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                      className="max-w-xs"
                    />
                  </div>
                  
                  <Button onClick={updateAvailability} className="bg-purple-600 hover:bg-purple-700">
                    Save Settings
                  </Button>
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
