"use client"

import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"  // Adjust path if needed
import { ModeToggle } from "@/components/mode-toggle"     // Adjust path if needed
import { Search, Edit, Trash } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function NewOrderPage() {
  return (
    <div className="min-h-screen p-6 md:p-8 bg-theme text-theme border-theme">
      {/* TOP BAR: Sidebar trigger + Title (left), Dark Mode toggle (right) */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          {/* Page title */}
          <h1 className="text-2xl font-bold">New Order</h1>
        </div>
        <ModeToggle />
      </div>

      {/* MAIN CONTENT: Two-column grid */}
      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        {/* LEFT COLUMN */}
        <div>
          {/* Header row: "Order on Process" + search bar */}
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold">Order on Process</h2>
            {/* Search bar */}
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Scan or Search Item..."
                className="w-full pl-8 pr-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product ID</th>
                  <th className="px-4 py-3 font-semibold">Product Name</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Quantity</th>
                  <th className="px-4 py-3 font-semibold">Discount</th>
                  <th className="px-4 py-3 font-semibold">Final Price</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {/* Example rows; replace with your real data */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">AS00{i}KL8H</td>
                    <td className="px-4 py-3">Kanvas Rem ABC</td>
                    <td className="px-4 py-3">Campuran</td>
                    <td className="px-4 py-3">Rp 1.500.000</td>
                    <td className="px-4 py-3">1</td>
                    <td className="px-4 py-3">Rp 15.000</td>
                    <td className="px-4 py-3">Rp 1.485.000</td>
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
        </div>

        {/* RIGHT COLUMN: Invoice details */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Invoice <span className="text-gray-500">#220203</span>
            </h3>
          </div>

          {/* Invoice Fields */}
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <span className="font-medium">Date</span>
              <span className="text-gray-600">25/05/24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Car</span>
              <span className="text-gray-600">DB 1137 DG</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Sales</span>
              <span className="text-gray-600">David Yurman</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Mechanic</span>
              <span className="text-gray-600">Kenzu</span>
            </div>
          </div>

          {/* Subtotal / Discount / Total */}
          <div className="mt-4 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>Rp 12.800.000</span>
            </div>
            <div className="flex items-center justify-between text-red-600">
              <span>Discount</span>
              <span>-Rp 50.000</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span>Rp 12.750.000</span>
            </div>
          </div>

          {/* Payment & Pending Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button className="rounded-md bg-[#0456F7] px-4 py-2 text-white hover:opacity-90">
              Payment
            </button>
            <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-100">
              Pending
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}