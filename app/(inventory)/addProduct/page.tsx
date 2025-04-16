"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { sendEkspedisi } from "@/api/productApi"; // Ensure this API function is defined

// Define the ProductForm interface
interface ProductForm {
  productID: string;
  productName: string;
  category: string;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
}

export default function ProductFormComponent() {
  // Initialize the form state
  const [form, setForm] = useState<ProductForm>({
    productID: "",
    productName: "",
    category: "",
    quantity: 0,
    purchasePrice: 0,
    salePrice: 0,
  });

  // Determine if the form is valid
  const isFormValid =
    form.productID.trim() !== "" &&
    form.productName.trim() !== "" &&
    form.category.trim() !== "" &&
    form.quantity > 0 &&
    form.purchasePrice > 0 &&
    form.salePrice > 0;

  // Generic change handler to update the state. It converts numeric fields appropriately.
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log("handleChange triggered:", { name, value });
    const newValue =
      name === "quantity" ||
      name === "purchasePrice" ||
      name === "salePrice"
        ? Number(value)
        : value;
    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // Handle form submission
  // const handleSubmitProductForm = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   // Check form validity
  //   if (!isFormValid) {
  //     console.error("Form is invalid", form);
  //     return;
  //   }
  //   try {
  //     // Call your API function with the entire form data
  //     const res = await sendEkspedisi(form);
  //     console.log("Ekspedisi response", res);
  //     // Optionally, update the UI here after the API call
  //   } catch (error) {
  //     console.error("Failed to send ekspedisi data", error);
  //   }
  // };

  return (
    <form className="space-y-4 p-4">
      {/* Product ID */}
      <div>
        <label htmlFor="productID" className="block text-sm font-medium mb-1">
          Product ID
        </label>
        <Input
          id="productID"
          name="productID"
          type="text"
          placeholder="Enter Product ID"
          value={form.productID}
          onChange={handleChange}
        />
      </div>
      {/* Product Name */}
      <div>
        <label htmlFor="productName" className="block text-sm font-medium mb-1">
          Product Name
        </label>
        <Input
          id="productName"
          name="productName"
          type="text"
          placeholder="Enter Product Name"
          value={form.productName}
          onChange={handleChange}
        />
      </div>
      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">Choose Category</option>
          <option value="Oli">Oli</option>
          <option value="SpareParts Mobil">SpareParts Mobil</option>
          <option value="SpareParts Motor">SpareParts Motor</option>
          <option value="Aki">Aki</option>
          <option value="Ban">Ban</option>
          <option value="Campuran">Campuran</option>
        </select>
      </div>
      {/* Quantity */}
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium mb-1">
          Quantity
        </label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          placeholder="Enter Quantity"
          value={form.quantity}
          onChange={handleChange}
        />
      </div>
      {/* Purchase Price */}
      <div>
        <label htmlFor="purchasePrice" className="block text-sm font-medium mb-1">
          Purchase Price
        </label>
        <Input
          id="purchasePrice"
          name="purchasePrice"
          type="text"
          placeholder="Enter Purchase Price"
          value={form.purchasePrice}
          onChange={handleChange}
        />
      </div>
      {/* Sale Price */}
      <div>
        <label htmlFor="salePrice" className="block text-sm font-medium mb-1">
          Sale Price
        </label>
        <Input
          id="salePrice"
          name="salePrice"
          type="text"
          placeholder="Enter Sale Price"
          value={form.salePrice}
          onChange={handleChange}
        />
      </div>
      {/* Submit Button */}
      <Button type="submit" disabled={!isFormValid}>
        Submit
      </Button>
    </form>
  );
}