
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/BookingModal";
import { History, Star, Calendar, Repeat } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const pastServices = [
  {
    id: '1',
    artistName: 'Maya Styles',
    serviceName: 'Box Braids',
    date: '2024-12-15',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    price: 85,
    category: 'Braids',
    status: 'completed'
  },
  {
    id: '2',
    artistName: 'Zara Beauty',
    serviceName: 'Gel Manicure',
    date: '2024-12-10',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
    price: 45,
    category: 'Nails',
    status: 'completed'
  },
  {
    id: '3',
    artistName: 'Amara Wellness',
    serviceName: 'Deep Tissue Massage',
    date: '2024-12-05',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    price: 120,
    category: 'Massage',
    status: 'completed'
  }
];

export function PastGlowsSection() {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <History className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Your Past Glows
              </h2>
            </div>
            <p className="text-gray-600">
              Book your favorite artists and services again
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pastServices.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative">
                <img 
                  src={service.image} 
                  alt={service.serviceName}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-blue-500 text-white">
                    {service.category}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${i < service.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.serviceName}</h3>
                <p className="text-blue-600 font-medium mb-2">with {service.artistName}</p>
                
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(service.date).toLocaleDateString()}</span>
                  <span className="ml-auto text-lg font-bold text-blue-600">${service.price}</span>
                </div>

                <div className="space-y-2">
                  <BookingModal service={{
                    id: service.id,
                    name: service.serviceName,
                    price: service.price,
                    category: service.category
                  }}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Repeat className="w-4 h-4 mr-2" />
                      Book Again
                    </Button>
                  </BookingModal>
                  
                  <Button variant="outline" className="w-full">
                    View Artist Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {pastServices.length === 0 && (
          <div className="text-center py-12">
            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No past services yet</h3>
            <p className="text-gray-500 mb-6">Book your first service to see your glow journey!</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Browse Services
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
