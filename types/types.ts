export type UserType = {
    email: string;
    password: string;
    userId: number;
    userName: string;
}

export type ErrorState = {
    email: string | null;
    password: string | null;
}

export type Invoice = {
    invoice_id: number;
    invoice_date: Date;
    sales: string;
    mechanic: string;
    total_price: number;
    amount_paid: number;
    unpaid_amount: number;
    payment_method: string;
    car_number: string;
    discount: number;
    invoice_status: string;
  }