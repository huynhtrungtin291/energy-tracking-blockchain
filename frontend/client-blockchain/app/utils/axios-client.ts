import axios from "axios";

const axiosClient = axios.create({
    // baseURL: "https://cleansingly-timorous-margarett.ngrok-free.dev",
    baseURL: "http://10.10.5.118:80",
    // baseURL: "http://192.168.1.122:2004", // trung tin ket noi wifi ngoc yen 1 lau 2
    // baseURL: "http://10.132.75.44:2004", // oppo trung tin 
    // baseURL: "http://localhost:2004",
    headers: {
        "Content-Type": "application/json",
        // "ngrok-skip-browser-warning": "69420",
    },
});

// --- INTERCEPTOR ---
// Tự động chèn Token vào mỗi request
axiosClient.interceptors.request.use(
    (config) => {
        // Kiểm tra xem code có đang chạy ở trình duyệt không 
        // (để tránh lỗi SSR trong Next.js)
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("auth_token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;