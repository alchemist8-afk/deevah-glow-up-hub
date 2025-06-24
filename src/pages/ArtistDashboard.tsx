
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, DollarSign, Star, TrendingUp, Clock, MapPin, Check, X, Edit, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import { useToast } from "@/hooks/use-toast";

const artistData = {
  name: "Maya Johnson",
  specialties: ["Box Braids", "Cornrows", "Protective Styles"],
  rating: 4.9,
  completedJobs: 127,
  revenue: "$3,240",
  responseRate: "95%"
};

const ArtistDashboard = () => {
  const { profile } = useAuth();
  const { bookings, updateBookingStatus } = useBooking();
  const { toast } = useToast();

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const upcomingJobs = bookings.filter(b => b.status === 'accepted');

  const handleBookingAction = (bookingId: string, action: 'accept' | 'reject') => {
    updateBookingStatus(bookingId, action === 'accept' ? 'accepted' : 'rejected');
    toast({
      title: action === 'accept' ? "Booking Accepted!" : "Booking Rejected",
      description: `You have ${action}ed the booking request.`
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>{profile?.full_name?.split(' ').map(n => n[0]).join('') || 'MJ'}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.full_name || artistData.name}!</h1>
                <p className="text-gray-600">Ready to create beautiful transformations today?</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              Add New Service
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{artistData.revenue}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{artistData.completedJobs}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Rating</p>
                    <div className="flex items-center space-x-1">
                      <p className="text-2xl font-bold text-gray-900">{artistData.rating}</p>
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    </div>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Response Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{artistData.responseRate}</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Pending Requests
                      <Badge variant="secondary">{pendingBookings.length} pending</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingBookings.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No pending requests</p>
                      ) : (
                        pendingBookings.map((booking) => (
                          <div key={booking.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h3 className="font-semibold text-lg">Booking Request</h3>
                                <p className="text-gray-600">Client ID: {booking.client_id}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-600">KSh {booking.total_amount}</p>
                                <p className="text-sm text-gray-500">Service booking</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(booking.booking_date).toLocaleDateString()}
                                </span>
                                {booking.location && (
                                  <span className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {booking.location}
                                  </span>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-600 border-red-600"
                                  onClick={() => handleBookingAction(booking.id, 'reject')}
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Decline
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleBookingAction(booking.id, 'accept')}
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Accept
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Confirmed Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingJobs.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No upcoming jobs</p>
                      ) : (
                        upcomingJobs.map((job) => (
                          <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <h4 className="font-medium">Confirmed Booking</h4>
                              <p className="text-sm text-gray-600">Client: {job.client_id} • {new Date(job.booking_date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">KSh {job.total_amount}</p>
                              <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Your Services
                    <Button>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {artistData.specialties.map((specialty, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{specialty}</span>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Booking Rate</span>
                          <span>87%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Client Satisfaction</span>
                          <span>96%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Box Braids</span>
                        <span className="font-semibold">45 bookings</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cornrows</span>
                        <span className="font-semibold">32 bookings</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protective Styles</span>
                        <span className="font-semibold">28 bookings</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ArtistDashboard;
