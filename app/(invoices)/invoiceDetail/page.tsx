'use client'

import React, { useEffect, useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"  // Adjust path if needed
import { ModeToggle } from "@/components/mode-toggle"     // Adjust path if needed
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useParams, useRouter, useSearchParams } from "next/navigation"
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
import invoiceApi from "@/api/invoiceApi"
import productApi from "@/api/productApi"
import ProductPickerModal from "@/components/add-product"
import ProductInlinePicker from "@/components/productInLinePicker"
import AddProductPicker from "@/components/add-product"
import { format } from "date-fns/format"
import employeeApi from "@/api/employeeApi"
import { useMemo } from "react"

const ITEMS_PER_PAGE = 13

function formatRupiah(value: number): string {
    return "Rp " + new Intl.NumberFormat("id-ID", {
        maximumFractionDigits: 0,
    }).format(value)
}


interface InvoiceDetailPage {
    invoice_id: number;
}

type ItemData = {
    product_id: string
    price: number
    quantity: number
    discount_per_item: number
}

type Form = {
    invoice_id: number
    invoice_date: string
    amount_paid: number
    payment_method: string
    car_number: string
    discount: number
    invoice_status: string
    items: {
        product_id: string
        quantity: number
        price: number
        discount_per_item: number
    }[]
    sales: { employee: number; total_sales_omzet: number }[]
    selectedSalesId: number | null
    selectedMechanicId: number | null
}

type Employee = {
    employee_id: number
    employee_name: string
    role: "Sales" | "Mechanic" | string
};


type InvoiceDetailApi = {
    invoice_id: number;
    invoice_date: string;
    amount_paid: number;
    payment_method: string;
    car_number: string;
    discount: number;
    invoice_status: string;
    sales: { employee: number; total_sales_omzet: number }[];
    items: ItemData[];
}


