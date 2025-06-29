
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share, Users } from 'lucide-react';
import { useGlowFeed } from '@/contexts/GlowFeedContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export function GlowFeed() {
  const { posts, likePost, addComment, fetchPosts } = useGlowFeed();
  const { profile } = useAuth();
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddComment = (postId: string) => {
    const text = commentTexts[postId];
    if (text?.trim() && profile) {
      addComment(postId, text.trim());
      setCommentTexts(prev => ({ ...prev, [postId]: '' }));
    }
  };

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Glow Feed</h2>
          <p className="text-xl text-gray-600">See the latest transformations from our community</p>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={post.profiles?.avatar_url} />
                      <AvatarFallback>{post.profiles?.full_name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{post.profiles?.full_name || 'User'}</h4>
                      <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {post.is_group_session && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      <Users className="w-3 h-3 mr-1" />
                      Glow Together
                    </Badge>
                  )}
                </div>

                {/* Post Image */}
                <div className="relative">
                  <img 
                    src={post.image_url} 
                    alt="Glow transformation"
                    className="w-full h-80 object-cover"
                  />
                  {post.service_used && (
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {post.service_used} {post.artist_name && `by ${post.artist_name}`}
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div className="p-4">
                  {post.caption && <p className="text-gray-900 mb-3">{post.caption}</p>}
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-4 mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => likePost(post.id)}
                      className={post.isLiked ? 'text-red-500' : ''}
                    >
                      <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                      {post.likes_count}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      0
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>

                  {/* Add Comment */}
                  {profile && (
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a comment..."
                        value={commentTexts[post.id] || ''}
                        onChange={(e) => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      />
                      <Button 
                        size="sm" 
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentTexts[post.id]?.trim()}
                      >
                        Post
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
