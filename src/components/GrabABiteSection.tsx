
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Clock, MapPin, Star, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useMood } from "@/contexts/MoodContext";

const restaurants = [
  {
    id: '1',
    name: 'Glow Juice Bar',
    type: 'Healthy Drinks',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    rating: 4.8,
    distance: '0.5 km',
    deliveryTime: '15-25 min',
    mood: ['calm', 'private'],
    specialties: ['Fresh Smoothies', 'Detox Juices', 'Wellness Shots'],
    isOpen: true
  },
  {
    id: '2',
    name: 'Social Bites Café',
    type: 'Brunch & Coffee',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    rating: 4.6,
    distance: '0.8 km',
    deliveryTime: '20-30 min',
    mood: ['social', 'fast'],
    specialties: ['Avocado Toast', 'Artisan Coffee', 'Sharing Platters'],
    isOpen: true
  },
  {
    id: '3',
    name: 'Quick Fuel Kitchen',
    type: 'Fast Healthy',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    rating: 4.7,
    distance: '1.2 km',
    deliveryTime: '10-15 min',
    mood: ['fast', 'social'],
    specialties: ['Power Bowls', 'Protein Wraps', 'Energy Bars'],
    isOpen: true
  },
  {
    id: '4',
    name: 'Zen Garden Restaurant',
    type: 'Wellness Cuisine',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b',
    rating: 4.9,
    distance: '2.1 km',
    deliveryTime: '25-35 min',
    mood: ['calm', 'private'],
    specialties: ['Organic Salads', 'Herbal Teas', 'Mindful Meals'],
    isOpen: false
  }
];

export function GrabABiteSection() {
  const { selectedMood } = useMood();

  const filteredRestaurants = selectedMood 
    ? restaurants.filter(restaurant => restaurant.mood.includes(selectedMood))
    : restaurants.slice(0, 3);

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <UtensilsCrossed className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Grab a Bite
                {selectedMood && (
                  <span className="text-orange-500 ml-2">
                    for {selectedMood} vibes
                  </span>
                )}
              </h2>
            </div>
            <p className="text-gray-600">
              Fuel your glow-up with nearby restaurants and wellness cafés
            </p>
          </div>
          <Link to="/food">
            <Button variant="outline" className="hidden md:flex">
              View All
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <div className="relative">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={`${restaurant.isOpen ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {restaurant.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/90 text-gray-800">
                    {restaurant.type}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{restaurant.rating}</span>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{restaurant.name}</h3>
                
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {restaurant.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {restaurant.deliveryTime}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {restaurant.specialties.slice(0, 2).map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Link to={`/restaurant/${restaurant.id}`} className="flex-1">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      View Menu
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="px-3"
                    disabled={!restaurant.isOpen}
                  >
                    <Truck className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link to="/food">
            <Button variant="outline">
              View All Restaurants
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
