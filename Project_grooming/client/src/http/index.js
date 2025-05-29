import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const $host = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

const $authHost = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

const authInterceptor = (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }
    // Если отправляем FormData, не устанавливаем Content-Type
    if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
};

$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost };
