
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, MapPin, Clock, Star, Navigation } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Driver {
  id: string;
  name: string;
  rating: number;
  vehicle: string;
  distance: string;
  estimatedTime: string;
  fare: number;
  avatar?: string;
}

const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'James Kariuki',
    rating: 4.9,
    vehicle: 'Toyota Vitz',
    distance: '2.1 km away',
    estimatedTime: '5 mins',
    fare: 150,
    avatar: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Grace Wanjiku',
    rating: 4.8,
    vehicle: 'Nissan Note',
    distance: '3.5 km away',
    estimatedTime: '8 mins',
    fare: 200,
    avatar: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Peter Mwangi',
    rating: 4.7,
    vehicle: 'Honda Fit',
    distance: '1.8 km away',
    estimatedTime: '4 mins',
    fare: 120,
    avatar: '/placeholder.svg'
  }
];

export function DeevahRidesSection() {
  const { isAuthenticated, user } = useAuth();
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [showDrivers, setShowDrivers] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const handleSearchRides = () => {
    if (!pickupLocation.trim() || !dropoffLocation.trim()) {
      toast.error('Please enter both pickup and drop-off locations');
      return;
    }
    setShowDrivers(true);
  };

  const handleBookRide = async (driver: Driver) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book a ride');
      return;
    }

    setIsBooking(true);
    setSelectedDriver(driver);

    try {
      // Create ride booking in database
      const { error } = await supabase
        .from('rides')
        .insert({
          passenger_id: user?.id,
          rider_id: driver.id, // In real app, this would be the actual driver's user ID
          pickup_location: pickupLocation,
          dropoff_location: dropoffLocation,
          fare: driver.fare,
          status: 'requested',
          estimated_duration: parseInt(driver.estimatedTime)
        });

      if (error) throw error;

      toast.success(`Ride booked with ${driver.name}! They'll be there in ${driver.estimatedTime}`);
      
      // Reset form
      setPickupLocation('');
      setDropoffLocation('');
      setShowDrivers(false);

    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book ride. Please try again.');
    } finally {
      setIsBooking(false);
      setSelectedDriver(null);
    }
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Car className="w-12 h-12 text-blue-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Deevah Rides
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get there in style. Book reliable rides to your beauty appointments, shopping trips, or anywhere you need to glow.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-600" />
                Where would you like to go?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-green-600" />
                  <Input
                    placeholder="Pickup location"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-red-600" />
                  <Input
                    placeholder="Drop-off location"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>

                <Button 
                  onClick={handleSearchRides}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Find Available Rides
                </Button>
              </div>

              {showDrivers && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Available Drivers</h3>
                  
                  {mockDrivers.map((driver) => (
                    <Card key={driver.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <Car className="w-6 h-6 text-gray-600" />
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-900">{driver.name}</h4>
                              <p className="text-sm text-gray-600">{driver.vehicle}</p>
                              <div className="flex items-center space-x-3 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span>{driver.rating}</span>
                                </div>
                                <span>•</span>
                                <span>{driver.distance}</span>
                                <span>•</span>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{driver.estimatedTime}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">KSh {driver.fare}</p>
                            <Button
                              onClick={() => handleBookRide(driver)}
                              disabled={isBooking && selectedDriver?.id === driver.id}
                              className="mt-2 bg-blue-600 hover:bg-blue-700"
                            >
                              {isBooking && selectedDriver?.id === driver.id ? 'Booking...' : 'Book Ride'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reliable Rides</h3>
            <p className="text-gray-600">Vetted drivers with high ratings and well-maintained vehicles</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Pickup</h3>
            <p className="text-gray-600">Average pickup time of 5 minutes in busy areas</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Experience</h3>
            <p className="text-gray-600">Clean cars, professional drivers, and seamless booking</p>
          </div>
        </div>
      </div>
    </section>
  );
}
