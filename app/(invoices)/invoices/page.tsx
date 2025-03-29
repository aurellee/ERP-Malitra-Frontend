"use client"

import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"  // Adjust import path
import { ModeToggle } from "@/components/mode-toggle"     // Adjust import path
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Search, Filter, Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function InvoicesPage() {
  return (
    <div className="min-h-screen flex flex-col p-6 md:p-8 bg-theme text-theme border-theme">
      {/* TOP BAR: Sidebar Trigger + Title on the left, Dark Mode Toggle on the right */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          {/* Page title */}
          <h1 className="text-2xl font-bold">Invoices</h1>
        </div>
        <ModeToggle />
      </div>

      {/* INVOICE SUMMARY + MONTH FILTER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold py-2">Invoice Summary</h1>
        {/* Right side: "This Month" (select or button) */}
        <Select>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="This Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* CARDS: Total Income, Cash, Transfer Bank, Unpaid Invoice */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Income */}
        <div className="rounded-md bg-theme p-4 shadow-sm border border-theme">
          <p className="text-sm text-gray-500">Total Income</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">Rp 388.000.000</p>
        </div>
        {/* Cash */}
        <div className="rounded-md bg-theme p-4 shadow-sm border border-theme">
          <p className="text-sm text-gray-500">Cash</p>
          <p className="mt-1 text-2xl font-bold text-theme">Rp 138.000.000</p>
        </div>
        {/* Transfer Bank */}
        <div className="rounded-md bg-theme p-4 shadow-sm border border-theme">
          <p className="text-sm text-gray-500">Transfer Bank</p>
          <p className="mt-1 text-2xl font-bold text-theme">Rp 200.000.000</p>
        </div>
        {/* Unpaid Invoice */}
        <div className="rounded-md bg-theme p-4 shadow-sm border border-theme">
          <p className="text-sm text-gray-500">Unpaid Invoice</p>
          <p className="mt-1 text-2xl font-bold text-red-600">Rp 50.000.000</p>
        </div>
      </div>

      {/* SUBHEADER: All Invoices (1400), Search, Filter, +Add Invoice */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-semibold">All Invoices (1400)</h3>
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-3"
            />
          </div>

          {/* Filter button */}
          <Button variant="outline" className="flex items-center gap-1 bg-theme">
            <Filter size={16} />
            Filter
          </Button>

          {/* +Add Invoice button */}
          <Button className="rounded-md bg-[#0456F7] dark:bg-[#0456F7] dark:text-white px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            + Add Invoice
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto rounded-lg border border-theme">
        <table className="w-full border-collapse text-sm border-theme">
          <thead className="bg-gray-100 dark:bg-[#121212] text-left text-theme">
            <tr>
              <th className="px-4 py-3 font-semibold">Invoice ID</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Sales</th>
              <th className="px-4 py-3 font-semibold">Mechanic</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Amount Paid</th>
              <th className="px-4 py-3 font-semibold">Amount Due</th>
              <th className="px-4 py-3 font-semibold">Payment</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-[#181818] divide-y divide-theme text-theme">
            {/* Example rows; replace with your real data */}
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-3">#23H0{i}9</td>
                <td className="px-4 py-3">25/05/2024</td>
                <td className="px-4 py-3">Heru Kenz</td>
                <td className="px-4 py-3">Kenzu</td>
                <td className="px-4 py-3">Rp 25.000.000</td>
                <td className="px-4 py-3">Rp 10.000.000</td>
                <td className="px-4 py-3">Rp 15.000.000</td>
                <td className="px-4 py-3">Installment</td>
                <td className="px-4 py-3">
                  <button className="mr-2 text-blue-600 hover:text-blue-800">
                    <Edit size={16} />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <footer className="mt-auto w-full bg-white dark:bg-[#121212] py-4 text-sm text-gray-600 dark:text-gray-200 ">
        {/* border-t border-gray-200 dark:border-gray-700 */}
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <p>Showing 9 of 1600 Products</p>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <span>1 / 120</span>
            <Button variant="outline">
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}