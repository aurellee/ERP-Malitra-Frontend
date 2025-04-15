import axios from "axios";
import api from "./api";
import apiRequest from "@/constants/apiRequest";

export default function authApi() {
    return {
        login: apiRequest("post", "token/"),
        refreshAuth: apiRequest("post", "refresh/")
    }
}