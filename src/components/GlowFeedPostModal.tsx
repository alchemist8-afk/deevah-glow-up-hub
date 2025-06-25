
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useGlowFeed } from '@/contexts/GlowFeedContext';
import { useToast } from '@/hooks/use-toast';
import { Camera, Users, Sparkles, Upload } from 'lucide-react';

interface GlowFeedPostModalProps {
  children: React.ReactNode;
}

export function GlowFeedPostModal({ children }: GlowFeedPostModalProps) {
  const { profile, isAuthenticated } = useAuth();
  const { createPost } = useGlowFeed();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [serviceUsed, setServiceUsed] = useState('');
  const [artistName, setArtistName] = useState('');
  const [isGroupSession, setIsGroupSession] = useState(false);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !profile) {
      toast({
        title: "Authentication Required",
        description: "Please log in to post to the feed",
        variant: "destructive"
      });
      return;
    }

    if (!imageUrl.trim()) {
      toast({
        title: "Image Required",
        description: "Please provide an image URL for your post",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      await createPost({
        image_url: imageUrl,
        caption: caption || null,
        service_used: serviceUsed || null,
        artist_name: artistName || null,
        is_group_session: isGroupSession
      });

      toast({
        title: "Posted Successfully! ✨",
        description: "Your glow-up has been shared with the community"
      });

      setIsOpen(false);
      // Reset form
      setImageUrl('');
      setCaption('');
      setServiceUsed('');
      setArtistName('');
      setIsGroupSession(false);

    } catch (error: any) {
      toast({
        title: "Post Failed",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#E07A5F]" />
            Share Your Glow
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handlePost} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Image URL *
            </Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/your-image.jpg"
              required
            />
            <p className="text-xs text-gray-500">
              Upload your image to a service like Imgur and paste the URL here
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Share your glow story..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceUsed">Service Used</Label>
            <Input
              id="serviceUsed"
              value={serviceUsed}
              onChange={(e) => setServiceUsed(e.target.value)}
              placeholder="e.g., Box Braids, Gel Nails, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="artistName">Artist Name</Label>
            <Input
              id="artistName"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Credit your artist"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="groupSession"
              checked={isGroupSession}
              onCheckedChange={setIsGroupSession}
            />
            <Label htmlFor="groupSession" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Glow Together Session
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#E07A5F] hover:bg-[#E07A5F]/90"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting...
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Share Glow
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
