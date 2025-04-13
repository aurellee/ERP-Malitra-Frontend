"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { categoryColors } from "@/utils/categoryColors"
import { Input } from "@/components/ui/input"
import {
  AlignVerticalJustifyCenter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Filter,
  Link as LucideLink,
  PencilLine,
  Search,
  Trash,
  Trash2,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Separator } from "@/components/ui/separator"

// Helper: format number menjadi rupiah (e.g. Rp 1.000, Rp 20.000, dsb.)
function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value)
}

// 6 kategori: Oli, SpareParts Mobil, SpareParts Motor, Aki, Ban, Campuran
const categories = ["Oli", "SpareParts Mobil", "SpareParts Motor", "Aki", "Ban", "Campuran"]

// Buat 48 produk unik
const inventoryData = Array.from({ length: 48 }, (_, i) => ({
  productID: `AS${i.toString().padStart(3, "0")}XYZ`,
  productName: `Product ${i}`,
  category: categories[i % categories.length],
  quantity: 500 + i,
  purchasePrice: 200000 + i * 1000,
  salePrice: 250000 + i * 1000,
  status: "Ready Stock",
}))

// Berapa baris per halaman
const ITEMS_PER_PAGE = 13

export default function InventoryPage() {
  const [isOpen, setIsOpen] = useState(false)

  // State form "Add Product"
  const [productID, setProductID] = useState("")
  const [productName, setProductName] = useState("")
  const [category, setCategory] = useState("")
  const [quantity, setQuantity] = useState<number>(0)
  const [purchasePrice, setPurchasePrice] = useState<number>(0)
  const [salePrice, setSalePrice] = useState<number>(0)

  // Definisikan validitas form
  const isFormValid =
    productID.trim() !== "" &&
    productName.trim() !== "" &&
    category.trim() !== "" &&
    quantity > 0 &&
    purchasePrice > 0 &&
    salePrice > 0

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)

  // Total item = 48
  const totalItems = inventoryData.length
  // Total halaman = 48 / 16 = 3
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  // Hitung slice data
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = inventoryData.slice(startIndex, endIndex)
  const displayedCount = currentItems.length

  const onDialogOpenChange = (open: boolean) => {
    // Jika open true, izinkan
    if (open) {
      setIsOpen(true)
    }
    // Jika open false (misalnya klik di luar), abaikan agar dialog tetap terbuka.
  }

  function handlePurchaseChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Ambil semua digit, hilangkan non-digit
    const rawValue = e.target.value.replace(/\D/g, "")
    // Ubah ke number (jika kosong, jadikan 0)
    const numericValue = rawValue ? parseInt(rawValue, 10) : 0
    setPurchasePrice(numericValue)
  }

  function handleSaleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = e.target.value.replace(/\D/g, "")
    const numericValue = rawValue ? parseInt(rawValue, 10) : 0
    setSalePrice(numericValue)
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

  // Handle form submission (placeholder)
  const handleAddProduct = () => {
    // Contoh: post ke API
    console.log("Adding product:", {
      productID,
      productName,
      category,
      quantity,
      purchasePrice,
      salePrice,
    })
    // Reset form
    setProductID("")
    setProductName("")
    setCategory("")
    setQuantity(0)
    setPurchasePrice(0)
    setSalePrice(0)
    setIsOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col p-8 bg-white dark:bg-[#000] text-theme">
      {/* TOP BAR */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-2xl font-bold">Inventory</h1>
        </div>
        <ModeToggle />
      </div>

      {/* SUBHEADER: All Products, Search, Filter, +Add Product */}
      <div className="mt-2 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold mt-2">
          All Products ({totalItems})
        </h1>
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative flex items-center gap-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <Input type="text" placeholder="Search..." className="pl-9 pr-5" />
          </div>

          {/* Filter */}
          <Button variant="outline" className="flex items-center gap-1">
            <Filter size={16} />
            Filter
          </Button>

          {/* +Add Product */}
          <Dialog open={isOpen} onOpenChange={onDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="bg-[#0456F7] text-white hover:bg-blue-700">
                + Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg text-theme [&>button]:hidden">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Add new product by filling the information below
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2 space-y-2">
                {/* Product ID */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product ID
                  </label>
                  <Input
                    placeholder="Scan the barcode to detect the Product ID"
                    value={productID}
                    onChange={(e) => setProductID(e.target.value)}
                  />
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product Name
                  </label>
                  <Input
                    placeholder="Input item name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <div className="relative rounded-md dark:bg-[#181818] 
                    border border-gray-300 dark:border-[#404040]
                    focus-within:border-gray-400 dark:focus-within:border-[oklch(1_0_0_/_45%)]
                    focus-within:ring-3 focus-within:ring-gray-300 dark:focus-within:ring-[oklch(0.551_0.027_264.364_/_54%)]
                  ">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full dark:text-theme appearance-none bg-transparent px-4 py-2 pr-10 text-sm 
                        focus:outline-none ${!category ? "text-gray-500 dark:text-gray-400" : "text-black dark:text-white"
                        }`}
                    >
                      <option value="">Choose Item Category</option>
                      <option value="SpareParts Mobil">SpareParts Mobil</option>
                      <option value="SpareParts Motor">SpareParts Motor</option>
                      <option value="Oli">Oli</option>
                      <option value="Ban">Ban</option>
                      <option value="Aki">Aki</option>
                      <option value="Campuran">Campuran</option>
                    </select>
                    {/* Icon arrow di kanan */}
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <div className="flex items-center gap-2 grid grid-cols-[40px_5fr_40px]">
                    <Button
                      variant="outline"
                      onClick={() => setQuantity(Math.max(0, quantity - 1))}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0
                        setQuantity(Math.max(val, 0))
                      }}
                      className="w-full text-center appearance-none"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Purchase Price */}
                <div>
                  <label className="block text-sm font-medium mb-1">Purchase Price</label>
                  <input
                    type="text"
                    className="w-full rounded-md dark:bg-[#181818]
                    border border-gray-300 dark:border-[#404040]
                    px-3 py-2 
                    focus:outline-none focus-within:border-gray-400 dark:focus-within:border-[oklch(1_0_0_/_45%)] 
                    focus-within:ring-3 focus-within:ring-gray-300 dark:focus-within:ring-[oklch(0.551_0.027_264.364_/_54%)]"
                    value={purchasePrice ? formatRupiah(purchasePrice) : ""}
                    onChange={handlePurchaseChange}
                    placeholder="Rp 0"
                  />
                </div>

                {/* Sale Price */}
                <div>
                  <label className="block text-sm font-medium mb-1">Sale Price</label>
                  <input
                    type="text"
                    className="w-full rounded-md dark:bg-[#181818]
                    border border-gray-300 dark:border-[#404040]
                    px-3 py-2 
                    focus:outline-none focus-within:border-gray-400 dark:focus-within:border-[oklch(1_0_0_/_45%)]
                    focus-within:ring-3 focus-within:ring-gray-300 dark:focus-within:ring-[oklch(0.551_0.027_264.364_/_54%)]"
                    value={salePrice ? formatRupiah(salePrice) : ""}
                    onChange={handleSaleChange}
                    placeholder="Rp 0"
                  />
                </div>
              </div>

              <DialogFooter className="grid grid-cols-2">
                <Button variant="outline" className="rounded-[80px]"
                onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddProduct}
                  className="bg-[#0456F7] text-white hover:bg-[#0348CF] rounded-[80px]"
                  disabled={!isFormValid}
                >
                  Add Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-[oklch(1_0_0_/_10%)] bg-theme text-theme  text-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#F1F1F1] text-left text-gray-600 dark:bg-[#181818] dark:text-gray-400">
            <tr>
              <th className="px-4 py-4 font-semibold">Product ID</th>
              <th className="px-4 py-3 font-semibold">Product Name</th>
              <th className="px-2 py-3 font-semibold">Category</th>
              <th className="px-14 py-3 font-semibold">Quantity</th>
              <th className="px-4 py-3 font-semibold">Purchase Price</th>
              <th className="px-4 py-3 font-semibold">Sale Price</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-[oklch(1_0_0_/_10%)] text-theme">
            {currentItems.map((item, i) => {
              const colorClass = categoryColors[item.category] || "bg-gray-100 text-gray-600"
              return (
                <tr key={i}>
                  <td className="px-4 py-3">{item.productID}</td>
                  <td className="px-4 py-3">{item.productName}</td>
                  {/* <td className="px-4 py-3">{item.category}</td> */}
                  <td className="px-2 py-3 w-[160px] h-14">
                    <span
                      className={`inline-block w-full h-full px-3 py-1.5 text-center rounded-full text-sm font-medium ${colorClass}`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="px-14 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">Rp {item.purchasePrice.toLocaleString()}</td>
                  <td className="px-4 py-3">Rp {item.salePrice.toLocaleString()}</td>
                  <td className="px-4 py-3">{item.status}</td>
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

      {/* FOOTER PAGINATION */}
      <footer className="mt-auto w-full text-sm text-gray-600 dark:text-white">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          {/* e.g. "Showing 16 of 48 Products" */}
          <p>Showing {displayedCount} of {totalItems} Products</p>
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
