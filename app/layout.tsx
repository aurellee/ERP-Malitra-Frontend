import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle";
// import localFont from "next/font/local"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// const sfPro = localFont({
//   src: [
//     {
//       path: "../public/fonts/SF-Pro-Text-Regular.woff2",
//       weight: "400",
//       style: "normal",
//     },
//     {
//       path: "../public/fonts/SF-Pro-Text-Medium.woff2",
//       weight: "500",
//       style: "normal",
//     },
//     {
//       path: "../public/fonts/SF-Pro-Text-Bold.woff2",
//       weight: "700",
//       style: "normal",
//     },
//     // Add more weights/styles as needed
//   ],
//   variable: "--sf-pro", // A CSS variable to reference in Tailwind
// })

// export const metadata: Metadata = {
//   title: "ERP Malitra",
//   description: "ERP Malitra with custom SF Pro font and background",
// }

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            {/* 
              1) Make a flex container to hold the sidebar and main content side by side
              2) "min-h-screen" ensures the container spans the full viewport height
            */}
            <div className="flex min-h-screen min-w-screen bg-white text-black dark:bg-[#121212] dark:text-white">
              {/* SIDEBAR (fixed width or auto) */}
              <AppSidebar />

              {/* MAIN CONTENT (flex-1 grows to fill remaining space) */}
              <div className="flex-1 py-2 md:py-2">
                {/* Optional triggers/toggles you had in <main> */}

                {/* Render the actual page content */}
                {children}
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
