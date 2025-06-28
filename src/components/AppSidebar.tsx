
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Sparkles, 
  Calendar, 
  Wallet, 
  User, 
  Settings, 
  Coffee, 
  Package, 
  Car,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const getNavItems = () => {
    if (!isAuthenticated || !profile) {
      return [
        { title: 'Home', url: '/', icon: Home },
        { title: 'Services', url: '/services', icon: Sparkles },
        { title: 'Food', url: '/food', icon: Coffee },
        { title: 'Shop', url: '/products', icon: Package },
        { title: 'Rides', url: '/rides', icon: Car },
      ];
    }

    const baseItems = [
      { title: 'Home', url: '/', icon: Home },
      { title: 'Dashboard', url: `/dashboard/${profile.user_role}`, icon: User },
    ];

    switch (profile.user_role) {
      case 'client':
        return [
          ...baseItems,
          { title: 'Services', url: '/services', icon: Sparkles },
          { title: 'Bookings', url: '/bookings', icon: Calendar },
          { title: 'Food', url: '/food', icon: Coffee },
          { title: 'Shop', url: '/products', icon: Package },
          { title: 'Rides', url: '/rides', icon: Car },
          { title: 'Wallet', url: '/wallet', icon: Wallet },
        ];
      case 'artist':
        return [
          ...baseItems,
          { title: 'Bookings', url: '/bookings', icon: Calendar },
          { title: 'Portfolio', url: '/glow-feed', icon: Sparkles },
          { title: 'Wallet', url: '/wallet', icon: Wallet },
        ];
      case 'business':
        return [
          ...baseItems,
          { title: 'Services', url: '/services', icon: Sparkles },
          { title: 'Products', url: '/products', icon: Package },
          { title: 'Food Menu', url: '/food', icon: Coffee },
          { title: 'Wallet', url: '/wallet', icon: Wallet },
        ];
      case 'transport':
        return [
          ...baseItems,
          { title: 'Rides', url: '/rides', icon: Car },
          { title: 'Earnings', url: '/wallet', icon: Wallet },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();
  const currentPath = location.pathname;
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path) 
      ? "bg-purple-100 text-purple-700 hover:bg-purple-200" 
      : "hover:bg-gray-100";
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        {/* User Profile Section */}
        {isAuthenticated && profile && !isCollapsed && (
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback>
                  {profile.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{profile.full_name}</p>
                <p className="text-sm text-gray-500 capitalize">{profile.user_role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Actions */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Back to Home Button for Dashboard Users */}
              {isAuthenticated && currentPath.includes('/dashboard') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Button
                      variant="ghost"
                      onClick={handleBackToHome}
                      className="w-full justify-start"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {!isCollapsed && <span>Back to Home</span>}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Settings */}
              {isAuthenticated && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/settings" className={getNavClassName('/settings')}>
                      <Settings className="h-4 w-4" />
                      {!isCollapsed && <span>Settings</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Auth Actions */}
              {isAuthenticated ? (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      {!isCollapsed && <span>Sign Out</span>}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/auth" className={getNavClassName('/auth')}>
                      <User className="h-4 w-4" />
                      {!isCollapsed && <span>Sign In</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
