
import { Home, Star, ShoppingBag, UtensilsCrossed, Wallet, User, Calendar, TrendingUp, Truck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

const MobileNavigation = () => {
  const location = useLocation();
  const { profile } = useAuth();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const getNavItems = () => {
    if (!profile) {
      return [
        { title: "Home", url: "/", icon: Home },
        { title: "Services", url: "/services", icon: Star },
        { title: "Food", url: "/food", icon: UtensilsCrossed },
        { title: "Login", url: "/auth", icon: User },
      ];
    }

    switch (profile.user_role) {
      case 'artist':
        return [
          { title: "Dashboard", url: "/dashboard/artist", icon: Home },
          { title: "Bookings", url: "/artist-bookings", icon: Calendar },
          { title: "Portfolio", url: "/artist-portfolio", icon: Star },
          { title: "Wallet", url: "/wallet", icon: Wallet },
        ];
      case 'business':
        return [
          { title: "Business", url: "/dashboard/business", icon: Home },
          { title: "Analytics", url: "/business-analytics", icon: TrendingUp },
          { title: "Products", url: "/business-products", icon: ShoppingBag },
          { title: "Wallet", url: "/wallet", icon: Wallet },
        ];
      case 'transport':
        return [
          { title: "Dashboard", url: "/dashboard/transport", icon: Home },
          { title: "Deliveries", url: "/transport-deliveries", icon: Truck },
          { title: "Earnings", url: "/transport-earnings", icon: TrendingUp },
          { title: "Wallet", url: "/wallet", icon: Wallet },
        ];
      default:
        return [
          { title: "Home", url: "/", icon: Home },
          { title: "Services", url: "/services", icon: Star },
          { title: "Food", url: "/food", icon: UtensilsCrossed },
          { title: "Wallet", url: "/wallet", icon: Wallet },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.title}
            to={item.url}
            className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
              location.pathname === item.url
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{item.title}</span>
            {item.title === 'Wallet' && (
              <Badge variant="secondary" className="text-xs mt-1">
                0
              </Badge>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
