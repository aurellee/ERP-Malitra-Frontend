"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const publicPaths = ["/login", "/register"];
  const isPublic = publicPaths.includes(pathname);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isPublic) {
        router.replace("/login");
      } else if (isAuthenticated && isPublic) {
        router.replace("/");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading && !isPublic) {
    return null;
  }

  // Render normal
  return isPublic ? (
    <>{children}</>
  ) : (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SidebarProvider>
        <div className="flex min-h-screen bg-white dark:bg-[#121212]">
          <AppSidebar />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
