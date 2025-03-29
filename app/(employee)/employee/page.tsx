"use client"

import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"   // Adjust import path
import { ModeToggle } from "@/components/mode-toggle"      // Adjust import path
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Search, Edit, Trash } from "lucide-react"

export default function EmployeePage() {
  return (
    <div className="min-h-screen bg-theme text-theme border-theme p-6 md:p-8">
      {/* TOP BAR: Sidebar Trigger + Title (left), Dark Mode Toggle (right) */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Employee</h1>
        </div>
        <ModeToggle />
      </div>

      {/* EMPLOYEE PERFORMANCE + "THIS MONTH" SELECT */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Employee Performance</h2>
        <Select>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="This Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="custom-range">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* PLACEHOLDER BAR CHART */}
      <div className="mb-6 flex items-end gap-3 overflow-x-auto border border-gray-200 bg-white p-4">
        {/* Example bars - replace with real chart if needed */}
        {mockBarData.map((item) => (
          <div key={item.name} className="flex flex-col items-center">
            <span className="mb-1 text-sm text-gray-600">{item.value}</span>
            <div
              className="w-4 rounded bg-blue-500"
              style={{ height: `${item.value * 2}px` }} // Scale for demo
            />
            <span className="mt-1 text-xs text-gray-500">{item.name}</span>
          </div>
        ))}
      </div>

      {/* INFO CARDS: Total Salary, Total Bonus, Employee Attendance, Employee Benefits */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md bg-white p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Salary</p>
          <p className="mt-1 text-2xl font-bold text-gray-800">Rp 420.000.000</p>
        </div>
        <div className="rounded-md bg-white p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Bonus</p>
          <p className="mt-1 text-2xl font-bold text-gray-800">Rp 30.000.000</p>
        </div>
        <div className="rounded-md bg-white p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Employee Attendance</p>
          <p className="mt-1 text-2xl font-bold text-gray-800">100%</p>
        </div>
        <div className="rounded-md bg-white p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Employee Benefits</p>
          <p className="mt-1 text-2xl font-bold text-gray-800">Active</p>
        </div>
      </div>

      {/* EMPLOYEE LIST (20), SEARCH, FILTER, + ADD EMPLOYEE */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-semibold">Employee List (20)</h3>
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
          <Button variant="outline" className="flex items-center gap-1">
            Filter
          </Button>

          {/* +Add Employee */}
          <Button>+ Add Employee</Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Employee ID</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Position</th>
              <th className="px-4 py-3 font-semibold">Hire Date</th>
              <th className="px-4 py-3 font-semibold">Salary</th>
              <th className="px-4 py-3 font-semibold">Bonus</th>
              <th className="px-4 py-3 font-semibold">Notes</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-3">MCPNY25{210 + i}</td>
                <td className="px-4 py-3">Rhea Hermes</td>
                <td className="px-4 py-3">Sales</td>
                <td className="px-4 py-3">18/01/24</td>
                <td className="px-4 py-3">Rp 10.000.000</td>
                <td className="px-4 py-3">Rp 1.000.000</td>
                <td className="px-4 py-3">Omset penjualan naik 10%</td>
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
      <div className="mt-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <p className="text-sm text-gray-600">Showing 4 of 100 Employees</p>
        <div className="flex items-center gap-2">
          <Button variant="outline">Prev</Button>
          <span className="text-sm text-gray-600">1 / 25</span>
          <Button variant="outline">Next</Button>
        </div>
      </div>
    </div>
  )
}

/* Example bar chart data (just placeholders) */
const mockBarData = [
  { name: "Hera", value: 25 },
  { name: "Angel", value: 31 },
  { name: "Kiki", value: 48 },
  { name: "Mella", value: 19 },
  { name: "David", value: 35 },
  { name: "Yudi", value: 22 },
  { name: "Irwan", value: 40 },
  { name: "Yoh", value: 12 },
  { name: "Yuman", value: 30 },
  { name: "Lora", value: 28 },
  { name: "Diro", value: 15 },
  { name: "Pian", value: 45 },
  { name: "Agus", value: 18 },
  { name: "Laura", value: 26 },
]