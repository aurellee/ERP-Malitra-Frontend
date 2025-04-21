"use client"

import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PencilLine, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { use, useEffect, useState, useRef } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DateRangePicker } from "@/components/date-range-picker";
import type { DateRange } from "react-day-picker";
import { AttendanceStatus, AttendanceDetailType } from "@/types/types";
import employeeApi from "@/api/employeeApi";
import { format, parseISO } from "date-fns"
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

function parseTime(timeStr: string): Date | null {
    if (timeStr === "-" || !timeStr) return null

    const match = timeStr.match(/^(\d{1,2}):(\d{2})(AM|PM)$/i)
    if (!match) return null

    const [, hh, mm, ampm] = match
    let hour = parseInt(hh, 10)
    const minute = parseInt(mm, 10)

    if (ampm.toUpperCase() === "PM" && hour < 12) {
        hour += 12
    }
    if (ampm.toUpperCase() === "AM" && hour === 12) {
        hour = 0
    }

    const date = new Date()
    date.setHours(hour, minute, 0, 0)
    return date
}

const statusColor: { [key: string]: string } = {
    "Present": "bg-blue-100 text-blue-600",
    "Absent": "bg-red-100 text-red-600",
    "On Leave": "bg-yellow-100 text-yellow-600",
    "On Sick": "bg-green-100 text-green-600",
}

