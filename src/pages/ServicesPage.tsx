
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Clock, MapPin, Search, Filter } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { useMood } from '@/contexts/MoodContext';
import { BookingModal } from '@/components/BookingModal';

const ServicesPage = () => {
  const { selectedMood } = useMood();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const { services, isLoading } = useServices(
    selectedCategory || undefined, 
    selectedMood || undefined
  );

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ['Hair', 'Braids', 'Nails', 'Massage', 'Beauty'];

  const handleBookService = (service: any) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              <div className="animate-pulse">Loading services...</div>
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
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Beauty Services
              </h1>
              <p className="text-xl mb-8">
                {selectedMood 
                  ? `${filteredServices.length} services for your ${selectedMood} mood`
                  : 'Discover amazing beauty professionals near you'
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
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-6">
            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No services found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <Card key={service.id} className="group hover:shadow-xl transition-all duration-300">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img 
                        src={service.image_url || 'https://images.unsplash.com/photo-1562322140-8baeececf3df'} 
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 text-gray-900">
                          <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                          4.8
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {service.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            by {service.profiles?.full_name || 'Professional Artist'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">
                            KSh {service.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        {service.duration && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {service.duration} mins
                          </div>
                        )}
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          Available citywide
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">
                          {service.category}
                        </Badge>
                        <Button 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          onClick={() => handleBookService(service)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedService(null);
          }}
          service={selectedService}
          artist={selectedService.profiles}
        />
      )}
    </Layout>
  );
};

export default ServicesPage;
