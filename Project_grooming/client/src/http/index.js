import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const $host = axios.create({//экземпляр axios для запросов к API
    baseURL: API_URL,
    withCredentials: true
});

const $authHost = axios.create({//экземпляр axios для запросов к API с авторизацией
    baseURL: API_URL,
    withCredentials: true
});

const authInterceptor = (config) => {//перехватчик запросов с авторизацией
    const token = localStorage.getItem('token');//получаем токен из localStorage
    if (token) {
        config.headers.authorization = `Bearer ${token}`;//добавляем токен в заголовок запроса
    }
    if (!(config.data instanceof FormData)) {//если данные не являются FormData, то устанавливаем Content-Type
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
};

$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost };
