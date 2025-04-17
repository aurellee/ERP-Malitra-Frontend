import apiRequest from "@/constants/apiRequest";

export default function dashboardApi() {
    return {
        getDashboardData: apiRequest("get", "dashboard/")
    }
}