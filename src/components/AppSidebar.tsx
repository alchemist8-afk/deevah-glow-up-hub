
import { Calendar, Home, Scissors, ShoppingBag, Gamepad2, UtensilsCrossed, LogIn, Star, LogOut, User, Settings, Wallet, Share2, Camera, Users, Truck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Services",
    url: "/services",
    icon: Star,
    subItems: [
      { title: "Braids", url: "/braids" },
      { title: "Nails", url: "/nails" },
      { title: "Massage", url: "/massage" },
      { title: "Dreadlocks", url: "/dreadlocks" }
    ]
  },
  {
    title: "Products",
    url: "/products", 
    icon: ShoppingBag,
  },
  {
    title: "Grab a Bite",
    url: "/food",
    icon: UtensilsCrossed,
  },
  {
    title: "Game Night",
    url: "/games",
    icon: Gamepad2,
  },
  {
    title: "Deevah Cuts",
    url: "/cuts",
    icon: Scissors,
  },
  {
    title: "Glow Feed",
    url: "/glow-feed",
    icon: Camera,
  }
];

const userMenuItems = [
  {
    title: "Wallet",
    url: "/wallet",
    icon: Wallet,
    roles: ['client', 'artist', 'business', 'transport']
  },
  {
    title: "Referrals",
    url: "/referrals",
    icon: Share2,
    roles: ['client', 'artist', 'business', 'transport']
  }
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, isAuthenticated, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!profile) return null;
    
    switch (profile.user_role) {
      case 'artist':
        return { url: '/artist-dashboard', label: 'Artist Dashboard', icon: Star };
      case 'business':
        return { url: '/business', label: 'Business Dashboard', icon: Settings };
      case 'transport':
        return { url: '/transport-dashboard', label: 'Transport Portal', icon: Truck };
      default:
        return null;
    }
  };

  const dashboardLink = getDashboardLink();

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-6">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <Star className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Deevah</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-muted-foreground px-6">
            Explore
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <Link 
                      to={item.url} 
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors ${
                        location.pathname === item.url ? 'bg-accent text-accent-foreground' : ''
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Menu - Only show if authenticated */}
        {isAuthenticated && profile && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-medium text-muted-foreground px-6">
              Your Account
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-3">
              <SidebarMenu>
                {userMenuItems
                  .filter(item => item.roles.includes(profile.user_role))
                  .map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className="w-full">
                        <Link 
                          to={item.url}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent transition-colors ${
                            location.pathname === item.url ? 'bg-accent text-accent-foreground' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon className="w-5 h-5" />
                            <span>{item.title}</span>
                          </div>
                          {item.title === 'Wallet' && (
                            <Badge variant="secondary" className="text-xs">
                              0
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                
                {/* Dashboard link for logged-in artists/business owners */}
                {dashboardLink && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="w-full">
                      <Link 
                        to={dashboardLink.url}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors ${
                          location.pathname === dashboardLink.url ? 'bg-accent text-accent-foreground' : ''
                        }`}
                      >
                        <dashboardLink.icon className="w-5 h-5" />
                        <span>{dashboardLink.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-6">
        {isAuthenticated && profile ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
              <Avatar className="w-8 h-8">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>
                  {profile.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{profile.full_name}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-muted-foreground capitalize">{profile.user_role}</p>
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    ✓
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <SidebarMenuButton asChild className="w-full">
            <Link 
              to="/auth" 
              className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-5 h-5" />
              <span>Login / Signup</span>
            </Link>
          </SidebarMenuButton>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
