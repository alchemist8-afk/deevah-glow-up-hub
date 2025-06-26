
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, Users, MapPin, Home, Building, Car, Star } from 'lucide-react';

interface BookingModalProps {
  children: React.ReactNode;
  service?: {
    id: string;
    name: string;
    price: number;
    category: string;
  };
}

const mockArtists = [
  { id: '1', name: 'Maya Styles', rating: 4.9, distance: '0.5 km', price: 85 },
  { id: '2', name: 'Zara Beauty', rating: 4.8, distance: '1.2 km', price: 75 },
  { id: '3', name: 'Amara Touch', rating: 4.7, distance: '2.1 km', price: 90 },
];

const mockRiders = [
  { id: '1', name: 'James Quick', rating: 4.8, distance: '0.3 km', price: 15, eta: '5 min' },
  { id: '2', name: 'Sarah Fast', rating: 4.9, distance: '0.8 km', price: 18, eta: '8 min' },
  { id: '3', name: 'Mike Speed', rating: 4.7, distance: '1.5 km', price: 22, eta: '12 min' },
];

export function BookingModal({ children, service }: BookingModalProps) {
  const { profile, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Form states
  const [selectedArtist, setSelectedArtist] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [locationType, setLocationType] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [isGroupSession, setIsGroupSession] = useState(false);
  const [maxGuests, setMaxGuests] = useState(1);
  const [notes, setNotes] = useState('');
  const [selectedRider, setSelectedRider] = useState('');
  const [needsRider, setNeedsRider] = useState(false);

  const handleNext = () => {
    if (step === 1 && !selectedArtist) {
      toast({
        title: "Select Artist",
        description: "Please choose an artist for your service",
        variant: "destructive"
      });
      return;
    }
    if (step === 2 && !bookingDate) {
      toast({
        title: "Select Date",
        description: "Please choose a date and time",
        variant: "destructive"
      });
      return;
    }
    if (step === 3 && !locationType) {
      toast({
        title: "Choose Location",
        description: "Please select where you'd like the service",
        variant: "destructive"
      });
      return;
    }
    setStep(step + 1);
  };

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
      const totalAmount = (service?.price || 0) + (needsRider && selectedRider ? mockRiders.find(r => r.id === selectedRider)?.price || 0 : 0);
      
      const { error } = await supabase
        .from('bookings')
        .insert({
          client_id: profile.id,
          service_id: service?.id,
          provider_id: selectedArtist,
          booking_date: new Date(bookingDate).toISOString(),
          location: locationType === 'home' ? homeAddress : locationType === 'salon' ? 'Salon Location' : 'Group Session Location',
          is_group_session: isGroupSession,
          max_guests: isGroupSession ? maxGuests : null,
          notes: notes || null,
          total_amount: totalAmount,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Booking Successful! 🎉",
        description: "Your booking has been submitted. We'll contact you soon to confirm."
      });

      setIsOpen(false);
      resetForm();

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

  const resetForm = () => {
    setStep(1);
    setSelectedArtist('');
    setBookingDate('');
    setLocationType('');
    setHomeAddress('');
    setIsGroupSession(false);
    setMaxGuests(1);
    setNotes('');
    setSelectedRider('');
    setNeedsRider(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose Your Artist</h3>
            <RadioGroup value={selectedArtist} onValueChange={setSelectedArtist}>
              {mockArtists.map((artist) => (
                <div key={artist.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={artist.id} id={artist.id} />
                  <Card className="flex-1 cursor-pointer" onClick={() => setSelectedArtist(artist.id)}>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{artist.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{artist.rating}</span>
                            <span>•</span>
                            <span>{artist.distance}</span>
                          </div>
                        </div>
                        <span className="font-bold text-purple-600">${artist.price}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Date & Time</h3>
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
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Where would you like the service?</h3>
            <RadioGroup value={locationType} onValueChange={setLocationType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id="home" />
                <Label htmlFor="home" className="flex items-center gap-2 cursor-pointer">
                  <Home className="w-4 h-4" />
                  At Your Home
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="salon" id="salon" />
                <Label htmlFor="salon" className="flex items-center gap-2 cursor-pointer">
                  <Building className="w-4 h-4" />
                  At the Salon
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="group" id="group" />
                <Label htmlFor="group" className="flex items-center gap-2 cursor-pointer">
                  <Users className="w-4 h-4" />
                  Join a Public Glow Session
                </Label>
              </div>
            </RadioGroup>

            {locationType === 'home' && (
              <div className="space-y-2">
                <Label htmlFor="homeAddress">Your Address</Label>
                <Input
                  id="homeAddress"
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  placeholder="Enter your full address"
                  required
                />
              </div>
            )}

            {(locationType === 'salon' || locationType === 'group') && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="needsRider"
                    checked={needsRider}
                    onCheckedChange={setNeedsRider}
                  />
                  <Label htmlFor="needsRider" className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Need a ride?
                  </Label>
                </div>

                {needsRider && (
                  <div className="space-y-2">
                    <Label>Available Riders</Label>
                    <RadioGroup value={selectedRider} onValueChange={setSelectedRider}>
                      {mockRiders.map((rider) => (
                        <div key={rider.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={rider.id} id={`rider-${rider.id}`} />
                          <Card className="flex-1 cursor-pointer" onClick={() => setSelectedRider(rider.id)}>
                            <CardContent className="p-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">{rider.name}</h4>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span>{rider.rating}</span>
                                    <span>•</span>
                                    <span>{rider.distance}</span>
                                    <span>•</span>
                                    <span>ETA: {rider.eta}</span>
                                  </div>
                                </div>
                                <span className="font-bold text-green-600">${rider.price}</span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Final Details</h3>
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
              <div className="bg-purple-50 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold">Booking Summary</h4>
                <div className="flex justify-between">
                  <span>{service.name}</span>
                  <span>${service.price}</span>
                </div>
                {needsRider && selectedRider && (
                  <div className="flex justify-between">
                    <span>Ride with {mockRiders.find(r => r.id === selectedRider)?.name}</span>
                    <span>${mockRiders.find(r => r.id === selectedRider)?.price}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(service.price + (needsRider && selectedRider ? mockRiders.find(r => r.id === selectedRider)?.price || 0 : 0)).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Book {service?.name || 'Service'} - Step {step} of 4
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {renderStep()}
          
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                resetForm();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            {step < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleBooking}
                disabled={isLoading}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
