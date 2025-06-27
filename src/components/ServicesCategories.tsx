
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scissors, Palette, Sparkles, Hand } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMood } from '@/contexts/MoodContext';
import { useServices } from '@/hooks/useServices';

const categories = [
  { 
    name: 'Cuts', 
    icon: Scissors, 
    path: '/services/cuts',
    description: 'Professional hair cuts and styling',
    category: 'Hair'
  },
  { 
    name: 'Braids', 
    icon: Palette, 
    path: '/services/braids',
    description: 'Beautiful braiding services',
    category: 'Braids'
  },
  { 
    name: 'Nails', 
    icon: Hand, 
    path: '/services/nails',
    description: 'Manicure and nail art',
    category: 'Nails'
  },
  { 
    name: 'Beauty', 
    icon: Sparkles, 
    path: '/services',
    description: 'All beauty services',
    category: 'Beauty'
  },
];

export function ServicesCategories() {
  const navigate = useNavigate();
  const { selectedMood } = useMood();
  const { services } = useServices(undefined, selectedMood || undefined);

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Book Your Glow Session
          </h2>
          <p className="text-lg text-gray-600">
            {selectedMood 
              ? `${services.length} services match your ${selectedMood} vibe`
              : 'Choose from our professional beauty services'
            }
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const categoryServices = services.filter(s => s.category === category.category);
            
            return (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => navigate(category.path)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  {categoryServices.length > 0 && (
                    <p className="text-sm text-purple-600 mb-4">
                      {categoryServices.length} available services
                    </p>
                  )}
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(category.path);
                    }}
                  >
                    Explore {category.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
