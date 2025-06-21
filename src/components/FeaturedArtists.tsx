
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock } from "lucide-react";

const artists = [
  {
    name: "Sarah Chen",
    specialty: "Makeup Artist",
    rating: 4.9,
    reviews: 127,
    location: "Downtown",
    price: "From $80",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    available: true
  },
  {
    name: "Marcus Williams",
    specialty: "Barber",
    rating: 4.8,
    reviews: 203,
    location: "Midtown",
    price: "From $45",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    available: true
  },
  {
    name: "Zara Ahmed",
    specialty: "Lash Specialist",
    rating: 5.0,
    reviews: 89,
    location: "Uptown",
    price: "From $120",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    available: false
  },
  {
    name: "David Kim",
    specialty: "Hair Stylist",
    rating: 4.7,
    reviews: 156,
    location: "Eastside",
    price: "From $90",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    available: true
  }
];

export function FeaturedArtists() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 gradient-text">Trending Artists</h2>
          <p className="text-xl text-muted-foreground">Discover top-rated beauticians and barbers near you</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {artists.map((artist, index) => (
            <Card 
              key={artist.name} 
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative">
                <img 
                  src={artist.image} 
                  alt={artist.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  {artist.available ? (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Available
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Busy
                    </span>
                  )}
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{artist.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{artist.rating}</span>
                    <span className="text-xs text-muted-foreground">({artist.reviews})</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">{artist.specialty}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{artist.location}</span>
                  </div>
                  <span className="font-semibold text-deevah-purple">{artist.price}</span>
                </div>
                
                <Button className="w-full bg-gradient-deevah hover:opacity-90 transition-opacity">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