export default function InvoiceDetailPage() {
    const params = useSearchParams()

    const invoice_id = params.get("invoice_id") || "";

    const fetchInvoiceAndEmployees = async () => {
        setIsLoadingForm(true);
        try {
            const [empRes, invoiceRes] = await Promise.all([
                employeeApi().viewAllEmployees(),
                invoiceApi().viewInvoiceDetail({ invoice_id: Number(invoice_id) }),
            ]);

            // 1. Employees
            const empData: Employee[] = empRes.status === 200 ? empRes.data : [];
            setEmployees(empData);
            const empMapLocal = Object.fromEntries(empData.map((e: any) => [e.employee_id, e]));
            setEmpMap(empMapLocal);

            // 2. Store raw invoice for table usage
            const invoice = invoiceRes.data;
            setInvoiceDetailRaw(invoice); // <--- Store raw invoice for filtering, table display, etc.

            // 3. Extract selected sales & mechanic
            const salesIds = invoice.sales.map((e: any) => e.employee_id);
            const selectedSales = salesIds.find((id: any) => empMapLocal[id]?.role === "Sales") ?? null;
            const selectedMechanic = salesIds.find((id: any) => empMapLocal[id]?.role === "Mechanic") ?? null;

            // 4. Populate form for editing
            setForm({
                invoice_id: invoice.invoice_id,
                invoice_date: invoice.invoice_date,
                amount_paid: invoice.amount_paid,
                payment_method: invoice.payment_method,
                car_number: invoice.car_number,
                discount: invoice.discount,
                invoice_status: invoice.invoice_status,
                items: invoice.items,
                sales: [
                    ...(selectedSales ? [{ employee: selectedSales, total_sales_omzet: invoice.amount_paid }] : []),
                    ...(selectedMechanic ? [{ employee: selectedMechanic, total_sales_omzet: invoice.amount_paid }] : []),
                ],
                selectedSalesId: selectedSales,
                selectedMechanicId: selectedMechanic,
            });
        } catch (err) {
            console.error("Failed to fetch invoice/employees:", err);
        } finally {
            setIsLoadingForm(false);
        }
    };

    useEffect(() => {
        fetchInvoiceAndEmployees();
    }, [invoice_id])

    const fetchAllProducts = async () => {
        try {
            const res = await productApi().viewAllProducts();
            if (res.status === 200) {
                const products = res.data;
                const map = products.reduce((acc: Record<string, any>, product: any) => {
                    acc[product.product_id] = product;
                    return acc;
                }, {});
                setProductMap(map);
            }
        } catch (err) {
            console.error('Failed to fetch products:', err);
        }
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchInvoiceAndEmployees(); // Fetch ulang kalau kembali ke halaman ini
                fetchAllProducts();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    const [searchQuery, setSearchQuery] = useState("")

    const [isLoadingForm, setIsLoadingForm] = useState(true);

    const [dialogUpdateChanges, setDialogUpdateChanges] = useState(false)

    const [invoiceDetailRaw, setInvoiceDetailRaw] = useState<InvoiceDetailApi | null>(null);

    const [employees, setEmployees] = useState<Employee[]>([])
    const [empMap, setEmpMap] = useState<Record<number, Employee>>({})

    const initialForm: Form = {
        invoice_id: 0,
        invoice_date: format(new Date(), "yyyy-MM-dd"),
        amount_paid: 0,
        payment_method: "Cash",
        car_number: "",
        discount: 0,
        invoice_status: "",
        items: [],
        sales: [],
        selectedSalesId: null,
        selectedMechanicId: null,
    }

    // Derived from employees
    const salesOptions = useMemo(() => employees.filter(e => e.role === "Sales"), [employees]);
    const mechanicOptions = useMemo(() => employees.filter(e => e.role === "Mechanic"), [employees]);

    const [form, setForm] = useState<Form>(initialForm);



    const handleFormChange = (field: keyof Form, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const subTotal = form.items.reduce((sum, item) => {
        return sum + (item.price - item.discount_per_item) * item.quantity;
    }, 0);

    const [editSales, setEditSales] = useState(false);
    const [editMechanic, setEditMechanic] = useState(false);

    const totalInvoice = subTotal - Number(form.discount || 0);

    const buildSalesPayload = () => {
        const entries = [];
        if (form.selectedSalesId !== null)
            entries.push({ employee: form.selectedSalesId, total_sales_omzet: form.amount_paid });
        if (form.selectedMechanicId !== null)
            entries.push({ employee: form.selectedMechanicId, total_sales_omzet: form.amount_paid });
        return entries;
    };

    const handleUpdateInvoice = async () => {
        try {
            const salesPayload = buildSalesPayload();

            if (salesPayload.length === 0) {
                alert("At least one sales or mechanic must be selected.");
                return;
            }

            const status = form.payment_method === "Unpaid"
                ? "Unpaid"
                : form.amount_paid === totalInvoice
                    ? "Full Payment"
                    : form.amount_paid > 0
                        ? "Partially Paid"
                        : "Pending";


            const payload = {
                invoice_id: form.invoice_id,
                invoice_date: form.invoice_date,
                amount_paid: form.amount_paid,
                payment_method: form.payment_method,
                car_number: form.car_number,
                discount: Number(form.discount),
                invoice_status: form.invoice_status,
                items: form.items.map(i => ({
                    product: i.product_id,
                    quantity: i.quantity,
                    price: i.price,
                    discount_per_item: i.discount_per_item,
                })),
                sales: salesPayload,
            }
            
            console.log("Payload being sent:", payload);

            const res = await invoiceApi().updateInvoice(payload)

            // console.log("Invoice updated data:", res)
            if (res.error) throw new Error(res.error)
            setDialogUpdateChanges(false)
            alert("Invoice updated successfully")
        } catch (err) {
            console.error("Failed to update invoice:", err)
            alert("Failed to update invoice")
        }
    }

    const handleAddItem = (item: ItemData) => {

        setForm(prev => {
            const idx = prev.items.findIndex(i => i.product_id === item.product_id);
            if (idx >= 0) {
                const updated = [...prev.items];
                updated[idx].quantity += item.quantity;
                return { ...prev, items: updated };
            }
            return { ...prev, items: [...prev.items, item] };
        });

    };

    useEffect(() => {
        console.log("Form", form);
    }, [form])

    
    const handleDeleteItemInInvoice = (index: number) => {
        const updatedItems = form.items.filter((_, i) => i !== index);
        setForm((prev) => ({
            ...prev,
            items: updatedItems,
        }));
    };

    const [productMap, setProductMap] = useState<Record<string, any>>({});
    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)
    const [dialogEditOpen, setDialogEditOpen] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [editValues, setEditValues] = useState<ItemData | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    // 4) When user clicks ✏️
    function openEditDialog(idx: number) {
        setEditIndex(idx)
        setEditValues({ ...form.items[idx] })
        setDialogOpen(true)
    }

    function handleCancelEdit() {
        setDialogOpen(false)
        setEditIndex(null)
        setEditValues(null)
    }

    // 5) Save edit back into form.items_data
    function handleSaveEdit() {
        if (editIndex === null || !editValues) return
        setForm(prev => {
            const updated = [...prev.items]
            updated[editIndex] = editValues
            return { ...prev, items: updated }
        })
        handleCancelEdit()
    }


    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const filteredInvoiceDetail: ItemData[] = form.items?.filter((item) => {
        const product = productMap[item.product_id];
        return (
            item.product_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product?.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product?.category?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }) || [];

    // Hitung total item dan total halaman
    const totalItems = filteredInvoiceDetail.length
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

    // Fungsi slice data sesuai halaman
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentData = filteredInvoiceDetail.slice(startIndex, endIndex)

    const enrichedCurrentData = currentData.map((item) => {
        const product = productMap[item.product_id] || {}; // fallback to empty object
        return {
            ...item,
            product_name: product.product_name || 'Unknown Product',
            category: product.category || 'Unknown',
            colorClass: categoryColors[product.category] || 'bg-gray-100 text-gray-600'
        };
    });

    // PAGINATION
    const startItem = totalItems > 0 ? startIndex + 1 : 0;
    const endItem = Math.min(endIndex, totalItems);

    // build the display string
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
                    <h1 className="text-2xl font-bold">Invoice Detail</h1>
                </div>
                <ModeToggle />
            </div>

            {/* MAIN CONTENT: Two-column grid (no breakpoints => always side by side) */}
            <div className="w-full grid gap-6 grid-cols-[2fr_300px] h-full">
                {/* LEFT COLUMN */}
                <div className="flex flex-col h-full">
                    {/* Header row: "Order on Process" + search bar */}
                    <div className="mt-2 mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold mt-2">Invoice #{invoice_id}</h2>
                        {/* Search bar */}
                        <div className="flex justify-end">
                            <div className="flex w-full justify-end text-right">
                                <AddProductPicker
                                    currentItems={form.items}
                                    onAdd={handleAddItem}
                                    onAddItems={(updated) => {
                                        setForm(prev => ({ ...prev, items: updated }));
                                    }}
                                />
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
                                    <th className="px-0 py-3 font-semibold">Product Name</th>
                                    <th className="px-4 py-3 font-semibold">Category</th>
                                    <th className="px-4 py-3 font-semibold">Price</th>
                                    <th className="px-4 py-3 font-semibold">Quantity</th>
                                    <th className="px-4 py-3 font-semibold">Discount</th>
                                    <th className="px-4 py-3 font-semibold">Final Price</th>
                                    <th className="px-0 py-3 font-semibold"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:text-white text-gray-700 dark:divide-[oklch(1_0_0_/_10%)]">
                                {enrichedCurrentData.map((item, i) => {
                                    const itemTotal = item.price * item.quantity;
                                    const finalTotal = itemTotal - item.discount_per_item;
                                    const colorClass = categoryColors[item.category] || "bg-gray-100 text-gray-600";
                                    return (
                                        <tr key={i}>
                                            <td className="px-4 py-3">{item.product_id}</td>
                                            <td className="px-0 py-3">{item.product_name}</td>
                                            <td className="px-4 py-2 w-[140px] h-14">
                                                <span
                                                    className={`inline-block w-full h-[32px] px-3 py-1.5 text-center rounded-full text-[13px] font-medium ${colorClass}`}
                                                >
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {formatRupiah(item.price)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-3">
                                                {formatRupiah(item.discount_per_item)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {formatRupiah(finalTotal)}
                                            </td>
                                            <td className="px-0 py-3">
                                                {/* <button className="mr-2 text-[#0456F7] cursor-pointer">
                                                    <PencilLine size={16} />
                                                </button>
                                                <button className="text-[#DF0025] cursor-pointer" onClick={() => handleDeleteItemInInvoice(i)}>
                                                    <Trash2 size={16} />
                                                </button> */}
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
                                                                    onClick={() => handleDeleteItemInInvoice(i)}
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
                                                value={formatRupiah(editValues.price * editValues.quantity - editValues.discount_per_item)}
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







                {/* RIGHT COLUMN: Invoice details */}
                <div>
                    <div className="h-[832px] mt-2 bg-theme rounded-lg w-full
                    border border-gray-200 p-4 dark:border-[oklch(1_0_0_/_10%)] px-6">

                        {/* Invoice Fields */}
                        <div className="space-y-8 mt-4 ">
                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Date
                                </label>
                                <div className="flex border-none px-4 w-full text-sm h-[48px] items-center rounded-md
                          bg-gray-100 dark:bg-[#2a2a2a] cursor-not-allowed text-gray-500">
                                    {form.invoice_date}
                                </div>
                            </div>

                            <div className="items-center">
                                <label className="block text-sm font-medium mb-2">
                                    Car
                                </label>
                                <Input
                                    type="text"
                                    value={form.car_number}
                                    onChange={(e) => handleFormChange("car_number", e.target.value)}
                                    placeholder="AA XXXX AA"
                                    className="w-full border dark:bg-[#121212] h-[48px] dark:hover:bg-[#191919] hover:bg-[oklch(0.278_0.033_256.848_/_5%)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Sales</label>
                                <div className="w-full items-center border flex relative rounded-md dark:bg-[#121212] h-[48px] dark:hover:bg-[#191919] hover:bg-[oklch(0.278_0.033_256.848_/_5%)]">
                                    {isLoadingForm ? (
                                        <span className="text-gray-400">Loading...</span>
                                    ) : (
                                        <Input
                                            type="text"
                                            value={form.selectedSalesId && empMap[form.selectedSalesId]
                                                ? empMap[form.selectedSalesId].employee_name
                                                : "—"}
                                            readOnly
                                            placeholder="AA XXXX AA"
                                            className="w-full flex relative border rounded-md dark:bg-[#121212] h-[48px] dark:hover:bg-[#191919] hover:bg-[oklch(0.278_0.033_256.848_/_5%)]"
                                        />
                                    )}
                                    <button
                                        onClick={() => setEditSales(true)}
                                        className="text-sm text-blue-500 hover:underline px-3"
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>
                            {editSales && !isLoadingForm && (
                                <select
                                    value={form.selectedSalesId || ""}
                                    onChange={(e) => {
                                        const selectedSlsId = Number(e.target.value);
                                        setForm((prev) => ({
                                            ...prev,
                                            selectedSalesId: selectedSlsId,
                                            sales: [
                                                ...prev.sales.filter(
                                                    (s) => empMap[s.employee]?.role !== "Sales"
                                                ),
                                                { employee: selectedSlsId, total_sales_omzet: prev.amount_paid },
                                            ],
                                        }))
                                        setEditSales(false);
                                    }}
                                    className="mt-2 w-full px-4 py-2 border rounded-md"
                                >
                                    {salesOptions.map((e) => (
                                        <option key={e.employee_id} value={e.employee_id}>
                                            {e.employee_name}
                                        </option>
                                    ))}
                                </select>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-2">Mechanic</label>
                                <div className="w-full flex relative border rounded-md dark:bg-[#121212] h-[48px] dark:hover:bg-[#191919] hover:bg-[oklch(0.278_0.033_256.848_/_5%)]">
                                    {isLoadingForm ? (
                                        <span className="text-gray-400">Loading...</span>
                                    ) : (
                                        <Input
                                            type="text"
                                            value={form.selectedMechanicId && empMap[form.selectedMechanicId]
                                                ? empMap[form.selectedMechanicId].employee_name
                                                : "—"}
                                            readOnly
                                            placeholder="AA XXXX AA"
                                            className="w-full flex relative border rounded-md dark:bg-[#121212] h-[48px] dark:hover:bg-[#191919] hover:bg-[oklch(0.278_0.033_256.848_/_5%)]"
                                        />
                                    )}
                                    <button
                                        onClick={() => setEditMechanic(true)}
                                        className="text-sm text-blue-500 hover:underline px-3"
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>
                            {editMechanic && (
                                <select
                                    value={form.selectedMechanicId || ""}
                                    onChange={(e) => {
                                        const selectedMecId = Number(e.target.value)
                                        setForm((prev) => ({
                                            ...prev,
                                            selectedMechanicId: selectedMecId,
                                            sales: [
                                                ...prev.sales.filter(
                                                    (s) => empMap[s.employee]?.role !== "Mechanic"
                                                ),
                                                { employee: selectedMecId, total_sales_omzet: prev.amount_paid },
                                            ],
                                        }))
                                        setEditMechanic(false)
                                    }}
                                    className="mt-2 w-full px-4 py-2 border rounded-md"
                                >
                                    <option value="">-- Choose Mechanic --</option>
                                    {mechanicOptions.map(e => (
                                        <option key={e.employee_id} value={e.employee_id}>
                                            {e.employee_name}
                                        </option>
                                    ))}
                                </select>
                            )}

                            <div className="space-y-12 mt-28">
                                {/* Subtotal & Invoice Discount & Total */}
                                <div className="flex items-center text-[15px] justify-between">
                                    <span className="block font-regular">Subtotal</span>
                                    <span className="font-medium">{formatRupiah(subTotal)}</span>
                                </div>

                                <div className="flex items-center justify-between text-red-600 block text-[15px] font-regular">
                                    <span>Discount</span>
                                    <div className="flex items-center font-medium gap-2">
                                        <span>-Rp</span>
                                        <Input
                                            type="text"
                                            value={form.discount}
                                            onChange={(e) => handleFormChange("discount", e.target.value)}
                                            className="w-[94px] text-md text-red-600 text-right"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                {/* The dashed line */}
                                {/* <hr className="w-full border-t-4 border-dashed border-gray-300 my-4" /> */}
                                <svg className="w-full justify-between items-center" style={{ height: "1px" }} viewBox="0 0 100 2" preserveAspectRatio="none">
                                    <line x1="0" y1="1" x2="100" y2="1" stroke="gray" strokeWidth="8" strokeDasharray="6,3.5" />
                                </svg>

                                <div className="flex items-center justify-between text-[19px] font-medium">
                                    <span>Total</span>
                                    <span>{formatRupiah(totalInvoice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex mt-6">
                        <Dialog open={dialogUpdateChanges} onOpenChange={setDialogUpdateChanges}>
                            <DialogTrigger asChild>
                                <Button className="w-full rounded-[80px] bg-[#0456F7] text-white hover:bg-[#0348CF] h-[48px] text-md"
                                    onClick={() => setDialogUpdateChanges(true)}>
                                    Update Invoice Detail
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-sm p-12 md:p-12 rounded-[32px] [&>button]:hidden text-center justify-center w-auto"
                                onEscapeKeyDown={(e) => e.preventDefault()}
                                onPointerDownOutside={(e) => e.preventDefault()}
                            >
                                <DialogHeader>
                                    <DialogTitle className="text-4xl font-medium text-theme text-center">Update Changes</DialogTitle>
                                    <DialogDescription className="text-xl font-regular text-center mt-5 w-[340px]">
                                        You’re about to update the invoice details.
                                        This action will overwrite the current data in the database.
                                        Are you sure you want to proceed?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-5 flex w-full justify-center text-center mx-auto">
                                    <div>
                                        <Button
                                            onClick={handleUpdateInvoice}
                                            variant="outline"
                                            className="text-lg h-[48px] w-full bg-[#0456F7] text-white hover:text-white hover:bg-[#0348CF] rounded-[80px] cursor-pointer text-center dark:bg-[#0456F7] dark:text-white dark:hover:text-white dark:hover:bg-[#0348CF]">
                                            Update</Button>

                                        <Button variant="outline" className="text-lg mt-4 h-[48px] flex w-[340px] rounded-[80px] text-theme cursor-pointer"
                                            onClick={() => setDialogUpdateChanges(false)}>
                                            Cancel</Button>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div >
    )
}