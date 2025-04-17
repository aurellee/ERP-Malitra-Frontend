"use client"

import { useState, useEffect, useRef } from "react";
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
import productApi from "@/api/productApi";

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

// Berapa baris per halaman
const ITEMS_PER_PAGE = 3

export default function InventoryPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)
  const [dialogEditOpen, setDialogEditOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // use this to know which record we're editing
  const [editIndex, setEditIndex] = useState<number | null>(null)


  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchProducts(); // Fetch ulang kalau kembali ke halaman ini
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productApi().viewAllProducts();
      if (response.status === 200) {
        setProducts(response.data);
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
    productID: "",
    productName: "",
    category: "",
    quantity: 0,
    purchasePrice: 0,
    salePrice: 0,
    brandName: "",
  })

  const handleEditClick = (product: any, idx: number) => {
    setEditIndex(idx)
    setForm({
      productID: product.product_id,
      productName: product.product_name,
      brandName: product.brand_name,
      category: product.category,
      quantity: product.product_quantity,
      purchasePrice: product.purchase_price,
      salePrice: product.sale_price,
    })
    setDialogEditOpen(true)
  }

  // PUT updated payload back to your API
  const handleUpdateProduct = async () => {
    try {
      const payload = {
        product_id: form.productID,
        product_name: form.productName,
        brand_name: form.brandName,
        category: form.category,
        product_quantity: form.quantity,
        purchase_price: form.purchasePrice,
        sale_price: form.salePrice,
      }

      const res = await productApi().updateProduct(payload)
      if (res.error) throw new Error(res.error)
      // success! re‑fetch and close
      await fetchProducts()
      setDialogEditOpen(false)
      setEditIndex(null)
    } catch (err) {
      console.error("Update failed:", err)
    }
  }

  const resetForm = () => {
    setForm({
      productID: "",
      productName: "",
      category: "",
      quantity: 0,
      purchasePrice: 0,
      salePrice: 0,
      brandName: "",
    })
  }

  const isFormValid =
    form.productID.trim() !== "" &&
    form.productName.trim() !== "" &&
    form.category.trim() !== "" &&
    form.brandName.trim() !== "" &&
    form.quantity > 0 &&
    form.purchasePrice > 0 &&
    form.salePrice > 0


  const handleSubmitAddProductApi = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = { ...form, in_or_out: 1 };

      console.log("ProductID: ", formData.productID);
      const findProduct = await productApi().findProduct({ product_id: formData.productID });
      console.log("Find Product: ", findProduct);

      // Jika produk sudah ada → langsung buat ekspedisi
      if (findProduct.data.exists) {
        await createEkspedisiAndCloseModal(formData);
      } else {
        // Buat produk baru
        console.log("masuk ke produk baru ga");
        const formProductReq = {
          product_id: formData.productID,
          product_name: formData.productName,
          product_quantity: formData.quantity,
          category: formData.category,
          brand_name: formData.brandName
        };

        const responseProduct = await productApi().createProduct(formProductReq);

        if (responseProduct.error) {
          throw new Error(responseProduct.error);
        }

        // Setelah buat produk → langsung addFirstEkspedisi
        await createEkspedisiAndCloseModal(formData, true);
      }
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  const createEkspedisiAndCloseModal = async (formData: any, isFirst: boolean = false) => {
    const ekspedisiPayload = {
      product: formData.productID,
      quantity: formData.quantity,
      purchase_price: formData.purchasePrice,
      sale_price: formData.salePrice,
      in_or_out: formData.in_or_out,
    };

    console.log("Ekspedisi Payload:", ekspedisiPayload);

    const response = isFirst
      ? await productApi().addFirstEkspedisi(ekspedisiPayload)
      : await productApi().createEkspedisi(ekspedisiPayload);

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.status === 201) {
      console.log("Product added successfully:", response.data);
      resetForm();
      setIsOpen(false);
      fetchProducts();
    }
  };

  const handleChange = (field: string, value: any) => {
    setForm({
      ...form,
      [field]: value,
    })
  }

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  // FUNGSI DELETE:
  const handleDeleteProduct = async () => {
    if (deleteIndex === null) return

    // Ambil produk yang akan di‐delete
    const productToDelete = products[deleteIndex]

    try {
      // Kirim payload yang benar: product_id dari productToDelete, bukan form.productID
      const res = await productApi().deleteProduct({
        product_id: productToDelete.product_id,
      })

      if (res.error) {
        throw new Error(res.error)
      }

      // Success: tutup dialog, reset index, dan refresh list
      setDialogDeleteOpen(false)
      setDeleteIndex(null)
      await fetchProducts()
    } catch (err) {
      console.error("Failed to delete:", err)
    }
  }


  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const filteredProducts = products.filter((product) =>
    product.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  // Hitung slice data
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredProducts.slice(startIndex, endIndex)

  // 2. compute 1‑based values
  const totalItems = filteredProducts.length;
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

  const onDialogOpenChange = (open: boolean) => {
    // Jika open true, izinkan
    if (open) {
      setIsOpen(true)
    }
    // Jika open false (misalnya klik di luar), abaikan agar dialog tetap terbuka.
  }

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input so scanner keystrokes go here
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);



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
      <div className="mt-2 mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              <Button className="bg-[#0456F7] text-white hover:bg-blue-700"
                onClick={() => {
                  resetForm()      // <<< reset langsung saat klik
                  setIsOpen(true)
                }}>
                + Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl text-theme [&>button]:hidden p-12 rounded-[32px] space-y-1">
              <DialogHeader>
                <DialogTitle className="text-2xl">Add New Product</DialogTitle>
                <DialogDescription className="text-md">
                  Add new product by filling the information below
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2 space-y-1">
                {/* Product ID */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product ID
                  </label>
                  <Input
                    placeholder="Scan the barcode to detect the Product ID"
                    ref={inputRef}
                    value={form.productID}
                    onChange={(e) => handleChange("productID", e.target.value)}
                    required
                    className="border px-3 py-2 w-full text-md h-[48px]"
                  />
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name
                  </label>
                  <Input
                    placeholder="Input item name"
                    value={form.productName}
                    className="h-[48px]"
                    onChange={(e) => handleChange("productName", e.target.value)}
                    required
                  />
                </div>

                {/* Brand Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Brand Name
                  </label>
                  <Input
                    placeholder="Input brand name"
                    value={form.brandName}
                    className="h-[48px]"
                    onChange={(e) => handleChange("brandName", e.target.value)}
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <div className="relative rounded-md dark:bg-[#181818] 
                    border border-gray-300 dark:border-[#404040] h-[48px] text-sm
                    focus-within:border-gray-400 dark:focus-within:border-[oklch(1_0_0_/_45%)]
                    focus-within:ring-3 focus-within:ring-gray-300 dark:focus-within:ring-[oklch(0.551_0.027_264.364_/_54%)]
                  ">
                    <select
                      value={form.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      required
                      className={`w-full dark:text-theme appearance-none bg-transparent px-4 py-2 pr-10 h-[48px] 
                        focus:outline-none ${!form.category ? "text-gray-500 dark:text-gray-400" : "text-black dark:text-white"
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
                  <label className="block text-sm font-medium mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-2 grid grid-cols-[48px_5fr_48px]">
                    <Button
                      variant="outline"
                      className="text-xl h-[48px]"
                      onClick={() => handleChange("quantity", Math.max(0, form.quantity - 1))}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={form.quantity}
                      onChange={(e) => handleChange("quantity", Number(e.target.value))}
                      required
                      className="w-full text-center appearance-none text-md h-[48px]"
                    />
                    <Button
                      variant="outline"
                      className="text-xl h-[48px]"
                      onClick={() => handleChange("quantity", form.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Purchase Price */}
                <div>
                  <label className="block text-sm font-medium mb-2">Purchase Price</label>
                  <input
                    type="text"
                    className="w-full rounded-md dark:bg-[#181818]
                    border border-gray-300 dark:border-[#404040]
                    px-3 py-2 h-[48px]text-sm
                    focus:outline-none focus-within:border-gray-400 dark:focus-within:border-[oklch(1_0_0_/_45%)] 
                    focus-within:ring-3 focus-within:ring-gray-300 dark:focus-within:ring-[oklch(0.551_0.027_264.364_/_54%)]"
                    value={form.purchasePrice || ""}
                    onChange={(e) => handleChange("purchasePrice", Number(e.target.value))}
                    required
                    placeholder="Rp 0"
                  />
                </div>

                {/* Sale Price */}
                <div>
                  <label className="block text-sm font-medium mb-2">Sale Price</label>
                  <input
                    type="text"
                    className="w-full rounded-md dark:bg-[#181818]
                    border border-gray-300 dark:border-[#404040]
                    px-3 py-2 h-[48px] text-sm
                    focus:outline-none focus-within:border-gray-400 dark:focus-within:border-[oklch(1_0_0_/_45%)]
                    focus-within:ring-3 focus-within:ring-gray-300 dark:focus-within:ring-[oklch(0.551_0.027_264.364_/_54%)]"
                    value={form.salePrice || ""}
                    onChange={(e) => handleChange("salePrice", Number(e.target.value))}
                    required
                    placeholder="Rp 0"
                  />
                </div>
              </div>

              <DialogFooter className="grid grid-cols-2">
                <Button variant="outline" className="rounded-[80px] text-md h-[48px]"
                  onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitAddProductApi}
                  className="bg-[#0456F7] text-white hover:bg-[#0348CF] rounded-[80px] text-md h-[48px]"
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
              <th className="pr-8 px-4 py-3 font-semibold">Brand</th>
              <th className="px-0 py-3 font-semibold">Category</th>
              <th className="pl-20 py-3 font-semibold">Quantity</th>
              <th className="px-4 py-3 font-semibold">Purchase Price</th>
              <th className="px-4 py-3 font-semibold">Sale Price</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-0 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-[oklch(1_0_0_/_10%)] text-theme">
            {currentItems.map((item, i) => {
              const colorClass = categoryColors[item.category] || "bg-gray-100 text-gray-600"
              return (
                <tr key={i}>
                  <td className="px-4 py-3">{item.product_id}</td>
                  <td className="px-4 py-3">{item.product_name}</td>
                  <td className="pr-8 px-4 py-3">{item.brand_name}</td>
                  <td className="px-0 py-2 w-[140px] h-14">
                    <span
                      className={`inline-block w-full h-[32px] px-3 py-1.5 text-center rounded-full text-[13px] font-medium ${colorClass}`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="pl-20 py-3">{item.product_quantity}</td>
                  <td className="px-4 py-3">Rp {item.purchase_price.toLocaleString()}</td>
                  <td className="px-4 py-3">Rp {item.sale_price.toLocaleString()}</td>
                  <td className="px-4 py-3">Ready Stock</td>
                  <td className="px-0 py-3">
                    <Dialog open={dialogEditOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className="mr-2 text-[#0456F7] cursor-pointer bg-theme hover:bg-theme"
                          onClick={() => handleEditClick(item, i)}>
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
                          {/* Product ID */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Product ID
                            </label>
                            <Input
                              placeholder="This is the default Product ID"
                              ref={inputRef}
                              value={form.productID}
                              onChange={(e) => handleChange("productID", e.target.value)}
                              required
                              className="border px-3 py-2 w-full text-sm h-[48px]"
                            />
                          </div>

                          {/* Product Name */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Product Name
                            </label>
                            <Input
                              placeholder="Update product name"
                              value={form.productName}
                              className="h-[48px]"
                              onChange={(e) => handleChange("productName", e.target.value)}
                              required
                            />
                          </div>

                          {/* Brand Name */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Brand Name
                            </label>
                            <Input
                              placeholder="Update brand name"
                              value={form.brandName}
                              className="h-[48px]"
                              onChange={(e) => handleChange("brandName", e.target.value)}
                              required
                            />
                          </div>

                          {/* Category */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Category
                            </label>
                            <div className="relative rounded-md dark:bg-[#181818] 
                              border border-gray-300 dark:border-[#404040] h-[48px] text-sm
                              focus-within:border-gray-400 dark:focus-within:border-[oklch(1_0_0_/_45%)]
                              focus-within:ring-3 focus-within:ring-gray-300 dark:focus-within:ring-[oklch(0.551_0.027_264.364_/_54%)]
                            ">
                              <select
                                value={form.category}
                                onChange={(e) => handleChange("category", e.target.value)}
                                required
                                className={`w-full dark:text-theme appearance-none bg-transparent px-4 py-2 pr-10 h-[48px] 
                                focus:outline-none ${!form.category ? "text-gray-500 dark:text-gray-400" : "text-black dark:text-white"
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
                            <label className="block text-sm font-medium mb-2">
                              Quantity
                            </label>
                            <div className="flex items-center gap-2 grid grid-cols-[48px_5fr_48px]">
                              <Button
                                variant="outline"
                                className="text-xl h-[48px]"
                                onClick={() => handleChange("quantity", Math.max(0, form.quantity - 1))}
                              >
                                -
                              </Button>
                              <Input
                                type="number"
                                value={form.quantity}
                                onChange={(e) => handleChange("quantity", Number(e.target.value))}
                                required
                                className="w-full text-center appearance-none text-lg h-[48px]"
                              />
                              <Button
                                variant="outline"
                                className="text-xl h-[48px]"
                                onClick={() => handleChange("quantity", form.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </div>

                          {/* Purchase Price */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Purchase Price</label>
                            <input
                              type="text"
                              className="w-full rounded-md dark:bg-[#181818]
                              border border-gray-300 dark:border-[#404040]
                              px-3 py-2 h-[48px] text-sm
                              focus:outline-none focus-within:border-gray-400 dark:focus-within:border-[oklch(1_0_0_/_45%)] 
                              focus-within:ring-3 focus-within:ring-gray-300 dark:focus-within:ring-[oklch(0.551_0.027_264.364_/_54%)]"
                              value={form.purchasePrice || ""}
                              onChange={(e) => handleChange("purchasePrice", Number(e.target.value))}
                              required
                              placeholder="Rp 500.000"
                            />
                          </div>

                          {/* Sale Price */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Sale Price</label>
                            <input
                              type="text"
                              className="w-full rounded-md dark:bg-[#181818]
                              border border-gray-300 dark:border-[#404040]
                              px-3 py-2 h-[48px] text-sm
                              focus:outline-none focus-within:border-gray-400 dark:focus-within:border-[oklch(1_0_0_/_45%)]
                              focus-within:ring-3 focus-within:ring-gray-300 dark:focus-within:ring-[oklch(0.551_0.027_264.364_/_54%)]"
                              value={form.salePrice || ""}
                              onChange={(e) => handleChange("salePrice", Number(e.target.value))}
                              required
                              placeholder="Rp 550.0000"
                            />
                          </div>
                        </div>

                        <DialogFooter className="mt-1 grid grid-cols-2">
                          <Button variant="outline" className="rounded-[80px] text-md h-[48px]"
                            onClick={() => setDialogEditOpen(false)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={handleUpdateProduct}
                            disabled={!isFormValid}
                            className="bg-[#0456F7] text-white hover:bg-[#0348CF] rounded-[80px] text-md h-[48px]"
                          // disabled={!isFormValid}
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
                          <DialogTitle className="text-4xl font-medium text-theme text-center">Delete Product</DialogTitle>
                          <DialogDescription className="text-xl font-regular text-center mt-5 w-[340px]">
                            This action will delete product from the inventory permanently.
                            Are you sure you want to proceed?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-5 flex w-full justify-center text-center mx-auto">
                          <div>
                            <Button
                              onClick={handleDeleteProduct}
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
              )
            })}
          </tbody>
        </table>
      </div>

      {/* FOOTER PAGINATION */}
      <footer className="mt-auto w-full text-sm text-gray-600 dark:text-white">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          {/* e.g. "Showing 16 of 48 Products" */}
          <p>Showing {rangeText} of {totalItems} Products</p>
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






