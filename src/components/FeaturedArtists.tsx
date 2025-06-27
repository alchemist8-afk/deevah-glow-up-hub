
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '@/hooks/useServices';
import { useMood } from '@/contexts/MoodContext';

export function FeaturedArtists() {
  const navigate = useNavigate();
  const { selectedMood } = useMood();
  const { services, isLoading } = useServices(undefined, selectedMood || undefined);

  if (isLoading) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Artists
            </h2>
            <div className="animate-pulse">Loading artists...</div>
          </div>
        </div>
      </section>
    );
  }

  // Group services by artist
  const artistServices = services.reduce((acc, service) => {
    const artistId = service.provider_id || 'unknown';
    if (!acc[artistId]) {
      acc[artistId] = {
        artist: service.profiles,
        services: []
      };
    }
    acc[artistId].services.push(service);
    return acc;
  }, {} as Record<string, { artist: any; services: typeof services }>);

  const featuredArtists = Object.entries(artistServices).slice(0, 6);

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Artists
          </h2>
          <p className="text-lg text-gray-600">
            {selectedMood 
              ? `Top artists matching your ${selectedMood} vibe`
              : 'Book with our highly rated beauty professionals'
            }
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArtists.map(([artistId, { artist, services: artistServiceList }]) => {
            const mainService = artistServiceList[0];
            
            return (
              <Card key={artistId} className="group hover:shadow-xl transition-all duration-300">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  <img 
                    src={mainService.image_url || 'https://images.unsplash.com/photo-1562322140-8baeececf3df'} 
                    alt={artist?.full_name || 'Artist'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-gray-900">
                      <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                      4.9
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {artist?.full_name || 'Professional Artist'}
                    </h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-600">
                        From KSh {Math.min(...artistServiceList.map(s => s.price)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {artistServiceList.slice(0, 3).map((service) => (
                      <Badge key={service.id} variant="secondary" className="text-xs">
                        {service.category}
                      </Badge>
                    ))}
                    {artistServiceList.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{artistServiceList.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      {mainService.duration ? `${mainService.duration} mins` : 'Duration varies'}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      Available citywide
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => navigate(`/services?artist=${artistId}`)}
                    >
                      View Services
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate('/services')}
            size="lg"
            variant="outline"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            View All Artists
          </Button>
        </div>
      </div>
    </section>
  );
}
