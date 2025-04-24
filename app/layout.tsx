"use client"

import type { Metadata } from "next";
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ProtectedLayout>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
              {/* <SidebarProvider> */}
              {/* 
              1) Make a flex container to hold the sidebar and main content side by side
              2) "min-h-screen" ensures the container spans the full viewport height
            */}
              {/* <div className="flex min-h-screen min-w-screen bg-theme text-theme"> */}
              {/* SIDEBAR (fixed width or auto) */}
              {/* <AppSidebar /> */}
              {/* MAIN CONTENT (flex-1 grows to fill remaining space) */}
              <div className="flex-1 overflow:hidden max-h-screen">
                {/* Optional triggers/toggles you had in <main> */}

                {/* Render the actual page content */}
                {children}
                <Dialog open={showPrompt} onOpenChange={cancelNavigation}>
                  <DialogContent className="text-center">
                    <DialogHeader>
                      <DialogTitle>Unsaved Changes</DialogTitle>
                      <p className="text-gray-500 mt-2">
                        You have unsaved changes. Do you want to save before leaving?
                      </p>
                    </DialogHeader>
                    <DialogFooter className="mt-4 flex gap-4 justify-center">
                      <Button variant="outline" onClick={cancelNavigation}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={confirmNavigation}>
                        Discard Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {/* </div> */}
              {/* </SidebarProvider> */}
            </ThemeProvider>
          </ProtectedLayout>
        </AuthProvider>
      </body>
    </html>
  )
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