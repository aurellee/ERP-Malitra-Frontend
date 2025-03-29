"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Edit, Filter, Link, Search, Trash } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Separator } from "@/components/ui/separator"

export default function InventoryPage() {
  const [isOpen, setIsOpen] = useState(false)

  // Form fields for the new product
  const [productID, setProductID] = useState("")
  const [productName, setProductName] = useState("")
  const [category, setCategory] = useState("")
  const [quantity, setQuantity] = useState<number>(0)
  const [purchasePrice, setPurchasePrice] = useState<number>(0)
  const [salePrice, setSalePrice] = useState<number>(0)

  // Handle form submission (placeholder)
  const handleAddProduct = () => {
    // Example: send data to your API
    // fetch("/api/products", { method: "POST", body: JSON.stringify({ productID, productName, ... }) })
    console.log("Adding product:", { productID, productName, category, quantity, purchasePrice, salePrice })
    // Clear form & close dialog
    setProductID("")
    setProductName("")
    setCategory("")
    setQuantity(0)
    setPurchasePrice(0)
    setSalePrice(0)
    setIsOpen(false)
  }

  return (

    <div className="min-h-screen flex flex-col p-4 md:p-6">
      {/* TOP BAR: Sidebar trigger + Title (left), Dark mode toggle (right) */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Sidebar trigger on the left */}
          {/* <SidebarTrigger /> */}
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          {/* Page title */}
          <h1 className="text-2xl font-bold">Inventory</h1>
        </div>

        {/* Dark mode toggle on the right */}
        <ModeToggle />
      </div>
      {/* MAIN CONTENT */}
      <main className="flex-1 py-2 md:px-1 md:py-4">
        {/* Title & Filter/Add Buttons */}
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <h2 className="text-xl font-semibold">All Products (200)</h2>
          <div className="flex items-center gap-2">

            <Button variant="outline">
              <Search className="[p;-8 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search..."
              // className="pl-8 pr-2 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </Button>

            <Button variant="outline">
              <Filter size={16} />
              Filter
            </Button>

            {/* + Add Product button (opens dialog) */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-md bg-[#0456F7] dark:bg-[#0456F7] dark:text-white px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  + Add Product
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Add new product by filling the information below
                  </DialogDescription>
                </DialogHeader>

                {/* Pop-up Form */}
                <div className="grid gap-4 py-2">
                  {/* Product ID */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Product ID</label>
                    <Input
                      placeholder="Scan the barcode to detect the Product ID"
                      value={productID}
                      onChange={(e) => setProductID(e.target.value)}
                    />
                  </div>

                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name</label>
                    <Input
                      placeholder="Input item name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Choose Item Category</option>
                      <option value="SpareParts Mobil">SpareParts Mobil</option>
                      <option value="SpareParts Motor">SpareParts Motor</option>
                      <option value="Oli">Oli</option>
                      <option value="Ban">Ban</option>
                      <option value="Aki">Aki</option>
                      <option value="Campuran">Campuran</option>
                    </select>
                  </div>

                  {/* Quantity with +/- buttons */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Quantity</label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => setQuantity(Math.max(0, quantity - 1))}>
                        -
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-16 text-center"
                      />
                      <Button variant="outline" onClick={() => setQuantity(quantity + 1)}>
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Purchase Price */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Purchase Price</label>
                    <Input
                      type="number"
                      placeholder="Rp 0"
                      value={purchasePrice || ""}
                      onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    />
                  </div>

                  {/* Sale Price */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Sale Price</label>
                    <Input
                      type="number"
                      placeholder="Rp 0"
                      value={salePrice || ""}
                      onChange={(e) => setSalePrice(Number(e.target.value))}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProduct}>
                    Add Product
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* TABLE */}
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white dark:bg-[#121212] dark:border-gray-700">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50 dark:bg-[#181818] text-left">
              <tr className="text-gray-600 dark:text-gray-300">
                <th className="px-4 py-3 font-semibold">Product ID</th>
                <th className="px-4 py-3 font-semibold">Product Name</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Quantity</th>
                <th className="px-4 py-3 font-semibold">Purchase Price</th>
                <th className="px-4 py-3 font-semibold">Sale Price</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-200">
              {/* Example rows; replace with .map() for dynamic data */}
              {Array.from({ length: 9 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3">AS890JKBH{i}</td>
                  <td className="px-4 py-3">Kanvas Rem ABCDEF</td>
                  <td className="px-4 py-3">SpareParts Mobil</td>
                  <td className="px-4 py-3">550</td>
                  <td className="px-4 py-3">Rp 200.000</td>
                  <td className="px-4 py-3">Rp 350.000</td>
                  <td className="px-4 py-3">Ready Stock</td>
                  <td className="px-4 py-3">
                    {/* Edit & Trash icons */}
                    <button className="mr-3 text-gray-600 hover:text-gray-400">
                      <Edit size={16} />
                    </button>
                    <button className=" text-red-700 hover:text-red-500">
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto w-full bg-white dark:bg-[#121212] py-4 text-sm text-gray-600 dark:text-gray-200 ">
        {/* border-t border-gray-200 dark:border-gray-700 */}
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <p>Showing 9 of 1600 Products</p>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <span>1 / 120</span>
            <Button variant="outline">
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}