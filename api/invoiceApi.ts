// invoiceApi.ts
import axios from "axios";

// Set up the base URL using an environment variable or default to localhost:
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Define TypeScript interfaces for Invoice and InvoiceItem.
export interface Invoice {
  id: number | string;
  invoice_date: string; // e.g. "2025-05-25"
  amount_paid: number;
  payment_status: string;
  payment_method: string;
  car_number: string;
  discount: number;
  invoice_status: string;
  // ... add any additional fields as necessary
}

export interface InvoiceItem {
  invoice_detail_id: number | string;
  product_id: string;
  invoice_id: number | string;
  discount_per_item: number;
  quantity: number;
  price: number;
  // ... add any additional fields if needed
}

// API functions

/**
 * Get all invoices.
 */
export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const response = await api.get("/invoices/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a single invoice by its ID.
 */
export const getInvoiceById = async (id: number | string): Promise<Invoice> => {
  try {
    const response = await api.get(`/invoices/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new invoice.
 */
export const createInvoice = async (data: Partial<Invoice>): Promise<Invoice> => {
  try {
    const response = await api.post("/invoices/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing invoice.
 */
export const updateInvoice = async (
  id: number | string,
  data: Partial<Invoice>
): Promise<Invoice> => {
  try {
    const response = await api.put(`/invoices/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete an invoice.
 */
export const deleteInvoice = async (
  id: number | string
): Promise<any> => {
  try {
    const response = await api.delete(`/invoices/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all invoice items for a given invoice.
 */
export const getInvoiceItems = async (
  invoiceId: number | string
): Promise<InvoiceItem[]> => {
  try {
    const response = await api.get(`/invoices/${invoiceId}/items/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create an invoice item for a given invoice.
 */
export const createInvoiceItem = async (
  invoiceId: number | string,
  data: Partial<InvoiceItem>
): Promise<InvoiceItem> => {
  try {
    const response = await api.post(`/invoices/${invoiceId}/items/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing invoice item.
 */
export const updateInvoiceItem = async (
  invoiceItemId: number | string,
  data: Partial<InvoiceItem>
): Promise<InvoiceItem> => {
  try {
    const response = await api.put(`/invoice-items/${invoiceItemId}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete an invoice item.
 */
export const deleteInvoiceItem = async (
  invoiceItemId: number | string
): Promise<any> => {
  try {
    const response = await api.delete(`/invoice-items/${invoiceItemId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Export all functions as a default object for easier import.
export default {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoiceItems,
  createInvoiceItem,
  updateInvoiceItem,
  deleteInvoiceItem,
};