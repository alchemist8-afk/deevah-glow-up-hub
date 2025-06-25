
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookingModal } from '@/components/BookingModal';
import { Star, Clock, Users, Sparkles } from 'lucide-react';
import { useMood } from '@/contexts/MoodContext';

const services = [
  {
    id: '1',
    name: 'Box Braids',
    category: 'Braids',
    price: 85,
    duration: 180,
    rating: 4.9,
    reviews: 127,
    image: '/placeholder.svg',
    mood: ['calm', 'social'],
    description: 'Classic protective style with premium synthetic hair'
  },
  {
    id: '2',
    name: 'Gel Nails',
    category: 'Nails',
    price: 45,
    duration: 90,
    rating: 4.8,
    reviews: 89,
    image: '/placeholder.svg',
    mood: ['fast', 'social'],
    description: 'Long-lasting gel manicure with your choice of colors'
  },
  {
    id: '3',
    name: 'Deep Tissue Massage',
    category: 'Massage',
    price: 120,
    duration: 60,
    rating: 4.9,
    reviews: 156,
    image: '/placeholder.svg',
    mood: ['calm', 'private'],
    description: 'Therapeutic massage for muscle tension relief'
  },
  {
    id: '4',
    name: 'Dreadlock Maintenance',
    category: 'Dreadlocks',
    price: 65,
    duration: 120,
    rating: 4.7,
    reviews: 78,
    image: '/placeholder.svg',
    mood: ['calm', 'social'],
    description: 'Professional loc maintenance and styling'
  },
  {
    id: '5',
    name: 'Twist Out',
    category: 'Natural Hair',
    price: 55,
    duration: 90,
    rating: 4.6,
    reviews: 92,
    image: '/placeholder.svg',
    mood: ['fast', 'social'],
    description: 'Beautiful twist out for natural hair texture'
  },
  {
    id: '6',
    name: 'Facial Treatment',
    category: 'Skincare',
    price: 80,
    duration: 75,
    rating: 4.8,
    reviews: 104,
    image: '/placeholder.svg',
    mood: ['calm', 'private'],
    description: 'Rejuvenating facial with organic products'
  }
];

export function ServicesCategories() {
  const { selectedMood } = useMood();

  // Filter services based on selected mood
  const filteredServices = selectedMood 
    ? services.filter(service => service.mood.includes(selectedMood))
    : services;

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Popular Services
          </h2>
          <p className="text-xl text-gray-600">
            Book your glow-up session with our top-rated artists
          </p>
          {selectedMood && (
            <Badge className="mt-4 bg-[#E07A5F] text-white">
              <Sparkles className="w-4 h-4 mr-1" />
              Filtered for {selectedMood} vibes
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={service.image} 
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800">
                  {service.category}
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                  <span className="text-2xl font-bold text-[#E07A5F]">${service.price}</span>
                </div>
                
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{service.rating} ({service.reviews})</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <BookingModal service={service}>
                    <Button className="flex-1 bg-[#E07A5F] hover:bg-[#E07A5F]/90">
                      Book Now
                    </Button>
                  </BookingModal>
                  
                  <Button variant="outline" size="sm" className="px-3">
                    <Users className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && selectedMood && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No services match your current mood. Try a different vibe!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
