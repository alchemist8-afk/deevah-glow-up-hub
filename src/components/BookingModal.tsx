
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

interface BookingModalProps {
  children: React.ReactNode;
  service?: {
    id: string;
    name: string;
    price: number;
    category: string;
  };
}

export function BookingModal({ children, service }: BookingModalProps) {
  const { profile, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [bookingDate, setBookingDate] = useState('');
  const [location, setLocation] = useState('');
  const [isGroupSession, setIsGroupSession] = useState(false);
  const [maxGuests, setMaxGuests] = useState(1);
  const [notes, setNotes] = useState('');

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !profile) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a service",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          client_id: profile.id,
          service_id: service?.id,
          booking_date: new Date(bookingDate).toISOString(),
          location: location || null,
          is_group_session: isGroupSession,
          max_guests: isGroupSession ? maxGuests : null,
          notes: notes || null,
          total_amount: service?.price || 0,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Booking Successful! 🎉",
        description: "Your booking has been submitted. We'll contact you soon to confirm."
      });

      setIsOpen(false);
      // Reset form
      setBookingDate('');
      setLocation('');
      setIsGroupSession(false);
      setMaxGuests(1);
      setNotes('');

    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#E07A5F]" />
            Book {service?.name || 'Service'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleBooking} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bookingDate" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Date & Time *
            </Label>
            <Input
              id="bookingDate"
              type="datetime-local"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your address or preferred location"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="groupSession"
              checked={isGroupSession}
              onCheckedChange={setIsGroupSession}
            />
            <Label htmlFor="groupSession" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Group Session (Glow Together)
            </Label>
          </div>

          {isGroupSession && (
            <div className="space-y-2">
              <Label htmlFor="maxGuests">Number of Guests</Label>
              <Select value={maxGuests.toString()} onValueChange={(value) => setMaxGuests(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 6, 7, 8].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} people
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Special Requests</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or notes for your appointment..."
              rows={3}
            />
          </div>

          {service && (
            <div className="bg-[#F4F1DE] p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{service.name}</span>
                <span className="text-[#E07A5F] font-bold">
                  ${service.price}{isGroupSession && ` x ${maxGuests}`}
                </span>
              </div>
              {isGroupSession && (
                <div className="text-sm text-gray-600 mt-1">
                  Total: ${(service.price * maxGuests).toFixed(2)}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#E07A5F] hover:bg-[#E07A5F]/90"
            >
              {isLoading ? 'Booking...' : 'Book Now'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
