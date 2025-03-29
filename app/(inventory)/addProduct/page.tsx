"use client"

import React, { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Trash, Filter, Search } from "lucide-react"

export default function InventoryPage() {
  // State for controlling the dialog
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
    <div className="min-h-screen bg-theme text-theme border-theme p-6 md:p-8">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Inventory</h1>
        {/* Optional icons on the right, e.g. user profile, notifications, etc. */}
      </div>

      {/* Subheader: All Products, Search, Filter, Add Product */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">All Products (200)</h2>
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          {/* Filter button */}
          <Button variant="outline" className="flex items-center gap-1">
            <Filter size={16} />
            Filter
          </Button>

          {/* + Add Product button (opens dialog) */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>+ Add Product</Button>
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
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Product ID</th>
              <th className="px-4 py-3 font-semibold">Product Name</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Purchase Price</th>
              <th className="px-4 py-3 font-semibold">Sale Price</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {/* Example rows; replace with your actual data */}
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-3">AS00{i}KL8H</td>
                <td className="px-4 py-3">Kanvas Rem ABCDEF</td>
                <td className="px-4 py-3">SpareParts Mobil</td>
                <td className="px-4 py-3">Rp 200.000</td>
                <td className="px-4 py-3">Rp 350.000</td>
                <td className="px-4 py-3">Ready Stock</td>
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

      {/* Pagination / Footer */}
      <div className="mt-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <p className="text-sm text-gray-600">Showing 5 of 1600 Products</p>
        <div className="flex items-center gap-2">
          <Button variant="outline">Prev</Button>
          <span className="text-sm text-gray-600">1 / 320</span>
          <Button variant="outline">Next</Button>
        </div>
      </div>
    </div>
  )
}