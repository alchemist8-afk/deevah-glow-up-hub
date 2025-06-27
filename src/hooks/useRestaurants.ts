
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

// Simulate restaurants with existing data structure
export function useRestaurants(mood?: string) {
  const { data: restaurants, isLoading } = useQuery({
    queryKey: ['restaurants', mood],
    queryFn: async () => {
      // For now, create sample restaurants from business profiles
      const { data: businessProfiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_role', 'business');

      const sampleRestaurants: Restaurant[] = [
        {
          id: '1',
          owner_id: businessProfiles?.[0]?.id || null,
          name: 'Mama Njeri Kitchen',
          description: 'Authentic Kenyan home cooking',
          cuisine_type: 'Kenyan',
          address: 'Westlands, Nairobi',
          phone: '+254701234567',
          image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
          rating: 4.5,
          is_active: true,
          mood_tags: mood ? [mood] : ['calm', 'social'],
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          owner_id: businessProfiles?.[1]?.id || null,
          name: 'Urban Bites',
          description: 'Modern fusion restaurant',
          cuisine_type: 'International',
          address: 'Karen, Nairobi',
          phone: '+254702345678',
          image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
          rating: 4.2,
          is_active: true,
          mood_tags: mood ? [mood] : ['fast', 'social'],
          created_at: new Date().toISOString()
        }
      ];

      return mood ? sampleRestaurants.filter(r => r.mood_tags?.includes(mood)) : sampleRestaurants;
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

      if (error) {
        // If no meals exist, return sample data
        const sampleMeals: Meal[] = [
          {
            id: '1',
            restaurant_id: restaurantId || '1',
            name: 'Nyama Choma Platter',
            category: 'Main Course',
            description: 'Grilled meat with ugali and vegetables',
            price: 850,
            prep_time: 30,
            image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
            mood_tags: ['social', 'calm'],
            is_available: true,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            restaurant_id: restaurantId || '2',
            name: 'Chicken Burger',
            category: 'Fast Food',
            description: 'Crispy chicken burger with fries',
            price: 450,
            prep_time: 15,
            image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
            mood_tags: ['fast', 'social'],
            is_available: true,
            created_at: new Date().toISOString()
          }
        ];

        return mood ? sampleMeals.filter(m => m.mood_tags?.includes(mood)) : sampleMeals;
      }
      
      return data as Meal[];
    },
  });

  return {
    meals: meals || [],
    isLoading,
  };
}
