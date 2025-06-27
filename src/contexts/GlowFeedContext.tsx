
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GlowPost {
  id: string;
  user_id: string | null;
  artist_id: string | null;
  image_url: string;
  caption: string | null;
  description: string | null;
  service_used: string | null;
  artist_name: string | null;
  is_group_session: boolean | null;
  likes_count: number | null;
  mood_tags: string[] | null;
  created_at: string | null;
  profiles?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  } | null;
  isLiked?: boolean;
}

interface GlowFeedContextType {
  posts: GlowPost[];
  isLoading: boolean;
  fetchPosts: () => Promise<void>;
  createPost: (postData: {
    image_url: string;
    caption?: string;
    service_used?: string;
    artist_name?: string;
    is_group_session?: boolean;
  }) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  addComment: (postId: string, comment: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
}

const GlowFeedContext = createContext<GlowFeedContextType | undefined>(undefined);

export function GlowFeedProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<GlowPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('glow_posts')
        .select(`
          *,
          profiles!glow_posts_user_id_fkey (
            id,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check which posts are liked by current user
      const { data: { user } } = await supabase.auth.getUser();
      let likedPostIds: string[] = [];
      
      if (user && data) {
        const { data: likes } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', data.map(post => post.id));
        
        likedPostIds = likes?.map(like => like.post_id) || [];
      }

      const postsWithLikes = data?.map(post => ({
        ...post,
        isLiked: likedPostIds.includes(post.id)
      })) || [];

      setPosts(postsWithLikes);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (postData: {
    image_url: string;
    caption?: string;
    service_used?: string;
    artist_name?: string;
    is_group_session?: boolean;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('glow_posts')
        .insert({
          user_id: user.id,
          ...postData
        });

      if (error) throw error;
      
      // Refresh posts after creating
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const likePost = async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if already liked
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike - remove the like
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;

        // Use RPC function to decrement likes
        await supabase.rpc('decrement_likes', { post_id: postId });

        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, likes_count: Math.max((post.likes_count || 0) - 1, 0), isLiked: false }
            : post
        ));
      } else {
        // Like - add the like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });

        if (error && error.code !== '23505') throw error; // Ignore duplicate key errors

        // Use RPC function to increment likes
        await supabase.rpc('increment_likes', { post_id: postId });

        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, likes_count: (post.likes_count || 0) + 1, isLiked: true }
            : post
        ));
      }
    } catch (error) {
      console.error('Error toggling post like:', error);
    }
  };

  const addComment = async (postId: string, comment: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          comment_text: comment
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('glow_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };

  return (
    <GlowFeedContext.Provider value={{
      posts,
      isLoading,
      fetchPosts,
      createPost,
      likePost,
      addComment,
      deletePost,
    }}>
      {children}
    </GlowFeedContext.Provider>
  );
}

export function useGlowFeed() {
  const context = useContext(GlowFeedContext);
  if (context === undefined) {
    throw new Error('useGlowFeed must be used within a GlowFeedProvider');
  }
  return context;
}
