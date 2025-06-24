
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MoodType } from './MoodContext';

export interface Service {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  duration?: number;
  image_url?: string;
  provider_id: string;
  created_at: string;
}

export interface Booking {
  id: string;
  client_id: string;
  provider_id: string;
  service_id: string;
  booking_date: string;
  status: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  location?: string;
  notes?: string;
  mood?: MoodType;
  is_group_session: boolean;
  max_guests?: number;
  created_at: string;
}

interface BookingContextType {
  services: Service[];
  bookings: Booking[];
  isLoading: boolean;
  fetchServices: (category?: string, mood?: MoodType) => Promise<void>;
  createBooking: (serviceId: string, bookingData: Partial<Booking>) => Promise<{ success: boolean; error?: any }>;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<void>;
  fetchUserBookings: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchServices = async (category?: string, mood?: MoodType) => {
    setIsLoading(true);
    try {
      let query = supabase.from('services').select('*');
      
      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createBooking = async (serviceId: string, bookingData: Partial<Booking>) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          client_id: user.id,
          service_id: serviceId,
          ...bookingData
        })
        .select()
        .single();

      if (error) throw error;

      setBookings(prev => [data, ...prev]);
      
      toast({
        title: "Booking Created!",
        description: "Your booking has been submitted successfully"
      });

      return { success: true };
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to create booking",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status }
            : booking
        )
      );

      toast({
        title: "Booking Updated",
        description: `Booking status changed to ${status}`
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update booking status",
        variant: "destructive"
      });
    }
  };

  const fetchUserBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services(name, category, price),
          profiles!bookings_provider_id_fkey(full_name, avatar_url)
        `)
        .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  return (
    <BookingContext.Provider value={{
      services,
      bookings,
      isLoading,
      fetchServices,
      createBooking,
      updateBookingStatus,
      fetchUserBookings
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
