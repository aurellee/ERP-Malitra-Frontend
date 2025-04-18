"use client"

import React, { SetStateAction, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Pencil, PencilLine, PlusIcon, Search, Trash2 } from 'lucide-react'
import { DateRangePicker } from "@/components/date-range-picker"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import { PayrollDatePicker } from "@/components/payroll-date"

const payrollData = [
    {
        date: '25/05/24',
        id: 'MCPHY2524',
        name: 'Hera Hermes',
        role: 'Sales',
        totalSales: 5000000,
        totalSalary: 2000000,
        status: 'Pending',
    },
    {
        date: '25/05/24',
        id: 'MCPRL2524',
        name: 'Ralph Lauren',
        role: 'Sales',
        totalSales: 6000000,
        totalSalary: 2300000,
        status: 'Pending',
    },
    {
        date: '25/05/24',
        id: 'MCPCD2203',
        name: 'Christian Dior',
        role: 'Mechanic',
        totalSales: 7000000,
        totalSalary: 3500000,
        status: 'Completed',
    },
    {
        date: '25/05/24',
        id: 'MCPHY2524',
        name: 'Hera Hermes',
        role: 'Sales',
        totalSales: 5000000,
        totalSalary: 2000000,
        status: 'Pending',
    },
    {
        date: '25/05/24',
        id: 'MCPRL2524',
        name: 'Ralph Lauren',
        role: 'Sales',
        totalSales: 6000000,
        totalSalary: 2300000,
        status: 'Pending',
    },
    {
        date: '25/05/24',
        id: 'MCPRL2524',
        name: 'Ralph Lauren',
        role: 'Sales',
        totalSales: 6000000,
        totalSalary: 2300000,
        status: 'Pending',
    },
    {
        date: '25/05/24',
        id: 'MCPCD2203',
        name: 'Christian Dior',
        role: 'Mechanic',
        totalSales: 7000000,
        totalSalary: 3500000,
        status: 'Completed',
    },
    {
        date: '25/05/24',
        id: 'MCPHY2524',
        name: 'Hera Hermes',
        role: 'Sales',
        totalSales: 5000000,
        totalSalary: 2000000,
        status: 'Pending',
    },
    {
        date: '25/05/24',
        id: 'MCPRL2524',
        name: 'Ralph Lauren',
        role: 'Sales',
        totalSales: 6000000,
        totalSalary: 2300000,
        status: 'Pending',
    },
    {
        date: '25/05/24',
        id: 'MCPCD2203',
        name: 'Christian Dior',
        role: 'Mechanic',
        totalSales: 7000000,
        totalSalary: 3500000,
        status: 'Completed',
    },
    {
        date: '25/05/24',
        id: 'MCPHY2524',
        name: 'Hera Hermes',
        role: 'Sales',
        totalSales: 5000000,
        totalSalary: 2000000,
        status: 'Pending',
    },
    {
        date: '25/05/24',
        id: 'MCPRL2524',
        name: 'Ralph Lauren',
        role: 'Sales',
        totalSales: 6000000,
        totalSalary: 2300000,
        status: 'Pending',
    },
    {
        date: '25/05/24',
        id: 'MCPCD2203',
        name: 'Christian Dior',
        role: 'Mechanic',
        totalSales: 7000000,
        totalSalary: 3500000,
        status: 'Completed',
    },
    {
        date: '25/05/24',
        id: 'MCPHY2524',
        name: 'Hera Hermes',
        role: 'Sales',
        totalSales: 5000000,
        totalSalary: 2000000,
        status: 'Pending',
    },
    {
        date: '25/05/24',
        id: 'MCPRL2524',
        name: 'Ralph Lauren',
        role: 'Sales',
        totalSales: 6000000,
        totalSalary: 2300000,
        status: 'Pending',
    },
    {
        date: '25/05/24',
        id: 'MCPCD2203',
        name: 'Christian Dior',
        role: 'Mechanic',
        totalSales: 7000000,
        totalSalary: 3500000,
        status: 'Completed',
    },
    {
        date: '25/05/24',
        id: 'MCPHY2524',
        name: 'Hera Hermes',
        role: 'Sales',
        totalSales: 5000000,
        totalSalary: 2000000,
        status: 'Pending',
    },
    {
        date: '25/05/24',
        id: 'MCPRL2524',
        name: 'Ralph Lauren',
        role: 'Sales',
        totalSales: 6000000,
        totalSalary: 2300000,
        status: 'Pending',
    },
    {
        date: '25/05/24',
        id: 'MCPCD2203',
        name: 'Christian Dior',
        role: 'Mechanic',
        totalSales: 7000000,
        totalSalary: 3500000,
        status: 'Completed',
    },
    // Tambahkan data lainnya untuk mock pagination
];

