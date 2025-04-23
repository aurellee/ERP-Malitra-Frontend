"use client"

import React, { useState, useEffect } from "react"
import { Search, Plus, Minus, CheckCircle2, IceCreamCone, CircleStopIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import productApi from "@/api/productApi"
import { Button } from "./ui/button"
import { IconDropdown } from "react-day-picker"

function formatRupiah(value: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value)
}

type Product = {
    product_id: string;
    product_name: string;
    category: string;
    product_quantity: number;
    sale_price: number;
};

type SelectedProduct = {
    product_id: string;
    price: number;
    quantity: number;
    discount_per_item: number;
};

type Props = {
    onAdd: (item: SelectedProduct) => void;
    onAddItems?: (updated: SelectedProduct[]) => void; // ← optional override if editing
    currentItems: SelectedProduct[];
};

const categoryColors: Record<string, string> = {
    "SpareParts Mobil": "bg-blue-100 text-blue-700",
    "SpareParts Motor": "bg-green-100 text-green-700",
    "Oli": "bg-yellow-100 text-yellow-800",
    "Aki": "bg-pink-100 text-pink-600",
    "Ban": "bg-indigo-100 text-indigo-700",
    "Campuran": "bg-purple-100 text-purple-700",
}

export default function AddProductPicker({ onAdd, currentItems, onAddItems }: Props) {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [showSearch, setShowSearch] = useState(false)
    const [open, setOpen] = useState(false)

    const fetchProducts = async () => {
        try {
            const res = await productApi().viewAllProducts()
            setProducts(res.data)
        } catch (err) {
            console.error("Failed to fetch products", err)
        }
    }

    useEffect(() => {
        if (open) fetchProducts()
    }, [open])

    useEffect(() => {
        if (scannedCode) {
            setSearchQuery(scannedCode);
            const matched = products.find((p) => p.product_id === scannedCode);
            if (matched) setSelectedProduct(matched);
        }
    }, [scannedCode]);


    const filteredProducts = products.filter(
        (p) =>
            p.product_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAdd = () => {
        if (!selectedProduct || quantity <= 0) return;
    
        const existingIndex = currentItems.findIndex(
            (item) => item.product_id === selectedProduct.product_id
        );
    
        if (existingIndex !== -1) {
            const confirmAdd = window.confirm("Product already exists. Add quantity?");
            if (!confirmAdd) return;
    
            const updatedItems = [...currentItems];
            updatedItems[existingIndex].quantity += quantity;
    
            if (onAddItems) {
                onAddItems(updatedItems);
            }
        } else {
            const newItem: SelectedProduct = {
                product_id: selectedProduct.product_id,
                price: selectedProduct.sale_price,
                quantity,
                discount_per_item: 0,
            };
            onAdd(newItem);
        }
    
        setSearchQuery("");
        setSelectedProduct(null);
        setQuantity(1);
        setOpen(false);
    };

    return (
        <div className="relative w-full flex">
            {!open ? (
                <Button
                    onClick={() => setOpen(true)}
                    className="bg-[#0456F7] text-white hover:bg-blue-700 rounded-full h-[40px] px-5"
                >
                    + Add Product
                </Button>
            ) : (
                <>
                    <div className="absolute z-50 right-0 top-0 bottom-40 -translate-y-5 transition-all duration-500 ease-in-out ">
                    {/* <div
                        className={cn(
                            "fixed left-[47%] -translate-x-1/2 top-23 z-50 transition-all duration-500 ease-in-out w-[100%] max-w-5xl",
                            !open && "opacity-0 pointer-events-none"
                        )}> */}
                        <div className="relative flex items-center text-right justify-end rounded-full border w-266.5 px-6 h-[40px] bg-background dark:bg-[#121212]">
                            <Search size={16} className="text-muted-foreground mr-2" />
                            <div className="justify-between flex w-full">
                                <Input
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Scan barcode or search by ID or name..."
                                    className="border-none focus:ring-0 focus:outline-none placeholder:text-gray-400 text-sm appearance-none bg-background dark:bg-[#121212] shadow-none"
                                />

                            </div>
                            <X
                                size={16}
                                className="cursor-pointer text-gray-500 hover:text-red-500"
                                onClick={() => setOpen(false)}
                            />
                        </div>

                        <div className="absolute flex flex-col left-0 w-full mt-6 z-40 w-full">
                            <div className="flex w-full bg-white dark:bg-[#121212] shadow-lg border rounded-lg max-h-[800px] overflow-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 dark:bg-[#222] text-gray-600 dark:text-gray-300">
                                        <tr>
                                            <th className="text-left p-2"></th>
                                            <th className="text-left px-2 py-3.5">Product ID</th>
                                            <th className="text-left p-2">Name</th>
                                            <th className="text-left p-2">Category</th>
                                            <th className="text-left p-2">Stock</th>
                                            <th className="text-left p-2">Sale Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center p-4 text-gray-400 dark:text-gray-500">
                                                    No products found.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredProducts.map((product) => (
                                                <tr
                                                    key={product.product_id}
                                                    className={cn(
                                                        "cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2a2a2a]",
                                                        selectedProduct?.product_id === product.product_id && "bg-blue-50 dark:bg-blue-900"
                                                    )}
                                                    onClick={() => setSelectedProduct(product)}
                                                >
                                                    <td className="text-center py-3.5 px-4">
                                                        <input
                                                            type="radio"
                                                            checked={selectedProduct?.product_id === product.product_id}
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="text-left p-2">{product.product_id}</td>
                                                    <td className="text-left p-2">{product.product_name}</td>
                                                    <td className="text-left p-2">
                                                        <span
                                                            className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[product.category] || "bg-gray-200 text-gray-700"}`}
                                                        >
                                                            {product.category}
                                                        </span>
                                                    </td>
                                                    <td className="text-left p-2">{product.product_quantity}</td>
                                                    <td className="text-left p-2">{formatRupiah(product.sale_price)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {selectedProduct && (
                                <div className="flex items-center justify-between mt-6">
                                    <div className="flex items-center gap-4">
                                        <span className="text-md text-muted-foreground font-regular">Quantity:</span>
                                        <div className="flex items-center border rounded-full px-4 py-1 dark:border-gray-600 justify-between w-56">
                                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                                <Minus size={14} />
                                            </button>
                                            <span className="px-12">{quantity}</span>
                                            <button onClick={() => setQuantity(quantity + 1)}>
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleAdd}
                                        className="bg-[#0456F7] text-white hover:bg-blue-700 flex items-center gap-2 rounded-full w-64"
                                    >
                                        {/* <CheckCircle2 size={16} /> */}
                                        Add Product
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}