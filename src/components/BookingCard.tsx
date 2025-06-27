
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";
import { Booking } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/hooks/useBookings";

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const { profile } = useAuth();
  const { updateBookingStatus } = useBookings();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-green-500';
      case 'en_route': return 'bg-blue-500';
      case 'in_progress': return 'bg-purple-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      case 'rejected': return 'bg-red-600';
      default: return 'bg-gray-400';
    }
  };

  const canAcceptReject = profile?.user_role === 'artist' && booking.status === 'pending';
  const canMarkComplete = profile?.user_role === 'artist' && booking.status === 'in_progress';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={booking.profiles?.avatar_url} />
              <AvatarFallback>{booking.profiles?.full_name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{booking.services?.name}</CardTitle>
              <p className="text-sm text-gray-600">
                {profile?.user_role === 'artist' ? 'Client' : 'Artist'}: {booking.profiles?.full_name}
              </p>
            </div>
          </div>
          <Badge className={`${getStatusColor(booking.status)} text-white`}>
            {booking.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{new Date(booking.booking_date).toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="capitalize">{booking.location_type}</span>
          </div>
          <div className="font-semibold text-blue-600">
            KES {booking.price}
          </div>
        </div>

        {booking.location_details && (
          <div className="text-sm text-gray-600">
            <strong>Location:</strong> {booking.location_details}
          </div>
        )}

        {booking.notes && (
          <div className="text-sm text-gray-600">
            <strong>Notes:</strong> {booking.notes}
          </div>
        )}

        {(canAcceptReject || canMarkComplete) && (
          <div className="flex gap-2 pt-2">
            {canAcceptReject && (
              <>
                <Button
                  size="sm"
                  onClick={() => updateBookingStatus.mutate({ bookingId: booking.id, status: 'accepted' })}
                  disabled={updateBookingStatus.isPending}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => updateBookingStatus.mutate({ bookingId: booking.id, status: 'rejected' })}
                  disabled={updateBookingStatus.isPending}
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            
            {canMarkComplete && (
              <Button
                size="sm"
                onClick={() => updateBookingStatus.mutate({ bookingId: booking.id, status: 'completed' })}
                disabled={updateBookingStatus.isPending}
                className="w-full"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark Complete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
