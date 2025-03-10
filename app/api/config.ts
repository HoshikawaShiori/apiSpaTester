import axios from 'axios';

// Function to get CSRF token from cookie
const getCSRFToken = () => {
    const name = 'XSRF-TOKEN';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

// Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8000/',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

// Function to fetch CSRF token
export const fetchCSRFToken = async () => {
    try {
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
            withCredentials: true
        });
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
};

// Request interceptor to include CSRF token
api.interceptors.request.use(async (config) => {
    const token = getCSRFToken();
    if (token) {
        config.headers['X-XSRF-TOKEN'] = token;
    }
    return config;
});

// Response interceptor for handling 419 errors
let isRetry = false;
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if ((error.response?.status === 419 || error.response?.status === 403) && !isRetry) {
            isRetry = true;
            await fetchCSRFToken();
            const retryResponse = await api(error.config);
            isRetry = false;
            return retryResponse;
        }
        isRetry = false;
        return Promise.reject(error);
    }
);

export default api
