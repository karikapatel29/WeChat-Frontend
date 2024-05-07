import http from "../http-connection";

class chatData {
    saveChat(data) {
        return http.post("/chats/save-chat", data);
    }

    deleteChat(messageId) {
        return http.delete(`/chats/delete-chat/${messageId}`);
    }

    loadChat(data) {
        return http.post("/chats/load-chat", data)
    }
}

export default new chatData();