
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 p-4">
            <SidebarTrigger className="lg:hidden" />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
