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
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

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
  })

  const resetForm = () => {
    setForm({
      productID: "",
      productName: "",
      category: "",
      quantity: 0,
      purchasePrice: 0,
      salePrice: 0,
    })
  }

  const isFormValid =
    form.productID.trim() !== "" &&
    form.productName.trim() !== "" &&
    form.category.trim() !== "" &&
    form.quantity > 0 &&
    form.purchasePrice > 0 &&
    form.salePrice > 0


  const handleSubmitAddProductApi = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = { ...form, in_or_out: 1, brandName: "Michelin" };

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


  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const filteredProducts = products.filter((product) =>
    product.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  // Total item = 48
  const totalItems = filteredProducts.length
  // Total halaman = 48 / 16 = 3
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  // Hitung slice data
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = filteredProducts.slice(startIndex, endIndex)
  const displayedCount = currentItems.length

  const onDialogOpenChange = (open: boolean) => {
    // Jika open true, izinkan
    if (open) {
      setIsOpen(true)
    }
    // Jika open false (misalnya klik di luar), abaikan agar dialog tetap terbuka.
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
                    ref={inputRef}
                    value={form.productID}
                    onChange={(e) => handleChange("productID", e.target.value)}
                    required
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product Name
                  </label>
                  <Input
                    placeholder="Input item name"
                    value={form.productName}
                    onChange={(e) => handleChange("productName", e.target.value)}
                    required
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
                      value={form.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      required
                      className={`w-full dark:text-theme appearance-none bg-transparent px-4 py-2 pr-10 text-sm 
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
                  <label className="block text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <div className="flex items-center gap-2 grid grid-cols-[40px_5fr_40px]">
                    <Button
                      variant="outline"
                      onClick={() => handleChange("quantity", Math.max(0, form.quantity - 1))}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={form.quantity}
                      onChange={(e) => handleChange("quantity", Number(e.target.value))}
                      required
                      className="w-full text-center appearance-none"
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleChange("quantity", form.quantity + 1)}
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
                    value={form.purchasePrice || ""}
                    onChange={(e) => handleChange("purchasePrice", Number(e.target.value))}
                    required
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
                    value={form.salePrice || ""}
                    onChange={(e) => handleChange("salePrice", Number(e.target.value))}
                    required
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
                  onClick={handleSubmitAddProductApi}
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
              <th className="px-0 py-3 font-semibold">Category</th>
              <th className="pl-20 py-3 font-semibold">Quantity</th>
              <th className="px-4 py-3 font-semibold">Purchase Price</th>
              <th className="px-4 py-3 font-semibold">Sale Price</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-1 py-3 font-semibold"></th>
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
                  <td className="px-0 py-3 w-[160px] h-14">
                    <span
                      className={`inline-block w-full h-full px-3 py-1.5 text-center rounded-full text-sm font-medium ${colorClass}`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="pl-20 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">Rp {item.purchasePrice.toLocaleString()}</td>
                  <td className="px-4 py-3">Rp {item.salePrice.toLocaleString()}</td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-1 py-3">
                    <button className="mr-2 text-[#0456F7] cursor-pointer">
                      <PencilLine size={16} />
                    </button>
                    {/* <button className="text-[#DF0025] cursor-pointer">
                      <Trash2 size={16} />
                    </button> */}
                    <Dialog open={dialogDeleteOpen} onOpenChange={setDialogDeleteOpen}>
                      <DialogTrigger asChild>
                        <Button className="text-[#DF0025] cursor-pointer bg-theme hover:bg-theme"
                          onClick={() => setDialogDeleteOpen(true)}>
                          <Trash2 size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm p-12 md:p-12 rounded-[32px] bg-transparent [&>button]:hidden text-center justify-center w-auto"
                        onEscapeKeyDown={(e) => e.preventDefault()}
                        onPointerDownOutside={(e) => e.preventDefault()}
                      >
                        <DialogHeader>
                          <DialogTitle className="text-4xl font-medium text-theme text-center">Delete Invoice</DialogTitle>
                          <DialogDescription className="text-xl font-regular text-center mt-5 w-[320px]">
                            This action will delete invoice including all the data permanently.
                            Are you sure you want to proceed?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-5 flex w-full justify-center text-center mx-auto">
                          <div>
                            <Button onClick={() => setDialogDeleteOpen(false)}
                              className="text-lg h-[48px] w-full bg-[#DD0004] text-white hover:bg-[#BA0003] rounded-[80px] cursor-pointer text-center">Delete</Button>

                            <Button variant="outline" className="text-lg mt-4 h-[48px] flex w-[320px] rounded-[80px] text-theme cursor-pointer" onClick={() => setDialogDeleteOpen(false)}>Cancel</Button>
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






