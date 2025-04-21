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

export type Benefits = {
    [x: string]: any;
    employee: any;
    date: string;
    employee_id: number;
    employee_name: string;
    type: string;
    amount: number;
    status: string;
    notes: string;
}

export type PayrollType = {
    employee_payroll_id: number;
    employee_id: number;
    employee_name: string;
    payment_date: string; // ISO string format: e.g. "2025-04-21T05:44:30.218000Z"
    role: string; // Use union type based on your model
    sales_omzet_amount: number;
    salary_amount: number;
};