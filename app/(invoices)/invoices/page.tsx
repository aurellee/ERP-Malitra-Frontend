"use client"

import React, { useState, useEffect } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { DateRangePicker } from "@/components/date-range-picker"
import Link from "next/link"
import type { DateRange } from "react-day-picker"
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  PencilLine,
  Trash2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { parseRupiah } from "@/utils/commonFunctions"
import { Invoice } from "@/types/types"
import invoiceApi from "@/api/invoiceApi"

// Konfigurasi pagination
const ITEMS_PER_PAGE = 9

export default function InvoicesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  const [summary, setSummary] = useState({
    start_date: "",
    end_date: "",
    total_amount_paid: 0,
    total_paid_cash: 0,
    total_paid_transfer: 0,
    total_unpaid: 0,
  })

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  })

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = filteredInvoices.slice(startIndex, endIndex)
  const displayedCount = currentItems.length

  const totalItems = filteredInvoices.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  const [searchQuery, setSearchQuery] = useState("")

  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)
  const [dialogEditOpen, setDialogEditOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

  // const [form, setForm]

  useEffect(() => {
    handleViewAllInvoices();
  }, [])

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      filterInvoicesByDate()
    }
    handleFetchSummaryFilter();
  }, [dateRange]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      filterInvoicesByDate(); // kembali ke hasil filter berdasarkan tanggal saja
    } else {
      const filtered = filteredInvoices.filter((invoice) =>
        invoice.invoice_id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.sales?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.mechanic?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredInvoices(filtered);
    }
    setCurrentPage(1); // reset ke halaman pertama setelah filter
  }, [searchQuery]);

  const handleFetchSummaryFilter = async () => {
    try {
      const startDate = format(dateRange?.from ?? new Date(), "yyyy-MM-dd");
      const endDate = format(dateRange?.to ?? new Date(), "yyyy-MM-dd");

      const formDate = {
        start_date: startDate,
        end_date: endDate
      }

      const res = await invoiceApi().invoiceSummaryFilter(formDate);
      if (res.status == 200) {
        setSummary(res.data);
      } else {
        console.log("Error fetching data:", res.error)
      }
    } catch (error) {
      console.log("Error fetching data:", error)
    }
  }

  const handleViewAllInvoices = async () => {
    try {
      const res = await invoiceApi().viewAllInvoices();
      if (res.status == 200) {
        setInvoices(res.data);
        setFilteredInvoices(res.data);
        console.log("Success fetched data...");
      }
    } catch (error) {
      console.log("Error fetching invoices list...");
    }
  }

  const filterInvoicesByDate = () => {
    const fromDate = dateRange?.from ?? new Date();
    const toDate = dateRange?.to ?? new Date();

    // Normalize dates to start and end of the day
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);

    const filtered = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.invoice_date);
      return invoiceDate >= fromDate && invoiceDate <= toDate;
    });

    setFilteredInvoices(filtered);
  }

  const [form, setForm] = useState({
    invoice_id: 0,
    invoice_date: "",
    total_price: 0,
    amount_paid: 0,
    payment_method: "",
  })

  const handleEditClick = (invoice: any, idx: number) => {
    setEditIndex(idx)
    setForm({
      invoice_id: invoice.invoice_id,
      invoice_date: invoice.invoice_date,
      amount_paid: invoice.amount_paid,
      total_price: invoice.total_price,
      payment_method: invoice.payment_method,
    })
    setDialogEditOpen(true)
  }

  // PUT updated payload back to your API
  const handleUpdateInvoice = async () => {
    try {
      if (editIndex !== null && editIndex !== undefined) {
        const payload = {
          invoice_id: invoices[editIndex].invoice_id,
          invoice_date: form.invoice_date,
          amount_paid: form.amount_paid,
          total_price: form.total_price,
          payment_method: form.payment_method,
        }

        const res = await invoiceApi().updateInvoice(payload)
        if (res.error) throw new Error(res.error)
        // success! re‑fetch and close
        await handleViewAllInvoices()
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

  const resetForm = () => {
    setForm({
      invoice_id: 0,
      total_price: 0,
      invoice_date: "",
      amount_paid: 0,
      payment_method: "",
    })
  }

  const isFormValid =
    // form.invoice_id > 0 &&
    // form.invoice_date.trim() !== "" &&
    form.payment_method.trim() !== "" &&
    form.amount_paid > 0

  const handleDeleteInvoice = async () => {
    if (deleteIndex === null) return

    // Ambil produk yang akan di‐delete
    const invoiceToDelete = invoices[deleteIndex]

    try {
      // Kirim payload yang benar: product_id dari productToDelete, bukan form.productID
      const res = await invoiceApi().deleteInvoice({
        invoice_id: invoiceToDelete.invoice_id,
      })

      if (res.error) {
        throw new Error(res.error)
      }

      // Success: tutup dialog, reset index, dan refresh list
      setDialogDeleteOpen(false)
      setDeleteIndex(null)
      await handleViewAllInvoices()
    } catch (err) {
      console.error("Failed to delete:", err)
    }
  }


  const handleChange = (field: string, value: any) => {
    setForm({
      ...form,
      [field]: value,
    })
  }

  // Next / Prev page
  function handleNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }
  function handlePrevPage() {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col p-8 md:p-8 bg-white dark:bg-[#000] text-theme">
      {/* TOP BAR */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-2xl font-bold">Invoice History</h1>
        </div>
        <ModeToggle />
      </div>

      {/* INVOICE SUMMARY + THIS MONTH SELECT */}
      <div className="mt-2 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold mt-2">Invoice Summary</h1>
        {/* Date Range Picker (contoh) */}
        <DateRangePicker value={dateRange} onValueChange={setDateRange} />
      </div>

      {/* 4 Cards: Total Income, Cash, Transfer Bank, Unpaid Invoice */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Income */}
        <div className="rounded-[28px] h-[110px] p-7 shadow-sm dark:shadow-gray-900 bg-gradient-to-r from-[#023291] to-[#0456F7]">
          <p className="text-sm text-white">Total Income</p>
          <p className="mt-1 text-2xl font-bold text-white">Rp {summary.total_amount_paid.toLocaleString("id-ID")}</p>
        </div>
        {/* Card 2: Cash */}
        <div className="rounded-[28px] h-[110px] p-7 shadow-sm dark:shadow-gray-900 bg-theme text-theme border border-gray-200 dark:border-[oklch(1_0_0_/_10%)]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Cash</p>
          <p className="mt-1 text-2xl font-bold text-theme">Rp {summary.total_paid_cash.toLocaleString("id-ID")}</p>
        </div>
        {/* Card 3: Transfer Bank */}
        <div className="rounded-[28px] h-[110px] p-7 shadow-sm dark:shadow-gray-900 bg-theme text-theme border border-gray-200 dark:border-[oklch(1_0_0_/_10%)]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Transfer Bank</p>
          <p className="mt-1 text-2xl font-bold text-theme">Rp {summary.total_paid_transfer.toLocaleString("id-ID")}</p>
        </div>
        {/* Card 4: Unpaid Invoice */}
        <div className="rounded-[28px] h-[110px] p-7 shadow-sm dark:shadow-gray-900 bg-gradient-to-r from-[#960019] to-[#DF0025]">
          <p className="text-sm text-white">Unpaid Invoice</p>
          <p className="mt-1 text-2xl font-bold text-white">Rp {summary.total_unpaid.toLocaleString("id-ID")}</p>
        </div>
      </div>

      {/* SUBHEADER: All Invoices, Search, Filter, +Add Invoice */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-semibold">All Invoices ({totalItems})</h3>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex items-center gap-6 border rounded-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
            <Input type="text"
              placeholder="Search..."
              value={searchQuery}
              className="pl-9 pr-5 outline-none appearance-none border-none text-md "
              onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          {/* Filter button */}
          <Button variant="outline" className="flex items-center gap-1">
            <Filter size={16} />
            Filter
          </Button>

          {/* +Add Invoice */}
          <Button
            className="bg-[#0456F7] text-white hover:bg-[#0348CF]"
            onClick={() => router.push("/newOrder")}
          >
            + Add Invoice
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-[oklch(1_0_0_/_10%)]">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#F1F1F1] text-left text-gray-600 dark:bg-[#181818] dark:text-gray-500">
            <tr>
              <th className="px-4 py-4 font-semibold">Invoice ID</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Sales</th>
              <th className="px-4 py-3 font-semibold">Mechanic</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Amount Paid</th>
              <th className="px-4 py-3 font-semibold">Amount Due</th>
              <th className="px-4 py-3 font-semibold">Payment</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Detail</th>
              <th className="px-0 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700 dark:bg-[#121212] dark:text-gray-300 dark:divide-[oklch(1_0_0_/_10%)]">
            {currentItems.map((invoice, idx) => (
              <tr key={idx}>
                <td className="px-4 py-4">{invoice.invoice_id}</td>
                <td className="px-4 py-3">{format(invoice.invoice_date, "dd MMMM yyyy")}</td>
                <td className="px-4 py-3">{invoice.sales || "-"}</td>
                <td className="px-4 py-3">{invoice.mechanic || "-"}</td>
                <td className="px-4 py-3">{invoice.total_price}</td>
                <td className="px-4 py-3">{invoice.amount_paid}</td>
                <td className="px-4 py-3">{invoice.unpaid_amount}</td>
                <td className="px-4 py-3">{invoice.payment_method}</td>
                <td className="px-4 py-3">{invoice.invoice_status}</td>
                {/* Detail column: link ke /invoices/[invoiceId] */}
                <td className="px-4 py-3">
                  <Link
                    href={{
                      pathname: '/invoiceDetail',
                      query: { invoice_id: invoice.invoice_id }
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    See Detail
                  </Link>
                </td>
                <td className="px-0 py-3">
                  <Dialog open={dialogEditOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="text-[#0456F7] cursor-pointer bg-transparent hover:bg-transparent shadow-none"
                        onClick={() => handleEditClick(invoice, idx)}
                      >
                        <PencilLine size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl text-theme [&>button]:hidden p-12 rounded-[32px] space-y-0">
                      <DialogHeader>
                        <DialogTitle className="text-3xl">Invoice #{form.invoice_id.toLocaleString()}</DialogTitle>
                        <DialogDescription className="text-lg">
                          Edit this invoice with new information.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-2 space-y-1">
                        {/* Product ID */}
                        <div>
                          <label className="block text-md font-medium mb-2">
                            Date
                          </label>
                          <div className="flex border-none px-4 w-full text-md h-[48px] items-center rounded-md
                          bg-gray-100 dark:bg-[#2a2a2a] cursor-not-allowed text-gray-500">
                            {form.invoice_date
                              ? format(parseISO(form.invoice_date), 'dd MMMM yyyy')
                              : '-'}
                          </div>
                          {/* <Input
                            placeholder="Update Invoice Date"
                            value={invoice.invoice_date}
                            // onChange={(e) => handleChange("productID", e.target.value)}
                            readOnly
                            className="border-none px-3 py-2 w-full text-sm h-[48px] bg-gray-100 dark:bg-[#2a2a2a] cursor-not-allowed text-gray-500"
                          /> */}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Total Amount
                          </label>
                          <div className="flex border-none px-4 w-full text-md h-[48px] items-center rounded-md
                          bg-gray-100 dark:bg-[#2a2a2a] cursor-not-allowed text-gray-500">
                            {form.total_price.toLocaleString()}
                          </div>
                        </div>

                        {/* Product Name */}
                        <div>
                          <label className="block text-md font-medium mb-2">
                            Amount Paid
                          </label>
                          <Input
                            placeholder="Update amount paid"
                            value={form.amount_paid}
                            className="h-[48px] text-md flex px-4"
                            style={{ fontWeight: 400, fontSize: 16 }}
                            onChange={(e) => handleChange("amount_paid", e.target.value)}
                            required
                          />
                        </div>

                        {/* Brand Name */}
                        <div>
                          <label className="block text-md font-medium mb-2">
                            Payment Method
                          </label>
                          <Input
                            placeholder="Update payment method"
                            value={form.payment_method}
                            className="h-[48px] text-md flex px-4"
                            style={{ fontWeight: 400, fontSize: 16 }}
                            onChange={(e) => handleChange("payment_method", e.target.value)}
                            required
                          />
                        </div>


                      </div>

                      <DialogFooter className="mt-1 grid grid-cols-2">
                        <Button variant="outline" className="rounded-[80px] text-md h-[48px]"
                          onClick={() => setDialogEditOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleUpdateInvoice}
                          // disabled={!isFormValid}
                          className="bg-[#0456F7] text-white hover:bg-[#0348CF] rounded-[80px] text-md h-[48px]"
                        >
                          Update Invoice
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
                      <Button className="text-[#DF0025] cursor-pointer bg-transparent hover:bg-transparent shadow-none"
                        onClick={() => setDeleteIndex(idx)}>
                        <Trash2 size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm p-12 md:p-12 rounded-[32px] [&>button]:hidden text-center justify-center w-auto"
                      onEscapeKeyDown={(e) => e.preventDefault()}
                      onPointerDownOutside={(e) => e.preventDefault()}
                    >
                      <DialogHeader>
                        <DialogTitle className="text-4xl font-medium text-theme text-center">Delete Invoice #{invoice.invoice_id}</DialogTitle>
                        <DialogDescription className="text-xl font-regular text-center mt-5 w-[340px]">
                          This action will delete invoice from the database permanently.
                          Are you sure you want to proceed?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-5 flex w-full justify-center text-center mx-auto">
                        <div>
                          <Button
                            onClick={handleDeleteInvoice}
                            className="text-lg h-[48px] w-full bg-[#DD0004] text-white hover:bg-[#BA0003] rounded-[80px] cursor-pointer text-center">
                            Delete</Button>

                          <Button variant="outline" className="text-lg mt-4 h-[48px] flex w-[340px] rounded-[80px] text-theme cursor-pointer"
                            onClick={() => setDialogDeleteOpen(false)}>
                            Cancel</Button>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <footer className="mt-auto w-full text-sm text-gray-600 dark:text-white">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <p>Showing {displayedCount} of {totalItems} Invoices</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 1}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <Button variant="outline" onClick={handleNextPage} disabled={currentPage === totalPages}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
