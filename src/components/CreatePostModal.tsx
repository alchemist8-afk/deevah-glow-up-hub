
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Upload } from "lucide-react";
import { useGlowPosts } from "@/hooks/useGlowPosts";
import { useAuth } from "@/contexts/AuthContext";

const serviceCategories = [
  'Braids', 'Dreadlocks', 'Nails', 'Massage', 'Cuts', 'Makeup', 'Skincare'
];

const moodTags = [
  'calm', 'energetic', 'glamorous', 'natural', 'bold', 'elegant', 'fun', 'professional'
];

export function CreatePostModal() {
  const { profile } = useAuth();
  const { createPost } = useGlowPosts();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    image_url: '',
    description: '',
    service_category: '',
    mood_tags: [] as string[]
  });

  if (profile?.user_role !== 'artist') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image_url || !formData.service_category) {
      return;
    }

    await createPost.mutateAsync(formData);
    setOpen(false);
    setFormData({
      image_url: '',
      description: '',
      service_category: '',
      mood_tags: []
    });
  };

  const toggleMoodTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      mood_tags: prev.mood_tags.includes(tag)
        ? prev.mood_tags.filter(t => t !== tag)
        : [...prev.mood_tags, tag]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Share Your Work
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Glow Work</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="image">Image URL *</Label>
            <div className="flex gap-2">
              <Input
                id="image"
                placeholder="Paste image URL here"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                required
              />
              <Button type="button" variant="outline" size="icon">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="category">Service Category *</Label>
            <Select value={formData.service_category} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, service_category: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
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

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell us about this work..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label>Mood Tags</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {moodTags.map(tag => (
                <Button
                  key={tag}
                  type="button"
                  variant={formData.mood_tags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleMoodTag(tag)}
                  className="text-xs"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={createPost.isPending} className="flex-1">
              {createPost.isPending ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