const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
};

const statusBadge = (status: string) => {
    switch (status) {
        case 'Pending':
            return <Badge variant="outline" className="bg-orange-100 text-orange-600">Pending</Badge>;
        case 'Completed':
            return <Badge variant="outline" className="bg-green-100 text-green-600">Completed</Badge>;
        default:
            return <Badge>{status}</Badge>;
    }
};

export default function EmployeePayrollPage() {
    const perPage = 14
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(0)

    const filtered = payrollData.filter((emp) =>
        emp.name.toLowerCase().includes(search.toLowerCase())
    )

    const currentData = filtered.slice(currentPage * perPage, (currentPage + 1) * perPage)
    const totalPages = Math.ceil(filtered.length / perPage)


    const totalPayroll = payrollData.reduce((acc, item) => acc + item.totalSalary, 0);
    const completedPayments = payrollData
        .filter((item) => item.status === 'Completed')
        .reduce((acc, item) => acc + item.totalSalary, 0);
    const pendingPayments = totalPayroll - completedPayments;

    return (
        <div className="min-h-screen p-8 bg-white dark:bg-[#000] text-theme space-y-4 flex flex-col">
            {/* Breadcrumb */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <h1 className="text-2xl font-bold">Payroll</h1>
                </div>
                <ModeToggle />
            </div>

            {/* Title & Date */}
            <div className="mt-2 flex items-center justify-between w-full">
                <PayrollDatePicker></PayrollDatePicker>
                {/* Search Bar */}
                <div className="relative flex items-center gap-4">
                    <div className="relative flex gap-6 justify-end text-right">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <Input
                            placeholder="Search.."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 pr-5 w-100 h-[40px] rounded-[80px]" />
                    </div>
                    <Button className="bg-[#0456F7] text-white hover:bg-blue-700 w-38 h-[40px] rounded-[80px] items-center font-semibold text-sm">
                        <span>
                            <PlusIcon style={{ color: "white", width: "18px", height: "18px" }} />
                        </span>
                        Add Payroll</Button>
                </div>
            </div>


            {/* Table */}
            <div className="w-full overflow-x-auto rounded-lg border border-theme bg-theme">
                <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-50 text-left text-gray-600 dark:bg-[#181818] dark:text-gray-400 shadow-sm">
                        <tr>
                            <th className="px-4 py-4 font-semibold">Payment Date</th>
                            <th className="px-4 py-4 font-semibold">Employee ID</th>
                            <th className="px-4 py-4 font-semibold">Employee Name</th>
                            <th className="px-4 py-4 font-semibold">Role</th>
                            <th className="px-4 py-4 font-semibold">Sales Amount</th>
                            <th className="px-2 py-4 font-semibold">Salary Amount</th>
                            {/* <th className="px-4 py-4 font-semibold">Status</th> */}
                            <th className="py-4 font-semibold"></th>
                        </tr>
                    </thead>
                    <TableBody>
                        {currentData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="px-4 py-4">{item.date}</TableCell>
                                <TableCell className="px-4 py-4">{item.id}</TableCell>
                                <TableCell className="px-4 py-4">{item.name}</TableCell>
                                <TableCell className="px-4 py-4">{item.role}</TableCell>
                                <TableCell className="px-4 py-4">{formatRupiah(item.totalSales)}</TableCell>
                                <TableCell className="px-2 py-4">{formatRupiah(item.totalSalary)}</TableCell>
                                {/* <TableCell className="px-4 py-4">{statusBadge(item.status)}</TableCell> */}
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
            <footer className="w-full mt-auto text-sm text-gray-600 dark:text-white">
                <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                    {/* e.g. "Showing 16 of 48 Products" */}
                    <p>
                        Showing {Math.min((currentPage + 1) * perPage, filtered.length)} of {filtered.length} Employees
                    </p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline"
                            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))} disabled={currentPage === 0}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span>
                            {currentPage + 1} / {totalPages}
                        </span>
                        <Button variant="outline"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage === totalPages - 1}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </footer>


        </div>
    );
}

// "use client"

// import React, { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
// import { useRouter } from "next/navigation"
// import { ChevronLeft, ChevronRight } from "lucide-react"

// const dummyEmployees = Array.from({ length: 100 }, (_, i) => ({
//   id: `MCPHY${2500 + i}`,
//   name: `Employee ${i + 1}`,
//   role: i % 2 === 0 ? "Sales" : "Mechanic",
//   hired: "19/01/24",
//   salary: 29000000,
//   bonus: 1000000,
//   absensi: "See Detail",
//   status: i % 3 === 0 ? "Unpaid" : "Paid",
//   notes: "Omzet penjualan 20% dibawah target",
//   performance: Math.floor(Math.random() * 60) + 1,
// }))

