import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function MainLayout({ children, title, description }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background relative">
        <div className="fixed inset-0 z-0">
          <AppSidebar />
        </div>
        
        <div className="flex-1 flex flex-col ml-[240px] relative z-10 bg-background min-h-screen">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card flex items-center px-6 sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-semibold text-foreground">{title}</h1>
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            </div>
            
            <div className="ml-auto flex items-center gap-4">
              {/* User info will be displayed dynamically via props or context */}
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-background relative z-10">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}