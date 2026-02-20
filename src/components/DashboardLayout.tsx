import { User } from "@/types";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { MobileHeader } from "@/components/MobileHeader";

interface DashboardLayoutProps {
  user: User;
  title: string;
  notificationCount?: number;
  children: React.ReactNode;
}

export function DashboardLayout({ user, title, notificationCount, children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Desktop sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <AppSidebar user={user} />
        </div>

        <div className="flex-1 flex flex-col pb-16 md:pb-0">
          {/* Mobile header */}
          <MobileHeader user={user} title={title} notificationCount={notificationCount} />

          {/* Desktop header */}
          <header className="hidden md:block border-b bg-card shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold">{title}</h1>
            </div>
          </header>

          {children}
        </div>

        {/* Mobile bottom nav */}
        <MobileBottomNav user={user} />
      </div>
    </SidebarProvider>
  );
}
