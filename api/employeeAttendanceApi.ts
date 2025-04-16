import apiRequest from "@/constants/apiRequest";

export default function employeeAttendanceApi() {
    return {
        newRequest: apiRequest("post", "employees/"),
        viewMonthlyEmployeePerformance: apiRequest("get", "employees/monthlyEmployeePerformance/"),
        deleteEmployee: apiRequest("delete", "employees/delete/"),
        updateEmployee: apiRequest("put", "employees/update/"),
        createEmployee: apiRequest("post", "employees/create/"),
    }
}