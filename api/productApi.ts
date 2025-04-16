import apiRequest from "@/constants/apiRequest";

export default function productApi() {
    return {
        viewAllProducts: apiRequest("get", "products/withLatestPrices/"),
        createProduct: apiRequest("post", "products/create/"),
        deleteProduct: apiRequest("delete", "products/delete/"),
        updateProduct: apiRequest("put", "products/update/"),
        findProduct: apiRequest("post", "products/findProduct/"),

        viewEkspedisi: apiRequest("get", "ekspedisi/"),
        createEkspedisi: apiRequest("post", "ekspedisi/create/"),
        addFirstEkspedisi: apiRequest("post", "ekspedisi/firstCreate/"),
        deleteEkspedisi: apiRequest("delete", "ekspedisi/delete/"),
        updateEkspedisi: apiRequest("put", "ekspedisi/update/"),
    }
}