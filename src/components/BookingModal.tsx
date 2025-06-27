
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MapPin, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  price: number;
  category: string;
  provider_id?: string;
  duration?: number;
  description?: string;
}

interface Artist {
  id: string;
  full_name: string;
  avatar_url?: string;
  location?: string;
}

interface BookingModalProps {
  children: React.ReactNode;
  service: Service;
  artist?: Artist;
}

export function BookingModal({ children, service, artist }: BookingModalProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [locationType, setLocationType] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState('');
  
  const { createBooking } = useBookings();
  const { user, profile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) {
      toast.error('Please sign in to book a service');
      return;
    }

    if (!date || !time || !locationType || !locationDetails) {
      toast.error('Please fill in all required fields');
      return;
    }

    const bookingDateTime = new Date(date);
    const [hours, minutes] = time.split(':');
    bookingDateTime.setHours(parseInt(hours), parseInt(minutes));

    try {
      await createBooking.mutateAsync({
        artist_id: artist?.id || service.provider_id || '',
        service_id: service.id,
        booking_date: bookingDateTime.toISOString(),
        location_type: locationType,
        location_details: locationDetails,
        price: service.price,
        mood,
        notes
      });
      
      setOpen(false);
      // Reset form
      setDate(undefined);
      setTime('');
      setLocationType('');
      setLocationDetails('');
      setNotes('');
      setMood('');
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Book {service.name}
            {artist && <span className="text-sm text-gray-600">with {artist.full_name}</span>}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Service</Label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{service.name}</p>
                <p className="text-sm text-gray-600">{service.category}</p>
                <div className="flex items-center gap-2 mt-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">KSh {service.price}</span>
                  {service.duration && (
                    <>
                      <Clock className="w-4 h-4 ml-2" />
                      <span className="text-sm">{service.duration}min</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {artist && (
              <div className="space-y-2">
                <Label>Artist</Label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{artist.full_name}</p>
                  {artist.location && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs text-gray-600">{artist.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location-type">Location Type *</Label>
            <Select value={locationType} onValueChange={setLocationType}>
              <SelectTrigger>
                <SelectValue placeholder="Where would you like the service?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">At My Home</SelectItem>
                <SelectItem value="salon">At Salon/Studio</SelectItem>
                <SelectItem value="mobile">Mobile Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location-details">Location Details *</Label>
            <Input
              id="location-details"
              placeholder="Enter specific address or salon name"
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mood">Mood/Vibe</Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger>
                <SelectValue placeholder="What's your vibe?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calm">Calm & Relaxed</SelectItem>
                <SelectItem value="fast">Quick & Efficient</SelectItem>
                <SelectItem value="social">Social & Fun</SelectItem>
                <SelectItem value="private">Private & Intimate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Special Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any special requests or instructions?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createBooking.isPending}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {createBooking.isPending ? 'Booking...' : `Book for KSh ${service.price}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
