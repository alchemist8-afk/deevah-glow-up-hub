
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  bucketName?: string;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

export function ImageUpload({
  onImageUpload,
  currentImage,
  bucketName = 'images',
  maxFileSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size
    if (file.size > maxFileSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxFileSize}MB`);
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // For now, we'll use a placeholder upload - in production this would upload to Supabase Storage
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock URL - in production this would be the actual Supabase Storage URL
      const mockUrl = `https://images.unsplash.com/photo-${Date.now()}`;
      
      onImageUpload(mockUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUpload('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
          />
          <Button
            onClick={handleRemove}
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Drag and drop an image here, or click to select
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Supports JPEG, PNG, WebP up to {maxFileSize}MB
          </p>
        </div>
      )}
      
      <div className="flex items-center justify-center">
        <label htmlFor="image-upload" className="cursor-pointer">
          <Button 
            type="button" 
            disabled={uploading}
            className="bg-purple-600 hover:bg-purple-700"
            asChild
          >
            <span>
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : preview ? 'Change Image' : 'Upload Image'}
            </span>
          </Button>
          <input
            id="image-upload"
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
}
