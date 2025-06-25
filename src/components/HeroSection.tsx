
import { Button } from '@/components/ui/button';
import { BookingModal } from '@/components/BookingModal';
import { GlowFeedPostModal } from '@/components/GlowFeedPostModal';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Calendar, Camera, Sparkles } from 'lucide-react';

export function HeroSection() {
  const { isAuthenticated, profile } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4F1DE] via-[#E9C46A]/30 to-[#E07A5F]/20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#E07A5F]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#E9C46A]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Star className="w-5 h-5 text-[#E07A5F]" />
            <span className="text-[#E07A5F] font-medium">Glow Hub</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Your Beauty
            <span className="block text-[#E07A5F]">Sanctuary</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Book premium beauty services, connect with amazing artists, and share your glow journey with our community
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <BookingModal>
            <Button size="lg" className="bg-[#E07A5F] hover:bg-[#E07A5F]/90 text-white px-8 py-4 text-lg">
              <Calendar className="w-5 h-5 mr-2" />
              Book Your Glow
            </Button>
          </BookingModal>

          {isAuthenticated && (
            <GlowFeedPostModal>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-[#E07A5F] text-[#E07A5F] hover:bg-[#E07A5F] hover:text-white">
                <Camera className="w-5 h-5 mr-2" />
                Share Your Glow
              </Button>
            </GlowFeedPostModal>
          )}

          <Button size="lg" variant="ghost" className="text-gray-600 hover:text-[#E07A5F] px-8 py-4 text-lg">
            <Sparkles className="w-5 h-5 mr-2" />
            Spin to Win
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
          <div>
            <div className="text-3xl font-bold text-[#E07A5F] mb-2">500+</div>
            <div className="text-gray-600">Happy Clients</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#E07A5F] mb-2">50+</div>
            <div className="text-gray-600">Expert Artists</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#E07A5F] mb-2">15+</div>
            <div className="text-gray-600">Services</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#E07A5F] mb-2">4.9</div>
            <div className="text-gray-600">Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
