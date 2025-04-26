import axios from "axios";
import api from "./api";
import apiRequest from "@/constants/apiRequest";
import { register } from "module";

export default function authApi() {
    return {
        register: apiRequest("post", "register/"),
        login: apiRequest("post", "token/"),
        refreshAuth: apiRequest("post", "refresh/")
    }
}