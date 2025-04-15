import axios from "axios";
import { ACCESS_TOKEN } from "@/constants/AuthConstants";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { response } = error;
        if (response && response.status === 401) {
            try {
                const refreshToken = await localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    return Promise.reject(error);
                }
                
                const { data } = await api.post("refresh/", { refreshToken });

                await localStorage.setItem("accessToken", data.accessToken);
                await localStorage.setItem("refreshToken", data.refreshToken);

                if (error.config) {
                    error.config.headers.Authorization = `Bearer ${data.accessToken}`;
                    return api.request(error.config);
                }
            } catch (error) {
                console.log("Failed to refresh token: ", error);
            }
        }
        return Promise.reject(error);
    }
)

export default api