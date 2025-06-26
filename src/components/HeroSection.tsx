
import { Button } from '@/components/ui/button';
import { BookingModal } from '@/components/BookingModal';
import { GlowFeedPostModal } from '@/components/GlowFeedPostModal';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Calendar, Camera, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  const { isAuthenticated, profile } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50"></div>
      
      {/* Subtle geometric patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center px-6 py-20">
        {/* Premium badge */}
        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/20 mb-8">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span className="text-purple-600 font-semibold text-sm tracking-wide">PREMIUM BEAUTY PLATFORM</span>
        </div>
        
        {/* Hero headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight">
          Your Beauty
          <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            Sanctuary
          </span>
        </h1>
        
        {/* Refined subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          Connect with premium beauty artists, book exclusive services, and join a community that celebrates your unique glow
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          {isAuthenticated ? (
            <>
              <Link to={`/dashboard/${profile?.user_role || 'client'}`}>
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <GlowFeedPostModal>
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 border-purple-200 text-purple-700 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Camera className="w-5 h-5 mr-2" />
                  Share Your Glow
                </Button>
              </GlowFeedPostModal>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Join Deevah
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <BookingModal service={{
                id: 'explore',
                name: 'Explore Services',
                price: 0,
                category: 'Any'
              }}>
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 border-purple-200 text-purple-700 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Calendar className="w-5 h-5 mr-2" />
                  Explore Services
                </Button>
              </BookingModal>
            </>
          )}
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">2K+</div>
            <div className="text-gray-600 font-medium">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">150+</div>
            <div className="text-gray-600 font-medium">Expert Artists</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">25+</div>
            <div className="text-gray-600 font-medium">Premium Services</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">4.9</div>
            <div className="text-gray-600 font-medium">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
