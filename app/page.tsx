"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { useEffect } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SalesIncomeChart } from "./salesIncome/page";

export default function Page() {

  useEffect(() => {
    // Applying on mount
    document.body.style.overflow = "hidden";
    // Applying on unmount    
    return () => {
      document.body.style.overflow = "visible";
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col p-8 bg-theme text-theme space-y-6">
      {/* TOP BAR */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <ModeToggle />
      </div>


      {/* MAIN CONTENT */}
      <main className="flex flex-1 flex-col">

        <div className="grid auto-rows-min gap-6 grid-cols-[2fr_560px] mb-6">
          <div>
            <div className="w-full h-56 rounded-[40px] p-8 shadow shadow-sm dark:shadow-gray-900 bg-gradient-to-r from-[#023291] to-[#0456F7]"/>
            <div className="mt-6 grid auto-rows-min gap-6 grid-cols-2">
              <div className="bg-[oklch(0.21_0.034_264.665_/_3%)] p-8 shadow shadow-sm dark:shadow-gray-900 w-full rounded-[40px] h-46" />
              <div className="bg-[oklch(0.21_0.034_264.665_/_3%)] p-8 shadow shadow-sm dark:shadow-gray-900 w-full rounded-[40px] h-46" />
            </div>
          </div>
          <div className="bg-[oklch(0.21_0.034_264.665_/_3%)] p-8 shadow shadow-sm dark:shadow-gray-900 w-full h-auto rounded-[40px]" />
        </div>
        <SalesIncomeChart></SalesIncomeChart>
      </main>
    </div>
  )
}
