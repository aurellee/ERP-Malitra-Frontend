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
  Edit2,
  Trash2,
  Pencil,
  Divide,
  Edit3,
  LucideEdit3,
  PencilLine,
  LucideTrash2,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import SingleDatePicker from "@/components/single-date-picker"
import { categoryColors } from "@/utils/categoryColors"

const ITEMS_PER_PAGE = 13

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
    category: "SpareParts Mobil",
    price: 1500000,
    quantity: 1,
    discount: 15000,
    finalPrice: 1485000,
  },
]

function formatRupiah(value: number): string {
  return "Rp " + new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(value)
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(value)
}

function getPaymentButtonClasses(
  currentMethod: "Cash" | "Transfer Bank" | "Unpaid" | "",
  buttonMethod: "Cash" | "Transfer Bank" | "Unpaid"
) {
  if (currentMethod !== buttonMethod) {
    // Not selected => show an outline style (or whatever "unselected" style you want)
    return "border border-gray-300 text-theme bg-theme hover:bg-gray-100 dark:border-[oklch(1_0_0_/_10%)] dark:hover:bg-[oklch(1_0_0_/_10%)] rounded-[80px]"
  }

  // If this button is the selected method, pick a color
  switch (buttonMethod) {
    case "Cash":
    case "Transfer Bank":
      // For both Cash & Transfer Bank => use blue
      return "bg-blue-600 text-white hover:bg-blue-700 rounded-[80px]"
    case "Unpaid":
      // For Unpaid => use red
      return "bg-red-600 text-white hover:bg-red-700 rounded-[80px]"
    default:
      return ""
  }
}

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
  const [carPlate, setCarPlate] = useState("DB 1137 DG")
  const [sales, setSales] = useState("")
  const [mechanic, setMechanic] = useState("")
  const [invoiceDiscount, setInvoiceDiscount] = useState<number>(0)
  // raw numeric value (null means nothing typed yet)
  const [rawDiscount, setRawDiscount] = useState<number | null>(null)
  // display string for the input
  const [displayValue, setDisplayValue] = useState<string>("")

  // When the user types, we update the raw value and the display value (unformatted)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "") // remove non-digits
    if (!cleaned) {
      // if user cleared input or typed invalid chars, revert to empty
      setRawDiscount(null)
      setDisplayValue("")
    } else {
      const num = parseInt(cleaned, 10)
      setRawDiscount(num)
      setDisplayValue(formatNumber(num)) // e.g. "50.000"
    }
  }

  // Calculate subtotal from left items
  const subTotal = currentData.reduce((sum, item) => sum + item.finalPrice, 0)
  // Final total after subtracting invoice-level discount
  const total = subTotal - invoiceDiscount

  const router = useRouter()

  const [dialogOpen, setDialogOpen] = useState(false)

  // Payment dialog states
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Transfer Bank" | "Unpaid" | "">("")

  // For amount paid, we store both the raw number and its display string.
  const [rawAmountPaid, setRawAmountPaid] = useState<number>(0)
  const [displayAmountPaid, setDisplayAmountPaid] = useState<string>("")

  // Ensure that when the user types, we always update the display with formatted value.
  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digit characters.
    const cleaned = e.target.value.replace(/\D/g, "")
    const num = cleaned ? parseInt(cleaned, 10) : 0
    setRawAmountPaid(num)
    // Always update the display with the formatted string.
    setDisplayAmountPaid(formatRupiah(num))
  }

  // Form is valid if:
  // - Payment method is "Unpaid" OR
  // - Payment method is "Cash" or "Transfer Bank" AND rawAmountPaid > 0.
  const isFormValid =
    paymentMethod === "Unpaid" ||
    ((paymentMethod === "Cash" || paymentMethod === "Transfer Bank") && rawAmountPaid > 0)

  // Prevent dialog closing with ESC or outside clicks.

  function handleSave() {
    if (!isFormValid) return
    // Save invoice logic here.
    console.log("Payment Method:", paymentMethod)
    console.log("Amount Paid:", rawAmountPaid)
    setDialogOpen(false)
    setPaymentMethod("")
    setRawAmountPaid(0)
    setDisplayAmountPaid("")
  }

  function handleCancel() {
    setDialogOpen(false)
    setPaymentMethod("")
    setRawAmountPaid(0)
    setDisplayAmountPaid("")
  }

  function handlePending() {
    // Navigate to pending order page
    router.push("/pendingOrder")
  }

  return (
    <div className="p-8 md:p-8 bg-white dark:bg-[#000] text-theme min-h-screen flex flex-col">
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
      <div className="w-full grid gap-6 grid-cols-[2fr_300px] h-full">
        {/* LEFT COLUMN */}
        <div className="flex flex-col h-full">
          {/* Header row: "Order on Process" + search bar */}
          <div className="mt-2 mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold mt-2">Order on Process</h2>
            {/* Search bar */}
            <div className="flex gap-2">
              <div className="relative w-full flex justify-between items-center">
                <Input
                  type="text"
                  placeholder="Scan or Search Item..."
                  className="w-80 px-4 rounded-md 
                  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                  dark:focus:border-blue-400 dark:focus:ring-blue-400 
                  transition"
                />
                {/* <Search className="text-gray-500" size={18} /> */}
              </div>
              <div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full rounded-[8px] bg-[#0456F7] text-white hover:bg-[#0348CF]"
                      onClick={() => setDialogOpen(true)}>
                      Search
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm p-8 md:p-8 rounded-[32px] [&>button]:hidden"
                    onEscapeKeyDown={(e) => e.preventDefault()}
                    onPointerDownOutside={(e) => e.preventDefault()}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-[25px] text-theme">Product</DialogTitle>
                      <DialogDescription className="text-[16px]">
                        Select payment method &amp; amount
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-8">
                      {/* Payment Method */}
                      <div>
                        <label className="mt-4 block text-md font-medium mb-4 text-theme">Payment Method</label>

                        <div className="flex gap-2 w-full grid grid-cols-[128px_1fr_128px] text-theme">
                          <Button
                            className={getPaymentButtonClasses(paymentMethod, "Cash")}
                            onClick={() => setPaymentMethod("Cash")}
                          >
                            Cash
                          </Button>

                          <Button
                            className={getPaymentButtonClasses(paymentMethod, "Transfer Bank")}
                            onClick={() => setPaymentMethod("Transfer Bank")}
                          >
                            Transfer Bank
                          </Button>

                          <Button
                            className={getPaymentButtonClasses(paymentMethod, "Unpaid")}
                            onClick={() => setPaymentMethod("Unpaid")}
                          >
                            Unpaid
                          </Button>
                        </div>
                      </div>

                      {/* Amount Paid */}
                      <div>
                        <label className="mt-4 block text-md font-medium mb-4 text-theme">Amount Paid</label>
                        <Input
                          type="text"
                          disabled={paymentMethod === "Unpaid"} // disabled if Unpaid
                          className="text-right text-theme"
                          placeholder="Rp 0"
                          style={{ fontSize: "19px" }}
                          value={displayAmountPaid}
                          onChange={handleAmountPaidChange}
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-4 flex justify-between gap-4 w-full grid grid-cols-2">
                      <Button variant="outline" className="h-[40px] rounded-[80px] text-theme" onClick={handleCancel}>Cancel</Button>
                      <Button disabled={!isFormValid} onClick={handleSave}
                        className="h-[40px] bg-[#0456F7] text-white hover:bg-[#0348CF] rounded-[80px]">Save Invoice</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="w-full flex overflow-x-auto rounded-lg 
          border border-gray-200 bg-theme dark:border-[oklch(1_0_0_/_10%)]">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-[#F1F1F1] dark:bg-[#181818] text-left text-gray-600 h-[50px] dark:text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product ID</th>
                  <th className="px-4 py-3 font-semibold">Product Name</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Quantity</th>
                  <th className="px-4 py-3 font-semibold">Discount</th>
                  <th className="px-4 py-3 font-semibold">Final Price</th>
                  <th className="px-4 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:text-white text-gray-700 dark:divide-[oklch(1_0_0_/_10%)]">
                {currentData.map((item, i) => {
                  const colorClass = categoryColors[item.category] || "bg-gray-100 text-gray-600"
                  return (
                    <tr key={i}>
                      <td className="px-4 py-3">{item.id}</td>
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-2 w-[140px] h-14">
                        <span
                          className={`inline-block w-full h-[32px] px-3 py-1.5 text-center rounded-full text-[13px] font-medium ${colorClass}`}
                        >
                          {item.category}
                        </span>
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
                      <td className="px-5 py-3">
                        <button className="mr-2 text-[#0456F7] cursor-pointer">
                          <PencilLine size={16} />
                        </button>
                        <button className="text-[#DF0025] cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <footer className="mt-auto">
            <div className="w-full text-sm text-gray-600 dark:text-white">
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
        <div className="h-[900px] mt-2 bg-theme rounded-lg w-full
        border border-gray-200 p-4 dark:border-[oklch(1_0_0_/_10%)] px-6">
          <div className="mt-4 mb-8 w-full flex items-center justify-between">
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
              <label className="block text-sm font-medium mb-2">Date</label>
              <SingleDatePicker />
            </div>
            {/* Car Plate */}
            <div className="items-center justify-between">
              <label className="block text-sm font-medium mb-2">Car</label>
              <Input
                type="text"
                // value={carPlate}
                placeholder="DB XXXX AA"
                onChange={(e) => setCarPlate(e.target.value)}
                className="w-full dark:bg-[#121212] h-[40px] dark:hover:bg-[#191919] hover:bg-[oklch(0.278_0.033_256.848_/_5%)]"
              />
            </div>
            {/* Sales */}
            <div className="items-center justify-between">
              <label className="block text-sm font-medium mb-2">Sales</label>
              <div className="relative">
                <select
                  value={sales}
                  onChange={(e) => setSales(e.target.value)}
                  aria-placeholder="Choose The Mechanic"
                  className={`w-full dark:hover:bg-[#191919] hover:bg-[oklch(0.278_0.033_256.848_/_5%)] h-[40px] dark:bg-[#121212] appearance-none rounded-lg border px-4 text-sm focus:outline-none 
                    ${!sales ? "text-gray-500 dark:text-gray-400" : "text-black dark:text-white"
                    }`}
                >
                  <option value="">Choose The Sales person</option>
                  <option value="David Yurman">David Yurman</option>
                  <option value="Heru Kenz">Heru Kenz</option>
                  <option value="Christian Dior">Christian Dior</option>
                  <option value="Ralph Laura">Ralph Laura</option>
                  <option value="Priscilla Key">Priscilla Key</option>
                  <option value="Can Gong">Can Gong</option>
                  <option value="Caramel Van">Caramel Van</option>
                  <option value="Kakao Page">Kakao Page</option>
                  <option value="Choco Lazaro">Choco Lazaro</option>
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>
            {/* Mechanic */}
            <div>
              <label className="block text-sm font-medium mb-2">Mechanic</label>
              <div className="relative">
                <select
                  value={mechanic}
                  onChange={(e) => setMechanic(e.target.value)}
                  aria-placeholder="Choose The Mechanic"
                  className={`w-full dark:hover:bg-[#191919] hover:bg-[oklch(0.278_0.033_256.848_/_5%)] h-[40px] dark:bg-[#121212] appearance-none rounded-lg border px-4 text-sm focus:outline-none 
                    ${!mechanic ? "text-gray-500 dark:text-gray-400" : "text-black dark:text-white"
                    }`}
                >
                  <option value="">Choose The Mechanic</option>
                  <option value="Kenzu Ralph">Kenzu Ralph</option>
                  <option value="Irwan Laurent">Irwan Laurent</option>
                  <option value="Stella Jang">Stella Jang</option>
                  <option value="Christian Dior">Christian Dior</option>
                  <option value="Ralph Laura">Ralph Laura</option>
                  <option value="Priscilla Key">Priscilla Key</option>
                  <option value="Can Gong">Can Gong</option>
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>

            {/* Subtotal & Invoice Discount & Total */}
            <div className="mt-16 flex items-center text-[15px] justify-between">
              <span className="block font-regular">Subtotal</span>
              <span className="font-medium">{formatRupiah(subTotal)}</span>
            </div>

            <div className="mt-8 flex items-center justify-between text-red-600 block text-[15px] font-regular">
              <span>Discount</span>
              <div className="flex items-center font-medium gap-2">
                <span>-Rp</span>
                <Input
                  type="text"
                  value={displayValue ? displayValue : ""}
                  onChange={handleChange}
                  className="w-[94px] text-md text-red-600 text-right"
                  placeholder="0"
                />
              </div>
            </div>

            {/* The dashed line */}
            {/* <hr className="w-full border-t-4 border-dashed border-gray-300 my-4" /> */}
            <svg className="w-full my-8 mt-10 justify-between items-center" style={{ height: "1px" }} viewBox="0 0 100 2" preserveAspectRatio="none">
              <line x1="0" y1="1" x2="100" y2="1" stroke="gray" strokeWidth="8" strokeDasharray="6,3.5" />
            </svg>

            <div className="flex items-center justify-between text-[19px] font-medium">
              <span>Total</span>
              <span>{formatRupiah(subTotal - invoiceDiscount)}</span>
            </div>
          </div>


          {/* Payment & Pending Buttons */}
          <div className="mt-16 flex flex-wrap items-center justify-between gap-4">
            {/* Payment button -> open Payment dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full rounded-[80px] bg-[#0456F7] text-white hover:bg-[#0348CF] h-[40px]"
                  onClick={() => setDialogOpen(true)}>
                  Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm p-8 md:p-8 rounded-[32px] [&>button]:hidden"
                onEscapeKeyDown={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle className="text-[25px] text-theme">Choose Payment</DialogTitle>
                  <DialogDescription className="text-[16px]">
                    Select payment method &amp; amount
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-8">
                  {/* Payment Method */}
                  <div>
                    <label className="mt-4 block text-md font-medium mb-4 text-theme">Payment Method</label>

                    <div className="flex gap-2 w-full grid grid-cols-[128px_1fr_128px] text-theme">
                      <Button
                        className={getPaymentButtonClasses(paymentMethod, "Cash")}
                        onClick={() => setPaymentMethod("Cash")}
                      >
                        Cash
                      </Button>

                      <Button
                        className={getPaymentButtonClasses(paymentMethod, "Transfer Bank")}
                        onClick={() => setPaymentMethod("Transfer Bank")}
                      >
                        Transfer Bank
                      </Button>

                      <Button
                        className={getPaymentButtonClasses(paymentMethod, "Unpaid")}
                        onClick={() => setPaymentMethod("Unpaid")}
                      >
                        Unpaid
                      </Button>
                    </div>
                  </div>

                  {/* Amount Paid */}
                  <div>
                    <label className="mt-4 block text-md font-medium mb-4 text-theme">Amount Paid</label>
                    <Input
                      type="text"
                      disabled={paymentMethod === "Unpaid"} // disabled if Unpaid
                      className="text-right text-theme"
                      placeholder="Rp 0"
                      style={{ fontSize: "19px" }}
                      value={displayAmountPaid}
                      onChange={handleAmountPaidChange}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-4 flex justify-between gap-4 w-full grid grid-cols-2">
                  <Button variant="outline" className="h-[40px] rounded-[80px] text-theme" onClick={handleCancel}>Cancel</Button>
                  <Button disabled={!isFormValid} onClick={handleSave}
                    className="h-[40px] bg-[#0456F7] text-white hover:bg-[#0348CF] rounded-[80px]">Save Invoice</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Pending button -> navigate to /pendingOrder */}
            <Button
              variant="outline"
              className="w-full rounded-[80px] border-gray-300 text-gray-500 
              hover:text-gray-500 dark:bg-[#181818] dark:hover:bg-[#121212] h-[40px]"
              onClick={() => {
                router.push(
                  `/pendingOrder`
                )
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