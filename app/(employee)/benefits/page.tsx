"use client"
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { PayrollDatePicker } from '@/components/payroll-date';
import { ChevronLeft, ChevronRight, ChevronDown, PencilLine, PlusIcon, Search, Trash2 } from 'lucide-react';
import {
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { Benefits } from '@/types/types';
import employeeApi from '@/api/employeeApi';
import { typeStyles } from '@/constants/styleConstants';
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HiredDatePicker } from "@/components/hired_date_picker"

const statusColor = (status: string) => {
  return status === "Unpaid"
    ? "bg-[#FFE3E3] text-[#B91C1C]"
    : "bg-[#E9F9EA] text-[#097A37]"
}

function getTypeStyle(type: string) {
  return typeStyles[type] || typeStyles.default
}

const formatRupiah = (num: number) => {
  return 'Rp ' + num.toLocaleString('id-ID');
};

export default function BenefitsPage() {
  const perPage = 13
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [benefits, setBeneftis] = useState<Benefits[]>([])
  const [filteredBenefits, setFilteredBenefits] = useState<Benefits[]>([])

  const [benefitsSummary, setBenefitsSummary] = useState({
    total_salaries: 0,
    total_paid: 0,
    total_unpaid: 0
  })

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  })

  const currentData = filteredBenefits.slice(currentPage * perPage, (currentPage + 1) * perPage)
  const totalPages = Math.ceil(filteredBenefits.length / perPage)

  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)
  const [dialogEditOpen, setDialogEditOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)

  useEffect(() => {
    handleViewBenefitsList();
  }, [])

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      filterBenefitsByDate();
    }
    handleViewBenefitsSummary();
  }, [dateRange]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      filterBenefitsByDate();
    } else {
      const filtered = filteredBenefits.filter((benefit) =>
        benefit.employee_name.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBenefits(filtered);
    }
    setCurrentPage(0); // reset ke halaman pertama setelah filter
  }, [searchQuery]);

  const handleViewBenefitsList = async () => {
    try {
      const res = await employeeApi().viewBenefitsList();
      if (res.status == 200) {
        const allBenefits = res.data;
        setBeneftis(allBenefits);

        const fromDate = dateRange?.from ?? new Date();
        const toDate = dateRange?.to ?? new Date();
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);

        const filtered = allBenefits.filter((benefit: Benefits) => {
          const benefitDate = new Date(benefit.date);
          return benefitDate >= fromDate && benefitDate <= toDate;
        });

        setFilteredBenefits(filtered);
      } else {
        console.log("Error fetching data:", res.error)
      }
    } catch (error) {
      console.log("Error fetching data:", error)
    }
  }

  const handleViewBenefitsSummary = async () => {
    try {
      const startDate = format(dateRange?.from ?? new Date(), "yyyy-MM-dd");
      const endDate = format(dateRange?.to ?? new Date(), "yyyy-MM-dd");

      const formDate = {
        start_date: startDate,
        end_date: endDate
      }

      const res = await employeeApi().viewBenefitsSummary(formDate);
      if (res.status == 200) {
        setBenefitsSummary(res.data);
      } else {
        console.log("Error fetching data:", res.error)
      }
    } catch (error) {
      console.log("Error fetching data:", error)
    }
  }

  const filterBenefitsByDate = () => {
    const fromDate = dateRange?.from ?? new Date();
    const toDate = dateRange?.to ?? new Date();

    // Normalize dates to start and end of the day
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);

    const filtered = benefits.filter(benefit => {
      const benefitDate = new Date(benefit.date);
      return benefitDate >= fromDate && benefitDate <= toDate;
    });

    setFilteredBenefits(filtered);
  }

  const [isOpen, setIsOpen] = useState(false)
  const todayIso = format(new Date(), 'yyyy-MM-dd')
  const [form, setForm] = useState({
    employee: 0,
    date: todayIso,
    bonus_type: "",
    amount: 0,
    status: "Unpaid",
    notes: "",
  })

  const resetForm = () => {
    setForm({
      employee: 0,
      date: todayIso,
      bonus_type: "",
      amount: 0,
      status: "Unpaid",
      notes: "",
    })
  }

  const isFormValid =
    form.employee !== 0 &&
    form.date.trim() !== "" &&
    form.bonus_type.trim() !== "" &&
    form.amount > 0 &&
    form.notes.trim() !== "";

  const onDialogOpenChange = (open: boolean) => {
    // Jika open true, izinkan
    if (open) {
      setIsOpen(true)
    }
    // Jika open false (misalnya klik di luar), abaikan agar dialog tetap terbuka.
  }

  const handleChange = (field: string, value: any) => {
    setForm({
      ...form,
      [field]: value,
    })
  }


  const handleCreateBenefit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await employeeApi().createBenefit(form);
      if (res.status == 201) {
        resetForm();
        setIsOpen(false);
        await handleViewBenefitsList();
      } else {
        console.log("Error fetching data:", res.error)
      }
    } catch (error) {
      console.log("Error fetching data:", error)
    }
  }

  // Update
  const [updateForm, setUpdateForm] = useState<Benefits>()

  const handleEditClick = (benefit: any, idx: number) => {
    setEditIndex(idx)
    setUpdateForm({
      date: benefit.date,
      employee_id: benefit.employee_id,
      employee_name: benefit.employee_name,
      type: benefit.type,
      amount: benefit.amount,
      status: benefit.status,
      notes: benefit.notes
    })
    setDialogEditOpen(true)
  }

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-[#000] text-theme space-y-4 flex flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-2xl font-bold">Benefits</h1>
        </div>
        <ModeToggle />
      </div>

      {/* Date Range & Search Bar */}
      <div className="mt-2 flex items-center justify-between w-full">
        <PayrollDatePicker value={dateRange} onValueChange={setDateRange} />
        <div className="relative flex items-center gap-4">
          <div className="relative flex gap-6 justify-end text-right">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <Input
              placeholder="Search.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-5 w-100 h-[40px] rounded-[80px]" />
          </div>
          <Dialog open={isOpen} onOpenChange={onDialogOpenChange}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm()      // <<< reset langsung saat klik
                  setIsOpen(true)
                }}
                className="bg-[#0456F7] text-white hover:bg-blue-700">
                + Add Benefit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl text-theme [&>button]:hidden p-12 rounded-[40px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">Add New Benefit</DialogTitle>
                <DialogDescription className="text-[14px]">
                  Add new benefit by filling the information below
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2 space-y-2">

                {/* Employee ID */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Employee ID
                  </label>
                  <div className="border rounded-md shadow-xs items-center
                          dark:focus-within:ring-4 dark:focus-within:ring-[oklch(0.551_0.027_264.364)]
                          dark:focus-within:border-[oklch(1_0_0_/_10%)]
                          focus-within:ring-3 focus-within:ring-gray-200 
                          focus-within:border-gray-300">
                    <Input
                      className="h-[48px] bg-transparent dark:bg-transparent border-none
                            border-0 appearance-none whitespace-normal items-center"
                      placeholder="Input employee's full name"
                      value={form.employee}
                      onChange={(e) => handleChange("employee", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Bonus Date */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Bonus Date
                  </label>
                  <HiredDatePicker
                    value={form.date}
                    onChange={(isoDateString) =>
                      handleChange("hired_date", isoDateString)
                    }
                  />
                </div>

                {/* Bonus Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bonus Type
                  </label>
                  <div className="relative rounded-md dark:bg-[#181818] 
                    border border-gray-300 dark:border-[#404040] h-[48px] text-sm
                    focus-within:border-gray-400 dark:focus-within:border-[oklch(1_0_0_/_45%)]
                    focus-within:ring-3 focus-within:ring-gray-300 dark:focus-within:ring-[oklch(0.551_0.027_264.364_/_54%)]
                  ">
                    <select
                      value={form.bonus_type}
                      onChange={(e) => handleChange("bonus_type", e.target.value)}
                      required
                      className={`w-full dark:text-theme appearance-none bg-transparent px-4 py-2 pr-10 h-[48px] focus:ring-0 focus:appearance-none border-none  
                        focus:outline-none ${!form.bonus_type ? "text-gray-500 dark:text-gray-400" : "text-black dark:text-white"
                        }`}
                    >
                      <option value="">Choose Bonus Type </option>
                      <option value="Incentive">Incentive</option>
                      <option value="Reimbursement">Reimbursement</option>
                      <option value="Bonus">Bonus</option>
                      <option value="Commission">Commission</option>
                      <option value="Meal Subsidy">Meal Subsidy</option>
                      <option value="Reward">Reward</option>
                      <option value="Transport Allowance">Transport Allowance</option>
                      <option value="Training Stipend">Training Stipend</option>
                      <option value="Overtime Bonus">Overtime Bonus</option>
                      <option value="Referral Bonus">Referral Bonus</option>
                      <option value="Performance Bonus">Performance Bonus</option>
                      <option value="Commissioned">Commissioned</option>
                    </select>
                    {/* Icon arrow di kanan */}
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Amount Bonus */}
                <div>
                  <label className="block text-sm font-medium mb-2">Amount Bonus</label>
                  <div className="border rounded-md">
                    <input
                      type="text"
                      className="w-full rounded-md dark:bg-[#181818]
                    px-3 py-2 h-[48px] text-sm h-[48px] outline-none appearance-none border-none"
                      value={form.amount || ""}
                      onChange={(e) => handleChange("amount", Number(e.target.value))}
                      required
                      placeholder="Rp 0"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Notes
                  </label>
                  <div className="border rounded-md shadow-xs items-center
                          dark:focus-within:ring-4 dark:focus-within:ring-[oklch(0.551_0.027_264.364)]
                          dark:focus-within:border-[oklch(1_0_0_/_10%)]
                          focus-within:ring-3 focus-within:ring-gray-200 
                          focus-within:border-gray-300">
                    <Input
                      className="h-[48px] bg-transparent dark:bg-transparent border-none
                            border-0 appearance-none whitespace-normal items-center"
                      placeholder="Write the benefit notes here"
                      value={form.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-2 grid grid-cols-2">
                <Button variant="outline" className="rounded-[80px] text-md h-[48px]"
                  onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateBenefit}
                  className="bg-[#0456F7] text-white hover:bg-[#0348CF] rounded-[80px] text-md h-[48px]"
                  disabled={!isFormValid}
                >
                  Add Benefit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Benefit Cards */}
      <div className="mb-4 grid grid-cols-3 gap-8">
        <div className="rounded-[20px] h-[96px] p-5 shadow-sm dark:shadow-gray-900 bg-gradient-to-r from-[#023291] to-[#0456F7]">
          <p className="text-[13px] text-white">Total Benefits</p>
          <p className="mt-1 text-2xl font-bold text-white">Rp {benefitsSummary.total_salaries.toLocaleString("id-ID")}</p>
        </div>
        <div className="rounded-[20px] h-[96px] p-5 shadow-sm dark:shadow-gray-900 bg-theme text-theme border border-gray-200 dark:border-[oklch(1_0_0_/_10%)]">
          <p className="text-[13px] text-gray-500 dark:text-gray-400">Paid Benefits</p>
          <p className="mt-1 text-2xl font-bold text-theme">Rp {benefitsSummary.total_paid.toLocaleString("id-ID")}</p>
        </div>
        <div className="rounded-[20px] h-[96px] p-5 shadow-sm dark:shadow-gray-900 bg-gradient-to-r from-[#960019] to-[#DF0025]">
          <p className="text-[13px] text-white">Unpaid Benefits</p>
          <p className="mt-1 text-2xl font-bold text-white">Rp {benefitsSummary.total_unpaid.toLocaleString("id-ID")}</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto rounded-lg border border-theme bg-theme">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#F1F1F1] text-left text-gray-600 dark:bg-[#181818] dark:text-gray-400">
            <tr>
              <th className="px-4 py-4 font-semibold">Payment Date</th>
              <th className="px-4 py-4 font-semibold">Employee ID</th>
              <th className="px-4 py-4 font-semibold">Name</th>
              <th className="px-4 py-4 font-semibold">Type</th>
              <th className="px-4 py-4 font-semibold">Amount</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-4 py-4 font-semibold">Notes</th>
              <th className="px-4 py-4 font-semibold"></th>
            </tr>
          </thead>
          <TableBody className="bg-theme divide-y dark:divide-[oklch(1_0_0_/_10%)]">
            {currentData.map((emp, i) => (
              <TableRow
                key={i}
                className="dark:hover:bg-[#161616] text-[13px]"
              >
                <TableCell className="px-4 py-3.5 whitespace-nowrap">
                  {emp.date}
                </TableCell>
                <TableCell className="px-4 py-2 whitespace-nowrap">
                  {emp.employee_id}
                </TableCell>
                <TableCell className="px-4 py-2 whitespace-nowrap">
                  {emp.employee_name}
                </TableCell>
                {/* TYPE with pastel "button" style */}
                <TableCell className="px-4 py-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[13px] font-medium ${getTypeStyle(emp.type)}`}
                  >
                    {emp.type}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-2 whitespace-nowrap">
                  {formatRupiah(emp.amount)}
                </TableCell>
                <TableCell className="px-4 py-2">
                  <div
                    className={`px-3 py-1 w-19 font-medium text-theme text-xs text-center rounded-xl items-center ${statusColor(
                      emp.status
                    )}`}
                  >
                    {emp.status}
                  </div>
                </TableCell>
                {/* Wrap the notes if too long */}
                <TableCell className="px-4 py-2 max-w-[260px] whitespace-normal break-words">
                  {emp.notes}
                </TableCell>

                {/* BUTTONS */}
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
                        <DialogTitle className="text-2xl">Edit Employee Benefit</DialogTitle>
                        <DialogDescription className="text-md">
                          Update the employee benefit data by changing the information below.
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
                              value={updateForm?.employee_name}
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
                              // value={form.role}
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
                              // value={form.hired_date}
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
                              // value={form.notes}
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
                          // onClick={(handleUpdateEmployee)}
                          disabled={!isFormValid}
                          className="bg-[#0456F7] text-white hover:bg-[#0348CF] rounded-[80px] text-md h-[48px]"
                        >
                          Update Employee
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>


                  <Dialog open={dialogDeleteOpen}
                    onOpenChange={(open) => {
                      setDialogDeleteOpen(open)
                      // if (!open) setDeleteIndex(null)
                    }}>
                    <DialogTrigger asChild>
                      <Button className="text-[#DF0025] cursor-pointer bg-transparent hover:bg-transparent shadow-none rounded-full"
                        // onClick={() => setDeleteIndex(i)}
                        >
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
                            // onClick={handleDeleteEmployee}
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
          <p>
            Showing {Math.min((currentPage + 1) * perPage, filteredBenefits.length)} of{" "}
            {filteredBenefits.length} Employees
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
    </div >
  )
};