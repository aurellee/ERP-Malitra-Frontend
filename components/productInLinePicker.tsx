// components/ProductInlinePicker.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Plus, Minus, CheckCircle2 } from "lucide-react";
// import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import productApi from "@/api/productApi";

function formatRupiah(value: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value)
}

// Barcode scanner (client-only)
const BarcodeScannerComponent = dynamic(() => import("react-qr-barcode-scanner"), {
  ssr: false,
});

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
  currentItems: SelectedProduct[];
};

export default function ProductInlinePicker({ onAdd, currentItems }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await productApi().viewAllProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

    const existing = currentItems.find((item) => item.product_id === selectedProduct.product_id);

    const alreadyIn = currentItems.some((item) => item.product_id === selectedProduct.product_id)
        if (alreadyIn) {
            alert("Product already in invoice!")
            return
        }

    const newItem: SelectedProduct = {
      product_id: selectedProduct.product_id,
      price: selectedProduct.sale_price,
      quantity: existing ? existing.quantity + quantity : quantity,
      discount_per_item: 0,
    };

    onAdd(newItem);
    setSearchQuery("");
    setSelectedProduct(null);
    setQuantity(1);
  };

  return (
    <div className="w-full space-y-4">
      {/* Search + Scanner */}
      {/* <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4 items-start"> */}
        <Input
          placeholder="Search product ID or name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedProduct(null);
          }}
          className="h-[40px] dark:bg-[#121212] dark:text-white"
        />
        {/* <div className="w-full h-[140px] border rounded-md overflow-hidden border-gray-300 dark:border-gray-600">
          <BarcodeScannerComponent
            onUpdate={(err, result) => {
              if (result) setScannedCode(result.getText());
            }}
            width="100%"
            height="100%"
          />
        </div> */}
      {/* </div> */}

      {/* Table of filtered products */}
      <div className="border rounded-md shadow-sm max-h-[300px] overflow-auto dark:bg-[#181818] dark:text-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-[#222] dark:text-gray-300 text-gray-600">
            <tr>
              <th className="p-2">Select</th>
              <th className="p-2">Product ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Category</th>
              <th className="p-2 text-center">Stock</th>
              <th className="p-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr
                key={p.product_id}
                className={`cursor-pointer transition ${
                  selectedProduct?.product_id === p.product_id
                    ? "bg-blue-50 dark:bg-blue-900"
                    : "hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
                }`}
                onClick={() => setSelectedProduct(p)}
              >
                <td className="p-2 text-center">
                  <input
                    type="radio"
                    checked={selectedProduct?.product_id === p.product_id}
                    readOnly
                  />
                </td>
                <td className="p-2">{p.product_id}</td>
                <td className="p-2">{p.product_name}</td>
                <td className="p-2">
                    {p.category}</td>
                <td className="p-2 text-center">{p.product_quantity}</td>
                <td className="p-2 text-right">{formatRupiah(p.sale_price)}</td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-400 dark:text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Quantity & Add */}
      {selectedProduct && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <span className="text-sm dark:text-gray-200">Quantity:</span>
            <div className="inline-flex items-center border rounded px-2 py-0.5 dark:border-gray-600">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus size={14} />
              </button>
              <span className="px-3">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>
                <Plus size={14} />
              </button>
            </div>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 inline-flex items-center gap-2"
            onClick={handleAdd}
          >
            <CheckCircle2 size={16} />
            Add Product
          </Button>
        </div>
      )}
    </div>
  );
}