export default function AttendanceSummaryPage({ params }: { params: Promise<{ employee_id: string }> }) {
    const { employee_id } = use(params);
    const [employeeName, setEmployeeName] = useState("")

    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    const [attendanceList, setAttendanceList] = useState<AttendanceDetailType[]>([]);
    const [filteredAttendanceList, setFilteredAttendanceList] = useState<AttendanceDetailType[]>([]);

    const [attendanceDetailSummary, setAttendanceDetailSummary] = useState({
        present_full_day: 0,
        present_half_day: 0,
        absent: 0,
        on_leave: 0,
        on_sick: 0
    })

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })

    const perPage = 13
    const currentData = filteredAttendanceList.slice(currentPage * perPage, (currentPage + 1) * perPage)
    const totalPages = Math.ceil(filteredAttendanceList.length / perPage)

    useEffect(() => {
        handleGetAttendanceList();
        handleGetEmployeeName();
    }, [])

    useEffect(() => {
        if (dateRange?.from && dateRange?.to) {
            filterAttendanceDetailListByDate();
        }
        handleViewAttendanceDetailSummary();
    }, [dateRange, attendanceList]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            filterAttendanceDetailListByDate();
        } else {
            const filtered = filteredAttendanceList.filter((al) =>
                al.absence_status.toString().toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredAttendanceList(filtered);
        }
        setCurrentPage(0);
    }, [searchQuery]);

    const handleGetAttendanceList = async () => {
        try {
            const id = parseInt(employee_id);
            const res = await employeeApi().getAttendanceDetailList({
                employee_id: id
            });
            if (res.status == 200) {
                const allList = res.data;
                setAttendanceList(allList);

                const fromDate = dateRange?.from ?? new Date();
                const toDate = dateRange?.to ?? new Date();
                fromDate.setHours(0, 0, 0, 0);
                toDate.setHours(23, 59, 59, 999);

                const filtered = allList.filter((list: AttendanceDetailType) => {
                    const listDate = new Date(list.date);
                    return listDate >= fromDate && listDate <= toDate;
                });
                setFilteredAttendanceList(filtered);
            } else {
                console.log("Error fetching data:", res.error)
            }
        } catch (error) {
            console.log("Error fetching data:", error)
        }
    }

    const handleGetEmployeeName = async () => {
        try {
            const id = parseInt(employee_id);
            const res = await employeeApi().getEmployeeName({
                employee_id: id
            });
            if (res.status == 200) {
                setEmployeeName(res.data.employee_name)
            } else {
                console.log("Error fetching data:", res.error)
            }
        } catch (error) {
            console.log("Error fetching data:", error)
        }
    }

    const filterAttendanceDetailListByDate = () => {
        const fromDate = dateRange?.from ?? new Date();
        const toDate = dateRange?.to ?? new Date();

        // Normalize dates to start and end of the day
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);

        const filtered = attendanceList.filter(al => {
            const alDate = new Date(al.date);
            return alDate >= fromDate && alDate <= toDate;
        });
        setFilteredAttendanceList(filtered);
    }

    const handleViewAttendanceDetailSummary = async () => {
        try {
            const startDate = format(dateRange?.from ?? new Date(), "yyyy-MM-dd");
            const endDate = format(dateRange?.to ?? new Date(), "yyyy-MM-dd");
            const id = parseInt(employee_id);
            const formDate = {
                employee_id: id,
                start_date: startDate,
                end_date: endDate
            }

            const res = await employeeApi().getSummaryDetailAttendance(formDate);
            if (res.status == 200) {
                setAttendanceDetailSummary(res.summary);
            } else {
                console.log("Error fetching data:", res.error)
            }
        } catch (error) {
            console.log("Error fetching data:", error)
        }
    }

    const [isOpen, setIsOpen] = useState(false)
    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)
    const [dialogEditOpen, setDialogEditOpen] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const todayIso = format(new Date(), 'yyyy-MM-dd')
    const [attendanceDate, setAttendanceDate] = useState(todayIso)
  
    const clockInRef = useRef<HTMLInputElement>(null)
    const clockOutRef = useRef<HTMLInputElement>(null)

    const [form, setForm] = useState({
        employee_absence_id: "",
        date: todayIso,
        clock_in: '00:00:00',
        clock_out: '00:00:00',
        absence_status: "",
        notes: "",
    })

    const handleEditClick = (al: any, idx: number) => {
        setEditIndex(idx)
        setForm({
          employee_absence_id: al.employee_absence_id,
          date: al.date,
          clock_in: al.clock_in || "09:00:00",
          clock_out: al.clock_out || "17:00:00",
          absence_status: al.absence_status,
          notes: al.notes,
        })
        setDialogEditOpen(true)
    }

    const isFormValid =
        form.clock_in.trim() !== "" &&
        form.clock_out.trim() !== "" &&
        form.absence_status.trim() !== "" &&
        form.notes.trim() !== ""

    const handleChange = (field: string, value: any) => {
        setForm({
          ...form,
          [field]: value,
        })
    }

    const handleUpdateAttendance = async () => {
        try {
          if (editIndex !== null && editIndex !== undefined) {
            const payload = {
              employee_absence_id: form.employee_absence_id,
              date: form.date,
              clock_in: form.clock_in,
              clock_out: form.clock_out,
              absence_status: form.absence_status,
              notes: form.notes,
            }
    
            const res = await employeeApi().updateAttendance(payload)
            await handleGetAttendanceList()
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

    return (
        <div className="min-h-screen p-8 bg-white dark:bg-[#000] text-theme space-y-4 flex flex-col">
            {/* Top bar */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <h1 className="text-2xl font-bold">Attendance Summary</h1>
                </div>
                <ModeToggle />
            </div>

            {/* Title & search */}
            <div className="mt-2 flex gap-2 items-center justify-between w-full">
                <h1 className="text-xl font-semibold">{employeeName}'s Attendance</h1>
                <div className="flex items-center gap-2">
                    {/* Search Bar */}
                    <div className="relative flex gap-6 justify-end text-right">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <Input
                            placeholder="Search.."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-5 w-80 h-[40px] rounded-[80px]"
                        />
                    </div>
                    <DateRangePicker value={dateRange} onValueChange={setDateRange} />
                </div>
            </div>

            {/* The summary row */}
            <div className="mt-0 w-full rounded-lg bg-gray-100 dark:bg-[#181818] px-0 h-22 flex items-center justify-around">
                {/* Present (Full Day) */}
                <div className="text-left items-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Present (Full Day)</div>
                    <div className="text-2xl font-semibold mt-0.5">
                        {attendanceDetailSummary.present_full_day} <span className="text-sm font-medium">{attendanceDetailSummary.present_full_day === 1 ? "day" : "days"}</span>
                    </div>
                </div>
                <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />
                {/* Present (Half Day) */}
                <div className="text-left items-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Present (Half Day)</div>
                    <div className="text-2xl font-semibold mt-0.5">
                        {attendanceDetailSummary.present_half_day} <span className="text-sm font-medium">{attendanceDetailSummary.present_half_day === 1 ? "day" : "days"}</span>
                    </div>
                </div>
                <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />
                {/* Absent */}
                <div className="text-left items-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Absent</div>
                    <div className="text-2xl font-semibold mt-0.5">
                        {attendanceDetailSummary.absent} <span className="text-sm font-medium">{attendanceDetailSummary.absent === 1 ? "day" : "days"}</span>
                    </div>
                </div>
                <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />
                {/* On Leave */}
                <div className="text-left items-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">On Leave</div>
                    <div className="text-2xl font-semibold mt-0.5">
                        {attendanceDetailSummary.on_leave} <span className="text-sm font-medium">{attendanceDetailSummary.on_leave === 1 ? "day" : "days"}</span>
                    </div>
                </div>
                <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />
                {/* On Sick */}
                <div className="text-left items-center mr-8">
                    <div className="text-sm text-gray-600 dark:text-gray-400">On Sick</div>
                    <div className="text-2xl font-semibold mt-0.5">
                        {attendanceDetailSummary.on_sick} <span className="text-sm font-medium">{attendanceDetailSummary.on_sick === 1 ? "day" : "days"}</span>
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="mt-0 w-full overflow-x-auto rounded-lg border border-theme bg-theme">
                <table className="w-full border-collapse text-sm">
                    <thead className="border-b text-left text-gray-600 bg-gray-50 dark:bg-[#181818] dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-4 font-semibold">Date</th>
                            <th className="px-4 py-4 font-semibold">Clock-In</th>
                            <th className="px-4 py-4 font-semibold">Clock-Out</th>
                            <th className="px-4 py-4 font-semibold">Day</th>
                            <th className="px-4 py-4 font-semibold">Status</th>
                            <th className="px-4 py-4 font-semibold">Notes</th>
                            <th className="px-0 py-4 font-semibold"></th>
                        </tr>
                    </thead>
                    <TableBody>
                        {currentData.map((al, i) => (
                            <TableRow key={i}>
                                <TableCell className="px-4 py-4">{al.date}</TableCell>
                                <TableCell className="px-4 py-2">{al.clock_in}</TableCell>
                                <TableCell className="px-4 py-2">{al.clock_out}</TableCell>
                                <TableCell className="px-4 py-2">{al.day_status}</TableCell>
                                <TableCell className="px-4 py-2">
                                    <span
                                        className={`px-2 py-1 text-sm rounded-full font-medium ${statusColor[al.absence_status as keyof typeof statusColor] || ""
                                            }`}
                                    >
                                        {al.absence_status}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-2">
                                    {al.notes || "-"}
                                </TableCell>
                                <TableCell className="px-0 py-2">
                                <Dialog open={dialogEditOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="text-[#0456F7] cursor-pointer bg-transparent hover:bg-transparent shadow-none rounded-full"
                        onClick={() => handleEditClick(al, i)}>
                        <PencilLine size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl text-theme [&>button]:hidden p-12 rounded-[32px] space-y-0">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">Edit Attendance</DialogTitle>
                        <DialogDescription className="text-md">
                          Update {employeeName}'s attendance by changing the information below.
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
                          onClick={handleUpdateAttendance}
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

            {/* PAGINATION */}
            <footer className="mt-auto w-full text-sm text-gray-600 dark:text-white">
                <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                    <p>
                        Showing {Math.min((currentPage + 1) * perPage, filteredAttendanceList.length)} of{" "}
                        {filteredAttendanceList.length} Employee Benefits
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                            disabled={currentPage === 0 || totalPages === 0}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span>
                            {totalPages === 0 ? "0 / 0" : `${currentPage + 1} / ${totalPages}`}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                            }
                            disabled={currentPage >= totalPages - 1 || totalPages === 0}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    )
}