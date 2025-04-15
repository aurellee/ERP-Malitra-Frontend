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