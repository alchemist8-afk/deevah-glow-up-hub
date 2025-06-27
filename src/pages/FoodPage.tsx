
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Clock, MapPin, Search, Filter, Phone } from 'lucide-react';
import { useRestaurants, useMeals } from '@/hooks/useRestaurants';
import { useMood } from '@/contexts/MoodContext';
import { useNavigate } from 'react-router-dom';

const FoodPage = () => {
  const navigate = useNavigate();
  const { selectedMood } = useMood();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  
  const { restaurants, isLoading } = useRestaurants(selectedMood || undefined);
  const { meals } = useMeals(undefined, selectedMood || undefined);

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisine_type?.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(restaurant => 
    !selectedCuisine || restaurant.cuisine_type === selectedCuisine
  );

  const cuisines = Array.from(new Set(restaurants.map(r => r.cuisine_type).filter(Boolean)));

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              <div className="animate-pulse">Loading restaurants...</div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Grab a Bite
              </h1>
              <p className="text-xl mb-8">
                {selectedMood 
                  ? `${filteredRestaurants.length} restaurants perfect for your ${selectedMood} mood`
                  : 'Delicious meals from local restaurants delivered to you'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search restaurants or dishes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All Cuisines" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Cuisines</SelectItem>
                    {cuisines.map((cuisine) => (
                      <SelectItem key={cuisine} value={cuisine!}>
                        {cuisine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Dishes */}
        {meals.length > 0 && (
          <section className="py-12 bg-white">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Dishes</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {meals.slice(0, 6).map((meal) => (
                  <Card key={meal.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="aspect-square relative overflow-hidden rounded-t-lg">
                      <img 
                        src={meal.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} 
                        alt={meal.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1">
                        {meal.name}
                      </h3>
                      <p className="text-purple-600 font-bold text-sm">
                        KSh {meal.price.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Restaurants Grid */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">All Restaurants</h2>
            {filteredRestaurants.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No restaurants found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <Card key={restaurant.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer"
                        onClick={() => navigate(`/restaurants/${restaurant.id}`)}>
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img 
                        src={restaurant.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'} 
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 text-gray-900">
                          <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {restaurant.rating?.toFixed(1) || '4.5'}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {restaurant.name}
                        </h3>
                        <Badge variant="secondary">
                          {restaurant.cuisine_type}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {restaurant.description}
                      </p>
                      
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {restaurant.address}
                        </div>
                        {restaurant.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            {restaurant.phone}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          15-30 min delivery
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/restaurants/${restaurant.id}`);
                        }}
                      >
                        View Menu
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default FoodPage;
