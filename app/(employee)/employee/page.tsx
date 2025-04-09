"use client"

import React, { useState } from "react"
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
import { Search, Edit, Trash, PencilLine, Trash2, Filter } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart } from "recharts"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { EmployeePerformanceChart } from "../employeePerformance/page"

const dummyEmployees = Array.from({ length: 100 }, (_, i) => ({
  id: `MCPHY${2500 + i}`,
  name: `Employee ${i + 1}`,
  role: i % 2 === 0 ? "Sales" : "Mechanic",
  hired: "19/01/24",
  salary: 29000000,
  bonus: 1000000,
  absensi: "See Detail",
  statusSalary: i % 3 === 0 ? "Unpaid" : "Paid",
  notes: "Omzet penjualan 20% dibawah target",
  performance: Math.floor(Math.random() * 60) + 1,
}))

const ITEMS_PER_PAGE = 3

export default function EmployeePage() {
  const router = useRouter()

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const filteredEmployees = dummyEmployees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalItems = filteredEmployees.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (direction: string) => {
    setCurrentPage((prev) =>
      direction === "next" ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
    )
  }

  return (
    <div className="p-8 md:p-8 bg-theme text-theme">
      {/* TOP BAR */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-2xl font-bold">Employee</h1>
        </div>
        <ModeToggle />
      </div>

      {/* EMPLOYEE PERFORMANCE + "THIS MONTH" SELECT */}
      <div className="mt-2 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* <h1 className="text-xl font-semibold mt-2">This Month's Employee Performance</h1> */}
        {/* PLACEHOLDER BAR CHART */}
        <EmployeePerformanceChart></EmployeePerformanceChart>
      </div>

      {/* INFO CARDS: Total Salary, Total Bonus, Employee Attendance, Employee Benefits */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Income */}
        <div className="rounded-[24px] h-[110px] p-7 shadow-sm dark:shadow-gray-900 bg-gradient-to-r from-[#023291] to-[#0456F7]">
          <p className="text-sm text-white">Total Salary</p>
          <p className="mt-1 text-2xl font-bold text-white">Rp 308.000.000</p>
        </div>
        {/* Card 2: Cash */}
        <div className="rounded-[28px] h-[110px] p-7 shadow-sm dark:shadow-gray-900 bg-gradient-to-r from-[#960019] to-[#DF0025]">
          <p className="text-sm text-white">Unpaid Salary</p>
          <p className="mt-1 text-2xl font-bold text-white">Rp 50.000.000</p>
        </div>
        {/* Card 3: Transfer Bank */}
        <div className="rounded-[24px] h-[110px] p-7 shadow-sm dark:shadow-gray-900 bg-gradient-to-r from-[#023291] to-[#0456F7]">
          <p className="text-sm text-white">Total Bonus</p>
          <p className="mt-1 text-2xl font-bold text-white">Rp 30.000.000</p>
        </div>
        {/* Card 4: Unpaid Invoice */}
        <div className="rounded-[28px] h-[110px] p-7 shadow-sm dark:shadow-gray-900 bg-gradient-to-r from-[#960019] to-[#DF0025]">
          <p className="text-sm text-white">Unpaid Bonus</p>
          <p className="mt-1 text-2xl font-bold text-white">Rp 5.000.000</p>
        </div>
      </div>

      {/* EMPLOYEE LIST (20), SEARCH, FILTER, + ADD EMPLOYEE */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-semibold">Employee List (20)</h3>
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative flex items-center gap-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <Input type="text" placeholder="Search..." className="pl-9 pr-5" />
          </div>

          {/* Filter button */}
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="text-gray-200" size={14} />
            Filter
          </Button>

          {/* +Add Employee */}
          <Button className="bg-[#0456F7] text-white hover:bg-blue-700">+ Add Employee</Button>
        </div>
      </div>

      {/* TABLE */}
      <div className=" w-full overflow-x-auto rounded-lg border border-theme bg-theme">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 text-left text-gray-600 dark:bg-[#181818] dark:text-gray-400">
            <tr>
              <th className="px-4 py-4 font-semibold">Employee ID</th>
              <th className="px-4 py-4 font-semibold">Name</th>
              <th className="px-4 py-4 font-semibold">Position</th>
              <th className="px-4 py-4 font-semibold">Hire Date</th>
              <th className="px-4 py-4 font-semibold">Absent</th>
              <th className="px-4 py-4 font-semibold">Salary</th>
              <th className="px-4 py-4 font-semibold">Bonus</th>
              <th className="px-4 py-4 font-semibold">Notes</th>
              <th className="px-4 py-4 font-semibold"></th>
            </tr>
          </thead>
          <TableBody className="bg-theme divide-y dark:divide-[oklch(1_0_0_/_10%)]">
            {paginatedEmployees.map((emp, i) => (
              <TableRow key={i} className="dark:hover:bg-[#161616]">
                <TableCell className="px-4 py-3">{emp.id}</TableCell>
                <TableCell className="px-4 py-3">{emp.name}</TableCell>
                <TableCell className="px-4 py-3">{emp.role}</TableCell>
                <TableCell className="px-4 py-3">{emp.hired}</TableCell>
                <TableCell className="px-4 py-3"><Button variant="outline" size="sm">See Detail</Button></TableCell>
                <TableCell className={`px-3 py-3`}>Rp {emp.salary.toLocaleString()}
                  <span className={`ml-3 text-theme px-2 py-1 text-xs rounded-md w-[150px] font-medium ${emp.statusSalary === "Unpaid" ? "bg-[#FFD2D9] text-[#DD0005]" : "bg-[#DAF6D2] text-[#34A718]"}`}>
                    {emp.statusSalary}</span>
                </TableCell>
                <TableCell className={`px-3 py-3 flex items-center`}>Rp {emp.bonus.toLocaleString()}
                  <span className={`ml-2 w-16 text-theme py-1 text-xs rounded-lg text-center ${emp.statusSalary === "Unpaid" ? "bg-[#FFD2D9] text-[#DD0005]" : "bg-[#DAF6D2] text-[#34A718]"}`}>
                    {emp.statusSalary}</span>
                </TableCell>
                <TableCell className="px-4 py-3">{emp.notes}</TableCell>
                <TableCell className="px-4 py-3">
                  <button className="mr-2 text-[#0456F7] cursor-pointer">
                    <PencilLine size={16} />
                  </button>
                  <button className="text-[#DD0005] cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </table>
      </div>

      {/* FOOTER PAGINATION */}
      <footer className="mt-4 w-full py-2 text-sm text-gray-600 dark:text-white">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          {/* e.g. "Showing 16 of 48 Products" */}
          <p>Showing {paginatedEmployees.length} of {totalItems} Products</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <Button variant="outline" onClick={() => handlePageChange("next")} disabled={currentPage === totalPages}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
