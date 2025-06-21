
import { Star, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-deevah rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">Deevah</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Connecting you with the best beauty and grooming professionals in your area. 
              Experience premium services at your convenience.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Makeup</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hair Styling</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Barber Cuts</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Lash Extensions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Nail Art</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Skincare</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partner with Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Deevah. All rights reserved. Beauty. Anywhere. Anytime.</p>
        </div>
      </div>
    </footer>
  );
}
