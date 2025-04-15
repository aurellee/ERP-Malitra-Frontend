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
import { CalendarIcon, ChevronRight, ChevronRightCircle, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/LogoutButton";

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
    <div className="min-h-screen flex flex-col p-8 space-y-6 bg-white dark:bg-[#000] text-black dark:text-white">
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

        <div className="grid auto-rows-min gap-6 grid-cols-[2fr_470px] mb-6">
          <div>
            {/* total income for today */}
            <div className="col-span-2 w-full h-48 rounded-[40px] px-12 py-10 shadow shadow-md 
            dark:shadow-gray-900 bg-gradient-to-r from-[#023291] to-[#0456F7] 
            text-white transition-transform cursor-pointer">
              {/* hover:scale-101  */}
              <p className="text-3xl font-medium ">Total Income</p>
              <div className="text-7xl font-medium text-right ">
                <span className="text-4xl font-medium mr-4">
                  Rp
                </span>22.020.300</div>
            </div>
            <div className="mt-6 grid auto-rows-min gap-6 grid-cols-2">
              {/* low stock items */}
              <div className="bg-theme border p-10 shadow shadow-sm dark:shadow-gray-900 transition cursor-pointer
              w-full rounded-[40px] h-44 border flex items-center justify-between hover:shadow-md">
                {/* <div className="justify-self-start flex items-center gap-6"> */}
                <div className="text-[72px] font-semibold ">19</div>
                <p className="text-3xl w-40 font-medium text-left justify-self-start">Low Stock Items</p>
                {/* </div> */}
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = "/inventory"
                  }}
                  className="flex w-full rounded-full w-14 h-14 justify-center items-center
              hover:text-white bg-[#0456F7] hover:bg-blue-700 dark:hover:bg-blue-700 dark:bg-[#0456F7]">
                  <ChevronRightIcon style={{ color: "white", width: '40px', height: '40px' }} />
                </Button>
              </div>
              {/* out od stock items */}
              <div className="bg-theme p-10 shadow shadow-sm dark:shadow-gray-900 transition cursor-pointer
              w-full rounded-[40px] h-44 border flex items-center justify-between hover:shadow-md">
                <div className="text-[72px] font-semibold">22</div>
                <p className="text-3xl w-40 font-medium text-left justify-self-start">Out of Stock Items</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = "/inventory"
                  }}
                  className="flex w-full rounded-full w-14 h-14 justify-center items-center
              hover:text-white bg-[#0456F7] hover:bg-blue-700 dark:hover:bg-blue-700 dark:bg-[#0456F7]">
                  <ChevronRightIcon style={{ color: "white", width: '40px', height: '40px' }} />
                </Button>
              </div>
              {/* <div className="bg-[oklch(0.21_0.034_264.665_/_3%)] p-8 shadow shadow-sm dark:shadow-gray-900 w-full rounded-[40px] h-46" /> */}
            </div>
          </div>

          {/* attendance display */}
          <div className="bg-theme border p-15 shadow shadow-sm dark:shadow-gray-900 w-full h-auto rounded-[40px]">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-4xl font-medium text-theme">Employees Working</h1>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = "/attendance"
                }}
                className="flex w-full rounded-full w-16 h-16 justify-center items-center
              hover:text-white bg-[#0456F7] hover:bg-blue-700 dark:hover:bg-blue-700 dark:bg-[#0456F7]">
                <ChevronRightIcon style={{ color: "white", width: '40px', height: '40px' }} />
              </Button>
            </div>
            <div className="w-full flex mt-16 gap-10 grid grid-cols-2 justify-bertween">
              <div className="justify-start">
                <div className="text-7xl font-semibold">25</div>
                <p className="text-3xl mt-4">Sales</p>
              </div>
              <div className="justify-start">
                <div className="text-7xl font-semibold">05</div>
                <p className="text-3xl mt-4">Mechanics</p>
              </div>
            </div>
          </div>
        </div>
        <SalesIncomeChart></SalesIncomeChart>
      </main>
    </div>
  )
}
