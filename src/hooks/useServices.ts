
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Service {
  id: string;
  provider_id: string | null;
  name: string;
  category: string;
  description: string | null;
  price: number;
  duration: number | null;
  image_url: string | null;
  mood_tags: string[] | null;
  is_active: boolean | null;
  created_at: string | null;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  } | null;
}

export function useServices(category?: string, mood?: string) {
  const { data: services, isLoading } = useQuery({
    queryKey: ['services', category, mood],
    queryFn: async () => {
      let query = supabase
        .from('services')
        .select(`
          *,
          profiles!services_provider_id_fkey(full_name, avatar_url)
        `)
        .eq('is_active', true);

      // Handle category filter - don't filter if "all" is selected
      if (category && category !== 'all' && category !== '') {
        query = query.eq('category', category);
      }

      if (mood) {
        query = query.contains('mood_tags', [mood]);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }
      return data as Service[];
    },
  });

  return {
    services: services || [],
    isLoading,
  };
}

export function useCreateService() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceData: {
      name: string;
      category: string;
      description?: string;
      price: number;
      duration?: number;
      image_url?: string;
      mood_tags?: string[];
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('services')
        .insert({
          provider_id: user.id,
          ...serviceData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create service: ' + error.message);
    },
  });
}
