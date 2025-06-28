
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookingModal } from '@/components/BookingModal';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  DollarSign,
  Sparkles,
  Scissors,
  Hand,
  Palette
} from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { useMood } from '@/contexts/MoodContext';

const ServicesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  const { selectedMood } = useMood();
  const { services, isLoading } = useServices(selectedCategory, selectedMood || undefined);

  const categories = [
    { name: 'Hair', icon: Scissors, color: 'bg-purple-100 text-purple-600' },
    { name: 'Braids', icon: Palette, color: 'bg-pink-100 text-pink-600' },
    { name: 'Nails', icon: Hand, color: 'bg-blue-100 text-blue-600' },
    { name: 'Beauty', icon: Sparkles, color: 'bg-green-100 text-green-600' },
  ];

  const filteredServices = services
    .filter(service => 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return (a.duration || 0) - (b.duration || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading services...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Beauty Services
            </h1>
            <p className="text-xl text-gray-600">
              {selectedMood 
                ? `${filteredServices.length} services match your ${selectedMood} vibe`
                : `Discover ${filteredServices.length} professional beauty services`
              }
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSortBy('name');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map(category => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.name;
              
              return (
                <Button
                  key={category.name}
                  onClick={() => setSelectedCategory(isActive ? '' : category.name)}
                  variant={isActive ? "default" : "outline"}
                  className={`${isActive ? 'bg-purple-600 hover:bg-purple-700' : ''} flex items-center gap-2`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>

          {/* Services Grid */}
          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {service.image_url && (
                    <div className="relative h-48">
                      <img 
                        src={service.image_url} 
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                      {service.mood_tags && (
                        <div className="absolute top-2 right-2 flex gap-1">
                          {service.mood_tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-white/90 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {service.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">
                          KSh {service.price}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {service.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {service.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      {service.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration} min</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current text-yellow-500" />
                        <span>4.8</span>
                      </div>
                    </div>

                    {service.profiles && (
                      <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded">
                        {service.profiles.avatar_url && (
                          <img 
                            src={service.profiles.avatar_url} 
                            alt={service.profiles.full_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium">{service.profiles.full_name}</p>
                          <p className="text-xs text-gray-500">Service Provider</p>
                        </div>
                      </div>
                    )}
                    
                    <BookingModal
                      service={{
                        id: service.id,
                        name: service.name,
                        price: service.price,
                        category: service.category,
                        provider_id: service.provider_id,
                        duration: service.duration,
                        description: service.description
                      }}
                      artist={service.profiles ? {
                        id: service.provider_id || '',
                        full_name: service.profiles.full_name,
                        avatar_url: service.profiles.avatar_url
                      } : undefined}
                    >
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        Book Now
                      </Button>
                    </BookingModal>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ServicesPage;
