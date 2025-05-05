"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedLayout from "./ProtectedLayout";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle";
import { useEffect } from "react";
import useUnsavedChangesWarning from "@/hooks/useUnsavedChanges";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
// import localFont from "next/font/local"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    // Applying on mount
    document.body.style.overflow = "hidden";
    // Applying on unmount    
    return () => {
      document.body.style.overflow = "visible";
    }
  }, [])

  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

  const {
    unsavedChanges,
    setNextRoute,
    showPrompt,
    setShowPrompt,
    confirmNavigation,
    cancelNavigation,
  } = useUnsavedChangesWarning();

  useEffect(() => {
    const handleRouteChange = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a')) {
        const href = (target.closest('a') as HTMLAnchorElement).href;
        const targetPath = new URL(href).pathname;

        if (unsavedChanges && targetPath !== pathname) {
          e.preventDefault();
          setNextRoute(targetPath);
          setShowPrompt(true);
        }
      }
    };

    document.addEventListener('click', handleRouteChange);
    return () => {
      document.removeEventListener('click', handleRouteChange);
    };
  }, [unsavedChanges, pathname]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
      <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
        <AuthProvider>
          {isAuthRoute ? (
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          ) : (
            // PROTECTED: everything else
            <ProtectedLayout>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </ProtectedLayout>
          )}

          {/* unsaved‐changes dialog… */}
          <Dialog open={showPrompt} onOpenChange={cancelNavigation}>
            {/* … */}
          </Dialog>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}



// import "./globals.css";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedLayout from "./ProtectedLayout";
// import { ThemeProvider } from "@/components/theme-provider"
// import { ModeToggle } from "@/components/mode-toggle";
// import { useEffect } from "react";

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body>
//         <AuthProvider>
//           <ProtectedLayout>
//             <ThemeProvider
//               attribute="class"
//               defaultTheme="system"
//               enableSystem
//               disableTransitionOnChange
//             >
//               {children}
//             </ThemeProvider>
//           </ProtectedLayout>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }