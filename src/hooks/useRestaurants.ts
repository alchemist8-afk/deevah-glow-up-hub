
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Restaurant {
  id: string;
  owner_id: string | null;
  name: string;
  description: string | null;
  cuisine_type: string | null;
  address: string;
  phone: string | null;
  image_url: string | null;
  rating: number | null;
  is_active: boolean | null;
  mood_tags: string[] | null;
  created_at: string | null;
}

export interface Meal {
  id: string;
  restaurant_id: string | null;
  name: string;
  category: string;
  description: string | null;
  price: number;
  prep_time: number | null;
  image_url: string | null;
  mood_tags: string[] | null;
  is_available: boolean | null;
  created_at: string | null;
}

export function useRestaurants(mood?: string) {
  const { data: restaurants, isLoading } = useQuery({
    queryKey: ['restaurants', mood],
    queryFn: async () => {
      let query = supabase
        .from('restaurants')
        .select('*')
        .eq('is_active', true);

      if (mood) {
        query = query.contains('mood_tags', [mood]);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as Restaurant[];
    },
  });

  return {
    restaurants: restaurants || [],
    isLoading,
  };
}

export function useMeals(restaurantId?: string, mood?: string) {
  const { data: meals, isLoading } = useQuery({
    queryKey: ['meals', restaurantId, mood],
    queryFn: async () => {
      let query = supabase
        .from('meals')
        .select('*')
        .eq('is_available', true);

      if (restaurantId) {
        query = query.eq('restaurant_id', restaurantId);
      }

      if (mood) {
        query = query.contains('mood_tags', [mood]);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as Meal[];
    },
  });

  return {
    meals: meals || [],
    isLoading,
  };
}
