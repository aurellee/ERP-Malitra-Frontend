import apiRequest from "@/constants/apiRequest";

export default function productApi() {
    return {
        viewAllInvoices: apiRequest("get", "invoice/"),
        invoiceSummaryFilter: apiRequest("post", "invoice/summaryFilter"),
        createInvoice: apiRequest("post", "invoice/create/"),
        deleteInvoice: apiRequest("delete", "invoice/delete/"),
        updateInvoice: apiRequest("put", "invoice/update/"),
        viewPendingInvoices: apiRequest("get", "invoice/getPendingInvoiceList/"),
        viewInvoiceDetail: apiRequest("post", "invoice/detail/"),

    }
}


/**
 * Get a single invoice by its ID.
 */
// export const getInvoiceById = async (id: number | string): Promise<Invoice> => {
//   try {
//     const response = await api.get(`/invoices/${id}/`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
