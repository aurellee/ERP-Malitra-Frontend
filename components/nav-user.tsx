"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/app/context/AuthContext";

export function NavUser({
  userinfo,
}: {
  userinfo: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { logout, isAuthenticated, user } = useAuth();

  const handleLogout = () => {
    logout();
    console.log("User logged out!");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userinfo.avatar} alt={userinfo.name} />
                <AvatarFallback className="rounded-lg">MCP</AvatarFallback>
              </Avatar>
              <div className="ml-1 grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userinfo.name}</span>
                <span className="truncate text-xs">{userinfo.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-auto min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userinfo.avatar} alt={userinfo.name} />
                  <AvatarFallback className="rounded-lg">MCP</AvatarFallback>
                </Avatar>
                <div className=" grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userinfo.name}</span>
                  <span className="truncate text-xs">{userinfo.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Settings />
                Setting
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem> */}
            {/* <DropdownMenuItem className="">
              <LogoutButton />
            </DropdownMenuItem> */}
            <div className="p-0">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  // The styling below makes it look like a sidebar item:
                  className="
                  group flex items-center gap-2 rounded-md px-2 py-2
                  text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-800
                  transition-colors w-full flex flex-1
                "
                >
                  <LogOut
                    size={16}
                    className="text-gray-400 transition-colors"
                  />
                  <span className="text-sm font-regular w-full flex flex-1">Log out</span>
                </button>
              ) : (
                <p>You are not logged in.</p>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
