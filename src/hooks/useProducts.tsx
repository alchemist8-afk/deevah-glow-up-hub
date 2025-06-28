
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  stock_quantity?: number;
  image_url?: string;
  seller_id?: string;
  provider_id?: string;
  mood_tags?: string[];
  is_active?: boolean;
  created_at?: string;
}

export const useProducts = () => {
  const { profile } = useAuth();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });

  const queryClient = useQueryClient();

  const createProduct = useMutation({
    mutationFn: async (productData: Omit<Product, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from("products")
        .insert([{
          ...productData,
          seller_id: profile?.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create product");
      console.error("Product creation error:", error);
    },
  });

  return {
    products,
    isLoading,
    createProduct,
  };
};
