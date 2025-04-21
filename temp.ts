// "use client"

// import { TableBody, TableCell, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { PencilLine, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
// import { useState } from "react";
// import { ModeToggle } from "@/components/mode-toggle";
// import { Separator } from "@/components/ui/separator";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { DateRangePicker } from "@/components/date-range-picker";
// import type { DateRange } from "react-day-picker";
// import { use } from "react";
// import { AttendanceStatus } from "@/types/types";

// interface Props {
//     params: {
//       employee_id: string;
//     };
// }

// /** Our table row shape */
// interface AttendanceData {
//     date: string
//     clockIn: string
//     clockOut: string
//     day: string
//     status: AttendanceStatus
//     notes?: string
// }

// function parseTime(timeStr: string): Date | null {
//     if (timeStr === "-" || !timeStr) return null

//     const match = timeStr.match(/^(\d{1,2}):(\d{2})(AM|PM)$/i)
//     if (!match) return null

//     const [, hh, mm, ampm] = match
//     let hour = parseInt(hh, 10)
//     const minute = parseInt(mm, 10)

//     if (ampm.toUpperCase() === "PM" && hour < 12) {
//         hour += 12
//     }
//     if (ampm.toUpperCase() === "AM" && hour === 12) {
//         hour = 0
//     }

//     const date = new Date()
//     date.setHours(hour, minute, 0, 0)
//     return date
// }

// function computeDayAndStatus(
//     clockIn: string,
//     clockOut: string,
//     oldStatus: AttendanceStatus
// ): { day: string; status: AttendanceStatus } {
//     // If clockIn or clockOut is "-", then
//     // we take the oldStatus (i.e. "Absent", "On Leave", or "On Sick"),
//     // and set day to "-"
//     if (clockIn === "-" || clockOut === "-") {
//         return { day: "-", status: oldStatus }
//     }

//     // If both are valid, parse them
//     const inTime = parseTime(clockIn)
//     const outTime = parseTime(clockOut)
//     if (!inTime || !outTime) {
//         // fallback => day = '-' & status = Absent
//         return { day: "-", status: "Absent" }
//     }

//     // Compute difference in hours
//     const diffMs = outTime.getTime() - inTime.getTime()
//     const diffHours = diffMs / (1000 * 60 * 60)

//     // If diff >= 5 => Full day present, else => half day present
//     if (diffHours >= 5) {
//         return { day: "Full Day", status: "Present" }
//     } else {
//         return { day: "Half Day", status: "Present" }
//     }
// }
// /** Example data with some placeholders. */
// const allEmployees: AttendanceData[] = [
//     // clockIn/clockOut both valid => logic will set full/half day
//     { date: "26/09/2024", clockIn: "08:00AM", clockOut: "05:00PM", day: "", status: "Present" },
//     { date: "25/09/2024", clockIn: "08:00AM", clockOut: "05:00PM", day: "", status: "Present" },
//     // Already absent => clockIn/clockOut => '-'
//     { date: "24/09/2024", clockIn: "-", clockOut: "-", day: "-", status: "Absent" },
//     // On Sick => also no clockIn/out
//     { date: "23/09/2024", clockIn: "-", clockOut: "-", day: "-", status: "On Sick" },
//     { date: "26/09/2024", clockIn: "08:00AM", clockOut: "05:00PM", day: "", status: "Present" },
//     { date: "25/09/2024", clockIn: "08:00AM", clockOut: "05:00PM", day: "", status: "Present" },
//     // On Leave => also no clockIn/out
//     { date: "22/09/2024", clockIn: "-", clockOut: "-", day: "-", status: "On Leave" },
//     // Another example
//     { date: "21/09/2024", clockIn: "08:00AM", clockOut: "02:00PM", day: "", status: "Present" },
//     { date: "20/09/2024", clockIn: "-", clockOut: "-", day: "-", status: "Absent" },
//     { date: "19/09/2024", clockIn: "09:00AM", clockOut: "04:00PM", day: "", status: "Present" },
//     { date: "21/09/2024", clockIn: "08:00AM", clockOut: "02:00PM", day: "", status: "Present" },
//     { date: "20/09/2024", clockIn: "-", clockOut: "-", day: "-", status: "Absent" },
//     { date: "19/09/2024", clockIn: "09:00AM", clockOut: "04:00PM", day: "", status: "Present" },
// ]

