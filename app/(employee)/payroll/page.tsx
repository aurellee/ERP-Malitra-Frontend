"use client"
import React, { SetStateAction, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { ChevronLeft, ChevronRight, PencilLine, Search, Trash2 } from 'lucide-react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import { format } from "date-fns/format"
import employeeApi from "@/api/employeeApi"
import { parseISO } from "date-fns"
import { DateRange } from "react-day-picker"
import { PayrollDatePicker } from "@/components/payroll-date"
import { PayrollType } from "@/types/types"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
  } from "@/components/ui/dialog"


const ITEMS_PER_PAGE = 10

function formatRupiah(value: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value)
}

const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export default function EmployeePayrollPage() {
    const perPage = 13
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    const todayIso = format(new Date(), 'yyyy-MM-dd')
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })

    const [payrolls, setPayrolls] = useState<PayrollType[]>([])
    const [filteredPayrolls, setFilteredPayrolls] = useState<PayrollType[]>([])

    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)
    const [dialogEditOpen, setDialogEditOpen] = useState(false)

    // Hitung slice data
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const payrollsData = filteredPayrolls.slice(currentPage * perPage, (currentPage + 1) * perPage)

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


    useEffect(() => {
        fetchPayrolls();
    }, []);

    useEffect(() => {
        if (dateRange?.from && dateRange?.to) {
            filterPayrollsByDate();
        }
    }, [dateRange, payrolls]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            filterPayrollsByDate();
        } else {
            const filtered = payrolls.filter((payroll) =>
                payroll.employee_name.toString().toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPayrolls(filtered);
        }
        setCurrentPage(0);
    }, [searchQuery]);

    const fetchPayrolls = async () => {
        try {
            const res = await employeeApi().viewPayroll();
            if (res.status == 200) {
                const allPayrolls = res.data;
                setPayrolls(allPayrolls);
                const fromDate = dateRange?.from ?? new Date();
                const toDate = dateRange?.to ?? new Date();
                fromDate.setHours(0, 0, 0, 0);
                toDate.setHours(23, 59, 59, 999);

                const filtered = allPayrolls.filter((payroll: PayrollType) => {
                    const benefitDate = new Date(payroll.payment_date);
                    return benefitDate >= fromDate && benefitDate <= toDate;
                });
                setFilteredPayrolls(filtered);
            } else {
                console.log("Error fetching data:", res.error)
            }
        } catch (error) {
            console.log("Error fetching data:", error)
        }
    }

    const filterPayrollsByDate = () => {
        const fromDate = dateRange?.from ?? new Date();
        const toDate = dateRange?.to ?? new Date();

        // Normalize dates to start and end of the day
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);

        const filtered = payrolls.filter(payroll => {
            const payrollDate = new Date(payroll.payment_date);
            return payrollDate >= fromDate && payrollDate <= toDate;
        });

        setFilteredPayrolls(filtered);
    }

    // Gunakan satu state untuk seluruh form
    const [form, setForm] = useState({
        employee_payroll_id: 0,
        payment_date: todayIso,
        sales_omzet_amount: 0,
        salary_amount: 0,
    })

    const resetForm = () => {
        setForm({
            employee_payroll_id: 0,
            payment_date: todayIso,
            sales_omzet_amount: 0,
            salary_amount: 0,
        })
    }

    const isFormValid =
        form.employee_payroll_id > 0 &&
        form.payment_date.trim() !== "" &&
        form.sales_omzet_amount > 0 &&
        form.salary_amount > 0

    const handleChange = (field: string, value: any) => {
        setForm({
            ...form,
            [field]: value,
        })
    }

    const handleEditClick = (payroll: any, idx: number) => {
        setEditIndex(idx)
        setForm({
            employee_payroll_id: payroll.employee_payroll_id,
            payment_date: payroll.payment_date,
            sales_omzet_amount: payroll.sales_omzet_amount,
            salary_amount: payroll.salary_amount,
        })
        setDialogEditOpen(true)
    }

    // PUT updated payload back to your API
    const handleUpdatePayroll = async () => {
        try {
            if (editIndex !== null && editIndex !== undefined) {
                const payload = {
                    ...form
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
        
        const payrollToDelete = payrolls[deleteIndex]
        try {
            const res = await employeeApi().deleteEmployeePayroll({
                employee_payroll_id: payrollToDelete.employee_payroll_id,
            })

            if (res.error) {
                throw new Error(res.error)
            }

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
                <PayrollDatePicker value={dateRange} onValueChange={setDateRange} />
                {/* Search Bar */}
                <div className="relative flex gap-6 justify-end text-right">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <Input
                        placeholder="Search.."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                                {/* BUTTONS */}
                                <TableCell className="px-0 py-2 text-center">
                                    <Dialog open={dialogEditOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                className="text-[#0456F7] cursor-pointer bg-transparent hover:bg-transparent shadow-none rounded-full"
                                                onClick={() => handleEditClick(item, index)}>
                                                <PencilLine size={16} />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-2xl text-theme [&>button]:hidden p-12 rounded-[32px] space-y-0">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl">Edit Employee Payroll</DialogTitle>
                                                <DialogDescription className="text-md">
                                                    Update the employee payroll data by changing the information below.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="grid gap-4 py-2 space-y-1">
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">
                                                        Payment Date
                                                    </label>
                                                    <div
                                                        className="border rounded-md shadow-xs 
                                                            dark:focus-within:ring-4 dark:focus-within:ring-[oklch(0.551_0.027_264.364)]
                                                            dark:focus-within:border-[oklch(1_0_0_/_10%)]
                                                            focus-within:ring-3 focus-within:ring-gray-200 
                                                            focus-within:border-gray-300">
                                                        <Input
                                                            placeholder="Update the benefit's date"
                                                            value={formatDate(form.payment_date)}
                                                            className="h-[48px] bg-transparent dark:bg-transparent border-none
                                                                border-0 appearance-none whitespace-normal"
                                                            onChange={(e) => handleChange("payment_date", e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium mb-2">
                                                        Sales Amount
                                                    </label>
                                                    <div
                                                        className="border rounded-md shadow-xs 
                                                        dark:focus-within:ring-4 dark:focus-within:ring-[oklch(0.551_0.027_264.364)]
                                                        dark:focus-within:border-[oklch(1_0_0_/_10%)]
                                                        focus-within:ring-3 focus-within:ring-gray-200 
                                                        focus-within:border-gray-300">
                                                        <Input
                                                            placeholder="Update the benefit's amount"
                                                            value={form.sales_omzet_amount}
                                                            className="h-[48px] bg-transparent dark:bg-transparent border-none
                                                                border-0 appearance-none whitespace-normal"
                                                            onChange={(e) => handleChange("sales_omzet_amount", e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium mb-2">
                                                        Salary Amount
                                                    </label>
                                                    <div
                                                        className="border rounded-md shadow-xs 
                                                        dark:focus-within:ring-4 dark:focus-within:ring-[oklch(0.551_0.027_264.364)]
                                                        dark:focus-within:border-[oklch(1_0_0_/_10%)]
                                                        focus-within:ring-3 focus-within:ring-gray-200 
                                                        focus-within:border-gray-300">
                                                        <Input
                                                            placeholder="Update the benefit's amount"
                                                            value={form.salary_amount}
                                                            className="h-[48px] bg-transparent dark:bg-transparent border-none
                                                                border-0 appearance-none whitespace-normal"
                                                            onChange={(e) => handleChange("salary_amount", e.target.value)}
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
                                                    onClick={(handleUpdatePayroll)}
                                                    disabled={!isFormValid}
                                                    className="bg-[#0456F7] text-white hover:bg-[#0348CF] rounded-[80px] text-md h-[48px]"
                                                >
                                                    Update Benefit
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>


                                    <Dialog open={dialogDeleteOpen}
                                        onOpenChange={(open) => {
                                            setDialogDeleteOpen(open)
                                            if (!open) setDeleteIndex(null)
                                        }}>
                                        <DialogTrigger asChild>
                                            <Button className="text-[#DF0025] cursor-pointer bg-transparent hover:bg-transparent shadow-none rounded-full"
                                                onClick={() => setDeleteIndex(index)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-sm p-12 md:p-12 rounded-[32px] [&>button]:hidden text-center justify-center w-auto"
                                            onEscapeKeyDown={(e) => e.preventDefault()}
                                            onPointerDownOutside={(e) => e.preventDefault()}
                                        >
                                            <DialogHeader>
                                                <DialogTitle className="text-4xl font-medium text-theme text-center">Delete Benefit</DialogTitle>
                                                <DialogDescription className="text-xl font-regular text-center mt-5 w-[340px]">
                                                    This action will delete employee payroll including all the data permanently.
                                                    Are you sure you want to proceed?
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter className="mt-5 flex w-full justify-center text-center mx-auto">
                                                <div>
                                                    <Button
                                                        onClick={handleDeletePayroll}
                                                        className="text-lg h-[48px] w-full bg-[#DD0004] text-white hover:bg-[#BA0003] rounded-[80px] cursor-pointer text-center">
                                                        Delete</Button>

                                                    <Button variant="outline" className="text-lg mt-4 h-[48px] flex w-[340px] rounded-[80px] text-theme cursor-pointer"
                                                        onClick={() => setDialogDeleteOpen(false)}>
                                                        Cancel</Button>
                                                </div>
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
                    <p>
                        Showing {Math.min((currentPage + 1) * perPage, filteredPayrolls.length)} of{" "}
                        {filteredPayrolls.length} Employee Payrolls
                    </p>
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
