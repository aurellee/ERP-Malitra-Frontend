"use client"

import React, { useState, useEffect } from "react"
import { Search, Plus, Minus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import productApi from "@/api/productApi"

function formatRupiah(value: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

type Product = {
  product_id: string
  product_name: string
  category: string
  product_quantity: number
  sale_price: number
}

type SelectedItem = {
  product_id: string
  quantity: number
  price: number
  discount_per_item: number
}

type Props = {
  currentItems: {
    product_id: string
    quantity: number
    price: number
    discount_per_item: number
  }[]
  onAdd: (item: SelectedItem) => void
  allProducts: Product[]
}

const categoryColors: Record<string, string> = {
  "SpareParts Mobil": "bg-blue-100 text-blue-700",
  "SpareParts Motor": "bg-green-100 text-green-700",
  "Oli": "bg-yellow-100 text-yellow-800",
  "Aki": "bg-pink-100 text-pink-600",
  "Ban": "bg-indigo-100 text-indigo-700",
  "Campuran": "bg-purple-100 text-purple-700",
}

const AddProductPicker: React.FC<Props> = ({ currentItems, onAdd, allProducts }) => {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [showSearch, setShowSearch] = useState(false)
  const [products, setAllProducts] = useState<Product[]>([]);

useEffect(() => {
  const fetchProducts = async () => {
    const response = await productApi().viewAllProducts();
    if (response.status === 200) {
      setAllProducts(response.data); // penting!
    }
  };
  fetchProducts();
}, []);

  const handleAdd = () => {
    const product = allProducts.find((p) => p.product_id === selected)
    if (!product) return

    const alreadyIn = currentItems.some((item) => item.product_id === selected)
    if (alreadyIn) {
      alert("Product already in invoice!")
      return
    }

    onAdd({
      product_id: product.product_id,
      quantity,
      price: product.sale_price,
      discount_per_item: 1000,
    })

    // Reset
    setSearch("")
    setSelected("")
    setQuantity(1)
  }

  const filteredProducts = allProducts.filter((product) => {
    const keyword = search.toLowerCase()
    return (
      product.product_id.toLowerCase().includes(keyword) ||
      product.product_name.toLowerCase().includes(keyword)
    )
  })

  const selectedProduct = allProducts.find((p) => p.product_id === selected)

  return (
    <div className="relative w-full">
      {!showSearch ? (
        <button
          className="text-white bg-[#0456F7] px-6 py-2 font-medium text-[15px] h-[40px] rounded-full"
          onClick={() => setShowSearch(true)}
        >
          + Add Product
        </button>
      ) : (
        <div className="relative rounded-full border items-center flex">
          {/* Barcode scanner or search input */}
          <div className="pl-5 text-gray-500 items-center">
            <Search size={14} />
          </div>
          <Input
            type="text"
            placeholder="Scan Barcode or Search Product Manually..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-4 w-full appearance-none focus:outline-none focus:ring-0 outline-none border-none"
          />
          

          {/* Product dropdown list */}
          {search && (
            <div className="absolute z-10 mt-1 w-full rounded-md shadow-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#121212] max-h-[250px] overflow-y-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product.product_id}
                  className={cn(
                    "cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#1f1f1f]",
                    selected === product.product_id && "bg-gray-100 dark:bg-[#1f1f1f]"
                  )}
                  onClick={() => {
                    setSelected(product.product_id)
                    setSearch(product.product_name)
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{product.product_name}</p>
                      <p className="text-sm text-gray-500">{product.product_id}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColors[product.category] || "bg-gray-100 text-gray-500"}`}
                    >
                      {product.category}
                    </span>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-500 text-center">
                  No products found.
                </div>
              )}
            </div>
          )}

          {/* Quantity & Add Button */}
          {selectedProduct && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">Quantity:</span>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-1 border rounded-md"
                >
                  <Minus size={12} />
                </button>
                <span className="w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 py-1 border rounded-md"
                >
                  <Plus size={12} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AddProductPicker;

// "use client";

// import React, { useEffect, useState } from "react";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Plus, Minus } from "lucide-react";
// import productApi from "@/api/productApi";
// import { DialogTitle } from "@radix-ui/react-dialog";
// // import { formatRupiah } from "@/lib/utils"; // make sure this exists

// function formatRupiah(value: number): string {
//     return new Intl.NumberFormat("id-ID", {
//         style: "currency",
//         currency: "IDR",
//         minimumFractionDigits: 0,
//     }).format(value)
// }

// type Product = {
//     product_id: string;
//     product_name: string;
//     category: string;
//     product_quantity: number;
//     sale_price: number;
// };

// type SelectedProductWithQty = {
//     product_id: string;
//     product_name: string;
//     category: string;
//     price: number;
//     quantity: number;
//     discount_per_item: number;
// };

// type ProductPickerModalProps = {
//     triggerLabel?: string;
//     onAdd: (item: SelectedProductWithQty) => void;
// };

// export default function ProductPickerModal({
//     triggerLabel = "+ Add Product",
//     onAdd,
// }: ProductPickerModalProps) {
//     const [isOpen, setIsOpen] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [products, setProducts] = useState<Product[]>([]);
//     const [filtered, setFiltered] = useState<Product[]>([]);
//     const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//     const [quantity, setQuantity] = useState(1);

//     const fetchProducts = async () => {
//         try {
//             const res = await productApi().viewAllProducts();
//             setProducts(res.data);
//         } catch (err) {
//             console.error("Failed to fetch products", err);
//         }
//     };

//     useEffect(() => {
//         fetchProducts();
//     }, []);

//     useEffect(() => {
//         const lower = searchQuery.toLowerCase();
//         setFiltered(
//             products.filter(
//                 (p) =>
//                     p.product_id.toLowerCase().includes(lower) ||
//                     p.product_name.toLowerCase().includes(lower)
//             )
//         );
//     }, [searchQuery, products]);

//     const handleAdd = () => {
//         if (!selectedProduct || quantity <= 0) return;
//         onAdd({
//             product_id: selectedProduct.product_id,
//             product_name: selectedProduct.product_name,
//             category: selectedProduct.category,
//             price: selectedProduct.sale_price,
//             quantity,
//             discount_per_item: 0,
//         });
//         setIsOpen(false);
//         setSearchQuery("");
//         setSelectedProduct(null);
//         setQuantity(1);
//     };

//     return (
//         <Dialog open={isOpen} onOpenChange={setIsOpen}>
//             <DialogTrigger asChild>
//                 <Button variant="default">{triggerLabel}</Button>
//             </DialogTrigger>
//             <DialogTitle/>
//             <DialogContent className="max-w-4xl">
//                 <div className="p-4">
//                     <div className="mb-4 flex justify-between items-center">
//                         <Input
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             placeholder="Search product by ID or name..."
//                         />
//                     </div>
//                     <div className="max-h-[300px] overflow-auto rounded-md border">
//                         <table className="w-full text-sm text-left">
//                             <thead className="bg-gray-100">
//                                 <tr>
//                                     <th className="p-2">Select</th>
//                                     <th className="p-2">Product ID</th>
//                                     <th className="p-2">Product Name</th>
//                                     <th className="p-2">Category</th>
//                                     <th className="p-2">Stock</th>
//                                     <th className="p-2">Price</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {filtered.map((product) => (
//                                     <tr key={product.product_id} className="border-t">
//                                         <td className="p-2">
//                                             <input
//                                                 type="radio"
//                                                 checked={selectedProduct?.product_id === product.product_id}
//                                                 onChange={() => setSelectedProduct(product)}
//                                             />
//                                         </td>
//                                         <td className="p-2">{product.product_id}</td>
//                                         <td className="p-2">{product.product_name}</td>
//                                         <td className="p-2">{product.category}</td>
//                                         <td className="p-2">{product.product_quantity}</td>
//                                         <td className="p-2">{formatRupiah(product.sale_price)}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                         {filtered.length === 0 && (
//                             <div className="p-4 text-center text-sm text-gray-500">
//                                 No product found
//                             </div>
//                         )}
//                     </div>

//                     <div className="mt-4 flex items-center justify-between">
//                         <div className="flex items-center gap-4">
//                             <span>Quantity:</span>
//                             <div className="flex items-center border rounded-md px-3 py-1">
//                                 <button
//                                     onClick={() => setQuantity((q) => Math.max(0, q - 1))}
//                                     className="text-gray-500"
//                                 >
//                                     <Minus size={16} />
//                                 </button>
//                                 <span className="px-4">{quantity}</span>
//                                 <button
//                                     onClick={() => setQuantity((q) => q + 1)}
//                                     className="text-gray-500"
//                                 >
//                                     <Plus size={16} />
//                                 </button>
//                             </div>
//                         </div>
//                         <Button
//                             disabled={!selectedProduct || quantity <= 0}
//                             onClick={handleAdd}
//                             className="bg-blue-600 hover:bg-blue-700"
//                         >
//                             Add Product
//                         </Button>
//                     </div>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// }