"use client"

import React, { SetStateAction, useEffect, useState } from "react"
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
import { format } from "date-fns/format"
import employeeApi from "@/api/employeeApi"
import { parseISO } from "date-fns"
import { DateRange } from "react-day-picker"



function formatRupiah(value: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value)
}

export default function EmployeePayrollPage() {
    const ITEMS_PER_PAGE = 10
    const [search, setSearch] = useState('')

    const [payrolls, setPayrolls] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const [dialogCreateOpen, setDialogCreateOpen] = useState(false)
    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)
    const [dialogEditOpen, setDialogEditOpen] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const todayIso = format(new Date(), 'yyyy-MM-dd')
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const filteredPayrolls = payrolls.filter((employee) =>
        employee.employee_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Hitung slice data
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const payrollsData = filteredPayrolls.slice(startIndex, endIndex)


    // 2. compute 1‑based values
    const totalPayrolls = filteredPayrolls.length
    const totalPages = Math.ceil(totalPayrolls / ITEMS_PER_PAGE)
    const startItem = totalPayrolls > 0 ? startIndex + 1 : 0;
    const endItem = Math.min(endIndex, totalPayrolls);

    // 3. build the display string
    //    if startItem===endItem, show just one number (e.g. “15 of 15”)
    const rangeText =
        startItem === endItem
            ? `${endItem}`
            : `${startItem}–${endItem}`;


    // const totalPayroll = payrollData.reduce((acc, item) => acc + item.totalSalary, 0);


    useEffect(() => {
        fetchPayrolls();
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchPayrolls(); // Fetch ulang kalau kembali ke halaman ini
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);


    const fetchPayrolls = async () => {
        setLoading(true);
        try {
            const response = await employeeApi().viewPayroll();
            if (response.status === 200) {
                setPayrolls(response.data);
                console.log(setPayrolls);
            } else {
                console.error("Failed to fetch payrolls");
            }
        } catch (error) {
            console.error("Error fetching payrolls:", error);
        } finally {
            setLoading(false);
        }
    }

    // Gunakan satu state untuk seluruh form
    const [form, setForm] = useState({
        employee_id: 0,
        employee_name: "",
        role: "",
        payment_date: todayIso,
        sales_omzet_amount: 0,
        salary_amount: 0,
    })

    const resetForm = () => {
        setForm({
            employee_id: 0,
            employee_name: "",
            role: "",
            payment_date: todayIso,
            sales_omzet_amount: 0,
            salary_amount: 0,
        })
    }

    const isFormValid =
        form.employee_id > 0 &&
        form.employee_name.trim() !== "" &&
        form.role.trim() !== "" &&
        form.payment_date.trim() !== "" &&
        form.sales_omzet_amount > 0 &&
        form.salary_amount > 0



    const handleEditClick = (payroll: any, idx: number) => {
        setEditIndex(idx)
        setForm({
            employee_id: payroll.employee_id,
            employee_name: payroll.employee_name,
            role: payroll.role,
            payment_date: payroll.payment_date,
            sales_omzet_amount: payroll.sales_omzet_amoun,
            salary_amount: payroll.salary_amount,
        })
        setDialogEditOpen(true)
    }

    // PUT updated payload back to your API
    const handleUpdatePayroll = async () => {
        try {
            if (editIndex !== null && editIndex !== undefined) {
                const payload = {
                    employee_absence_id: payrolls[editIndex].employee_absence_id,
                    employee_id: form.employee_id,
                    employee_name: form.employee_name,
                    role: form.role,
                    payment_date: form.payment_date,
                    sales_omzet_amount: form.sales_omzet_amount,
                    salary_amount: form.salary_amount,
                }

                const res = await employeeApi().updateEmployeePayroll(payload)
                await fetchPayrolls()
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

    const handleDeletePayroll = async () => {
        if (deleteIndex === null) return

        // Ambil produk yang akan di‐delete
        const payrollToDelete = payrolls[deleteIndex]

        try {
            // Kirim payload yang benar: employee_id dari employeeToDelete, bukan form.employee_id
            const res = await employeeApi().deleteEmployeePayroll({
                employee_id: payrollToDelete.employee_id,
            })

            if (res.error) {
                throw new Error(res.error)
            }

            // Success: tutup dialog, reset index, dan refresh list
            setDialogDeleteOpen(false)
            setDeleteIndex(null)
            await fetchPayrolls()
        } catch (err) {
            console.error("Failed to delete:", err)
        }
    }


    // Next / Prev page
    const handlePageChange = (direction: string) => {
        setCurrentPage((prev) =>
            direction === "next" ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
        )
    }


    const handleCreatePayroll = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            // Menggunakan spread operator untuk membuat objek yang sama dengan form
            const formData = { ...form }
            console.log("ini formdata", formData);
            const response = await employeeApi().createEmployeePayroll(formData);

            if (!response || response.error) {
                throw new Error("Failed to add payroll");
            }
            console.log("Payroll created successfully:", response);
            resetForm();
            setDialogCreateOpen(false)
            await fetchPayrolls();
        } catch (error) {
            console.error("Error submitting payroll:", error)
        }
    }

    const handleChange = (field: string, value: any) => {
        setForm({
            ...form,
            [field]: value,
        })
    }

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
                <PayrollDatePicker
                    value={dateRange} 
                    onValueChange={setDateRange}/>
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
                    <thead className="bg-gray-50 text-left text-gray-600 dark:bg-[#181818] dark:text-gray-400 shadow-sm">
                        <tr>
                            <th className="px-4 py-4 font-semibold">Payment Date</th>
                            <th className="px-0 py-4 font-semibold">Employee ID</th>
                            <th className="px-4 py-4 font-semibold">Employee Name</th>
                            <th className="px-4 py-4 font-semibold">Role</th>
                            <th className="px-4 py-4 font-semibold">Sales Amount</th>
                            <th className="px-2 py-4 font-semibold">Salary Amount</th>
                            {/* <th className="px-4 py-4 font-semibold">Status</th> */}
                            <th className="py-4 font-semibold"></th>
                        </tr>
                    </thead>
                    <TableBody>
                        {payrollsData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="px-4 py-4">
                                    {item.payment_date
                                        ? format(parseISO(item.payment_date), 'dd MMMM yyyy')
                                        : '-'}
                                </TableCell>
                                <TableCell className="px-0 py-4">{item.employee_id}</TableCell>
                                <TableCell className="px-4 py-4">{item.employee_name}</TableCell>
                                <TableCell className="px-4 py-4">{item.role}</TableCell>
                                <TableCell className="px-4 py-4">{formatRupiah(item.sales_omzet_amount)}</TableCell>
                                <TableCell className="px-2 py-4">{formatRupiah(item.salary_amount)}</TableCell>
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
            <footer className="mt-auto w-full text-sm text-gray-600 dark:text-white">
                <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                    {/* e.g. "Showing 16 of 48 Employees" */}
                    <p>Showing {rangeText} of {totalPayrolls} Payrolls</p>
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
    );
}
