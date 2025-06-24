
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface GlowPost {
  id: string;
  user_id: string;
  image_url: string;
  caption?: string;
  service_used?: string;
  artist_name?: string;
  likes_count: number;
  is_group_session: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
  isLiked?: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface GlowFeedContextType {
  posts: GlowPost[];
  isLoading: boolean;
  fetchPosts: () => Promise<void>;
  createPost: (imageUrl: string, caption?: string, serviceUsed?: string, artistName?: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  addComment: (postId: string, commentText: string) => Promise<void>;
  fetchComments: (postId: string) => Promise<PostComment[]>;
}

const GlowFeedContext = createContext<GlowFeedContextType | undefined>(undefined);

export function GlowFeedProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<GlowPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('glow_posts')
        .select(`
          *,
          profiles(full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check which posts are liked by current user
      if (user && data) {
        const { data: likes } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id);

        const likedPostIds = new Set(likes?.map(like => like.post_id) || []);
        
        const postsWithLikes = data.map(post => ({
          ...post,
          isLiked: likedPostIds.has(post.id)
        }));

        setPosts(postsWithLikes);
      } else {
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (imageUrl: string, caption?: string, serviceUsed?: string, artistName?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('glow_posts')
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          caption,
          service_used: serviceUsed,
          artist_name: artistName,
          is_group_session: false
        })
        .select(`
          *,
          profiles(full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      setPosts(prev => [data, ...prev]);
      
      toast({
        title: "Post Created! ✨",
        description: "Your glow moment has been shared"
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Failed to post",
        description: "Could not create your post",
        variant: "destructive"
      });
    }
  };

  const likePost = async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user.id
        });

      if (error && error.code !== '23505') throw error; // Ignore duplicate key errors

      // Update post likes count using direct SQL
      await supabase
        .from('glow_posts')
        .update({ likes_count: supabase.raw('likes_count + 1') })
        .eq('id', postId);

      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes_count: post.likes_count + 1, isLiked: true }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const unlikePost = async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update post likes count using direct SQL
      await supabase
        .from('glow_posts')
        .update({ likes_count: supabase.raw('GREATEST(likes_count - 1, 0)') })
        .eq('id', postId);

      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes_count: Math.max(0, post.likes_count - 1), isLiked: false }
          : post
      ));
    } catch (error) {
      console.error('Error unliking post:', error);
    }
  };

  const addComment = async (postId: string, commentText: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          comment_text: commentText
        });

      if (error) throw error;

      toast({
        title: "Comment added",
        description: "Your comment has been posted"
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Failed to comment",
        description: "Could not add your comment",
        variant: "destructive"
      });
    }
  };

  const fetchComments = async (postId: string): Promise<PostComment[]> => {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          profiles(full_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  return (
    <GlowFeedContext.Provider value={{
      posts,
      isLoading,
      fetchPosts,
      createPost,
      likePost,
      unlikePost,
      addComment,
      fetchComments
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
