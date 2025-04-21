import apiRequest from "@/constants/apiRequest";
import api from "./api";

export default function employeeApi() {
    return {
        viewAllEmployees: apiRequest("get", "employees/"),
        viewMonthlyEmployeePerformance: apiRequest("get", "employees/monthlyEmployeePerformance/"),
        deleteEmployee: apiRequest("delete", "employees/delete/"),
        updateEmployee: apiRequest("put", "employees/update/"),
        createEmployee: apiRequest("post", "employees/create/"),

        // Attendance
        viewAttendances: apiRequest("get", "employees/attendance/"),
        updateAttendance: apiRequest("put", "employees/attendance/update/"),
        newRequest: apiRequest("post", "employees/attendance/summaryView/"),

        // Payroll
        viewPayroll: apiRequest("get", "employees/payroll/"),
        updateEmployeePayroll: apiRequest("put", "employees/payroll/update/"),
        createEmployeePayroll: apiRequest("post", "employees/payroll/create/"),
        deleteEmployeePayroll: apiRequest("delete", "employees/payroll/delete/"),

        // Benefits
        viewBenefitsList: apiRequest("get", "employees/benefits/"),
        viewBenefitsSummary: apiRequest("post", "employees/benefits/summaryView/"),
        createBenefit: apiRequest("post", "employees/benefits/create/"),
        updateBenefit: apiRequest("put", "employees/benefits/update/"),
        deleteBenefit: apiRequest("delete", "employees/benefits/delete/"),
        payAll: apiRequest("post", "employees/benefits/payAll/"),
    }
}