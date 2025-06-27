
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Product {
  id: string;
  seller_id: string | null;
  name: string;
  category: string;
  description: string | null;
  price: number;
  stock_quantity: number | null;
  image_url: string | null;
  mood_tags: string[] | null;
  is_active: boolean | null;
  created_at: string | null;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  } | null;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string | null;
  products?: Product | null;
}

export function useProducts(category?: string, mood?: string) {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', category, mood],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          profiles!products_seller_id_fkey(full_name, avatar_url)
        `)
        .eq('is_active', true);

      if (category) {
        query = query.eq('category', category);
      }

      if (mood) {
        query = query.contains('mood_tags', [mood]);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });

  return {
    products: products || [],
    isLoading,
  };
}

export function useCart() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data as CartItem[];
    },
    enabled: !!user?.id,
  });

  const addToCart = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          product_id: productId,
          quantity,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Added to cart!');
    },
    onError: (error) => {
      toast.error('Failed to add to cart: ' + error.message);
    },
  });

  const removeFromCart = useMutation({
    mutationFn: async (cartItemId: string) => {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Removed from cart!');
    },
    onError: (error) => {
      toast.error('Failed to remove from cart: ' + error.message);
    },
  });

  return {
    cartItems: cartItems || [],
    isLoading,
    addToCart,
    removeFromCart,
  };
}
