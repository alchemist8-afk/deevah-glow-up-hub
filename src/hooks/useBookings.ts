
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Booking {
  id: string;
  client_id: string | null;
  artist_id: string | null;
  service_id: string | null;
  booking_date: string;
  status: string | null;
  location_type: string | null;
  location_details: string | null;
  price: number | null;
  escrow_held: boolean | null;
  mood: string | null;
  notes: string | null;
  total_amount: number;
  created_at: string | null;
  services?: {
    name: string;
    category: string;
    image_url: string | null;
  } | null;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  } | null;
}

export function useBookings() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings', user?.id, profile?.user_role],
    queryFn: async () => {
      if (!user?.id) return [];
      
      let query = supabase
        .from('bookings')
        .select(`
          *,
          services(name, category, image_url),
          profiles!bookings_artist_id_fkey(full_name, avatar_url)
        `);

      if (profile?.user_role === 'artist') {
        query = query.eq('artist_id', user.id);
      } else {
        query = query.eq('client_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!user?.id && !!profile?.user_role,
  });

  const createBooking = useMutation({
    mutationFn: async (bookingData: {
      artist_id: string;
      service_id: string;
      booking_date: string;
      location_type: string;
      location_details: string;
      price: number;
      mood?: string;
      notes?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          client_id: user.id,
          ...bookingData,
          total_amount: bookingData.price,
          escrow_held: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create booking: ' + error.message);
    },
  });

  const updateBookingStatus = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success(`Booking ${data.status} successfully!`);
    },
    onError: (error) => {
      toast.error('Failed to update booking: ' + error.message);
    },
  });

  return {
    bookings: bookings || [],
    isLoading,
    createBooking,
    updateBookingStatus,
  };
}
