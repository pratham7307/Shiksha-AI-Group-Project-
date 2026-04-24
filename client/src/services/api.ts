import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001/api',
});

// Simple Auth Injector
API.interceptors.request.use((config) => {
    const userStr = localStorage.getItem('shiksha_user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user && user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        } catch (e) {
            console.error("Auth Token Error", e);
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;
