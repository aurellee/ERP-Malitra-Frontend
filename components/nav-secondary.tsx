"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Use next/navigation in Next.js 13
import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavSecondaryProps extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
}

export function NavSecondary({ items, ...props }: NavSecondaryProps) {
  // Get the current pathname from next/navigation
  const pathname = usePathname();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            // Determine if the current path matches the item's URL
            const active = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  size="lg"
                  className={`px-4 h-[40px] rounded-[64px] ${
                    active
                      ? "bg-[#0456F7] text-white hover:bg-[#0456F7] hover:text-white "
                      : "bg-transparent hover:bg-gray-100 dark:hover:bg-[oklch(0.278_0.033_256.848)]"
                  }`}
                >
                  <Link href={item.url}>
                    <item.icon className="mr-2" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// import * as React from "react"
// import { type LucideIcon } from "lucide-react"

// import {
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"

// export function NavSecondary({
//   items,
//   ...props
// }: {
//   items: {
//     title: string
//     url: string
//     icon: LucideIcon
//   }[]
// } & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
//   return (
//     <SidebarGroup {...props}>
//       <SidebarGroupContent>
//         <SidebarMenu>
//           {items.map((item) => (
//             <SidebarMenuItem key={item.title}>
//               <SidebarMenuButton asChild size="lg">
//                 <a href={item.url}>
//                   <item.icon />
//                   <span>{item.title}</span>
//                 </a>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           ))}
//         </SidebarMenu>
//       </SidebarGroupContent>
//     </SidebarGroup>
//   )
// }
