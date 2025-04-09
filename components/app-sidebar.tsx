"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { Command } from "lucide-react"
import { Bot, Box, InboxIcon, LucideLayoutDashboard, ReceiptTextIcon, User2Icon } from "lucide-react"

// Sample data
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
    },
    {
      title: "Invoices",
      url: "/invoices",
      icon: ReceiptTextIcon,
      items: [
        {
          title: "New Order",
          url: "/newOrder",
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
          title: "Payroll",
          url: "/payroll",
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
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  // A small helper function to check if the current item is "active"
  // For exact matching: (pathname === itemUrl)
  // If you want partial matching (e.g., /invoices/new), use startsWith:
  // (pathname?.startsWith(itemUrl))
  function isActive(itemUrl: string) {
    return pathname === itemUrl
  }

  return (
    <Sidebar variant="inset" className="rounded-[40px] overflow-hidden" {...props}>
      {/* HEADER */}
      <SidebarHeader>
        <SidebarMenu className="w-[220px]">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="bg-[#0456F7] text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-extrabold text-default">Malitra</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Business Operation</SidebarGroupLabel>
          <SidebarMenu className="w-[220px] h-[20px] mt-3 space-y-4">
            {data.navMain.map((item) => {
              // Check if the top-level item is active
              const active = isActive(item.url)
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    // Apply background + text color if active
                    className={active ? "px-4 rounded-[64px] h-[36px] bg-[#0456F7] text-white hover:bg-[#0456F7] hover:text-white" : "px-4 h-[36px] rounded-[64px]"}
                  >
                    <Link href={item.url} className="font-medium flex items-center gap-2">
                      {/* Render icon if available */}
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.title}
                    </Link>
                  </SidebarMenuButton>

                  {/* Sub-menu items */}
                  {item.items?.length ? (
                    <SidebarMenuSub className="mt-3 ml-[22px] space-y-4">
                      {item.items.map((subItem) => {
                        const subActive = isActive(subItem.url)
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={subActive ? "px-3 w-[186px] rounded-[64px] h-[36px] bg-[#0456F7] text-white hover:bg-[#0456F7] hover:text-white" : "px-3 w-[186px] h-[36px] rounded-[64px]"}
                            >
                              <Link href={subItem.url}>{subItem.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Secondary Nav Items (AI Chatbot, Notifications) */}
        <NavSecondary items={data.navSecondary} className="mt-170 px-4 h-[36px] rounded-[64px]" />
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}