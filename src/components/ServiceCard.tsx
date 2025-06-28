
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin } from 'lucide-react';
import { Service } from '@/hooks/useServices';
import { formatDuration } from '@/utils/serviceHelpers';
import { BookingModal } from './BookingModal';

interface ServiceCardProps {
  service: Service;
  onBook?: (service: Service) => void;
}

export function ServiceCard({ service, onBook }: ServiceCardProps) {
  const handleBooking = () => {
    if (onBook) {
      onBook(service);
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        {service.image_url && (
          <div className="w-full h-48 rounded-lg overflow-hidden mb-3">
            <img 
              src={service.image_url} 
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardTitle className="text-lg font-semibold">{service.name}</CardTitle>
        {service.profiles && (
          <p className="text-sm text-gray-600">by {service.profiles.full_name}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        {service.description && (
          <p className="text-sm text-gray-700 line-clamp-2">{service.description}</p>
        )}
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {service.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(service.duration)}</span>
            </div>
          )}
        </div>
        
        {service.mood_tags && service.mood_tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {service.mood_tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-4">
        <div className="text-lg font-bold text-purple-600">
          KSh {service.price.toLocaleString()}
        </div>
        <BookingModal service={service}>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Book Now
          </button>
        </BookingModal>
      </CardFooter>
    </Card>
  );
}
