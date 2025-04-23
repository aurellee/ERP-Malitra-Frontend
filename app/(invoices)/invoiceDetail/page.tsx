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

const ITEMS_PER_PAGE = 13

function formatRupiah(value: number): string {
    return "Rp " + new Intl.NumberFormat("id-ID", {
        maximumFractionDigits: 0,
    }).format(value)
}


interface InvoiceDetailPage {
    invoice_id: number;
}

export default function InvoiceDetailPage() {
    const params = useSearchParams()
    const invoice_id = params.get("invoice_id") || "";

    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)
    const [dialogUpdateChanges, setDialogUpdateChanges] = useState(false)

    const [invoiceDetail, setInvoiceDetail] = useState<InvoiceDetail | null>(null);
    const [productMap, setProductMap] = useState<Record<string, any>>({});

    // use this to know which record we're editing
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)
    const [dialogEditOpen, setDialogEditOpen] = useState(false)

    const [allProducts, setAllProducts] = useState<[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await productApi().viewAllProducts();
            if (response.status === 200) {
                setAllProducts(response.data); // penting!
            }
        };
        fetchProducts();
    }, []);

    type InvoiceItem = {
        product_id: string;
        discount_per_item: number;
        quantity: number;
        price: number;
    };

    type InvoiceDetail = {
        invoice_id: number;
        invoice_date: string;
        invoice_status: string;
        car_number: string;
        amount_paid: number;
        payment_method: string;
        discount: number;
        items: InvoiceItem[];
        sales: {
            employee_id: number;
            employee_name: string;
            role: string;
        }[];
    };

    useEffect(() => {
        fetchInvoiceDetail();
    }, []);

    useEffect(() => {
        fetchAllProducts();
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchInvoiceDetail(); // Fetch ulang kalau kembali ke halaman ini
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    // Right column states
    const [form, setForm] = useState({
        invoice_id: 0, // or number
        invoice_date: "",
        amount_paid: 0,
        payment_method: "",
        car_number: "",
        discount: 0,
        invoice_status: "",
        sales: "",
        mechanic: "",
        items_data: [] as {
            product_id: string;
            quantity: number;
            price: number;
            discount_per_item: number;
        }[],
    });

    useEffect(() => {
        if (!invoiceDetail) return;

        const salesPerson = invoiceDetail.sales.find(emp => emp.role === "Sales");
        const mechanicPerson = invoiceDetail.sales.find(emp => emp.role === "Mechanic");

        setForm({
            invoice_id: invoiceDetail.invoice_id,
            invoice_date: invoiceDetail.invoice_date,
            amount_paid: invoiceDetail.amount_paid,
            payment_method: invoiceDetail.payment_method,
            car_number: invoiceDetail.car_number,
            discount: invoiceDetail.discount,
            invoice_status: invoiceDetail.invoice_status,

            sales: salesPerson?.employee_name || "",
            mechanic: mechanicPerson?.employee_name || "",

            items_data: invoiceDetail.items.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
                discount_per_item: item.discount_per_item,
            })),
        });
    }, [invoiceDetail]);

    const fetchInvoiceDetail = async () => {
        setLoading(true);
        try {
            const response = await invoiceApi().viewInvoiceDetail({ invoice_id: Number(invoice_id) });
            if (response.status === 200) {
                setInvoiceDetail(response.data);
            } else {
                console.error('Failed to fetch invoice details');
            }
        } catch (err) {
            console.error('Error fetching invoice details:', err);
        } finally {
            setLoading(false);
        }
    }

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


    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const filteredInvoiceDetail: InvoiceItem[] = invoiceDetail?.items?.filter((item) => {
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


    // const handleEditClick = (item: any, idx: number) => {
    //     setEditIndex(idx)

    //     setForm((prev) => ({
    //         ...prev,
    //         items_data: [
    //             ...prev.items_data.slice(0, idx),
    //             {
    //                 product_id: item.product_id,
    //                 quantity: item.quantity,
    //                 price: item.price,
    //                 discount_per_item: item.discount_per_item,
    //             },
    //             ...prev.items_data.slice(idx + 1),
    //         ],
    //     }))

    //     setDialogEditOpen(true)
    // }
    const handleEditClick = (invoice: any) => {
        setForm({
            invoice_id: invoice.invoice_id,
            invoice_date: invoice.invoice_date,
            amount_paid: invoice.amount_paid,
            payment_method: invoice.payment_method,
            car_number: invoice.car_number,
            discount: invoice.discount,
            invoice_status: invoice.invoice_status,
            sales: invoice.sales,
            mechanic: invoice.mechanic,
            items_data: invoice.items.map((item: any) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
                discount_per_item: item.discount_per_item,
            })),
        });
    };

    // PUT updated payload back to your API
    const handleUpdateInvoice = async () => {
        try {
            const payload = {
                invoice_id: form.invoice_id,
                invoice_date: form.invoice_date,
                amount_paid: form.amount_paid,
                payment_method: form.payment_method,
                car_number: form.car_number,
                discount: form.discount,
                invoice_status: form.invoice_status,
                items_data: form.items_data.map((item) => ({
                    product: item.product_id,
                    quantity: item.quantity,
                    price: item.price,
                    discount_per_item: item.discount_per_item
                })),
                // sales: [
                //     form.sales && { employee_id: form.sales },
                //     form.mechanic && { employee_id: form.mechanic }
                // ].filter(Boolean), // remove nulls
            };

            const res = await invoiceApi().updateInvoice(payload);
            if (res.error) throw new Error(res.error);

            console.log("Invoice updated successfully");
            setDialogEditOpen(false);
            await fetchInvoiceDetail(); // Refresh view
            setDialogUpdateChanges(false);
        } catch (err) {
            console.error("Failed to update invoice:", err);
        }
    };


    const handleFormChange = (field: string, value: any) => {
        setForm({ ...form, [field]: value });
    };

    // FUNGSI DELETE:
    const handleDeleteItemInInvoice = (index: number) => {
        const updatedItems = form.items_data.filter((_, i) => i !== index);
        setForm((prev) => ({
            ...prev,
            items_data: updatedItems,
        }));
    };

    const handleAddItem = (item: InvoiceItem) => {
        const existingIndex = form.items_data.findIndex(p => p.product_id === item.product_id);
        if (existingIndex !== -1) {
            const confirm = window.confirm("Product already exists. Add quantity?");
            if (!confirm) return;
            const updatedItems = [...form.items_data];
            updatedItems[existingIndex].quantity += item.quantity;
            setForm(prev => ({ ...prev, items_data: updatedItems }));
        } else {
            setForm(prev => ({
                ...prev,
                items_data: [...prev.items_data, item],
            }));
        }
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const updatedItems = [...form.items_data];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value,
        };
        setForm((prev) => ({
            ...prev,
            items_data: updatedItems,
        }));
    };


    const subTotal = form.items_data.reduce((sum, item) => {
        return sum + (item.price - item.discount_per_item) * item.quantity;
    }, 0);

    const totalInvoice = subTotal - Number(form.discount || 0);
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
                                    currentItems={form.items_data}
                                    onAdd={handleAddItem}
                                    onAddItems={(updated) => {
                                        setForm(prev => ({ ...prev, items_data: updated }));
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
                                                <button className="mr-2 text-[#0456F7] cursor-pointer">
                                                    <PencilLine size={16} />
                                                </button>
                                                <button className="text-[#DF0025] cursor-pointer" onClick={() => handleDeleteItemInInvoice(i)}>
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
                                    className="w-full dark:bg-[#121212] h-[48px] dark:hover:bg-[#191919] hover:bg-[oklch(0.278_0.033_256.848_/_5%)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Sales
                                </label>
                                <div className="flex border-none px-4 w-full text-sm h-[48px] items-center rounded-md
                          bg-gray-100 dark:bg-[#2a2a2a] cursor-not-allowed text-gray-500">
                                    {form.sales}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Mechanic
                                </label>
                                <div className="flex border-none px-4 w-full text-sm h-[48px] items-center rounded-md
                          bg-gray-100 dark:bg-[#2a2a2a] cursor-not-allowed text-gray-500">
                                    {form.mechanic}
                                </div>
                            </div>


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

                            {/* <div className="flex mt-28">
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
                                                    className="text-lg h-[48px] w-full bg-[#DD0004] text-white hover:bg-[#BA0003] rounded-[80px] cursor-pointer text-center">
                                                    Update</Button>

                                                <Button variant="outline" className="text-lg mt-4 h-[48px] flex w-[340px] rounded-[80px] text-theme cursor-pointer"
                                                    onClick={() => setDialogUpdateChanges(false)}>
                                                    Cancel</Button>
                                            </div>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div> */}
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
                                            className="text-lg h-[48px] w-full bg-[#0456F7] text-white hover:text-white hover:bg-[#0348CF] rounded-[80px] cursor-pointer text-center">
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
        </div>
    )
}