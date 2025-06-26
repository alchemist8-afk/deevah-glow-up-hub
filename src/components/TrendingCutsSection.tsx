
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/BookingModal";
import { Scissors, Star, TrendingUp, Users } from "lucide-react";

const trendingCuts = [
  {
    id: '1',
    name: 'Fade & Fresh',
    artist: 'Marcus King',
    image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23',
    price: 45,
    rating: 4.9,
    bookings: 127,
    category: 'Men\'s Cut',
    trending: true,
    description: 'Perfect skin fade with beard trim'
  },
  {
    id: '2',
    name: 'Silk Press Perfection',
    artist: 'Amara Beauty',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    price: 85,
    rating: 4.8,
    bookings: 89,
    category: 'Women\'s Style',
    trending: true,
    description: 'Smooth silk press with heat protection'
  },
  {
    id: '3',
    name: 'Loc Maintenance Plus',
    artist: 'Zara Locs',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    price: 65,
    rating: 4.7,
    bookings: 156,
    category: 'Dreadlocks',
    trending: true,
    description: 'Complete loc care and styling'
  },
  {
    id: '4',
    name: 'Buzz & Beard',
    artist: 'Tony Sharp',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    price: 35,
    rating: 4.6,
    bookings: 203,
    category: 'Quick Cut',
    trending: true,
    description: 'Classic buzz cut with beard shape-up'
  }
];

export function TrendingCutsSection() {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Trending Cuts This Week</h2>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Most booked styles by Deevah's top-rated barbers and stylists
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingCuts.map((cut, index) => (
            <Card key={cut.id} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 group">
              <div className="relative">
                <img 
                  src={cut.image} 
                  alt={cut.name}
                  className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className="bg-yellow-400 text-black font-semibold">
                    #{index + 1} Trending
                  </Badge>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-black">{cut.rating}</span>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">{cut.name}</h3>
                  <span className="text-xl font-bold text-yellow-400">${cut.price}</span>
                </div>
                
                <p className="text-gray-300 text-sm mb-2">by {cut.artist}</p>
                <p className="text-gray-400 text-sm mb-4">{cut.description}</p>
                
                <div className="flex items-center justify-between mb-4 text-sm">
                  <Badge variant="outline" className="border-white/30 text-white">
                    {cut.category}
                  </Badge>
                  <span className="flex items-center gap-1 text-gray-300">
                    <Users className="w-4 h-4" />
                    {cut.bookings} booked
                  </span>
                </div>

                <BookingModal service={{
                  id: cut.id,
                  name: cut.name,
                  price: cut.price,
                  category: cut.category
                }}>
                  <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
                    <Scissors className="w-4 h-4 mr-2" />
                    Book This Cut
                  </Button>
                </BookingModal>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
          >
            Explore All Deevah Cuts
          </Button>
        </div>
      </div>
    </section>
  );
}
