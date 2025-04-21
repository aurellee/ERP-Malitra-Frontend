'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CalendarIcon, PencilIcon, ChevronLeftIcon, ChevronRightIcon, PencilLine, Trash2, Search, ChevronLeft, ChevronRight, ChevronDown, ClockIcon } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { ModeToggle } from '@/components/mode-toggle'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import SingleDatePicker from '@/components/single-date-picker'
import AttendanceDatePicker from '@/components/attendance-date'
import employeeApi from '@/api/employeeApi'
import { format } from 'date-fns/format'

type AbsenceStatus = 'Present' | 'Absent' | 'On Leave' | 'On Sick';

const statusColor: { [key in AbsenceStatus]: string } = {
  Present: 'bg-blue-100 text-blue-600',
  Absent: 'bg-red-100 text-red-600',
  'On Leave': 'bg-orange-100 text-orange-600',
  'On Sick': 'bg-green-100 text-green-600'
  // "Oli": "bg-green-100 text-green-600",
  // "Ban": "bg-orange-100 text-orange-600",
  // "Aki": "bg-red-100 text-red-600",
  // "Campuran": "bg-purple-100 text-purple-600",
};

export default function AttendancePage() {
  const ITEMS_PER_PAGE = 13
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const [isOpen, setIsOpen] = useState(false)
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)
  const [dialogEditOpen, setDialogEditOpen] = useState(false)

  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const [editIndex, setEditIndex] = useState<number | null>(null)
  const todayIso = format(new Date(), 'yyyy-MM-dd')
  const [attendanceDate, setAttendanceDate] = useState(todayIso)

  const clockInRef = useRef<HTMLInputElement>(null)
  const clockOutRef = useRef<HTMLInputElement>(null)


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
        console.error("Failed to fetch employees");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  }

  // Gunakan satu state untuk seluruh form
  const [form, setForm] = useState({
    employee_absence_id: "",
    employee_name: "",
    role: "",
    date: todayIso,
    clock_in: '00:00:00',
    clock_out: '00:00:00',
    day_count: 0,
    absence_status: "",
    day_status: "",
    notes: "",
  })

  const resetForm = () => {
    setForm({
      employee_absence_id: "",
      employee_name: "",
      role: "",
      date: todayIso,
      clock_in: '00:00:00',
      clock_out: '00:00:00',
      day_count: 0,
      absence_status: "",
      day_status: "",
      notes: "",
    })
  }

  const isFormValid =
    form.employee_name.trim() !== "" &&
    form.role.trim() !== "" &&
    form.date.trim() !== "" &&
    form.clock_in.trim() !== "" &&
    form.clock_out.trim() !== "" &&
    form.day_count > 0 &&
    form.absence_status.trim() !== "" &&
    form.day_status.trim() !== "" &&
    form.notes.trim() !== ""


  const handleEditClick = (employee: any, idx: number) => {
    setEditIndex(idx)
    setForm({
      employee_absence_id: employee.employee_absence_id,
      employee_name: employee.employee_name,
      role: employee.role,
      date: employee.date,
      clock_in: employee.clock_in || "09:00:00",
      clock_out: employee.clock_out || "17:00:00",
      day_count: employee.day_count,
      absence_status: employee.absence_status,
      day_status: employee.day_status,
      notes: employee.notes,
    })
    setDialogEditOpen(true)
  }

  const handleUpdateEmployee = async () => {
    try {
      if (editIndex !== null && editIndex !== undefined) {
        const payload = {
          // employee_absence_id: employees[editIndex].employee_absence_id,
          employee_absence_id: employees[editIndex].employee_absence_id,
          // employee_id: employees[editIndex].employee_id,
          employee_name: form.employee_name,
          role: form.role,
          date: form.date,
          clock_in: form.clock_in,
          clock_out: form.clock_out,
          day_count: form.day_count,
          absence_status: form.absence_status,
          day_status: form.day_status,
          notes: form.notes,
        }

        const res = await employeeApi().updateAttendance(payload)
        await fetchEmployeeAbsence()
        setDialogEditOpen(false)
        setEditIndex(null)
        if (res.error) throw new Error(res.error)
      } else {
        console.error('editIndex is null or undefined');
      }
    } catch (err) {
      console.error("Update failed:", err)
    }
  }

  const handleChange = (field: string, value: any) => {
    setForm({
      ...form,
      [field]: value,
    })
  }

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)

  // 1) filter by search
  const filteredEmployees = employees.filter((employee) =>
    employee.employee_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 2) filter by selected date
  const byDate = filteredEmployees.filter(emp => emp.date === attendanceDate)

  // Hitung slice data
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const employeesData = byDate.slice(startIndex, endIndex)


  // 2. compute 1‑based values
  const totalEmployees = byDate.length
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
        <AttendanceDatePicker
          value={attendanceDate}
          onChange={(isoDate: string) => {
            setAttendanceDate(isoDate)
          }}
        />
        {/* Search Bar */}
        <div className="relative flex gap-6 justify-end text-right">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <Input
            placeholder="Search.."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            className="pl-12 pr-5 w-100 h-[40px] rounded-[80px]" />
        </div>
      </div>



      {/* Table */}
      <div className="mt-2 w-full overflow-x-auto rounded-lg border border-theme bg-theme">
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
                <TableCell className="px-4 py-2 w-[120px] h-14">
                  <span
                    className={`px-2 py-1 rounded-full font-medium inline-block w-full text-center text-[13px]
                      ${statusColor[emp.absence_status as AbsenceStatus]}`}
                  >
                    {emp.absence_status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center px-4 py-2">
                    <span>{emp.notes || '-'}</span>
                  </div>
                </TableCell>
                <TableCell className="px-0 py-2 text-center">
                  <Dialog open={dialogEditOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="text-[#0456F7] cursor-pointer bg-transparent hover:bg-transparent shadow-none rounded-full"
                        onClick={() => handleEditClick(emp, i)}>
                        <PencilLine size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl text-theme [&>button]:hidden p-12 rounded-[32px] space-y-0">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">Edit Attendance</DialogTitle>
                        <DialogDescription className="text-md">
                          Update {form.employee_name}'s attendance by changing the information below.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-2 space-y-2">
                        {/* Clock-In */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Clock-In
                          </label>
                          <div className="relative rounded-md border">
                              <input
                                ref={clockInRef}
                                type="time"
                                step={1}                                    // HH:MM:SS
                                value={form.clock_in}
                                onChange={e => handleChange("clock_in", e.target.value)}
                                className="w-full h-[48px] pl-3 pr-4 outline-none appearance-none border-none"          // hide native icon
                                required
                                tabIndex={-1}
                              />
                            <button
                              type="button"
                              onClick={() => clockInRef.current?.showPicker?.()}
                              className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                              {/* <ClockIcon size={20} /> */}
                            </button>
                          </div>
                        </div>

                        {/* Clock-Out */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Clock-Out
                          </label>
                          <div className="relative rounded-md border">
                            <input
                              ref={clockOutRef}
                              type="time"
                              step={1}
                              value={form.clock_out}
                              onChange={e => handleChange("clock_out", e.target.value)}
                              className="w-full h-[48px] pl-3 pr-4 outline-none appearance-none border-none"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => clockOutRef.current?.showPicker?.()}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                              {/* <ClockIcon size={20} /> */}
                            </button>
                          </div>
                          {/* <div
                            className="border rounded-md shadow-xs 
                          dark:focus-within:ring-4 dark:focus-within:ring-[oklch(0.551_0.027_264.364)]
                          dark:focus-within:border-[oklch(1_0_0_/_10%)]
                          focus-within:ring-3 focus-within:ring-gray-200 
                          focus-within:border-gray-300">
                            <Input
                              type="time"
                              step={1}
                              placeholder="Update clock-out time"
                              value={form.clock_out}
                              className="h-[48px] bg-transparent dark:bg-transparent border-none
                            border-0 appearance-none whitespace-normal flex justify-between"
                              onChange={(e) => handleChange("clock_out", e.target.value)}
                              required
                            />
                          </div> */}
                        </div>

                        {/* Attendance Status */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Attendance Status
                          </label>
                          <Select
                            value={form.absence_status}
                            onValueChange={(val) => handleChange('absence_status', val)}
                          >
                            <SelectTrigger className="w-full h-[48px] border rounded-md px-3 flex items-center justify-between">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value="Present">Present</SelectItem>
                              <SelectItem value="Absent">Absent</SelectItem>
                              <SelectItem value="On Leave">On Leave</SelectItem>
                              <SelectItem value="On Sick">On Sick</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Notes
                          </label>
                          <div
                            className="rounded-md border">
                            <Input
                              placeholder="Update the notes for this employee"
                              value={form.notes}
                              className="h-[48px] bg-transparent dark:bg-transparent border-none
                            border-0 appearance-none whitespace-normal"
                              onChange={(e) => handleChange("notes", e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter className="mt-1 grid grid-cols-2">
                        <Button variant="outline" className="rounded-[80px] text-md h-[48px]"
                          onClick={() => setDialogEditOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleUpdateEmployee}
                          disabled={!isFormValid}
                          className="bg-[#0456F7] text-white hover:bg-[#0348CF] rounded-[80px] text-md h-[48px]"
                        >
                          Update Employee
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </table>
      </div>

      {/* Pagination */}
      <footer className="mt-auto w-full text-sm text-gray-600 dark:text-white">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          {/* e.g. "Showing 16 of 48 Employees" */}
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