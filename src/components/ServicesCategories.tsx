
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    name: "Lashes",
    icon: "👁️",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    color: "from-pink-500 to-rose-500"
  },
  {
    name: "Makeup",
    icon: "💄",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    color: "from-purple-500 to-pink-500"
  },
  {
    name: "Dreadlocks",
    icon: "🌀",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    color: "from-green-500 to-emerald-500"
  },
  {
    name: "Nails",
    icon: "💅",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    color: "from-red-500 to-pink-500"
  },
  {
    name: "Hair",
    icon: "✂️",
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23",
    color: "from-blue-500 to-purple-500"
  },
  {
    name: "Barber Cuts",
    icon: "💇‍♂️",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    color: "from-gray-700 to-gray-900"
  },
  {
    name: "Skincare",
    icon: "🧴",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    color: "from-teal-500 to-cyan-500"
  }
];

export function ServicesCategories() {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 gradient-text">Top Categories</h2>
          <p className="text-xl text-muted-foreground">Choose from our premium beauty and grooming services</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
          {categories.map((category, index) => (
            <Card 
              key={category.name} 
              className="group cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-sm text-gray-900 group-hover:text-deevah-purple transition-colors">
                  {category.name}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
