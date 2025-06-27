
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ImageUpload';
import { Plus, Sparkles, X } from 'lucide-react';
import { useGlowPosts } from '@/hooks/useGlowPosts';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const moodOptions = [
  { value: 'calm', label: 'Calm & Relaxed', emoji: '🌿' },
  { value: 'fast', label: 'Quick & Efficient', emoji: '⚡' },
  { value: 'social', label: 'Social & Fun', emoji: '💃' },
  { value: 'private', label: 'Private & Intimate', emoji: '🤫' }
];

const serviceCategories = [
  'Hair', 'Braids', 'Nails', 'Massage', 'Makeup', 'Skincare', 'Lashes', 'Eyebrows'
];

export function CreatePostModal() {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [serviceUsed, setServiceUsed] = useState('');
  const [artistName, setArtistName] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [isGroupSession, setIsGroupSession] = useState(false);
  
  const { createPost } = useGlowPosts();
  const { profile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl) {
      toast.error('Please upload an image');
      return;
    }

    if (!caption.trim()) {
      toast.error('Please add a caption');
      return;
    }

    try {
      await createPost.mutateAsync({
        image_url: imageUrl,
        caption: caption.trim(),
        description: description.trim() || undefined,
        service_used: serviceUsed || undefined,
        artist_name: artistName.trim() || profile?.full_name || undefined,
        mood_tags: selectedMoods.length > 0 ? selectedMoods : undefined,
        is_group_session: isGroupSession
      });
      
      // Reset form
      setImageUrl('');
      setCaption('');
      setDescription('');
      setServiceUsed('');
      setArtistName('');
      setSelectedMoods([]);
      setIsGroupSession(false);
      setOpen(false);
    } catch (error) {
      console.error('Post creation error:', error);
    }
  };

  const toggleMood = (mood: string) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Plus className="w-4 h-4 mr-2" />
          Share Your Glow
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Share Your Glow Moment
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Photo *</Label>
            <ImageUpload 
              onImageUpload={setImageUrl}
              currentImage={imageUrl}
              bucketName="glow-posts"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption">Caption *</Label>
            <Textarea
              id="caption"
              placeholder="Tell us about your glow transformation..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Share more details about your experience..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Service Category</Label>
              <Select value={serviceUsed} onValueChange={setServiceUsed}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist-name">Artist Name</Label>
              <Input
                id="artist-name"
                placeholder="Credit your artist"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Mood Tags</Label>
            <div className="grid grid-cols-2 gap-2">
              {moodOptions.map(mood => (
                <Button
                  key={mood.value}
                  type="button"
                  variant={selectedMoods.includes(mood.value) ? "default" : "outline"}
                  onClick={() => toggleMood(mood.value)}
                  className="justify-start"
                >
                  <span className="mr-2">{mood.emoji}</span>
                  {mood.label}
                </Button>
              ))}
            </div>
            {selectedMoods.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedMoods.map(mood => {
                  const moodOption = moodOptions.find(m => m.value === mood);
                  return (
                    <Badge key={mood} variant="secondary" className="flex items-center gap-1">
                      {moodOption?.emoji} {moodOption?.label}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => toggleMood(mood)}
                      />
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="group-session"
              checked={isGroupSession}
              onChange={(e) => setIsGroupSession(e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <Label htmlFor="group-session" className="text-sm">
              This was a group session
            </Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createPost.isPending || !imageUrl || !caption.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {createPost.isPending ? 'Posting...' : 'Share Glow'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
