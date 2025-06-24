
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { Calendar, Clock, MapPin, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: string;
    name: string;
    provider: string;
    providerId: string;
    price: number;
    duration?: string;
    type: 'service' | 'product' | 'food';
  };
}

export function BookingModal({ isOpen, onClose, service }: BookingModalProps) {
  const { profile } = useAuth();
  const { createBooking } = useBooking();
  const { toast } = useToast();
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    location: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;

    const bookingDateTime = `${bookingData.date}T${bookingData.time}:00.000Z`;

    const result = await createBooking(service.id, {
      provider_id: service.providerId,
      booking_date: bookingDateTime,
      total_amount: service.price,
      location: bookingData.location,
      notes: bookingData.notes
    });

    if (result.success) {
      onClose();
      setBookingData({ date: '', time: '', location: '', notes: '' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Book {service.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Service Details</Label>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{service.name}</span>
                <span className="flex items-center text-green-600">
                  <DollarSign className="w-4 h-4" />
                  {service.price}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Provider: {service.provider}</span>
                {service.duration && (
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {service.duration}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Preferred Date</Label>
              <Input
                id="date"
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time</Label>
              <Input
                id="time"
                type="time"
                value={bookingData.time}
                onChange={(e) => setBookingData(prev => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Your address or salon location"
              value={bookingData.location}
              onChange={(e) => setBookingData(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special requests or requirements..."
              value={bookingData.notes}
              onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
              Book Now
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
