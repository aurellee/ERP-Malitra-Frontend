"use client"

import React, { useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"  // Adjust path if needed
import { ModeToggle } from "@/components/mode-toggle"     // Adjust path if needed
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import {
  Search,
  Edit,
  Trash,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Calendar,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import SingleDatePicker from "@/components/single-date-picker"

const ITEMS_PER_PAGE = 15

// Example table data
const orderItems = [
  {
    id: "AS8901KL8H",
    name: "Kanvas Rem ABC",
    category: "Campuran",
    price: 1500000,
    quantity: 1,
    discount: 15000,
    finalPrice: 1485000,
  },
  {
    id: "AS8902KL8H",
    name: "Ban ABCY",
    category: "SP Mobil",
    price: 1500000,
    quantity: 2,
    discount: 20000,
    finalPrice: 2960000,
  },
  {
    id: "AS8903KL8H",
    name: "Kanvas Rem ABC",
    category: "SP Motor",
    price: 1200000,
    quantity: 1,
    discount: 10000,
    finalPrice: 1190000,
  },
  {
    id: "AS8904KL8H",
    name: "Aki Spek Extra",
    category: "Aki",
    price: 800000,
    quantity: 1,
    discount: 5000,
    finalPrice: 795000,
  },
  {
    id: "AS8905KL8H",
    name: "Oli Super",
    category: "Oli",
    price: 250000,
    quantity: 1,
    discount: 0,
    finalPrice: 250000,
  },
  {
    id: "AS8906KL8H",
    name: "Kanvas Rem ABC",
    category: "SP Mobil",
    price: 1500000,
    quantity: 1,
    discount: 15000,
    finalPrice: 1485000,
  },
  {
    id: "AS8907KL8H",
    name: "Ban ABCZ",
    category: "SP Mobil",
    price: 1500000,
    quantity: 1,
    discount: 15000,
    finalPrice: 1485000,
  },
  {
    id: "AS8904KL8H",
    name: "Aki Spek Extra",
    category: "Aki",
    price: 800000,
    quantity: 1,
    discount: 5000,
    finalPrice: 795000,
  },
  {
    id: "AS8901KL8H",
    name: "Kanvas Rem ABC",
    category: "Campuran",
    price: 1500000,
    quantity: 1,
    discount: 15000,
    finalPrice: 1485000,
  },
  {
    id: "AS8905KL8H",
    name: "Oli Super",
    category: "Oli",
    price: 250000,
    quantity: 1,
    discount: 0,
    finalPrice: 250000,
  },
  {
    id: "AS8906KL8H",
    name: "Kanvas Rem ABC",
    category: "SP Mobil",
    price: 1500000,
    quantity: 1,
    discount: 15000,
    finalPrice: 1485000,
  },
  {
    id: "AS8907KL8H",
    name: "Ban ABCZ",
    category: "SP Mobil",
    price: 1500000,
    quantity: 1,
    discount: 15000,
    finalPrice: 1485000,
  },
  {

    id: "AS8905KL8H",
    name: "Oli Super",
    category: "Oli",
    price: 250000,
    quantity: 1,
    discount: 0,
    finalPrice: 250000,
  },
  {
    id: "AS8906KL8H",
    name: "Kanvas Rem ABC",
    category: "SP Mobil",
    price: 1500000,
    quantity: 1,
    discount: 15000,
    finalPrice: 1485000,
  },
  {
    id: "AS8907KL8H",
    name: "Ban ABCZ",
    category: "SP Mobil",
    price: 1500000,
    quantity: 1,
    discount: 15000,
    finalPrice: 1485000,
  },
  {

    id: "AS8905KL8H",
    name: "Oli Super",
    category: "Oli",
    price: 250000,
    quantity: 1,
    discount: 0,
    finalPrice: 250000,
  },
  {
    id: "AS8906KL8H",
    name: "Kanvas Rem ABC",
    category: "SP Mobil",
    price: 1500000,
    quantity: 1,
    discount: 15000,
    finalPrice: 1485000,
  },
  {
    id: "AS8907KL8H",
    name: "Ban ABCZ",
    category: "SP Mobil",
    price: 1500000,
    quantity: 1,
    discount: 15000,
    finalPrice: 1485000,
  },
  {
    id: "AS8906KL8H",
    name: "Kanvas Rem ABC",
    category: "SP Mobil",
    price: 1500000,
    quantity: 1,
    discount: 15000,
    finalPrice: 1485000,
  },
]

export default function NewOrderPage() {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)

  // Hitung total item dan total halaman
  const totalItems = orderItems.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  // Fungsi slice data sesuai halaman
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentData = orderItems.slice(startIndex, endIndex)
  const displayedCount = currentData.length

  // Next / Prev page
  function handleNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }
  function handlePrevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // -- Right column states
  const [invoiceDate, setInvoiceDate] = useState("2025-05-25") // or new Date() if you want a date picker
  const [carPlate, setCarPlate] = useState("DB 1137 DG")
  const [sales, setSales] = useState("David Yurman")
  const [mechanic, setMechanic] = useState("Kenzu")
  const [invoiceDiscount, setInvoiceDiscount] = useState(0)

  // Calculate subtotal from left items
  const subTotal = currentData.reduce((sum, item) => sum + item.finalPrice, 0)
  // Final total after subtracting invoice-level discount
  const total = subTotal - invoiceDiscount

  const router = useRouter()

  // Payment dialog states
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Transfer Bank">("Cash")
  const [amountPaid, setAmountPaid] = useState(total)

  function handlePending() {
    // Navigate to pending order page
    router.push("/pendingOrder")
  }

  function handlePayment() {
    // Example: handle saving invoice, or show success message
    console.log("Payment Method:", paymentMethod)
    console.log("Amount Paid:", amountPaid)
    setPaymentOpen(false)
  }

  return (
    <div className="p-8 md:p-8 bg-theme text-theme">
      {/* TOP BAR: Sidebar trigger + Title (left), Dark Mode toggle (right) */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          {/* Page title */}
          <h1 className="text-2xl font-bold">New Order</h1>
        </div>
        <ModeToggle />
      </div>

      {/* MAIN CONTENT: Two-column grid (no breakpoints => always side by side) */}
      <div className="w-full grid gap-6 grid-cols-[2fr_300px]">
        {/* LEFT COLUMN */}
        <div className="flex flex-col h-full">
          {/* Header row: "Order on Process" + search bar */}
          <div className="mt-2 mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold mt-2">Order on Process</h2>
            {/* Search bar */}
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <Input
                type="text"
                placeholder="Scan or Search Item..."
                className="pl-8 pr-3"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="flex-1 min-h-[750px] w-full overflow-x-auto rounded-lg 
          border border-gray-200 bg-theme dark:border-[oklch(1_0_0_/_10%)]">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 dark:bg-[#181818] text-left text-gray-600 h-[60px] dark:text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product ID</th>
                  <th className="px-4 py-3 font-semibold">Product Name</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Quantity</th>
                  <th className="px-4 py-3 font-semibold">Discount</th>
                  <th className="px-4 py-3 font-semibold">Final Price</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:text-white text-gray-700 dark:divide-[oklch(1_0_0_/_10%)]">
                {currentData.map((item, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">{item.id}</td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{item.category}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      Rp {item.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">
                      Rp {item.discount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      Rp {item.finalPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <button className="mr-2 text-blue-600 hover:text-blue-800">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <footer className="mt-2">
            <div className="w-full py-4 text-sm text-gray-600 dark:text-white">
              <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                {/* e.g. "Showing 10 of 20 Items" */}
                <p>
                  Showing {displayedCount} of {totalItems} Items
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 1}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span>
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </footer>
        </div>

        {/* RIGHT COLUMN: Invoice details */}
        <div className="h-[886px] mt-2 bg-theme rounded-md w-full
        border border-gray-200 p-4 dark:border-[oklch(1_0_0_/_10%)]">
          <div className="mt-2 mb-4 w-full flex flex-col items-center justify-between grid grid-cols-2 gap-24">
            <h2 className="text-[20px] font-semibold text-gray-500 dark:text-gray-400">
              Invoice
            </h2>
            <h2 className="text-[20px] font-semibold">
              #220203
            </h2>
          </div>

          {/* Invoice Fields */}
          <div className="space-y-6 text-sm">
            {/* Date */}
            <div className="items-center justify-between">
              {/* <div className="relative rounded-md dark:bg-[#181818] 
                    border border-gray-300 dark:border-[#404040]
                    focus-within:border-gray-400 dark:focus-within:border-[oklch(1_0_0_/_45%)]
                    focus-within:ring-3 focus-within:ring-gray-300 dark:focus-within:ring-[oklch(0.551_0.027_264.364_/_54%)]
                  "> */}
              <label className="block text-sm font-medium mb-1">Date</label>
              <SingleDatePicker />
            </div>
            {/* Car Plate */}
            <div className="flex items-center justify-between">
              <label className="font-medium">Car</label>
              <Input
                type="text"
                value={carPlate}
                onChange={(e) => setCarPlate(e.target.value)}
                className="w-[150px]"
              />
            </div>
            {/* Sales */}
            <div className="flex items-center justify-between">
              <label className="font-medium">Sales</label>
              <select
                value={sales}
                onChange={(e) => setSales(e.target.value)}
                className="border rounded-md px-2 py-1 text-sm"
              >
                <option>David Yurman</option>
                <option>Heru Kenz</option>
                <option>Yudi</option>
              </select>
            </div>
            {/* Mechanic */}
            <div className="flex items-center justify-between">
              <label className="font-medium">Mechanic</label>
              <select
                value={mechanic}
                onChange={(e) => setMechanic(e.target.value)}
                className="border rounded-md px-2 py-1 text-sm"
              >
                <option>Kenzu</option>
                <option>Irwan</option>
                <option>Agus</option>
              </select>
            </div>

            {/* Subtotal & Invoice Discount & Total */}
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>Rp {subTotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-red-600">
              <span>Discount</span>
              <div className="flex items-center gap-2">
                <span>-Rp</span>
                <Input
                  type="number"
                  className="w-[80px]"
                  placeholder="0"
                  // value={invoiceDiscount}
                  onChange={(e) => setInvoiceDiscount(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="mt-1 flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span>Rp {(subTotal - invoiceDiscount).toLocaleString()}</span>
            </div>
          </div>

          {/* Payment & Pending Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* Payment button -> open Payment dialog */}
            <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-[#0456F7] text-white hover:bg-blue-700">
                  Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Choose Payment</DialogTitle>
                  <DialogDescription>Select payment method & amount</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Method</label>
                    <div className="flex gap-4">
                      {/* Example radio buttons */}
                      {/* In real usage, you might do something more dynamic */}
                      <Button variant="outline" /* onClick=... */>Cash</Button>
                      <Button variant="outline" /* onClick=... */>Transfer Bank</Button>
                    </div>
                  </div>
                  {/* Amount Paid */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount Paid</label>
                    <Input placeholder={`Rp ${(subTotal - invoiceDiscount).toLocaleString()}`} />
                  </div>
                </div>
                <DialogFooter className="flex justify-end gap-2">
                  <Button variant="outline">Save Invoice</Button>
                  <Button>Print Invoice</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Pending button -> navigate to /pendingOrder */}
            <Button
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={() => {
                // Example: navigate to pending order
                // or do something else
                window.location.href = "/pendingOrder"
              }}
            >
              Pending
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}