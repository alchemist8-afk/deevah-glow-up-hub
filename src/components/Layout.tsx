
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import MobileNavigation from "./MobileNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {!isMobile && <AppSidebar />}
        <main className="flex-1 pb-20 lg:pb-0 bg-white lg:bg-gray-50">
          {!isMobile && (
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 p-4 lg:bg-transparent lg:border-0">
              <SidebarTrigger className="lg:hidden" />
            </div>
          )}
          <div className="lg:px-0">{children}</div>
        </main>
        <MobileNavigation />
      </div>
    </SidebarProvider>
  );
}
