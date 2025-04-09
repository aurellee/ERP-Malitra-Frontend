'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CalendarIcon, PencilIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useState } from 'react'
import { ModeToggle } from '@/components/mode-toggle'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

type AttendanceStatus = 'Present' | 'Absent' | 'On Leave'

interface AttendanceData {
  id: string
  employee: string
  role: string
  clockIn: string
  clockOut: string
  day: string
  status: AttendanceStatus
  notes?: string
}

const allEmployees: AttendanceData[] = [
  { id: 'MCPHY2524', employee: 'Hera Hermes', role: 'Sales', clockIn: '08:00AM', clockOut: '05:00', day: 'Full Day', status: 'Present' },
  { id: 'MCPHY2524', employee: 'Ralph Lauren', role: 'Mechanic', clockIn: '08:00AM', clockOut: '05:00', day: 'Half Day', status: 'Present' },
  { id: 'MCPHY2524', employee: 'Ralph Lauren', role: 'Sales', clockIn: '08:00AM', clockOut: '05:00', day: 'Full Day', status: 'Present' },
  { id: 'MCPHY2524', employee: 'Loro Piana', role: 'Sales', clockIn: '08:00AM', clockOut: '05:00', day: 'Full Day', status: 'Present' },
  { id: 'MCPHY2524', employee: 'David Yurman', role: 'Sales', clockIn: '-', clockOut: '-', day: '-', status: 'Absent' },
  { id: 'MCPHY2524', employee: 'Christian Dior', role: 'Mechanic', clockIn: '-', clockOut: '-', day: '-', status: 'On Leave' },
  { id: 'MCPHY2524', employee: 'David Yurman', role: 'Mechanic', clockIn: '-', clockOut: '-', day: '-', status: 'Absent' },
  { id: 'MCPHY2524', employee: 'Yurman David', role: 'Sales', clockIn: '-', clockOut: '-', day: '-', status: 'Absent' },
  { id: 'MCPHY2524', employee: 'Yura', role: 'Sales', clockIn: '08:00AM', clockOut: '05:00', day: 'Full Day', status: 'Present' },
  { id: 'MCPHY2524', employee: 'Ino', role: 'Mechanic', clockIn: '-', clockOut: '-', day: '-', status: 'Absent' },
  { id: 'MCPHY2524', employee: 'Zara', role: 'Mechanic', clockIn: '-', clockOut: '-', day: '-', status: 'On Leave' },
  // Tambahkan data lain sesuai kebutuhan
]

const statusColor = {
  Present: 'bg-blue-100 text-blue-600',
  Absent: 'bg-red-100 text-red-600',
  'On Leave': 'bg-yellow-100 text-yellow-600',
}

export default function AttendancePage() {
  const itemsPerPage = 11
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const filtered = allEmployees.filter((emp) =>
    emp.employee.toLowerCase().includes(search.toLowerCase())
  )

  const paginated = filtered.slice(page * itemsPerPage, (page + 1) * itemsPerPage)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  return (
    <div className="min-h-screen flex flex-col p-8 bg-theme text-theme space-y-4">
      {/* Header Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Employee &gt; <span className="font-medium text-black">Attendance</span>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-2xl font-bold">Attendance</h1>
        </div>
        <ModeToggle />
      </div>

      {/* Title & Date */}
      <div className="flex items-center justify-between w-full">
        <div>
          <Button variant="outline" className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
            <CalendarIcon className="h-4 w-4" />
            Today, Feb 20
          </Button>
        </div>
        {/* Search Bar */}
        <div className="w-120">
          <Input
            placeholder="Search.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
        </div>
      </div>



      {/* Table */}
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Clock-In</TableHead>
              <TableHead>Clock-Out</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((emp, i) => (
              <TableRow key={i}>
                <TableCell>{emp.id}</TableCell>
                <TableCell>{emp.employee}</TableCell>
                <TableCell>{emp.role}</TableCell>
                <TableCell>{emp.clockIn}</TableCell>
                <TableCell>{emp.clockOut}</TableCell>
                <TableCell>{emp.day}</TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${statusColor[emp.status]}`}
                  >
                    {emp.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{emp.notes || '-'}</span>
                    <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer hover:text-black" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {Math.min((page + 1) * itemsPerPage, filtered.length)} of {filtered.length} Employees
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <span>
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}