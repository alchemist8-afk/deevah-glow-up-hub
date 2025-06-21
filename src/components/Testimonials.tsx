
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Jessica Thompson",
    service: "Makeup for Wedding",
    rating: 5,
    text: "Absolutely amazing experience! Sarah transformed me into a princess for my wedding day. The service was professional and the results were beyond my expectations.",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
  },
  {
    name: "Michael Rodriguez",
    service: "Barber Cut & Beard Trim",
    rating: 5,
    text: "Marcus is a true artist. The attention to detail and the overall experience at Deevah Cuts is unmatched. I'm a customer for life!",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    name: "Amanda Chen",
    service: "Lash Extensions",
    rating: 5,
    text: "Zara's work is incredible! My lashes look so natural yet so glamorous. The convenience of home service made it even better.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
  }
];

export function Testimonials() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 gradient-text">What Our Clients Say</h2>
          <p className="text-xl text-muted-foreground">Real experiences from real people</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name} 
              className="hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center space-x-3">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.service}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
