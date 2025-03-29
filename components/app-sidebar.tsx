"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Box,
  CloudyIcon,
  CloverIcon,
  Command,
  FileBoxIcon,
  Frame,
  GemIcon,
  InboxIcon,
  LandmarkIcon,
  LayoutDashboard,
  LayoutDashboardIcon,
  LifeBuoy,
  LucideLayoutDashboard,
  LucideMessageCircleCode,
  MailIcon,
  Map,
  MessageCircleIcon,
  PersonStandingIcon,
  PieChart,
  PresentationIcon,
  ReceiptIcon,
  ReceiptTextIcon,
  Send,
  Settings2,
  SquareTerminal,
  User2Icon,
} from "lucide-react"

// import InventoryPage from "@/app/(inventory)/inventory/page"
import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavSecMain } from "@/components/nav-secondmain"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarGroupLabel
} from "@/components/ui/sidebar"
import Link from "next/link"

const data = {
  user: {
    name: "malitra",
    email: "malitra@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LucideLayoutDashboard,
      isActive: true,
    },
    {
      title: "Invoices",
      url: "/invoices",
      icon: ReceiptTextIcon,
      items: [
        {
          title: "New Order",
          url: "/newOrder",
          className: "py-2",  // Adds more vertical space
          size: "lg",         // Changes size to "lg"
        },
        {
          title: "Pending Order",
          url: "/pendingOrder",
        },
      ],
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: Box,
    },
    {
      title: "Employee",
      url: "/employee",
      icon: User2Icon,
      items: [
        {
          title: "Attendance",
          url: "/attendance",
        },
        {
          title: "Benefits",
          url: "/benefits",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "AI Chatbot",
      url: "#",
      icon: Bot,
    },
    {
      title: "Notifications",
      url: "#",
      icon: InboxIcon,
    },
  ],
  projects: [
    {
      title: "Employee",
      url: "/employee",
      icon: User2Icon,
      items: [
        {
          title: "Attendance",
          url: "/attendance",
        },
        {
          title: "Benefits",
          url: "/benefits",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-[#0456F7] text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-extrabold text-default">Malitra</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent >
      <SidebarGroup>
      <SidebarGroupLabel>Business Operation</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="lg">
                <Link href={item.url} className="font-medium">
                  {item.title}
                </Link>
              </SidebarMenuButton>
            
              {item.items?.length ? (
                <SidebarMenuSub>
                  {item.items.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.url}>
                          {subItem.title}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              ) : null}
            </SidebarMenuItem>
              // <SidebarMenuItem key={item.title}>
              //   <SidebarMenuButton asChild size={"lg"} >
              //     <a href={item.url} className="font-medium">
              //       {item.title}
              //     </a>
              //   </SidebarMenuButton>
              //   {item.items?.length ? (
              //     <SidebarMenuSub>
              //       {item.items.map((item) => (
              //         <SidebarMenuSubItem key={item.title}>
              //           <SidebarMenuSubButton href={item.url}>
              //             {item.title}
              //           </SidebarMenuSubButton>
              //         </SidebarMenuSubItem>
              //       ))}
              //     </SidebarMenuSub>
              //   ) : null}
              // </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {/* <NavSecMain items={data.projects} /> */}
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
