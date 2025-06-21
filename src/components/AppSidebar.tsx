
import { Calendar, Home, Scissors, ShoppingBag, Gamepad2, UtensilsCrossed, LogIn, Star } from "lucide-react";
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
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-deevah rounded-lg flex items-center justify-center">
            <Star className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Deevah</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-muted-foreground px-6">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <a 
                      href={item.url} 
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6">
        <SidebarMenuButton asChild className="w-full">
          <a 
            href="/auth" 
            className="flex items-center space-x-3 px-4 py-3 bg-gradient-deevah text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <LogIn className="w-5 h-5" />
            <span>Login / Signup</span>
          </a>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