// const PAGE_SIZE = 5

// export default function EmployeePage() {
//   const router = useRouter()
//   const [currentPage, setCurrentPage] = useState(0)
//   const [searchTerm, setSearchTerm] = useState("")

//   const paginatedEmployees = dummyEmployees
//     .filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()))
//     .slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)

//   const handlePageChange = (direction: "next" | "prev") => {
//     const maxPage = Math.ceil(dummyEmployees.length / PAGE_SIZE) - 1
//     if (direction === "next" && currentPage < maxPage) setCurrentPage(p => p + 1)
//     if (direction === "prev" && currentPage > 0) setCurrentPage(p => p - 1)
//   }

//   return (
//     <div className="p-8 space-y-6 w-full">
//       <h1 className="text-2xl font-bold">Employee</h1>

//       {/* Chart & Info */}
//       <div className="space-y-4">
//         <div className="flex w-full justify-between items-center">
//           <h2 className="text-lg font-semibold">Employee Performance</h2>
//           <Button variant="outline">This Month</Button>
//         </div>

//         <ScrollArea className="w-full whitespace-nowrap rounded-md border p-4">
//           <div className="flex w-[2000px]">
//             <ResponsiveContainer width="100%" height={200}>
//               <BarChart width={2000} height={200} data={dummyEmployees.slice(0, 20)}>
//                 <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="performance" fill="#0456F7" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//           <ScrollBar orientation="horizontal" />
//         </ScrollArea>

//         {/* Cards */}
//         <div className="grid grid-cols-4 gap-4">
//           <div className="p-6 bg-[#0456F7] text-white rounded-xl shadow">
//             <p className="text-sm">Total Salaries</p>
//             <p className="text-2xl font-bold">Rp 420.000.000</p>
//           </div>
//           <div className="p-6 bg-white border rounded-xl shadow">
//             <p className="text-sm">Total Bonus</p>
//             <p className="text-2xl font-bold">Rp 30.000.000</p>
//           </div>
//           <Button className="text-base h-auto py-6 rounded-xl" onClick={() => router.push("/payroll")}>Payroll ➜</Button>
//           <Button className="text-base h-auto py-6 rounded-xl" onClick={() => router.push("/benefits")}>Benefits ➜</Button>
//           <Button className="text-base h-auto py-6 rounded-xl" onClick={() => router.push("/attendance")}>Attendance ➜</Button>
//         </div>
//       </div>

//       {/* Employee List */}
//       <div className="bg-white rounded-xl p-6 shadow space-y-4">
//         <div className="flex justify-between items-center">
//           <h2 className="text-lg font-semibold">Employee List ({dummyEmployees.length})</h2>
//           <div className="flex items-center gap-4">
//             <Input placeholder="Search.." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
//             <Button>+ Add Employee</Button>
//           </div>
//         </div>

//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Employee ID</TableHead>
//               <TableHead>Employee Name</TableHead>
//               <TableHead>Role</TableHead>
//               <TableHead>Hired</TableHead>
//               <TableHead>Absensi</TableHead>
//               <TableHead>Total Salary</TableHead>
//               <TableHead>Bonus</TableHead>
//               <TableHead>Notes</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paginatedEmployees.map((emp, i) => (
//               <TableRow key={i}>
//                 <TableCell>{emp.id}</TableCell>
//                 <TableCell>{emp.name}</TableCell>
//                 <TableCell>{emp.role}</TableCell>
//                 <TableCell>{emp.hired}</TableCell>
//                 <TableCell><Button variant="outline" size="sm">See Detail</Button></TableCell>
//                 <TableCell className={emp.status === "Unpaid" ? "text-red-500" : ""}>Rp {emp.salary.toLocaleString()}</TableCell>
//                 <TableCell>
//                   <span className={`text-white px-2 py-1 text-xs rounded-md ${emp.status === "Unpaid" ? "bg-red-500" : "bg-green-500"}`}>
//                     {emp.status}
//                   </span>
//                 </TableCell>
//                 <TableCell>{emp.notes}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>

//         {/* Pagination */}
//         <div className="flex justify-between items-center mt-4">
//           <p className="text-sm text-gray-600">Showing {currentPage * PAGE_SIZE + 1} - {(currentPage + 1) * PAGE_SIZE} of {dummyEmployees.length} Employees</p>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="sm" onClick={() => handlePageChange("prev")} disabled={currentPage === 0}>
//               <ChevronLeft className="w-4 h-4" />
//             </Button>
//             <Button variant="outline" size="sm" onClick={() => handlePageChange("next")} disabled={(currentPage + 1) * PAGE_SIZE >= dummyEmployees.length}>
//               <ChevronRight className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }







