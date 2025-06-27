
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/BookingModal";
import { History, Star, Calendar, Repeat } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface CompletedBooking {
  id: string;
  service_id: string;
  artist_id: string;
  booking_date: string;
  price: number;
  status: string;
  services: {
    name: string;
    category: string;
    image_url: string;
  };
  profiles: {
    full_name: string;
  };
}

export function PastGlowsSection() {
  const { user, profile } = useAuth();

  const { data: pastBookings, isLoading } = useQuery({
    queryKey: ['past-bookings', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          service_id,
          artist_id,
          booking_date,
          price,
          status,
          services!inner(name, category, image_url),
          profiles!bookings_artist_id_fkey(full_name)
        `)
        .eq('client_id', user.id)
        .eq('status', 'completed')
        .order('booking_date', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching past bookings:', error);
        return [];
      }

      return data as CompletedBooking[];
    },
    enabled: !!user?.id,
  });

  if (!profile || !user) return null;

  if (isLoading) {
    return (
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <History className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Your Past Glows
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <History className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Your Past Glows
              </h2>
            </div>
            <p className="text-gray-600">
              Book your favorite artists and services again
            </p>
          </div>
        </div>

        {pastBookings && pastBookings.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {pastBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="relative">
                  <img 
                    src={booking.services.image_url || 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7'} 
                    alt={booking.services.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-blue-500 text-white">
                      {booking.services.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-3 h-3 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{booking.services.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">with {booking.profiles.full_name}</p>
                  
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                    <span className="ml-auto text-lg font-bold text-blue-600">KES {booking.price}</span>
                  </div>

                  <div className="space-y-2">
                    <BookingModal service={{
                      id: booking.service_id,
                      name: booking.services.name,
                      price: booking.price,
                      category: booking.services.category
                    }}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Repeat className="w-4 h-4 mr-2" />
                        Book Again
                      </Button>
                    </BookingModal>
                    
                    <Button variant="outline" className="w-full">
                      View Artist Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No past services yet</h3>
            <p className="text-gray-500 mb-6">Book your first service to see your glow journey!</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Browse Services
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