// const statusColor = {
//     Present: "bg-blue-100 text-blue-600",
//     Absent: "bg-red-100 text-red-600",
//     "On Leave": "bg-yellow-100 text-yellow-600",
//     "On Sick": "bg-green-100 text-green-600",
// }

// export default function AttendanceSummaryPage({ params }: { params: Promise<{ employee_id: string }> }) {
//     const { employee_id } = use(params);

//     const name = "Hera"
//     const presentFull: number = 31
//     const presentHalf: number = 0
//     const absent: number = 0
//     const onLeave: number = 0
//     const onSick: number = 0

//     const [dateRange, setDateRange] = useState<DateRange | undefined>({
//         from: new Date(),
//         to: new Date(),
//       })

//     // Compute the final day/status for each row
//     // so the UI is consistent with your logic
//     const finalData = allEmployees.map((emp) => {
//         const { day, status } = computeDayAndStatus(emp.clockIn, emp.clockOut, emp.status)
//         return { ...emp, day, status }
//     })

//     const itemsPerPage = 12
//     const [search, setSearch] = useState("")
//     const [page, setPage] = useState(0)

//     const filtered = finalData.filter((emp) =>
//         emp.date.toLowerCase().includes(search.toLowerCase())
//     )

//     const paginated = filtered.slice(page * itemsPerPage, (page + 1) * itemsPerPage)
//     const totalPages = Math.ceil(filtered.length / itemsPerPage)

//     return (
//         <div className="min-h-screen p-8 bg-white dark:bg-[#000] text-theme space-y-4 flex flex-col">
//             {/* Top bar */}
//             <div className="mb-4 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                     <SidebarTrigger className="-ml-1" />
//                     <Separator orientation="vertical" className="mr-2 h-4" />
//                     <h1 className="text-2xl font-bold">Attendance Summary</h1>
//                 </div>
//                 <ModeToggle />
//             </div>

//             {/* Title & search */}
//             <div className="mt-2 flex gap-2 items-center justify-between w-full">
//                 <h1 className="text-xl font-semibold">{name}&apos;s Attendance</h1>
//                 <div className="flex items-center gap-2">
//                     {/* Search Bar */}
//                     <div className="relative flex gap-6 justify-end text-right">
//                         <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
//                         <Input
//                             placeholder="Search.."
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             className="pl-12 pr-5 w-80 h-[40px] rounded-[80px]"
//                         />
//                     </div>
//                     <DateRangePicker value={dateRange} onValueChange={setDateRange} />
//                 </div>
//             </div>

//             {/* The summary row */}
//             <div className="mt-0 w-full rounded-lg bg-gray-100 dark:bg-[#181818] px-0 h-22 flex items-center justify-around">
//                 {/* Present (Full Day) */}
//                 <div className="text-left items-center">
//                     <div className="text-sm text-gray-600 dark:text-gray-400">Present (Full Day)</div>
//                     <div className="text-2xl font-semibold mt-0.5">
//                         {presentFull} <span className="text-sm font-medium">{presentFull === 1 ? "day" : "days"}</span>
//                     </div>
//                 </div>
//                 <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />
//                 {/* Present (Half Day) */}
//                 <div className="text-left items-center">
//                     <div className="text-sm text-gray-600 dark:text-gray-400">Present (Half Day)</div>
//                     <div className="text-2xl font-semibold mt-0.5">
//                         {presentHalf} <span className="text-sm font-medium">{presentHalf === 1 ? "day" : "days"}</span>
//                     </div>
//                 </div>
//                 <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />
//                 {/* Absent */}
//                 <div className="text-left items-center">
//                     <div className="text-sm text-gray-600 dark:text-gray-400">Absent</div>
//                     <div className="text-2xl font-semibold mt-0.5">
//                         {absent} <span className="text-sm font-medium">{absent === 1 ? "day" : "days"}</span>
//                     </div>
//                 </div>
//                 <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />
//                 {/* On Leave */}
//                 <div className="text-left items-center">
//                     <div className="text-sm text-gray-600 dark:text-gray-400">On Leave</div>
//                     <div className="text-2xl font-semibold mt-0.5">
//                         {onLeave} <span className="text-sm font-medium">{onLeave === 1 ? "day" : "days"}</span>
//                     </div>
//                 </div>
//                 <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />
//                 {/* On Sick */}
//                 <div className="text-left items-center mr-8">
//                     <div className="text-sm text-gray-600 dark:text-gray-400">On Sick</div>
//                     <div className="text-2xl font-semibold mt-0.5">
//                         {onSick} <span className="text-sm font-medium">{onSick === 1 ? "day" : "days"}</span>
//                     </div>
//                 </div>
//             </div>

