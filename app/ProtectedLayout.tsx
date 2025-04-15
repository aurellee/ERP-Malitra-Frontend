// app/ProtectedLayout.tsx (pindahkan ke file terpisah lebih rapi)
"use client";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthorized, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && isAuthorized !== null) {
      if (!isAuthorized && pathname !== "/login" && pathname !== "/register") {
        router.replace("/login");
      } else if (
        isAuthorized &&
        (pathname === "/login" || pathname === "/register")
      ) {
        router.replace("/");
      }
    }
  }, [isAuthorized, isLoading, pathname, router]);

  if (!isAuthorized && pathname !== "/login" && pathname !== "/register") {
    return null;
  }

  // If the user is authorized, render the sidebar layout
  return isAuthorized ? (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SidebarProvider>
        <div className="flex min-h-screen min-w-screen bg-white text-black dark:bg-[#121212] dark:text-white">
          {/* Sidebar for navigation */}
          <AppSidebar />

          {/* Main content area */}
          <div className="flex-1 py-2">{children}</div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  ) : (
    // Show only children (no sidebar) for login/register pages
    <>{children}</>
  );
}
