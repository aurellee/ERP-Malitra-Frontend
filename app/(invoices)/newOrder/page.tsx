"use client"

import React, { useState, Dispatch, SetStateAction, useEffect } from "react"
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
import { format } from "date-fns/format"
import AddProductPicker from "@/components/add-product"
import productApi from "@/api/productApi"
import invoiceApi from "@/api/invoiceApi"
import { useMemo } from "react"
import employeeApi from "@/api/employeeApi"

const ITEMS_PER_PAGE = 12

function formatRupiah(value: number): string {
  return "Rp " + new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(value)
  
}

type SelectedProduct = {
  product_id: string
  price: number
  quantity: number
  discount_per_item: number
}

export interface Product {
  product_id: string
  product_name: string
  category: string
  price: number
}

function getPaymentButtonClasses(
  currentMethod: "Cash" | "Transfer Bank" | "Unpaid",
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
      return "Unpaid"
  }
}

function usePersistedState<T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue
    try {
      const stored = localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : defaultValue
    } catch {
      return defaultValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // quota exceeded or some other issue
    }
  }, [key, state])

  return [state, setState]
}

const STORAGE_KEY = "new-order-form"

type Emp = {
  employee_id: number
  employee_name: string
  role: string
}

export default function NewOrderPage() {
  const router = useRouter()

  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)
  const [dialogEditOpen, setDialogEditOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const initialForm = {
    invoice_date: format(new Date(), "yyyy-MM-dd"),
    car_number: "",
    payment_method: "Cash" as "Cash" | "Transfer Bank" | "Unpaid",
    discount: 0,
    sales: [] as { employee: number; total_sales_omzet: number }[],
    mechanic_id: null as number | null,
    items: [] as SelectedProduct[],
  }

  // in your component:
  const [form, setForm] = usePersistedState<typeof initialForm>(
    STORAGE_KEY,
    initialForm
  )

  const resetForm = () => {
    setForm(initialForm)
  }
  // ─── Item CRUD Helpers ──────────────────────────────────────────────────────
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<SelectedProduct | null>(null)

  // 4) When user clicks ✏️
  function openEditDialog(i: number) {
    setEditIndex(i)
    setEditValues({ ...form.items[i] })       // make a copy
    setDialogEditOpen(true)
  }

  // 5) Save edits back into form.items
  function handleSaveEdit() {
    if (editIndex === null || !editValues) return

    setForm(prev => {
      // 1. copy the items array and swap in your edited row
      const updatedItems = [...prev.items]
      updatedItems[editIndex] = editValues

      // 2. return a new form object, spreading in all old fields
      return {
        ...prev,
        items: updatedItems,
      }
    })

    setDialogEditOpen(false)
    setEditIndex(null)
    setEditValues(null)
  }


  const handleAddItem = (item: SelectedProduct) => {
    setForm(prev => {
      const idx = prev.items.findIndex(i => i.product_id === item.product_id)
      if (idx >= 0) {
        const updated = [...prev.items]
        updated[idx].quantity += item.quantity
        return { ...prev, items: updated }
      }
      return { ...prev, items: [...prev.items, item] }
    })
  }

  const handleEditItem = (index: number, qty: number) => {
    setForm(prev => {
      const updated = [...prev.items]
      updated[index].quantity = qty
      return { ...prev, items: updated }
    })
  }


  const handleDeleteItem = (index: number) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
    setDialogDeleteOpen(false)
  }


  // Cancel edit:
  function handleCancelEdit() {
    setEditIndex(null)
    setEditValues(null)
    setDialogEditOpen(false)
  }


  // ─── Fetch Product Map ───────────────────────────────────────────────────────
  const [productMap, setProductMap] = useState<Record<string, any>>({})

  useEffect(() => {
    productApi()
      .viewAllProducts()
      .then(res => {
        const map: Record<string, any> = {}
        res.data.forEach((p: any) => (map[p.product_id] = p))
        setProductMap(map)
      })
      .catch(console.error)
  }, [])


  // ─── Totals & Discount ──────────────────────────────────────────────────────

  const [currentPage, setCurrentPage] = useState(1)
  // 1) Filtered list
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return form.items.filter(item => {
      const prod = productMap[item.product_id] || {}
      return (
        item.product_id.toLowerCase().includes(q) ||
        prod.product_name?.toLowerCase().includes(q) ||
        prod.category?.toLowerCase().includes(q)
      )
    })
  }, [form.items, productMap, searchQuery])

  // 2) Reset page on filter/items change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, form.items])

  // 3) Compute totalPages
  const totalItems = filteredItems.length
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))

  const itemsWithFinal = filteredItems.map(i => ({
    ...i,
    finalPrice: i.price * i.quantity - i.discount_per_item,
  }))

  const currentItemsWithFinal = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return itemsWithFinal.slice(start, start + ITEMS_PER_PAGE)
  }, [itemsWithFinal, currentPage])



  const subTotal = itemsWithFinal.reduce((sum, i) => sum + i.finalPrice, 0)

  const rangeText = useMemo(() => {
    if (totalItems === 0) return "0"
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1
    const end = Math.min(start + currentItemsWithFinal.length - 1, totalItems)
    return start === end ? `${end}` : `${start}–${end}`
  }, [currentItemsWithFinal, totalItems, currentPage])

  // 6) Handlers
  const nextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages))
  const prevPage = () => setCurrentPage(p => Math.max(p - 1, 1))



  const [rawDiscount, setRawDiscount] = useState(0)
  const [displayDiscount, setDisplayDiscount] = useState("")



  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "")
    const num = cleaned ? parseInt(cleaned, 10) : 0
    setRawDiscount(num)
    setDisplayDiscount(
      new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(num)
    )
    setForm(prev => ({ ...prev, discount: num }))
  }
  const total = subTotal - form.discount


  // ─── Payment Dialog ────────────────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(form.payment_method)
  const [rawAmountPaid, setRawAmountPaid] = useState(0)
  const [displayAmountPaid, setDisplayAmountPaid] = useState("")

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "")
    const num = cleaned ? parseInt(cleaned, 10) : 0
    setRawAmountPaid(num)
    setDisplayAmountPaid(
      "Rp " + new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(num)
    )
  }


  const isFormValid =
    (form.sales.length > 0 || form.mechanic_id !== null) &&
    form.items.length > 0;


  const isPaymentValid =
    paymentMethod === "Unpaid" ||
    ((paymentMethod === "Cash" || paymentMethod === "Transfer Bank") && rawAmountPaid > 0)


  // ─── Sales Selection  ───────────────────────────────────────────────
  // 1) load employees
  const [employees, setEmployees] = useState<Emp[]>([])
  const [loadingEmp, setLoadingEmp] = useState(false)

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoadingEmp(true)
      try {
        const resp = await employeeApi().viewAllEmployees()
        // console.log("EMPLOYEES →", resp.data)
        if (resp.status === 200) {
          setEmployees(resp.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingEmp(false)
      }
    }
    fetchEmployees()
  }, [])

  // 2) split into two lists
  const salesOptions = employees.filter(e =>
    e.role.toLowerCase() === "sales"
  )
  const mechanicOptions = employees.filter(e =>
    e.role.toLowerCase().includes("mechanic")
  )
  // 3) handle changes
  const handleSalesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const empId = Number(e.target.value)
    setForm((prev) => ({
      ...prev,
      // replace entire array with a single-sales entry
      sales: empId
        ? [{ employee: empId, total_sales_omzet: prev.sales[0]?.total_sales_omzet ?? 0 }]
        : [],
    }))
  }

  const handleMechanicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mechId = Number(e.target.value)
    setForm((prev) => ({
      ...prev,
      mechanic_id: mechId || null,
    }))
  }

  // ─── Create Invoice ─────────────────────────────────────────────────────────
  const handleCreateInvoice = async (forcePending: boolean = false) => {
    
    let status: "Pending" | "Unpaid" | "Partially Paid" | "Full Payment";
    if (forcePending) {
      status = "Pending";
    } else if (rawAmountPaid === 0) {
      status = "Unpaid";
    } else if (rawAmountPaid < total) {
      status = "Partially Paid";
    } else {
      status = "Full Payment"; 
    }

    const salesPayload = [...form.sales];

    if (form.mechanic_id !== null) {
      salesPayload.push({
        employee: form.mechanic_id,
        total_sales_omzet: rawAmountPaid,
      });
    }

    const payload = {
      invoice_date: form.invoice_date,
      amount_paid: rawAmountPaid,
      payment_method: paymentMethod,
      car_number: form.car_number,
      discount: form.discount,
      invoice_status: status,
      items: form.items.map(i => ({
        product: i.product_id,
        quantity: i.quantity,
        price: i.price,
        discount_per_item: i.discount_per_item,
      })),
      sales: salesPayload,
    }

    try {
      await invoiceApi().createInvoice(payload)
      localStorage.removeItem(STORAGE_KEY)
      resetForm()
      router.push("/invoices")
    } catch (err) {
      console.error(err)
      alert("Gagal membuat invoice")
    }
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
      <div className="w-full grid gap-6 grid-cols-[2fr_300px] max-h-screen">
        {/* LEFT COLUMN */}
        <div className="flex flex-col h-full max-h-screen">
          {/* Header row: "Order on Process" + search bar */}
          <div className="mt-2 mb-6 flex justify-between h-[40px]">
            <h2 className="text-xl font-semibold items-center mt-2">Order on Process</h2>
            {/* Search bar */}
            <div className="flex justify-end text-right items-center">
              <AddProductPicker
                currentItems={form.items}
                onAdd={handleAddItem}
                onAddItems={updated => setForm(prev => ({ ...prev, items: updated }))}
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="w-full flex overflow-x-auto rounded-lg max-h-screen 
          border border-gray-200 bg-theme dark:border-[oklch(1_0_0_/_10%)]">
            <table className="w-full border-collapse text-sm max-h-screen">
              <thead className="bg-[#F1F1F1] dark:bg-[#181818] text-left text-gray-600 h-[50px] dark:text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product ID</th>
                  <th className="px-4 py-3 font-semibold">Product Name</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Quantity</th>
                  <th className="px-4 py-3 font-semibold">Discount</th>
                  <th className="px-4 py-3 font-semibold">Final Price</th>
                  <th className="px-1 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:text-white text-gray-700 dark:divide-[oklch(1_0_0_/_10%)]">
                {currentItemsWithFinal.map((item, i) => {
                  const prod = productMap[item.product_id] || {}
                  const colorClass = categoryColors[prod.category] || "bg-gray-100 text-gray-600"
                  return (
                    <tr key={i}>
                      <td className="px-4 py-3">{item.product_id}</td>
                      <td className="px-4 py-3">{prod.product_name}</td>
                      <td className="px-4 py-2 w-[170px] h-14">
                        <span
                          className={`inline-block w-full h-[32px] px-3 py-1.5 text-center rounded-full text-[13px] font-medium ${colorClass}`}
                        >
                          {prod.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        Rp {item.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3">
                        Rp {item.discount_per_item.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        Rp {item.finalPrice.toLocaleString()}
                      </td>
                      <td className="px-1 py-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mr-2 text-[#0456F7] cursor-pointer hover:text-[#0456F7]"
                          onClick={() => openEditDialog(i)}>
                          <PencilLine size={16} />
                        </Button>

                        <Dialog open={dialogDeleteOpen}
                          onOpenChange={(open) => {
                            setDialogDeleteOpen(open)
                          }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-[#DF0025] hover:text-[#DF0025] cursor-pointer"
                            >
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
                                This action will delete product from the order list of products.
                                Are you sure you want to proceed?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="mt-5 flex w-full justify-center text-center mx-auto">
                              <div>
                                <Button
                                  onClick={() => handleDeleteItem(i)}
                                  className="text-lg h-[48px] w-full bg-[#DD0004] text-white hover:bg-[#BA0003] rounded-[80px] cursor-pointer text-center">
                                  Delete Product</Button>

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
            <Dialog open={dialogEditOpen}
              onOpenChange={setDialogEditOpen}>
              <DialogContent className="sm:max-w-2xl text-theme [&>button]:hidden p-12 rounded-[32px] space-y-0">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Edit Product</DialogTitle>
                  <DialogDescription className="text-md">
                    Update the product by changing its information below.
                  </DialogDescription>
                </DialogHeader>

                {editValues && (
                  <div className="grid gap-4 py-2 space-y-4">
                    {/* Product ID */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Product ID
                      </label>
                      <Input
                        placeholder="This is the  Product ID"
                        value={editValues.product_id}
                        readOnly
                        tabIndex={-1}
                        className="border-none px-3 py-2 w-full text-sm h-[48px] bg-gray-100 dark:bg-[#2a2a2a] cursor-not-allowed text-gray-500"
                      />
                    </div>

                    {/* Product Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Price
                      </label>
                      <div className="border rounded-md">
                        <Input
                          type="number"
                          value={editValues.price}
                          className="h-[48px] outline-none appearance-none border-none "
                          required
                          onChange={e =>
                            setEditValues(v =>
                              v ? { ...v, price: +e.target.value } : v
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Quantity
                      </label>
                      <div className="flex w-full items-center gap-2 grid grid-cols-[48px_5fr_48px]">
                        {/* Decrement */}
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-xl h-[48px] w-full flex"
                          disabled={editValues!.quantity <= 1}
                          onClick={() =>
                            setEditValues(v =>
                              v ? { ...v, quantity: v.quantity - 1 } : v
                            )
                          }
                        >
                          –
                        </Button>

                        {/* Number Input */}
                        <div className="border rounded-md">
                          <Input
                            type="number"
                            min={1}
                            value={editValues!.quantity}
                            onChange={e =>
                              setEditValues(v =>
                                v ? { ...v, quantity: Math.max(1, +e.target.value) } : v
                              )
                            }
                            className="w-full text-center text-md h-[48px] h-[48px] outline-none appearance-none border-none"
                          />
                        </div>

                        {/* Increment */}
                        <Button
                          variant="outline"
                          className="text-xl h-[48px] w-full flex"
                          size="icon"
                          onClick={() =>
                            setEditValues(v =>
                              v ? { ...v, quantity: v.quantity + 1 } : v
                            )
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Purchase Price */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Item Discount</label>
                      <Input
                        type="number"
                        className="h-[48px] outline-none appearance-none border-none "
                        required
                        value={editValues.discount_per_item}
                        onChange={e =>
                          setEditValues(v =>
                            v ? { ...v, discount_per_item: +e.target.value } : v
                          )
                        }
                      />
                    </div>

                    {/* Sale Price */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Final Price
                      </label>
                      <Input
                        placeholder="This is The Final Price"
                        value={formatRupiah((editValues.price * editValues.quantity) - editValues.discount_per_item)}
                        readOnly
                        tabIndex={-1}
                        className="border-none px-3 py-2 w-full text-sm h-[48px] bg-gray-100 dark:bg-[#2a2a2a] cursor-not-allowed text-gray-500"
                      />
                    </div>

                  </div>
                )}

                <DialogFooter className="mt-1 grid grid-cols-2">

                  <Button variant="outline" className="rounded-[80px] text-md h-[48px]"
                    onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="bg-[#0456F7] text-white hover:bg-[#0348CF] rounded-[80px] text-md h-[48px]"
                  >
                    Update Product
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* PAGINATION FOOTER */}
          <footer className="mt-auto">
            <div className="w-full text-sm text-gray-600 dark:text-white">
              <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                {/* e.g. "Showing 10 of 20 Items" */}
                <p>
                  Showing {rangeText} of {totalItems} Items
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={prevPage} disabled={currentPage === 1}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span>
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={nextPage}
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
          <div className="mt-4 mb-8 w-full flex items-center justify-start gap-1.5">
            <h2 className="text-[24px] font-semibold text-gray-500 dark:text-gray-400">
              Invoice
            </h2>
            <h2 className="text-[24px] font-semibold">
              Detail
            </h2>
          </div>

          {/* Invoice Fields */}
          <div className="space-y-6 text-sm">
            {/* Date */}
            <div className="items-center justify-between">
              <label className="block text-sm font-medium mb-2">Date</label>
              {/* <SingleDatePicker
                  value={format(Date.now(), "yyyy-MM-dd")}
                  onChange={(newDate: string) => {
                    setForm((prev) => ({
                      ...prev,
                      invoice_date: newDate,
                    }));
                  }}
                /> */}
              <SingleDatePicker
                value={form.invoice_date}
                onChange={d => setForm(prev => ({ ...prev, invoice_date: d }))}
              />
            </div>
            {/* Car Plate */}
            <div className="items-center justify-between">
              <label className="block text-sm font-medium mb-2">Car</label>
              <Input
                type="text"
                value={form.car_number}
                placeholder="Input The Car Number"
                onChange={e => setForm(prev => ({ ...prev, car_number: e.target.value }))}
                className="w-full dark:bg-[#121212] h-[40px] dark:hover:bg-[#191919] hover:bg-[oklch(0.278_0.033_256.848_/_5%)]"
              />
            </div>
            {/* Sales */}
            <div className="items-center justify-between">
              <label className="block text-sm font-medium mb-2">Sales</label>
              <div className="relative">
                <select
                  value={form.sales[0]?.employee ?? ""}
                  onChange={handleSalesChange}
                  disabled={loadingEmp}
                  className={`w-full dark:hover:bg-[#191919] hover:bg-[oklch(0.278_0.033_256.848_/_5%)] h-[40px] dark:bg-[#121212] appearance-none rounded-lg border px-4 text-sm focus:outline-none 
                    ${!form.sales[0] ? "text-gray-500 dark:text-gray-400" : "text-black dark:text-white"
                    }`}
                >
                  <option value="">— Select Sales —</option>
                  {salesOptions.map((e) => (
                    <option key={e.employee_id} value={e.employee_id}>
                      {e.employee_name}
                    </option>
                  ))}
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
                  value={form.mechanic_id ?? ""}
                  onChange={handleMechanicChange}
                  disabled={loadingEmp}
                  className={`w-full dark:hover:bg-[#191919] hover:bg-[oklch(0.278_0.033_256.848_/_5%)] h-[40px] dark:bg-[#121212] appearance-none rounded-lg border px-4 text-sm focus:outline-none 
                    ${!form.mechanic_id ? "text-gray-500 dark:text-gray-400" : "text-black dark:text-white"
                    }`}
                >
                  <option value="">— Select Mechanic —</option>
                  {mechanicOptions.map(e => (
                    <option key={e.employee_id} value={e.employee_id}>
                      {e.employee_name}
                    </option>
                  ))}
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
                  value={displayDiscount ? displayDiscount : ""}
                  onChange={handleDiscountChange}
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
              <span>{formatRupiah(total)}</span>
            </div>
          </div>


          {/* Payment & Pending Buttons */}
          <div className="mt-14 flex flex-wrap items-center justify-between gap-4">
            {/* Payment button -> open Payment dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full rounded-[80px] bg-[#0456F7] text-white hover:bg-[#0348CF] h-[48px]"
                  disabled={!isFormValid}
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
                  <Button
                    variant="outline"
                    className="h-[40px] rounded-[80px] text-theme"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button disabled={!isPaymentValid}
                    onClick={() => {
                      setDialogOpen(false)
                      handleCreateInvoice()
                    }}
                    className="h-[40px] bg-[#0456F7] text-white hover:bg-[#0348CF] rounded-[80px]">Save Invoice
                    </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Pending button -> navigate to /pendingOrder */}
            <Button
              variant="outline"
              className="w-full rounded-[80px] border-gray-300 text-gray-500 
                hover:text-gray-500 dark:bg-[#181818] dark:hover:bg-[#121212] h-[48px]"
              onClick={() => handleCreateInvoice(true)}
              disabled={!isFormValid}
            >
              Pending
            </Button>
          </div>
        </div>
      </div>
    </div >
  )
}