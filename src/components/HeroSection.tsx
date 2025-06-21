
import { Button } from "@/components/ui/button";
import { Star, Calendar } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-deevah-purple via-deevah-rose to-deevah-gold min-h-[80vh] flex items-center justify-center text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1649972904349-6e44c42644a7')] bg-cover bg-center opacity-10"></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Beauty.
            <br />
            <span className="text-deevah-gold-light">Anywhere.</span>
            <br />
            <span className="text-white">Anytime.</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Discover verified beauticians and barbers in your area. Book premium services that come to you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button 
              size="lg" 
              className="bg-white text-deevah-purple hover:bg-white/90 transition-all duration-300 font-semibold px-8 py-4 text-lg"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book a Service
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-deevah-purple transition-all duration-300 font-semibold px-8 py-4 text-lg"
            >
              <Star className="w-5 h-5 mr-2" />
              Join as an Artist
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
