import axios from "axios";

const api = axios.create({
    baseURL: "https://ppfm-production.up.railway.app"
});

export default api;