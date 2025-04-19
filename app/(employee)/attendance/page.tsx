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
import { CalendarIcon, PencilIcon, ChevronLeftIcon, ChevronRightIcon, PencilLine, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ModeToggle } from '@/components/mode-toggle'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import SingleDatePicker from '@/components/single-date-picker'
import AttendanceDatePicker from '@/components/attendance-date'
import employeeApi from '@/api/employeeApi'

type AbsenceStatus = 'Present' | 'Absent' | 'On Leave' | 'On Sick';

// const allEmployees: AttendanceData[] = [
//   { id: 'MCPHY2524', employee: 'Hera Hermes', role: 'Sales', clockIn: '08:00AM', clockOut: '05:00', day: 'Full Day', status: 'Present' },
//   { id: 'MCPHY2524', employee: 'Ralph Lauren', role: 'Mechanic', clockIn: '08:00AM', clockOut: '05:00', day: 'Half Day', status: 'Present' },
//   { id: 'MCPHY2524', employee: 'Ralph Lauren', role: 'Sales', clockIn: '08:00AM', clockOut: '05:00', day: 'Full Day', status: 'Present' },
//   { id: 'MCPHY2524', employee: 'Loro Piana', role: 'Sales', clockIn: '08:00AM', clockOut: '05:00', day: 'Full Day', status: 'Present' },
//   { id: 'MCPHY2524', employee: 'David Yurman', role: 'Sales', clockIn: '-', clockOut: '-', day: '-', status: 'Absent' },
//   { id: 'MCPHY2524', employee: 'Christian Dior', role: 'Mechanic', clockIn: '-', clockOut: '-', day: '-', status: 'On Leave' },
//   { id: 'MCPHY2524', employee: 'David Yurman', role: 'Mechanic', clockIn: '-', clockOut: '-', day: '-', status: 'Absent' },
//   { id: 'MCPHY2524', employee: 'Yurman David', role: 'Sales', clockIn: '-', clockOut: '-', day: '-', status: 'Absent' },
//   { id: 'MCPHY2524', employee: 'Yura', role: 'Sales', clockIn: '08:00AM', clockOut: '05:00', day: 'Full Day', status: 'Present' },
//   { id: 'MCPHY2524', employee: 'Ino', role: 'Mechanic', clockIn: '-', clockOut: '-', day: '-', status: 'Absent' },
//   { id: 'MCPHY2524', employee: 'Zara', role: 'Mechanic', clockIn: '-', clockOut: '-', day: '-', status: 'On Leave' },
//   { id: 'MCPHY2524', employee: 'Loro Piana', role: 'Sales', clockIn: '08:00AM', clockOut: '05:00', day: 'Full Day', status: 'Present' },
//   { id: 'MCPHY2524', employee: 'David Yurman', role: 'Sales', clockIn: '-', clockOut: '-', day: '-', status: 'Absent' },
//   { id: 'MCPHY2524', employee: 'Christian Dior', role: 'Mechanic', clockIn: '-', clockOut: '-', day: '-', status: 'On Leave' },
//   { id: 'MCPHY2524', employee: 'David Yurman', role: 'Mechanic', clockIn: '-', clockOut: '-', day: '-', status: 'Absent' },
//   // Tambahkan data lain sesuai kebutuhan
// ]

const statusColor: { [key in AbsenceStatus]: string } = {
  Present: 'bg-blue-100 text-blue-600',
  Absent: 'bg-pink-100 text-pink-600',
  'On Leave': 'bg-red-100 text-red-600',
  'On Sick': 'bg-orange-100 text-orange-600'
  // "Oli": "bg-green-100 text-green-600",
  // "Ban": "bg-orange-100 text-orange-600",
  // "Aki": "bg-red-100 text-red-600",
  // "Campuran": "bg-purple-100 text-purple-600",
};

