"use client"

import React, { useEffect, useState } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Edit, Trash, PencilLine, Trash2, Filter, ChevronDown } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart } from "recharts"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { EmployeePerformanceChart } from "../employeePerformance/page"
import employeeApi from "@/api/employeeApi"




const dummyEmployees = Array.from({ length: 100 }, (_, i) => ({
  id: `MCPHY${2500 + i}`,
  name: `Employee ${i + 1}`,
  role: i % 2 === 0 ? "Sales" : "Mechanic",
  hired: "19/01/24",
  salary: 29000000,
  bonus: 1000000,
  absensi: "See Detail",
  statusSalary: i % 3 === 0 ? "Unpaid" : "Paid",
  statusBonus: i % 3 === 0 ? "Unpaid" : "Paid",
  notes: "Omzet penjualan 20% dibawah target",
  performance: Math.floor(Math.random() * 60) + 1,
}))

const ITEMS_PER_PAGE = 9

const role = ["Sales", "Mechanic"]

export default function EmployeePage() {
  const router = useRouter()

  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)
  const [dialogEditOpen, setDialogEditOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchEmployees(); // Fetch ulang kalau kembali ke halaman ini
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);


  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeeApi().viewAllEmployees();
      if (response.status === 200) {
        setEmployees(response.data);
        console.log(setEmployees);
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
    hired_date: "",
    notes: "",
    total_salary: 0,
    total_benefit: 0,
  })


  const handleEditClick = (employee: any, idx: number) => {
    setEditIndex(idx)
    setForm({
      // employee_id: employee.product_id,
      employee_name: employee.employee_name,
      role: employee.role,
      hired_date: employee.hired_date,
      total_salary: employee.total_salary,
      total_benefit: employee.total_benefit,
      notes: employee.notes,
    })
    setDialogEditOpen(true)
  }

  // PUT updated payload back to your API
  const handleUpdateEmployee = async () => {
    try {
      if (editIndex !== null && editIndex !== undefined) {
        const payload = {
          employee_id: employees[editIndex].employee_id,
          employee_name: form.employee_name,
          role: form.role,
          hired_date: form.hired_date,
          total_salary: form.total_salary,
          total_benefit: form.total_benefit,
          notes: form.notes,
        }

        const res = await employeeApi().updateEmployee(payload)
        await fetchEmployees()
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

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

  const handleDeleteEmployee = async () => {
    if (deleteIndex === null) return

    // Ambil produk yang akan di‐delete
    const employeeToDelete = employees[deleteIndex]

    try {
      // Kirim payload yang benar: employee_id dari employeeToDelete, bukan form.employee_id
      const res = await employeeApi().deleteEmployee({
        employee_id: employeeToDelete.employee_id,
      })

      if (res.error) {
        throw new Error(res.error)
      }

      // Success: tutup dialog, reset index, dan refresh list
      setDialogDeleteOpen(false)
      setDeleteIndex(null)
      await fetchEmployees()
    } catch (err) {
      console.error("Failed to delete:", err)
    }
  }

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
  const totalItems = filteredEmployees.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const startItem = totalItems > 0 ? startIndex + 1 : 0;
  const endItem = Math.min(endIndex, totalItems);

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

  const [isOpen, setIsOpen] = useState(false)

  const resetForm = () => {
    setForm({
      employee_name: "",
      role: "",
      hired_date: "",
      notes: "",
      total_salary: 0,
      total_benefit: 0,
    })
  }

  const isFormValid =
    form.employee_name.trim() !== "" &&
    form.role.trim() !== "" &&
    form.hired_date.trim() !== "" &&
    form.notes.trim() !== ""


  const onDialogOpenChange = (open: boolean) => {
    // Jika open true, izinkan
    if (open) {
      setIsOpen(true)
    }
    // Jika open false (misalnya klik di luar), abaikan agar dialog tetap terbuka.
  }


  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Menggunakan spread operator untuk membuat objek yang sama dengan form
      const formData = { ...form }
      console.log("ini formdata", formData);
      const response = await employeeApi().createEmployee(formData);

      if (!response || response.error) {
        throw new Error("Failed to add employee");
      }
      console.log("Employee created successfully:", response);
      resetForm();
      setIsOpen(false)
      await fetchEmployees();
    } catch (error) {
      console.error("Error submitting employee:", error)
    }
  }

  const handleChange = (field: string, value: any) => {
    setForm({
      ...form,
      [field]: value,
    })
  }

  const handleSalaryClick = (emp: { total_salary: number; employee_id: any }) => {
    const prevSalary = emp.total_salary

    // 1) Update local state so this row immediately shows “Paid”
    setEmployees((all) =>
      all.map((e) =>
        e.employee_id === emp.employee_id
          ? {
            ...e,
            total_salary: 0,
            statusSalary: 'Paid',
          }
          : e
      )
    )

    // 2) Navigate to /payroll with the amount in the query
    router.push(
      `/payroll?employee_id=${encodeURIComponent(emp.employee_id)}&paid_amount=${emp.total_salary}`
    )
  }

  const handleBenefitClick = (emp: { total_benefit: number; employee_id: any }) => {
    const prevSalary = emp.total_benefit

    // 1) Update local state so this row immediately shows “Paid”
    setEmployees((all) =>
      all.map((e) =>
        e.employee_id === emp.employee_id
          ? {
            ...e,
            total_benefit: 0,
            statusSalary: 'Paid',
          }
          : e
      )
    )

    // 2) Navigate to /payroll with the amount in the query
    router.push(
      `/benefits?employee_id=${encodeURIComponent(emp.employee_id)}&paid_amount=${emp.total_benefit}`
    )
  }

  return (
    <div className="p-8 md:p-8 bg-white dark:bg-[#000] text-theme min-h-screen flex flex-col">
      {/* TOP BAR */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-2xl font-bold">Employee</h1>
        </div>
        <ModeToggle />
      </div>

      {/* EMPLOYEE PERFORMANCE + "THIS MONTH" SELECT */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* <h1 className="text-xl font-semibold mt-2">This Month's Employee Performance</h1> */}
        {/* PLACEHOLDER BAR CHART */}
        <EmployeePerformanceChart></EmployeePerformanceChart>
      </div>

      {/* EMPLOYEE LIST (20), SEARCH, FILTER, + ADD EMPLOYEE */}
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-semibold">Employee List (20)</h3>
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative flex items-center gap-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <Input type="text" placeholder="Search..." className="pl-9 pr-5" />
          </div>

          {/* Filter button */}
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="text-gray-400" size={14} />
            Filter
          </Button>

          {/* +Add Employee */}
          {/* <Button className="bg-[#0456F7] text-white hover:bg-blue-700">+ Add Employee</Button> */}
          <Dialog open={isOpen} onOpenChange={onDialogOpenChange}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm()      // <<< reset langsung saat klik
                  setIsOpen(true)
                }}
                className="bg-[#0456F7] text-white hover:bg-blue-700">
                + Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg text-theme [&>button]:hidden p-12 rounded-[40px]">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Add new employee by filling the information below
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2 space-y-2">

                {/* Employee Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Employee Name
                  </label>
                  <Input
                    placeholder="Input item name"
                    value={form.employee_name}
                    onChange={(e) => handleChange("employee_name", e.target.value)}
                    required
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Role
                  </label>
                  <div className="relative rounded-md dark:bg-[#181818] 
                    border border-gray-300 dark:border-[#404040]
                    focus-within:border-gray-400 dark:focus-within:border-[oklch(1_0_0_/_45%)]
                    focus-within:ring-3 focus-within:ring-gray-300 dark:focus-within:ring-[oklch(0.551_0.027_264.364_/_54%)]
                  ">
                    <select
                      value={form.role}
                      onChange={(e) => handleChange("role", e.target.value)}
                      required
                      className={`w-full dark:text-theme appearance-none bg-transparent px-4 py-2 pr-10 text-sm 
                        focus:outline-none ${!form.role ? "text-gray-500 dark:text-gray-400" : "text-black dark:text-white"
                        }`}
                    >
                      <option value="">Choose Employee's Role</option>
                      <option value="Sales">Sales</option>
                      <option value="Mechanic">Mechanic</option>
                    </select>
                    {/* Icon arrow di kanan */}
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Hired Date */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Hired Date
                  </label>
                  <Input
                    placeholder="Input item name"
                    value={form.hired_date}
                    onChange={(e) => handleChange("hired_date", e.target.value)}
                    required
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Notes
                  </label>
                  <Input
                    placeholder="Input item name"
                    value={form.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    required
                  />
                </div>
              </div>

              <DialogFooter className="grid grid-cols-2">
                <Button variant="outline" className="rounded-[80px]"
                  onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateEmployee}
                  className="bg-[#0456F7] text-white hover:bg-[#0348CF] rounded-[80px]"
                  disabled={!isFormValid}
                >
                  Add Employee
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto rounded-lg border border-theme bg-theme">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#F1F1F1] text-left text-gray-600 dark:bg-[#181818] dark:text-gray-400">
            <tr>
              <th className="pl-4 py-4 font-semibold">Employee ID</th>
              <th className="px-2 py-4 font-semibold">Name</th>
              <th className="px-4 py-4 font-semibold">Position</th>
              <th className="px-2 py-4 font-semibold">Hire Date</th>
              <th className="px-2 py-4 font-semibold">Absent</th>
              <th className="px-4 py-4 font-semibold">Salary</th>
              <th className="px-4 py-4 font-semibold">Bonus</th>
              <th className="px-4 py-4 font-semibold">Notes</th>
              <th className="px-0 py-4 font-semibold"></th>
            </tr>
          </thead>
          <TableBody className="bg-theme divide-y dark:divide-[oklch(1_0_0_/_10%)]">
            {employeesData.map((emp, i) => (
              <TableRow key={i} className="dark:hover:bg-[#161616] text-[13px]" >
                <TableCell className="pl-4 py-3">{emp.employee_id}</TableCell>
                <TableCell className="px-2 py-2">{emp.employee_name}</TableCell>
                <TableCell className="px-4 py-2">{emp.role}</TableCell>
                <TableCell className="px-2 py-2">{emp.hired_date}</TableCell>
                <TableCell className="px-2 py-1">
                  <Button variant="outline"
                    onClick={() => router.push(`/attendanceSummary`)}
                    className="text-xs px-3 h-[30px]"
                  >
                    See Detail
                  </Button>
                </TableCell>
                <TableCell className={`px-4 py-2 max-w-[250px]`}>
                  <div className="flex relative items-center gap-4 overflow-hidden justify-between w-full">
                    Rp {emp.total_salary}
                    <Button
                      variant='ghost'
                      className={`w-16 h-6 font-medium text-theme py-1 text-xs rounded-xl text-center 
                        ${emp.total_salary === 0 ? "border bg-[#F4F5F9] text-[#696969] hover:text-gray-500 dark:bg-[#181818] dark:hover:bg-[#121212]"
                          : "bg-[#DAF6D2] text-[#34A718]"}`}
                      onClick={() => handleSalaryClick(emp)}
                    >
                      Pay
                    </Button>
                  </div>
                </TableCell>
                <TableCell className={`px-4 py-2 max-w-[250px]`}>
                  <div className="flex relative items-center gap-4 overflow-hidden justify-between w-full">
                    Rp {emp.total_benefit}
                    <Button
                      variant='ghost'
                      className={`w-16 h-6 font-medium text-theme py-1 text-xs rounded-xl text-center 
                        ${emp.total_benefit === 0 ? "border bg-[#F4F5F9] text-[#696969] hover:text-gray-500 dark:bg-[#181818] dark:hover:bg-[#121212]"
                          : "bg-[#DAF6D2] text-[#34A718]"}`}
                      onClick={() => handleBenefitClick(emp)}
                    >
                      Pay
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2 w-[220px] whitespace-normal break-words text-ellipsis" title={emp.notes}>
                  {emp.notes}
                </TableCell>
                <TableCell className="px-0 py-2 text-center">
                  <Dialog open={dialogEditOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="text-[#0456F7] cursor-pointer bg-theme hover:bg-theme"
                        onClick={() => handleEditClick(emp, i)}>
                        <PencilLine size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl text-theme [&>button]:hidden p-12 rounded-[32px] space-y-0">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">Edit Product</DialogTitle>
                        <DialogDescription className="text-md">
                          Update the product by changing its information below.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-2 space-y-1">
                        {/* Employee Name */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Employee  Name
                          </label>
                          <div
                            className="border rounded-md shadow-xs 
                          dark:focus-within:ring-4 dark:focus-within:ring-[oklch(0.551_0.027_264.364)]
                          dark:focus-within:border-[oklch(1_0_0_/_10%)]
                          focus-within:ring-3 focus-within:ring-gray-200 
                          focus-within:border-gray-300">
                            <Input
                              placeholder="Update employee name"
                              value={form.employee_name}
                              className="h-[48px] bg-transparent dark:bg-transparent border-none
                            border-0 appearance-none whitespace-normal"
                              onChange={(e) => handleChange("employee_name", e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        {/* Brand Name */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Role
                          </label>
                          <div
                            className="border rounded-md shadow-xs 
                          dark:focus-within:ring-4 dark:focus-within:ring-[oklch(0.551_0.027_264.364)]
                          dark:focus-within:border-[oklch(1_0_0_/_10%)]
                          focus-within:ring-3 focus-within:ring-gray-200 
                          focus-within:border-gray-300">
                            <Input
                              placeholder="Update employee name"
                              value={form.role}
                              className="h-[48px] bg-transparent dark:bg-transparent border-none
                            border-0 appearance-none whitespace-normal"
                              onChange={(e) => handleChange("role", e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        {/* Hired date */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Hired Date
                          </label>
                          <div
                            className="border rounded-md shadow-xs 
                          dark:focus-within:ring-4 dark:focus-within:ring-[oklch(0.551_0.027_264.364)]
                          dark:focus-within:border-[oklch(1_0_0_/_10%)]
                          focus-within:ring-3 focus-within:ring-gray-200 
                          focus-within:border-gray-300">
                            <Input
                              placeholder="Update employee name"
                              value={form.hired_date}
                              className="h-[48px] bg-transparent dark:bg-transparent border-none
                            border-0 appearance-none whitespace-normal"
                              onChange={(e) => handleChange("hired_date", e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Notes
                          </label>
                          <div
                            className="border rounded-md shadow-xs 
                          dark:focus-within:ring-4 dark:focus-within:ring-[oklch(0.551_0.027_264.364)]
                          dark:focus-within:border-[oklch(1_0_0_/_10%)]
                          focus-within:ring-3 focus-within:ring-gray-200 
                          focus-within:border-gray-300">
                            <Input
                              placeholder="Update employee name"
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
                          Update Product
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
                      <Button className="text-[#DF0025] cursor-pointer bg-theme hover:bg-theme"
                        onClick={() => setDeleteIndex(i)}>
                        <Trash2 size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm p-12 md:p-12 rounded-[32px] [&>button]:hidden text-center justify-center w-auto"
                      onEscapeKeyDown={(e) => e.preventDefault()}
                      onPointerDownOutside={(e) => e.preventDefault()}
                    >
                      <DialogHeader>
                        <DialogTitle className="text-4xl font-medium text-theme text-center">Delete Employee</DialogTitle>
                        <DialogDescription className="text-xl font-regular text-center mt-5 w-[340px]">
                          This action will delete employee including all the data permanently.
                          Are you sure you want to proceed?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-5 flex w-full justify-center text-center mx-auto">
                        <div>
                          <Button
                            onClick={handleDeleteEmployee}
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

      {/* FOOTER PAGINATION */}
      <footer className="mt-auto w-full text-sm text-gray-600 dark:text-white">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          {/* e.g. "Showing 16 of 48 Products" */}
          <p>Showing {rangeText} of {totalItems} Products</p>
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
