"use client"

import React, { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Edit, Edit3, Pencil, PencilLine, Search, Trash, Trash2 } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { categoryColors } from "@/utils/categoryColors"
import invoiceApi from "@/api/invoiceApi";
import { useMemo } from "react"
import employeeApi from "@/api/employeeApi"
import productApi from "@/api/productApi"
import { useRouter } from "next/navigation"

const ITEMS_PER_PAGE = 9

function formatCurrency(value: number): string {
  // Example: "Rp 50.000"
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

type Employee = {
  employee_id: number;
  employee_name: string;
  role: string;
};

type Product = {
  product_id: string;
  product_name: string;
  category: string;
};

type Item = {
  product_id: string;
  price: number;
  quantity: number;
  discount_per_item: number;
};

type InvoiceDetail = {
  invoice_id: number;
  car_number: string;
  items: Item[];
  sales: { employee_id: number; role: string }[];
  discount: number;
};

type PendingInvoice = {
  invoice_id: number;
  car_number: string;
  employees: Employee[];
  total_quantity: number;
};

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

interface PendingInvoiceCardProps {
  invoiceNumber: number;
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
}) => (
  <div
    className={`space-y-2 rounded-lg border border-theme p-6 shadow-sm cursor-pointer h-auto ${isSelected ? "bg-[#0456F7] text-white" : "bg-theme text-theme"
      }`}
    onClick={onSelect}
  >
    <p className="font-semibold flex items-center w-full justify-between text-[16px]">
      Invoice
      <span className={`font-bold ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
        #{invoiceNumber}
      </span>
    </p>
    <p className="flex items-center justify-between text-[13px] font-medium">
      Car <span>{car}</span>
    </p>
    <p className="flex items-center justify-between text-[13px] font-medium">
      Sales <span>{sales}</span>
    </p>
    <p className="flex items-center justify-between text-[13px] font-medium">
      Mechanic <span>{mechanic}</span>
    </p>
    <p
      className={`mt-4 text-sm w-full p-1 rounded-md border text-center ${isSelected ? "text-white border-white" : "text-theme border-[#0456F7]"
        }`}
    >
      {itemCount} Items
    </p>
  </div>
);



export default function PendingOrderPage() {
  const router = useRouter();
  const [pendingInvoices, setPendingInvoices] = useState<PendingInvoice[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [invoiceDetail, setInvoiceDetail] = useState<InvoiceDetail | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Transfer Bank" | "Unpaid" | "">("");
  const [rawAmountPaid, setRawAmountPaid] = useState(0);
  const [displayAmountPaid, setDisplayAmountPaid] = useState("");
  const [dialogPaymentOpen, setDialogPaymentOpen] = useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  // const [subtotal, setSubtotal] = useState(0);
  // const [discount, setDiscount] = useState(0);
  // const [totalPendingInvoice, setTotalPendingInvoice] = useState(0);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const selectedCar = invoiceDetail?.car_number ?? "—"

  const sales = employees.find(e =>
    invoiceDetail?.sales.some(s => s.employee_id === e.employee_id && e.role === "Sales")
  )?.employee_name ?? "—"

  const mechanic = employees.find(e =>
    invoiceDetail?.sales.some(s => s.employee_id === e.employee_id && e.role === "Mechanic")
  )?.employee_name ?? "—"


  const subtotal = useMemo(() => {
    if (!invoiceDetail) return 0;
    return invoiceDetail.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [invoiceDetail]);
  const discount = invoiceDetail?.discount ?? 0;
  const totalPendingInvoice = subtotal - discount;



  useEffect(() => {
    async function fetchInitialData() {
      const [pendingRes, empRes, prodRes] = await Promise.all([
        invoiceApi().viewPendingInvoices(),
        employeeApi().viewAllEmployees(),
        productApi().viewAllProducts()
      ]);
      if (pendingRes.status === 200) setPendingInvoices(pendingRes.data);
      if (empRes.status === 200) setEmployees(empRes.data);
      if (prodRes.status === 200) setProducts(prodRes.data);
    }
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedInvoiceId) return;
    async function fetchDetail() {
      const res = await invoiceApi().viewInvoiceDetail({ invoice_id: selectedInvoiceId });
      if (res.status === 200) setInvoiceDetail(res.data);
    }
    fetchDetail();
  }, [selectedInvoiceId]);

  const productMap = useMemo(() => Object.fromEntries(products.map(p => [p.product_id, p])), [products]);
  const employeeMap = useMemo(() => Object.fromEntries(employees.map(e => [e.employee_id, e])), [employees]);


  const filteredInvoices = pendingInvoices.filter(inv =>
    inv.car_number.toLowerCase().includes(searchQuery.toLowerCase())
  );



  // Ensure that when the user types, we always update the display with formatted value.
  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "");
    const num = cleaned ? parseInt(cleaned, 10) : 0;
    setRawAmountPaid(num);
    setDisplayAmountPaid(formatCurrency(num));
  };

  const isFormValid =
    paymentMethod === "Unpaid" || ((paymentMethod === "Cash" || paymentMethod === "Transfer Bank") && rawAmountPaid > 0);


  const handleSave = async () => {
    if (!isFormValid || !invoiceDetail) return;

    const subtotal = invoiceDetail.items.reduce((sum, i) => sum + ((i.price * i.quantity) - i.discount_per_item), 0);
    const status =
      paymentMethod === "Unpaid"
        ? "Unpaid"
        : rawAmountPaid >= subtotal
          ? "Full Payment"
          : "Partially Paid";

    const payload = {
      invoice_id: invoiceDetail.invoice_id,
      invoice_date: new Date().toISOString().split("T")[0],
      amount_paid: rawAmountPaid,
      payment_method: paymentMethod,
      car_number: selectedCar,
      discount: discount,
      invoice_status: status,
      items: invoiceDetail.items.map((i) => ({
        product: i.product_id,
        quantity: i.quantity,
        price: i.price,
        discount_per_item: i.discount_per_item,
      })),

      sales: invoiceDetail.sales.map((s) => ({
        employee: s.employee_id,
        total_sales_omzet: rawAmountPaid,
      })),
    };

    try {
      const res = await invoiceApi().updateInvoice(payload);
      console.log("payload:", payload)
      console.log("res:", res)
      if (res.status === 200) {
        setSelectedInvoiceId(null);
        setInvoiceDetail(null);
        setDialogPaymentOpen(false);
        alert("Penting Invoice Updated Successfully!");
      } else {
        throw new Error("Failed to update pending invoice.");
      }
    } catch (err) {
      console.error("API update failed:", err);
      alert("Something went wrong during pending invoice update.");
    }
  }

  function handleCancel() {
    setDialogPaymentOpen(false)
  }


  const handleDeleteInvoice = async () => {
    if (selectedInvoiceId === null) return

    // Ambil produk yang akan di‐delete
    // const invoiceToDelete = pendingInvoices[selectedInvoiceId]

    try {
      // Kirim payload yang benar: product_id dari productToDelete, bukan form.productID
      const res = await invoiceApi().deleteInvoice({
        invoice_id: selectedInvoiceId,
      })

      if (res.error) {
        throw new Error(res.error)
      }

      // Success: tutup dialog, reset index, dan refresh list
      setDialogDeleteOpen(false)
      setDeleteIndex(null)
      setSelectedInvoiceId(null)
      setInvoiceDetail(null);
      const [pendingRes, empRes, prodRes] = await Promise.all([
        invoiceApi().viewPendingInvoices(),
        employeeApi().viewAllEmployees(),
        productApi().viewAllProducts()
      ]);
      if (pendingRes.status === 200) setPendingInvoices(pendingRes.data);
      if (empRes.status === 200) setEmployees(empRes.data);
      if (prodRes.status === 200) setProducts(prodRes.data);
    } catch (err) {
      console.error("Failed to delete:", err)
    }
  }


  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  // Hitung total item dan total halaman
  const totalItems = pendingInvoices.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  // Fungsi slice data sesuai halaman
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentData = pendingInvoices.slice(startIndex, endIndex)
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
          <h1 className="text-2xl font-bold">Pending Order</h1>
        </div>
        <ModeToggle />
      </div>


      {/* MAIN CONTENT: 2-column grid (left: invoice details, right: pending orders) */}
      <div className="w-full grid gap-6 grid-cols-[2fr_280px] flex flex-col h-full">


        {/* LEFT COLUMN: Table + Subtotal/Discount/Total + Action Buttons */}
        <div className="flex flex-col h-full">
          <div className="mt-2 mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold mt-2">
              Invoice<span className="ml-4 text-gray-500">{invoiceDetail ? `#${invoiceDetail.invoice_id}` : ''}</span>
            </h1>
          </div>

          {/* TABLE */}
          <div className=" w-full overflow-x-auto rounded-lg 
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:text-white text-gray-700 dark:divide-[oklch(1_0_0_/_10%)]">
                {invoiceDetail?.items?.map((item, idx) => {
                  const product = productMap[item.product_id];
                  // setDeleteIndex(idx)
                  const colorClass = categoryColors[product.category] || "bg-gray-100 text-gray-600"
                  return (
                    <tr key={idx}>
                      <td className="px-4 py-3">{item.product_id}</td>
                      <td className="px-4 py-3">{product.product_name}</td>
                      <td className="px-4 py-2 w-[172px] h-14">
                        <span
                          className={`inline-block w-full h-[32px] px-3 py-1.5 text-center rounded-full text-[13px] font-medium ${colorClass}`}
                        >
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        Rp {item.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3">
                        Rp {item.discount_per_item.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        Rp {(item.price * item.quantity - item.discount_per_item).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
                {!invoiceDetail && (
                  <tr>
                    <td colSpan={7} className="p-3 text-center text-muted-foreground">
                      No invoice selected
                    </td>
                  </tr>
                )}
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

            {/* Car Plate Row */}
            <div className="mt-3 flex w-full grid grid-cols-2 gap-6 justify-between">
              <div className="w-full p-6 space-y-5 rounded-lg shadow-sm border border-theme bg-theme justify-center items-center">
                {/* Subtotal row */}
                <div className="flex items-center w-full justify-between text-sm">
                  <span>Car</span>
                  <span>{selectedCar}</span>
                </div>

                {/* Sales row */}
                <div className="flex items-center w-full justify-between text-sm">
                  <span>Sales</span>
                  <span>{sales}</span>
                </div>

                {/* Mechanic row */}
                <div className="flex items-center w-full justify-between text-sm">
                  <span>Mechanic</span>
                  <span>{mechanic}</span>
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
                  <span>{formatCurrency(totalPendingInvoice)}</span>
                </div>
              </div>
            </div>



            {/* ACTION BUTTONS: DELETE, EDIT, PAYMENT */}
            <div className="mt-8 flex flex-wrap items-center gap-3 w-full grid grid-cols-3">
              {/* <button className="rounded-[80px] bg-[#DD0004] px-4 py-2 text-white h-[40px] hover:bg-[#BA0003]">
                Delete
              </button> */}
              <Dialog open={dialogDeleteOpen} onOpenChange={setDialogDeleteOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full rounded-[80px] bg-[#DD0004] px-4 py-2 text-white h-[40px] hover:bg-[#BA0003]"
                    // onClick={() => setDeleteIndex(idx)}
                    >
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm p-12 md:p-12 rounded-[32px] [&>button]:hidden text-center justify-center w-auto"
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
                      <Button onClick={handleDeleteInvoice}
                        className="text-lg h-[48px] w-full bg-[#DD0004] text-white hover:bg-[#BA0003] rounded-[80px] cursor-pointer text-center">Delete</Button>

                      <Button variant="outline" className="text-lg mt-4 h-[48px] flex w-[320px] rounded-[80px] text-theme cursor-pointer" onClick={() => setDialogDeleteOpen(false)}>Cancel</Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <button 
              onClick={() => router.push(`/editPendingInvoice?invoice_id=${selectedInvoiceId}`)}
              className="flex items-center justify-center gap-3 rounded-[80px] bg-theme px-4 py-2 text-theme border shadow-sm border-theme dark:border-gray-500 hover:opacity-90 h-[40px]">
                <PencilLine size={16} />
                Edit
              </button>

              <Dialog open={dialogPaymentOpen} onOpenChange={setDialogPaymentOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full rounded-[80px] bg-[#0456F7] text-white hover:bg-[#0348CF] h-[40px]"
                    onClick={() => setDialogPaymentOpen(true)}>
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
            </div>
          </footer>
        </div>


        {/* RIGHT COLUMN: PENDING ORDER LIST */}
        <div className="flex flex-col h-full">
          <div className="mt-2 mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold mt-2">
              Pending Order<span className="ml-4 text-gray-500">({pendingInvoices.length})</span>
            </h1>
          </div>
          {/* Search input */}
          <div className="relative w-full max-w-xs mb-4 items-center">
            <input
              type="text"
              placeholder="Search Pending Invoice..."
              className="pl-8 pr-3 w-full border rounded-md py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
              {/* Icon search */}
            </span>
          </div>
          <div className="overflow-y-auto max-h-196">
            <div className="space-y-4">
              {filteredInvoices.map((inv, index) => {
                const sales = inv.employees.find((e) => e.role === 'Sales');
                const mechanic = inv.employees.find((e) => e.role === 'Mechanic');
                return (
                  <PendingInvoiceCard
                    key={index}
                    invoiceNumber={inv.invoice_id}
                    car={inv.car_number}
                    sales={sales?.employee_name ?? '—'}
                    mechanic={mechanic?.employee_name ?? '—'}
                    itemCount={inv.total_quantity}
                    isSelected={selectedInvoiceId === inv.invoice_id}
                    onSelect={() => setSelectedInvoiceId(inv.invoice_id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}