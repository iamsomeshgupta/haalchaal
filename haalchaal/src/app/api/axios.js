import axios from "axios";

const api = axios.create({
    // use same-origin API routes in Next.js app router
    baseURL: "/api",
});

api.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) {
        // localStorage may be unavailable in some environments; ignore
    }
    return config;
});

export default api;