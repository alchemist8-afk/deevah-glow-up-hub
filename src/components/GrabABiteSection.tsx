
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMood } from '@/contexts/MoodContext';
import { useRestaurants } from '@/hooks/useRestaurants';

export function GrabABiteSection() {
  const navigate = useNavigate();
  const { selectedMood } = useMood();
  const { restaurants, isLoading } = useRestaurants(selectedMood || undefined);

  if (isLoading) {
    return (
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Grab a Bite
            </h2>
            <div className="animate-pulse">Loading restaurants...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Grab a Bite
          </h2>
          <p className="text-lg text-gray-600">
            {selectedMood 
              ? `Perfect dining spots for your ${selectedMood} mood`
              : 'Delicious meals from local restaurants'
            }
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {restaurants.slice(0, 6).map((restaurant) => (
            <Card key={restaurant.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img 
                  src={restaurant.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {restaurant.name}
                  </h3>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">
                      {restaurant.rating?.toFixed(1) || '4.5'}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">
                  {restaurant.description}
                </p>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {restaurant.address}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-600 font-medium">
                    {restaurant.cuisine_type}
                  </span>
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Order Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            onClick={() => navigate('/food')}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            View All Restaurants
          </Button>
        </div>
      </div>
    </section>
  );
}
