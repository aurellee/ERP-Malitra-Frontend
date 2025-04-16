import axios from "axios";
import api from "@/api/api";

const createApiFunction = (method: string, url: string) => async (data?: object) => {
    try {
        const res = await api({
            method,
            url: `/${url}`,
            data: (method === "post" || method === "put" || method === "delete")
                ? data
                : undefined
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data;
        }
        return { message: "An unexpected error occured" };
    }
}

export default createApiFunction;