
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, MapPin, Clock, Star, Phone, Navigation } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Ride {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  fare: number;
  status: string;
  estimated_duration: number;
  created_at: string;
  rider_id: string;
  passenger_id: string;
}

const RidesPage = () => {
  const { user, profile } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRides();
    }
  }, [user]);

  const fetchRides = async () => {
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .or(`rider_id.eq.${user?.id},passenger_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRides(data || []);
    } catch (error) {
      console.error('Error fetching rides:', error);
      toast.error('Failed to load rides');
    } finally {
      setIsLoading(false);
    }
  };

  const updateRideStatus = async (rideId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('rides')
        .update({ status: newStatus })
        .eq('id', rideId);

      if (error) throw error;
      
      await fetchRides();
      toast.success(`Ride ${newStatus} successfully`);
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
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'requested': return 'Ride Requested';
      case 'accepted': return 'Driver Assigned';
      case 'en_route_pickup': return 'Driver En Route';
      case 'passenger_picked': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const isDriver = profile?.user_role === 'transport';

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your rides...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isDriver ? 'My Rides - Driver' : 'My Rides'}
            </h1>
            <p className="text-gray-600">
              {isDriver ? 'Manage your ride requests and earnings' : 'Track your booked rides and trip history'}
            </p>
          </div>

          {rides.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isDriver ? 'No ride requests yet' : 'No rides booked yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {isDriver 
                    ? 'New ride requests will appear here when passengers book rides in your area.'
                    : 'When you book a ride, it will appear here for tracking.'
                  }
                </p>
                {!isDriver && (
                  <Button
                    onClick={() => window.location.href = '/'}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Book Your First Ride
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {rides.map((ride) => (
                <Card key={ride.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Car className="w-5 h-5 text-blue-600" />
                        Ride #{ride.id.slice(-8)}
                      </CardTitle>
                      <Badge className={getStatusColor(ride.status)}>
                        {getStatusText(ride.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-600">Pickup</p>
                            <p className="font-medium text-gray-900">{ride.pickup_location}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-600">Drop-off</p>
                            <p className="font-medium text-gray-900">{ride.dropoff_location}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              Est. {ride.estimated_duration} mins
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">KSh {ride.fare}</p>
                          </div>
                        </div>

                        {/* Action buttons based on role and status */}
                        <div className="flex gap-2">
                          {isDriver && ride.status === 'requested' && (
                            <>
                              <Button
                                onClick={() => updateRideStatus(ride.id, 'accepted')}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                Accept Ride
                              </Button>
                              <Button
                                onClick={() => updateRideStatus(ride.id, 'cancelled')}
                                variant="outline"
                                className="flex-1"
                              >
                                Decline
                              </Button>
                            </>
                          )}
                          
                          {isDriver && ride.status === 'accepted' && (
                            <Button
                              onClick={() => updateRideStatus(ride.id, 'en_route_pickup')}
                              className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                              Start Trip
                            </Button>
                          )}
                          
                          {isDriver && ride.status === 'en_route_pickup' && (
                            <Button
                              onClick={() => updateRideStatus(ride.id, 'passenger_picked')}
                              className="w-full bg-purple-600 hover:bg-purple-700"
                            >
                              Passenger Picked Up
                            </Button>
                          )}
                          
                          {isDriver && ride.status === 'passenger_picked' && (
                            <Button
                              onClick={() => updateRideStatus(ride.id, 'completed')}
                              className="w-full bg-green-600 hover:bg-green-700"
                            >
                              Complete Ride
                            </Button>
                          )}

                          {!isDriver && ['requested', 'accepted', 'en_route_pickup'].includes(ride.status) && (
                            <Button
                              onClick={() => updateRideStatus(ride.id, 'cancelled')}
                              variant="outline"
                              className="w-full"
                            >
                              Cancel Ride
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RidesPage;
