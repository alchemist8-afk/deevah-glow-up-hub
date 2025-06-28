
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";

const BookingsPage = () => {
  const { profile } = useAuth();
  const { bookings } = useBookings();

  const myBookings = bookings.filter(b => b.client_id === profile?.id);
  const upcomingBookings = myBookings.filter(b => 
    new Date(b.booking_date) > new Date() && b.status !== 'cancelled'
  );
  const pastBookings = myBookings.filter(b => b.status === 'completed');

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No upcoming bookings</p>
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
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{booking.location_details}</span>
                        </div>
                        <div className="flex items-center justify-between">
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
              <CardTitle>Past Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pastBookings.slice(0, 5).map((booking) => (
                  <Card key={booking.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{booking.services?.name || 'Service'}</h4>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
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
      </div>
    </Layout>
  );
};

export default BookingsPage;
