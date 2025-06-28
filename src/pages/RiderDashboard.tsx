
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Car, 
  MapPin, 
  Clock, 
  DollarSign,
  Navigation,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertCircle,
  Route
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RideRequest {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  fare: number;
  estimated_duration: number;
  status: string;
  passenger_id: string;
  created_at: string;
}

const RiderDashboard = () => {
  const { profile } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [activeRides, setActiveRides] = useState<RideRequest[]>([]);
  const [completedRides, setCompletedRides] = useState<RideRequest[]>([]);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    if (profile?.id) {
      fetchRideRequests();
      fetchRideHistory();
      fetchEarnings();
    }
  }, [profile?.id]);

  const fetchRideRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('status', 'requested')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRideRequests(data || []);
    } catch (error) {
      console.error('Error fetching ride requests:', error);
    }
  };

  const fetchRideHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('rider_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const active = data?.filter(r => ['accepted', 'en_route_pickup', 'passenger_picked'].includes(r.status)) || [];
      const completed = data?.filter(r => r.status === 'completed') || [];
      
      setActiveRides(active);
      setCompletedRides(completed);
    } catch (error) {
      console.error('Error fetching ride history:', error);
    }
  };

  const fetchEarnings = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: todayRides } = await supabase
        .from('rides')
        .select('fare')
        .eq('rider_id', profile?.id)
        .eq('status', 'completed')
        .gte('created_at', today);

      const { data: allRides } = await supabase
        .from('rides')
        .select('fare')
        .eq('rider_id', profile?.id)
        .eq('status', 'completed');

      const todayTotal = todayRides?.reduce((sum, ride) => sum + ride.fare, 0) || 0;
      const allTotal = allRides?.reduce((sum, ride) => sum + ride.fare, 0) || 0;

      setTodayEarnings(todayTotal);
      setTotalEarnings(allTotal);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  const updateOnlineStatus = async (online: boolean) => {
    try {
      setIsOnline(online);
      
      // Update rider availability using artist_availability table (reusing for riders)
      const { error } = await supabase
        .from('artist_availability')
        .upsert({
          artist_id: profile?.id,
          status: online ? 'available' : 'unavailable'
        });

      if (error) throw error;
      
      toast.success(online ? 'You are now online and available for rides' : 'You are now offline');
    } catch (error) {
      console.error('Error updating online status:', error);
      toast.error('Failed to update status');
    }
  };

  const acceptRideRequest = async (rideId: string) => {
    try {
      const { error } = await supabase
        .from('rides')
        .update({ 
          rider_id: profile?.id,
          status: 'accepted' 
        })
        .eq('id', rideId);

      if (error) throw error;
      
      await fetchRideRequests();
      await fetchRideHistory();
      toast.success('Ride request accepted!');
    } catch (error) {
      console.error('Error accepting ride:', error);
      toast.error('Failed to accept ride');
    }
  };

  const updateRideStatus = async (rideId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('rides')
        .update({ status })
        .eq('id', rideId);

      if (error) throw error;
      
      await fetchRideHistory();
      if (status === 'completed') {
        await fetchEarnings();
      }
      
      const statusMessages: { [key: string]: string } = {
        'en_route_pickup': 'Heading to pickup location',
        'passenger_picked': 'Passenger picked up, heading to destination',
        'completed': 'Ride completed successfully!'
      };
      
      toast.success(statusMessages[status] || 'Status updated');
    } catch (error) {
      console.error('Error updating ride status:', error);
      toast.error('Failed to update ride status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'en_route_pickup': return 'bg-purple-100 text-purple-800';
      case 'passenger_picked': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'requested': return 'New Request';
      case 'accepted': return 'Accepted';
      case 'en_route_pickup': return 'En Route to Pickup';
      case 'passenger_picked': return 'Passenger Onboard';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Rider Dashboard</h1>
              <p className="text-xl text-gray-600">Control your routes and earnings</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
                <Switch 
                  checked={isOnline}
                  onCheckedChange={updateOnlineStatus}
                />
              </div>
              <Badge className={`text-lg px-4 py-2 ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}>
                <Car className="w-4 h-4 mr-2" />
                {isOnline ? 'Available' : 'Unavailable'}
              </Badge>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                    <p className="text-2xl font-bold text-green-600">KSh {todayEarnings}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-blue-600">KSh {totalEarnings}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Rides</p>
                    <p className="text-2xl font-bold text-purple-600">{activeRides.length}</p>
                  </div>
                  <Route className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Today</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {completedRides.filter(r => 
                        new Date(r.created_at).toDateString() === new Date().toDateString()
                      ).length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="requests" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="requests">New Requests</TabsTrigger>
              <TabsTrigger value="active">Active Rides</TabsTrigger>
              <TabsTrigger value="history">Ride History</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
                    Available Ride Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!isOnline && (
                    <div className="text-center py-8">
                      <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">You're currently offline</p>
                      <p className="text-sm text-gray-400">Turn on availability to see ride requests</p>
                    </div>
                  )}
                  
                  {isOnline && rideRequests.length === 0 && (
                    <div className="text-center py-8">
                      <Navigation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No ride requests available</p>
                      <p className="text-sm text-gray-400">New requests will appear here</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {isOnline && rideRequests.map((request) => (
                      <Card key={request.id} className="border-l-4 border-l-yellow-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-start space-x-3 mb-3">
                                <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm text-gray-600">Pickup</p>
                                  <p className="font-medium">{request.pickup_location}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-3 mb-3">
                                <MapPin className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm text-gray-600">Drop-off</p>
                                  <p className="font-medium">{request.dropoff_location}</p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  Est. {request.estimated_duration} mins
                                </span>
                                <span className="flex items-center">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  KSh {request.fare}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                              <Button 
                                onClick={() => acceptRideRequest(request.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button variant="outline" size="sm">
                                <XCircle className="w-4 h-4 mr-1" />
                                Decline
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Rides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeRides.map((ride) => (
                      <Card key={ride.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <Badge className={getStatusColor(ride.status)}>
                              {getStatusText(ride.status)}
                            </Badge>
                            <span className="text-lg font-bold text-green-600">KSh {ride.fare}</span>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div className="flex items-start space-x-3">
                              <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-gray-600">Pickup</p>
                                <p className="font-medium">{ride.pickup_location}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <MapPin className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-gray-600">Drop-off</p>
                                <p className="font-medium">{ride.dropoff_location}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            {ride.status === 'accepted' && (
                              <Button 
                                onClick={() => updateRideStatus(ride.id, 'en_route_pickup')}
                                className="flex-1 bg-purple-600 hover:bg-purple-700"
                              >
                                Start Trip
                              </Button>
                            )}
                            
                            {ride.status === 'en_route_pickup' && (
                              <Button 
                                onClick={() => updateRideStatus(ride.id, 'passenger_picked')}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                Passenger Picked Up
                              </Button>
                            )}
                            
                            {ride.status === 'passenger_picked' && (
                              <Button 
                                onClick={() => updateRideStatus(ride.id, 'completed')}
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                              >
                                Complete Ride
                              </Button>
                            )}
                            
                            <Button variant="outline" className="flex-1">
                              <Navigation className="w-4 h-4 mr-1" />
                              Navigate
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {activeRides.length === 0 && (
                      <div className="text-center py-8">
                        <Route className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No active rides</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Rides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {completedRides.slice(0, 10).map((ride) => (
                      <Card key={ride.id} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{ride.pickup_location}</p>
                              <p className="text-sm text-gray-600">to {ride.dropoff_location}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(ride.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">KSh {ride.fare}</p>
                              <Badge className="bg-green-100 text-green-800">Completed</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {completedRides.length === 0 && (
                      <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No completed rides yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Earnings Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">KSh {todayEarnings}</p>
                        <p className="text-sm text-gray-600">Today's Earnings</p>
                      </div>
                      
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">KSh {totalEarnings}</p>
                        <p className="text-sm text-gray-600">Total Earnings</p>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{completedRides.length}</p>
                        <p className="text-sm text-gray-600">Total Rides</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Average per ride</span>
                        <span className="font-semibold">
                          KSh {completedRides.length > 0 ? Math.round(totalEarnings / completedRides.length) : 0}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Rides this week</span>
                        <span className="font-semibold">
                          {completedRides.filter(r => {
                            const rideDate = new Date(r.created_at);
                            const weekAgo = new Date();
                            weekAgo.setDate(weekAgo.getDate() - 7);
                            return rideDate >= weekAgo;
                          }).length}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Rating</span>
                        <div className="flex items-center">
                          <span className="font-semibold mr-1">4.8</span>
                          <div className="flex text-yellow-500">★★★★★</div>
                        </div>
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

export default RiderDashboard;
