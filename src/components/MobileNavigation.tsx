
import { Home, Sparkles, Calendar, Wallet, User, Car, Coffee, Package, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const MobileNavigation = () => {
  const { isAuthenticated, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const getNavItems = () => {
    if (!isAuthenticated) {
      return [
        { icon: Home, label: "Home", path: "/" },
        { icon: Sparkles, label: "Services", path: "/services" },
        { icon: Coffee, label: "Food", path: "/food" },
        { icon: Package, label: "Shop", path: "/products" },
        { icon: Car, label: "Rides", path: "/" },
      ];
    }

    // Authenticated user navigation based on role
    const baseItems = [
      { icon: Home, label: "Home", path: "/" },
      { icon: User, label: "Dashboard", path: `/dashboard/${profile?.user_role}` },
    ];

    switch (profile?.user_role) {
      case 'client':
        return [
          ...baseItems,
          { icon: Calendar, label: "Bookings", path: "/bookings" },
          { icon: Car, label: "Rides", path: "/rides" },
          { icon: Wallet, label: "Wallet", path: "/wallet" },
        ];
      case 'artist':
        return [
          ...baseItems,
          { icon: Calendar, label: "Bookings", path: "/bookings" },
          { icon: Sparkles, label: "Portfolio", path: "/glow-feed" },
          { icon: Wallet, label: "Wallet", path: "/wallet" },
        ];
      case 'business':
        return [
          ...baseItems,
          { icon: Package, label: "Products", path: "/products" },
          { icon: Calendar, label: "Orders", path: "/bookings" },
          { icon: Wallet, label: "Wallet", path: "/wallet" },
        ];
      case 'transport':
        return [
          ...baseItems,
          { icon: Car, label: "Rides", path: "/rides" },
          { icon: Wallet, label: "Earnings", path: "/wallet" },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-5 h-16">
        {navItems.slice(0, 4).map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-600 hover:text-gray-900"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
        
        {/* Profile/Auth section */}
        <div className="flex flex-col items-center justify-center space-y-1 text-gray-600">
          {isAuthenticated ? (
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 h-auto p-1"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-xs font-medium">Sign Out</span>
            </Button>
          ) : (
            <NavLink
              to="/auth"
              className="flex flex-col items-center justify-center space-y-1 transition-colors hover:text-gray-900"
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">Sign In</span>
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
