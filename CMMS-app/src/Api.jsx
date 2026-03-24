import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,                 // Add access tokens with the request
});

/* =======================
   CSRF INTERCEPTOR (Add CSRF Token to requests that change the data)
======================= */
api.interceptors.request.use((config) => {
    const method = config.method?.toLowerCase();

    if (["post", "put", "patch", "delete"].includes(method)) {
        const csrfToken = document.cookie
            .split("; ")
            .find(row => row.startsWith("csrftoken="))
            ?.split("=")[1];

        if (csrfToken) {
            config.headers = config.headers || {};
            config.headers["X-CSRFToken"] = csrfToken;
        }
    }

    return config;
});

/* =======================
   AUTO REFRESH INTERCEPTOR (For refreshing access tokens using refresh tokens)
======================= */

let isRefreshing = false;
let failedQueue = [];    // Queue to store the promises of the resolving requests

const processQueue = (error = null) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only handle 401 errors
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/login") && // <--- Letting invalid password requests fall.
            !originalRequest.url.includes("/auth/refresh") // <--- Do not retry refresh requests
        ) {
            originalRequest._retry = true;

            // If refresh already in progress, wait
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => api(originalRequest));
            }

            isRefreshing = true;

            try {
                // Attempt refresh (cookie-based)
                await api.post("/auth/refresh/");

                processQueue();
                return api(originalRequest);

            }
            catch (refreshError) {
                processQueue(refreshError);

                // Use raw axios to avoid interceptor logic during emergency logout
                try {
                    const csrfToken = document.cookie
                        .split("; ")
                        .find(row => row.startsWith("csrftoken="))
                        ?.split("=")[1];

                    await axios.post(`${import.meta.env.VITE_API_URL}/api/logout/`, {}, {
                        withCredentials: true,
                        headers: csrfToken ? { "X-CSRFToken": csrfToken } : {}
                    });
                }
                catch (_) { /* ignore */ }

                window.location.href = "/home";
                return Promise.reject(refreshError);
            }
            finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;

//---------------------------------------------------------------------------------------------------------------------------