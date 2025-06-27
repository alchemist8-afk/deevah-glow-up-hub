
import { useState } from "react";
import { Calendar, Car, Coffee, Home, LogOut, Package, Sparkles, Star, Users, Wallet } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const publicItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Services", url: "/services", icon: Star },
  { title: "Glow Feed", url: "/glow-feed", icon: Sparkles },
  { title: "Food & Dining", url: "/food", icon: Coffee },
  { title: "Shop", url: "/products", icon: Package },
  { title: "Transport", url: "/transport", icon: Car },
];

const clientItems = [
  { title: "Dashboard", url: "/dashboard/client", icon: Home },
  { title: "My Bookings", url: "/bookings", icon: Calendar },
  { title: "Wallet", url: "/wallet", icon: Wallet },
  { title: "Glow Feed", url: "/glow-feed", icon: Sparkles },
  { title: "Referrals", url: "/referrals", icon: Users },
];

const artistItems = [
  { title: "Dashboard", url: "/dashboard/artist", icon: Home },
  { title: "My Services", url: "/services", icon: Star },
  { title: "Bookings", url: "/bookings", icon: Calendar },
  { title: "Portfolio", url: "/glow-feed", icon: Sparkles },
  { title: "Wallet", url: "/wallet", icon: Wallet },
];

const businessItems = [
  { title: "Dashboard", url: "/dashboard/business", icon: Home },
  { title: "Products", url: "/products", icon: Package },
  { title: "Orders", url: "/orders", icon: Calendar },
  { title: "Wallet", url: "/wallet", icon: Wallet },
];

const transportItems = [
  { title: "Dashboard", url: "/dashboard/transport", icon: Home },
  { title: "Active Rides", url: "/rides", icon: Car },
  { title: "Earnings", url: "/wallet", icon: Wallet },
];

export function AppSidebar() {
  const { isAuthenticated, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getMenuItems = () => {
    if (!isAuthenticated) return publicItems;
    
    switch (profile?.user_role) {
      case 'client': return clientItems;
      case 'artist': return artistItems;
      case 'business': return businessItems;
      case 'transport': return transportItems;
      default: return publicItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6">
        <NavLink to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Deevah
          </span>
        </NavLink>
        {isAuthenticated && profile && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">{profile.full_name}</p>
            <p className="text-xs text-gray-500 capitalize">{profile.user_role}</p>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {isAuthenticated ? "Dashboard" : "Explore"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-purple-100 text-purple-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions for authenticated users */}
        {isAuthenticated && (
          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <Home className="w-5 h-5" />
                      <span>Back to Home</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        {isAuthenticated ? (
          <Button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            variant="outline"
            className="w-full flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
          </Button>
        ) : (
          <NavLink to="/auth">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Sign In
            </Button>
          </NavLink>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
