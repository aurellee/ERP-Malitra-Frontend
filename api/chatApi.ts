import apiRequest from "@/constants/apiRequest";

export default function chatApi() {
    return {
        sendQuestion: apiRequest("post", "chat/sendQuestion/"),
        loadRecentChat: apiRequest("post", "chat/loadRecentChat/"),
    }
}