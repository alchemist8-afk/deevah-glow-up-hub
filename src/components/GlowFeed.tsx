
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share } from "lucide-react";

const glowPosts = [
  {
    id: 1,
    artist: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    caption: "Soft glam for a beautiful bride ✨ #MakeupArtist #BridalMakeup",
    likes: 124,
    comments: 18,
    category: "Makeup"
  },
  {
    id: 2,
    artist: "Marcus Williams",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    caption: "Fresh fade on point! 💯 #BarberLife #FreshCut",
    likes: 89,
    comments: 12,
    category: "Barber"
  },
  {
    id: 3,
    artist: "Zara Ahmed",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    caption: "Volume lashes that speak volumes 👁️ #LashExtensions #BeautyGoals",
    likes: 156,
    comments: 24,
    category: "Lashes"
  },
  {
    id: 4,
    artist: "David Kim",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    caption: "Transformation Tuesday! From damaged to gorgeous 🌟 #HairTransformation",
    likes: 203,
    comments: 31,
    category: "Hair"
  }
];

export function GlowFeed() {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 gradient-text">Glow Feed</h2>
          <p className="text-xl text-muted-foreground">
            See the latest beauty transformations from our talented artists
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {glowPosts.map((post, index) => (
            <Card 
              key={post.id} 
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                <img 
                  src={post.image} 
                  alt={`Post by ${post.artist}`}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-deevah-purple text-white px-2 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm">{post.artist}</h4>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {post.caption}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-blue-500 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </button>
                  </div>
                  <button className="text-muted-foreground hover:text-deevah-purple transition-colors">
                    <Share className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button className="bg-gradient-deevah hover:opacity-90 transition-opacity px-8 py-3">
            View More Transformations
          </Button>
        </div>
      </div>
    </section>
  );
}
