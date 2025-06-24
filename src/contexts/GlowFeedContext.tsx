
import React, { createContext, useContext, useState } from 'react';

export interface GlowPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  image: string;
  caption: string;
  serviceUsed?: string;
  artistName?: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  timestamp: string;
  isGroupSession?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

interface GlowFeedContextType {
  posts: GlowPost[];
  addPost: (post: Omit<GlowPost, 'id' | 'likes' | 'isLiked' | 'comments' | 'timestamp'>) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, text: string, userName: string) => void;
}

const GlowFeedContext = createContext<GlowFeedContextType | undefined>(undefined);

export function GlowFeedProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<GlowPost[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'Zara M.',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b739',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e',
      caption: 'Absolutely loving these goddess braids! ✨ Perfect for the weekend vibes',
      serviceUsed: 'Goddess Braids',
      artistName: 'Maya Styles',
      likes: 47,
      isLiked: false,
      comments: [
        {
          id: 'c1',
          userId: 'user2',
          userName: 'Amina',
          text: 'Girl, you look stunning! 🔥',
          timestamp: '2 hours ago'
        }
      ],
      timestamp: '3 hours ago',
      isGroupSession: false
    },
    {
      id: '2',
      userId: 'user3',
      userName: 'Keisha B.',
      userAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
      image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2',
      caption: 'Glow Together session was amazing! Best spa day with my girls 💕',
      serviceUsed: 'Full Glow Package',
      artistName: 'Golden Beauty Team',
      likes: 23,
      isLiked: true,
      comments: [],
      timestamp: '5 hours ago',
      isGroupSession: true
    }
  ]);

  const addPost = (post: Omit<GlowPost, 'id' | 'likes' | 'isLiked' | 'comments' | 'timestamp'>) => {
    const newPost: GlowPost = {
      ...post,
      id: Date.now().toString(),
      likes: 0,
      isLiked: false,
      comments: [],
      timestamp: 'Just now'
    };

    setPosts(prev => [newPost, ...prev]);
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked 
          }
        : post
    ));
  };

  const addComment = (postId: string, text: string, userName: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: Date.now().toString(),
      userName,
      text,
      timestamp: 'Just now'
    };

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));
  };

  return (
    <GlowFeedContext.Provider value={{
      posts,
      addPost,
      likePost,
      addComment
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
