
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, Users, Clock, Award } from "lucide-react";

export function DeevahCuts() {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Scissors className="w-8 h-8 text-deevah-gold" />
            <h2 className="text-4xl font-bold">Deevah Cuts</h2>
          </div>
          <p className="text-xl text-gray-300">Premium barbershop experience for the modern gentleman</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">Where Style Meets Precision</h3>
            <p className="text-lg text-gray-300 mb-8">
              Experience the art of masculine grooming with our specialized barbers. 
              From classic cuts to modern styles, we deliver excellence in every detail.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <Users className="w-8 h-8 text-deevah-gold mx-auto mb-2" />
                <h4 className="font-semibold">Expert Barbers</h4>
                <p className="text-sm text-gray-400">Certified professionals</p>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 text-deevah-gold mx-auto mb-2" />
                <h4 className="font-semibold">Quick Service</h4>
                <p className="text-sm text-gray-400">30-45 min sessions</p>
              </div>
              <div className="text-center">
                <Award className="w-8 h-8 text-deevah-gold mx-auto mb-2" />
                <h4 className="font-semibold">Premium Quality</h4>
                <p className="text-sm text-gray-400">Top-tier products</p>
              </div>
            </div>
            
            <Button className="bg-deevah-gold hover:bg-deevah-gold/90 text-black font-semibold px-8 py-3">
              Explore Deevah Cuts
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <img 
                  src="https://images.unsplash.com/photo-1517022812141-23620dba5c23" 
                  alt="Classic Cut"
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-white">Classic Cuts</h4>
                <p className="text-sm text-gray-400">From $35</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <img 
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
                  alt="Beard Trim"
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-white">Beard Trims</h4>
                <p className="text-sm text-gray-400">From $25</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                  alt="Hot Towel"
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-white">Hot Towel</h4>
                <p className="text-sm text-gray-400">From $15</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <img 
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" 
                  alt="Hair Wash"
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-white">Hair Wash</h4>
                <p className="text-sm text-gray-400">From $20</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
