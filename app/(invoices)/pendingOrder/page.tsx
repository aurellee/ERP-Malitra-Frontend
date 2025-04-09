"use client"

import React, { useState } from "react"
import { ChevronLeft, ChevronRight, Edit, Edit3, Pencil, PencilLine, Search, Trash, Trash2 } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const ITEMS_PER_PAGE = 10

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

function formatCurrency(value: number): string {
  // Example: "Rp 50.000"
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

interface PendingInvoiceCardProps {
  invoiceNumber: string;
  car: string;
  sales: string;
  mechanic: string;
  itemCount: number;
  isSelected: boolean;
  onSelect: () => void;
}

const PendingInvoiceCard: React.FC<PendingInvoiceCardProps> = ({
  invoiceNumber,
  car,
  sales,
  mechanic,
  itemCount,
  isSelected,
  onSelect,
}) => {
  const handleClick = () => {
    onSelect(); // Parent yang urus seleksi tunggal
  };

  return (
    <div
      className={`pending-invoice-card space-y-2 rounded-lg border border-theme p-6 shadow-sm cursor-pointer h-auto
        ${isSelected ? 'bg-[#0456F7] text-white' : 'bg-theme text-theme'}`}
      onClick={handleClick}
    >
      <p className="font-semibold flex items-center w-full justify-between text-[16px]">
        Invoice
        <span className={`font-bold ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
          #{invoiceNumber}
        </span>
      </p>
      <p className="flex items-center w-full justify-between text-[13px] font-medium">
        Car
        <span className={`${isSelected ? 'text-white' : 'text-theme'}`}>{car}</span>
      </p>
      <p className="flex items-center w-full justify-between text-[13px] font-medium">
        Sales
        <span className={`${isSelected ? 'text-white' : 'text-theme'}`}>{sales}</span>
      </p>
      <p className="flex items-center w-full justify-between text-[13px] font-medium">
        Mechanic
        <span className={`${isSelected ? 'text-white' : 'text-theme'}`}>{mechanic}</span>
      </p>
      <p
        className={`mt-4 text-sm w-full p-1 rounded-md border text-center ${
          isSelected ? 'text-white border-white' : 'text-theme border-[#0456F7]'
        }`}
      >
        {itemCount} Items
      </p>
    </div>
  );
};



export default function PendingOrderPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  const invoices = [
    { id: 1, invoiceNumber: '928203', car: 'DB 1037 DG', sales: 'David Kenau', mechanic: 'Christian Dior', itemCount: 3 },
    { id: 2, invoiceNumber: '928204', car: 'DB 1139 GA', sales: 'David Kenau', mechanic: 'Ralph Lauren', itemCount: 2 },
    { id: 3, invoiceNumber: '928205', car: 'DB 1001 DG', sales: 'David Kenau', mechanic: 'Mauve Lava', itemCount: 5 },
    { id: 4, invoiceNumber: '928206', car: 'DB 2524 DG', sales: 'David Kenau', mechanic: 'Ralph Lauren', itemCount: 7 },
    { id: 5, invoiceNumber: '928207', car: 'DB 1001 DG', sales: 'David Kenau', mechanic: 'Mauve Lava', itemCount: 5 },
    { id: 6, invoiceNumber: '928208', car: 'DB 2524 DG', sales: 'David Kenau', mechanic: 'Ralph Lauren', itemCount: 7 },
    { id: 7, invoiceNumber: '928209', car: 'DB 1139 GA', sales: 'David Kenau', mechanic: 'Ralph Lauren', itemCount: 12 },
  ];

  // Fungsi untuk menangani pemilihan card
  const handleSelectInvoice = (invoiceNumber: string) => {
    if (selectedInvoice === invoiceNumber) {
      setSelectedInvoice(null); // Deselect jika card yang sama diklik lagi
    } else {
      setSelectedInvoice(invoiceNumber); // Select card baru
    }
  };

  // Filter daftar invoice berdasarkan search term
  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Discount State
  const [subtotal, setSubtotal] = useState(18370000);
  const [discount, setDiscount] = useState(50000); // numeric value
  const [total, setTotal] = useState(subtotal - discount);

  // For the discount input
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-digits
    const cleaned = e.target.value.replace(/\D/g, "");
    const numericVal = cleaned ? parseInt(cleaned, 10) : 0;

    setDiscount(numericVal);
    setTotal(subtotal - numericVal);
  };

  // Display string for discount
  const discountDisplay = discount ? formatCurrency(discount) : "Rp 0";

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
          <h1 className="text-2xl font-bold">Pending Order</h1>
        </div>
        <ModeToggle />
      </div>


      {/* MAIN CONTENT: 2-column grid (left: invoice details, right: pending orders) */}
      <div className="w-full grid gap-6 grid-cols-[2fr_280px]">


        {/* LEFT COLUMN: Table + Subtotal/Discount/Total + Action Buttons */}
        <div className="flex flex-col h-full">
          <div className="mt-2 mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold mt-2">
              Invoice<span className="ml-4 text-gray-500">#928203</span>
            </h1>
          </div>

          {/* TABLE */}
          <div className="min-h-[540px] w-full overflow-x-auto rounded-lg 
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:text-white text-gray-700 dark:divide-[oklch(1_0_0_/_10%)]">
                {currentData.map((item, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">{item.id}</td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="w-[76px] dark:bg-[#404040] text-[12px}">{item.category}</Badge>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <footer className="mt-3">
            <div className="w-full py-2 text-sm text-gray-600 dark:text-white">
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

            {/* Car Plate Row */}
            <div className="mt-3 flex w-full grid grid-cols-2 gap-6 justify-between">
              <div className="w-full p-6 space-y-5 rounded-lg shadow-sm border border-theme bg-theme justify-center items-center">
                {/* Subtotal row */}
                <div className="flex items-center w-full justify-between text-sm">
                  <span>Car</span>
                  <span>DB 1137 DG</span>
                </div>

                {/* Sales row */}
                <div className="flex items-center w-full justify-between text-sm">
                  <span>Sales</span>
                  <span>David Yurman</span>
                </div>

                {/* Mechanic row */}
                <div className="flex items-center w-full justify-between text-sm">
                  <span>Mechanic</span>
                  <span>Kenzu Lauren</span>
                </div>
              </div>

              <div className="w-full p-6 space-y-3 rounded-lg shadow-sm border border-theme bg-theme text-right">
                {/* Subtotal row */}
                <div className="flex items-center w-full justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                {/* Discount row */}
                <div className="mt-2 flex w-full items-center justify-between text-sm text-red-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>

                {/* Dashed divider */}
                <hr className=" border-dashed border-theme" />

                {/* Total row */}
                <div className="flex w-full items-center justify-between text-md font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>



            {/* ACTION BUTTONS: DELETE, EDIT, PAYMENT */}
            <div className="mt-8 flex flex-wrap items-center gap-3 w-full grid grid-cols-3">
              <button className="rounded-[80px] bg-[#DD0004] px-4 py-2 text-white h-[40px] hover:bg-[#BA0003]">
                Delete
              </button>
              <button className="flex items-center justify-center gap-3 rounded-[80px] bg-theme px-4 py-2 text-theme border shadow-sm border-theme dark:border-gray-500 hover:opacity-90 h-[40px]">
                <PencilLine size={16} />
                Edit
              </button>
              <button className="rounded-[80px] bg-[#0456F7] px-4 py-2 text-white hover:opacity-90 hover:bg-blue-700">
                Payment
              </button>
            </div>
          </footer>
        </div>


        {/* RIGHT COLUMN: PENDING ORDER LIST */}
        <div className="flex flex-col h-full">
          <div className="mt-2 mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold mt-2">
              Pending Order<span className="ml-4 text-gray-500">(7)</span>
            </h1>
          </div>
          {/* Search input */}
      <div className="relative w-full max-w-xs mb-4 items-center">
        <input
          type="text"
          placeholder="Search Pending Invoice..."
          className="pl-8 pr-3 w-full border rounded-md py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
          {/* Icon search */}
        </span>
      </div>
      <div className="overflow-y-auto max-h-196">
        <div className="space-y-4">
          {filteredInvoices.map((invoice, index) => (
            <PendingInvoiceCard
              key={index}
              invoiceNumber={invoice.invoiceNumber}
              car={invoice.car}
              sales={invoice.sales}
              mechanic={invoice.mechanic}
              itemCount={invoice.itemCount}
              isSelected={selectedInvoice === invoice.invoiceNumber}
              onSelect={() => handleSelectInvoice(invoice.invoiceNumber)}
            />
          ))}
        </div>
      </div>
        </div>
      </div>
    </div>
  )
}