
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface GlowPost {
  id: string;
  artist_id: string;
  image_url: string;
  description: string;
  service_category: string;
  mood_tags: string[];
  likes_count: number;
  is_featured: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

export function useGlowPosts(category?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['glow-posts', category],
    queryFn: async () => {
      let query = supabase
        .from('glow_posts')
        .select(`
          *,
          profiles!glow_posts_artist_id_fkey(full_name, avatar_url)
        `);

      if (category) {
        query = query.eq('service_category', category);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as GlowPost[];
    },
  });

  const createPost = useMutation({
    mutationFn: async (postData: {
      image_url: string;
      description: string;
      service_category: string;
      mood_tags?: string[];
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('glow_posts')
        .insert({
          artist_id: user.id,
          ...postData,
          likes_count: 0,
          is_featured: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glow-posts'] });
      toast.success('Post created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create post: ' + error.message);
    },
  });

  const likePost = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.rpc('increment_likes', { post_id: postId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glow-posts'] });
    },
  });

  return {
    posts: posts || [],
    isLoading,
    createPost,
    likePost,
  };
}
