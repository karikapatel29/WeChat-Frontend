import http from "../http-connection.js";
import axios from "axios";

class AppDataServices {

    login(data) {
        return http.post("/", data);
    }
    register(data) {
        return http.post("/signup", data);
    }
    editprofile(data) {
        return http.post("/edit-profile", data, {
            headers: {
                "Content-type": "multipart/form-data"
            }
        })
    }

    deleteUser(uniqueVal) {
        return http.delete(`/delete/${uniqueVal}`)
    }

    getUser(uniqueVal) {
        return http.get(`getuser/${uniqueVal}`)
    }

    getAllUsers(uniqueVal) {
        return http.get(`getallusers/${uniqueVal}`)
    }
}

export default new AppDataServices;