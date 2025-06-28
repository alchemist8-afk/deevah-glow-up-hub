
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  location?: string;
  phone?: string;
  email?: string;
  image_url?: string;
  is_active?: boolean;
  created_at?: string;
}

export const useRestaurants = () => {
  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_role", "business")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data.map(profile => ({
        id: profile.id,
        name: profile.full_name,
        description: profile.bio,
        location: profile.location,
        image_url: profile.avatar_url,
        is_active: true,
        created_at: profile.created_at
      })) as Restaurant[];
    },
  });

  const queryClient = useQueryClient();

  const createRestaurant = useMutation({
    mutationFn: async (restaurantData: Omit<Restaurant, 'id' | 'created_at'>) => {
      // This would typically create a restaurant profile
      // For now, we'll just return the data since restaurants are profiles
      return restaurantData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      toast.success("Restaurant profile updated!");
    },
    onError: (error) => {
      toast.error("Failed to update restaurant profile");
      console.error("Restaurant update error:", error);
    },
  });

  return {
    restaurants,
    isLoading,
    createRestaurant,
  };
};
