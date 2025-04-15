// "use client"

// // import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/app-sidebar"
// import { ThemeProvider } from "@/components/theme-provider"
// import { ModeToggle } from "@/components/mode-toggle";
// import { useEffect } from "react";
// // import localFont from "next/font/local"

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {

//   useEffect(() => {
//       // Applying on mount
//               document.body.style.overflow = "hidden";
//       // Applying on unmount    
//               return () => {
//                 document.body.style.overflow = "visible";
//               }
//             }, [])
            
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="system"
//           enableSystem
//           disableTransitionOnChange
//         >
//           <SidebarProvider>
//             {/* 
//               1) Make a flex container to hold the sidebar and main content side by side
//               2) "min-h-screen" ensures the container spans the full viewport height
//             */}
//             <div className="flex min-h-screen min-w-screen bg-theme text-theme">
//               {/* SIDEBAR (fixed width or auto) */}
//               <AppSidebar />

//               {/* MAIN CONTENT (flex-1 grows to fill remaining space) */}
//               <div className="flex-1 py-2 overflow:hidden max-h-screen">
//                 {/* Optional triggers/toggles you had in <main> */}

//                 {/* Render the actual page content */}
//                 {children}
//               </div>
//             </div>
//           </SidebarProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }



import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedLayout from "./ProtectedLayout";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ProtectedLayout>{children}</ProtectedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
