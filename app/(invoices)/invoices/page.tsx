"use client"

import React, { useState, useEffect } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { DateRangePicker } from "@/components/date-range-picker"
import Link from "next/link"
import invoiceApi from "@/api/invoiceApi"
import type { DateRange } from "react-day-picker"
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  PencilLine,
  Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { parseRupiah } from "@/utils/commonFunctions"
import { Invoice } from "@/types/types"

// Konfigurasi pagination
const ITEMS_PER_PAGE = 10

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
      }  else {
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
          <div className="relative flex items-center gap-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <Input type="text" placeholder="Search..." className="pl-9 pr-5" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
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
            + Add Product
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
              <th className="px-4 py-3 font-semibold"></th>
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
                    href={`/invoices/${invoice.invoice_id}`}
                    className="text-blue-600 hover:underline"
                  >
                    See Detail
                  </Link>
                </td>
                <td className="px-5 py-3">
                  <button className="mr-2 text-[#0456F7] cursor-pointer">
                    <PencilLine size={16} />
                  </button>
                  <button className="text-[#DF0025] cursor-pointer">
                    <Trash2 size={16} />
                  </button>
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