//             {/* TABLE */}
//             <div className="mt-0 w-full overflow-x-auto rounded-lg border border-theme bg-theme">
//                 <table className="w-full border-collapse text-sm">
//                     <thead className="border-b text-left text-gray-600 bg-gray-50 dark:bg-[#181818] dark:text-gray-400">
//                         <tr>
//                             <th className="px-4 py-4 font-semibold">Date</th>
//                             <th className="px-4 py-4 font-semibold">Clock-In</th>
//                             <th className="px-4 py-4 font-semibold">Clock-Out</th>
//                             <th className="px-4 py-4 font-semibold">Day</th>
//                             <th className="px-4 py-4 font-semibold">Status</th>
//                             <th className="px-4 py-4 font-semibold">Notes</th>
//                             <th className="px-0 py-4 font-semibold"></th>
//                         </tr>
//                     </thead>
//                     <TableBody>
//                         {paginated.map((emp, i) => (
//                             <TableRow key={i}>
//                                 <TableCell className="px-4 py-4">{emp.date}</TableCell>
//                                 <TableCell className="px-4 py-2">{emp.clockIn}</TableCell>
//                                 <TableCell className="px-4 py-2">{emp.clockOut}</TableCell>
//                                 <TableCell className="px-4 py-2">{emp.day}</TableCell>
//                                 <TableCell className="px-4 py-2">
//                                     <span
//                                         className={`px-2 py-1 text-sm rounded-full font-medium ${statusColor[emp.status] || ""
//                                             }`}
//                                     >
//                                         {emp.status}
//                                     </span>
//                                 </TableCell>
//                                 <TableCell className="px-4 py-2">
//                                     {emp.notes || "-"}
//                                 </TableCell>
//                                 <TableCell className="px-0 py-2">
//                                     <button className="mr-2 text-[#0456F7] cursor-pointer">
//                                         <PencilLine size={16} />
//                                     </button>
//                                     <button className="text-[#DD0005] cursor-pointer">
//                                         <Trash2 size={16} />
//                                     </button>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </table>
//             </div>

//             {/* PAGINATION */}
//             <footer className="w-full mt-auto text-sm text-gray-600 dark:text-white">
//                 <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
//                     <p>
//                         Showing {Math.min((page + 1) * itemsPerPage, filtered.length)} of{" "}
//                         {filtered.length} Records
//                     </p>
//                     <div className="flex items-center gap-2">
//                         <Button
//                             variant="outline"
//                             onClick={() => setPage((p) => Math.max(0, p - 1))}
//                             disabled={page === 0}
//                         >
//                             <ChevronLeft className="h-4 w-4" />
//                         </Button>
//                         <span>
//                             {page + 1} / {totalPages}
//                         </span>
//                         <Button
//                             variant="outline"
//                             onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
//                             disabled={page === totalPages - 1}
//                         >
//                             <ChevronRight className="h-4 w-4" />
//                         </Button>
//                     </div>
//                 </div>
//             </footer>
//         </div>
//     )
// }