export default function AttendancePage() {
  const ITEMS_PER_PAGE = 14
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const [isOpen, setIsOpen] = useState(false)
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)
  const [dialogEditOpen, setDialogEditOpen] = useState(false)
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchEmployeeAbsence();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchEmployeeAbsence(); // Fetch ulang kalau kembali ke halaman ini
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const fetchEmployeeAbsence = async () => {
    setLoading(true);
    try {
      const response = await employeeApi().viewAttendances();
      if (response.status === 200) {
        setEmployees(response.data);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  // Gunakan satu state untuk seluruh form
  const [form, setForm] = useState({
    employee_name: "",
    role: "",
    date: "",
    clock_in: "",
    clock_out: "",
    day_count: 0,
    absence_status: "",
    day_status: "",
    notes: "",
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const filteredEmployees = employees.filter((employee) =>
    employee.employee_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Hitung slice data
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const employeesData = filteredEmployees.slice(startIndex, endIndex)


  // 2. compute 1‑based values
  const totalEmployees = filteredEmployees.length
  const totalPages = Math.ceil(totalEmployees / ITEMS_PER_PAGE)
  const startItem = totalEmployees > 0 ? startIndex + 1 : 0;
  const endItem = Math.min(endIndex, totalEmployees);

  // 3. build the display string
  //    if startItem===endItem, show just one number (e.g. “15 of 15”)
  const rangeText =
    startItem === endItem
      ? `${endItem}`
      : `${startItem}–${endItem}`;


  // Next / Prev page
  const handlePageChange = (direction: string) => {
    setCurrentPage((prev) =>
      direction === "next" ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
    )
  }

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-[#000] text-theme space-y-4 flex flex-col">
      {/* Header Breadcrumb */}
      {/* <div className="text-sm text-muted-foreground">
        Employee  &gt; <span className="font-medium text-black">Attendance</span>
      </div> */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-2xl font-bold">Attendance</h1>
        </div>
        <ModeToggle />
      </div>

      {/* Title & Date */}
      <div className="mt-2 flex items-center justify-between w-full">
        <AttendanceDatePicker></AttendanceDatePicker>
        {/* Search Bar */}
        <div className="relative flex gap-6 justify-end text-right">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <Input
            placeholder="Search.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-5 w-100 h-[40px] rounded-[80px]" />
        </div>
      </div>



      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg border border-theme bg-theme">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 text-left text-gray-600 dark:bg-[#181818] dark:text-gray-400 shadow-xs shadow-theme">
            <tr>
              <th className="px-4 py-4 font-semibold">Employee ID</th>
              <th className="px-4 py-4 font-semibold">Employee Name</th>
              <th className="px-4 py-4 font-semibold">Role</th>
              <th className="px-4 py-4 font-semibold">Clock-In</th>
              <th className="px-4 py-4 font-semibold">Clock-Out</th>
              <th className="px-4 py-4 font-semibold">Day</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-4 py-4 font-semibold">Notes</th>
              <th className="px-4 py-4 font-semibold"></th>
            </tr>
          </thead>
          <TableBody className=''>
            {employeesData.map((emp, i) => (
              <TableRow key={i}>
                <TableCell className="px-4 py-4">{emp.employee_id}</TableCell>
                <TableCell className="px-4 py-2">{emp.employee_name}</TableCell>
                <TableCell className="px-4 py-2">{emp.role}</TableCell>
                <TableCell className="px-4 py-2">{emp.clock_in}</TableCell>
                <TableCell className="px-4 py-2">{emp.clock_out}</TableCell>
                <TableCell className="px-4 py-2">{emp.day_status}</TableCell>
                <TableCell className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-sm rounded-full font-medium ${statusColor[emp.absence_status as AbsenceStatus]}`}
                  >
                    {emp.absence_status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center px-4 py-2">
                    <span>{emp.notes || '-'}</span>
                  </div>
                </TableCell>
                <TableCell className="py-2">
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

      {/* Pagination */}
      <footer className="mt-auto w-full text-sm text-gray-600 dark:text-white">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          {/* e.g. "Showing 16 of 48 Products" */}
          <p>Showing {rangeText} of {totalEmployees} Employees</p>
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