
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Camera, Image as ImageIcon } from "lucide-react";
import { GlowFeed } from "@/components/GlowFeed";
import { useGlowFeed } from "@/contexts/GlowFeedContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const GlowFeedPage = () => {
  const { createPost } = useGlowFeed();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [newPost, setNewPost] = useState({
    image: '',
    caption: '',
    serviceUsed: '',
    artistName: '',
    isGroupSession: false
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmitPost = () => {
    if (!profile || !newPost.image || !newPost.caption) return;

    createPost(
      newPost.image,
      newPost.caption,
      newPost.serviceUsed || undefined,
      newPost.artistName || undefined
    );

    toast({
      title: "Post Shared!",
      description: "Your glow transformation has been shared with the community."
    });

    setNewPost({
      image: '',
      caption: '',
      serviceUsed: '',
      artistName: '',
      isGroupSession: false
    });
    setIsDialogOpen(false);
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2',
    'https://images.unsplash.com/photo-1583000520395-7e30d4e2fc88',
    'https://images.unsplash.com/photo-1571875257727-4ddc5cf765d6'
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Glow Feed</h1>
              <p className="text-xl text-gray-600">Share your beauty transformations with the community</p>
            </div>
            
            {profile && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Share Your Glow
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share Your Transformation</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Choose a photo</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {sampleImages.map((img, index) => (
                          <div
                            key={index}
                            className={`cursor-pointer border-2 rounded-lg overflow-hidden ${
                              newPost.image === img ? 'border-purple-500' : 'border-gray-200'
                            }`}
                            onClick={() => setNewPost(prev => ({ ...prev, image: img }))}
                          >
                            <img src={img} alt={`Sample ${index + 1}`} className="w-full h-20 object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="caption">Caption</Label>
                      <Textarea
                        id="caption"
                        placeholder="Tell us about your transformation..."
                        value={newPost.caption}
                        onChange={(e) => setNewPost(prev => ({ ...prev, caption: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="service">Service Used</Label>
                        <Input
                          id="service"
                          placeholder="e.g. Box Braids"
                          value={newPost.serviceUsed}
                          onChange={(e) => setNewPost(prev => ({ ...prev, serviceUsed: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="artist">Artist Name</Label>
                        <Input
                          id="artist"
                          placeholder="e.g. Maya Styles"
                          value={newPost.artistName}
                          onChange={(e) => setNewPost(prev => ({ ...prev, artistName: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="groupSession"
                        checked={newPost.isGroupSession}
                        onChange={(e) => setNewPost(prev => ({ ...prev, isGroupSession: e.target.checked }))}
                      />
                      <Label htmlFor="groupSession">This was a Glow Together session</Label>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSubmitPost}
                        disabled={!newPost.image || !newPost.caption}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                      >
                        Share Post
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Featured Categories */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">💄</span>
                </div>
                <h3 className="font-semibold">Makeup</h3>
                <p className="text-sm text-gray-600">247 posts</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">💅</span>
                </div>
                <h3 className="font-semibold">Nails</h3>
                <p className="text-sm text-gray-600">189 posts</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="font-semibold">Hair</h3>
                <p className="text-sm text-gray-600">356 posts</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="font-semibold">Glow Together</h3>
                <p className="text-sm text-gray-600">92 sessions</p>
              </CardContent>
            </Card>
          </div>

          <GlowFeed />
        </div>
      </div>
    </Layout>
  );
};

export default GlowFeedPage;
