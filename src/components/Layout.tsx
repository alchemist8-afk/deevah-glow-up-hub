
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
      <div className="min-h-screen flex w-full">
        {!isMobile && <AppSidebar />}
        <main className="flex-1 pb-20 lg:pb-0">
          {!isMobile && (
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 p-4">
              <SidebarTrigger className="lg:hidden" />
            </div>
          )}
          <div className="px-4 lg:px-0">{children}</div>
        </main>
        <MobileNavigation />
      </div>
    </SidebarProvider>
  );
}
