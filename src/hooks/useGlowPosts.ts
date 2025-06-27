
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface GlowPost {
  id: string;
  artist_id: string | null;
  user_id: string | null;
  image_url: string;
  description: string | null;
  caption: string | null;
  service_used: string | null;
  artist_name: string | null;
  mood_tags: string[] | null;
  likes_count: number | null;
  is_group_session: boolean | null;
  created_at: string | null;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  } | null;
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
        query = query.eq('service_used', category);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as GlowPost[];
    },
  });

  const createPost = useMutation({
    mutationFn: async (postData: {
      image_url: string;
      description?: string;
      caption?: string;
      service_used?: string;
      artist_name?: string;
      mood_tags?: string[];
      is_group_session?: boolean;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('glow_posts')
        .insert({
          artist_id: user.id,
          user_id: user.id,
          ...postData,
          likes_count: 0,
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
