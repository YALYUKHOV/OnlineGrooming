import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";

export const registration = async (email, password, name, phone) => {
    try {
        const {data} = await $host.post('/api/client/registration', { email, password, name, phone });
        localStorage.setItem('token', data.accessToken);
        return jwtDecode(data.accessToken);
    } catch (error) {
        throw error.response?.data || { message: 'Ошибка при регистрации' };
    }
};

export const login = async (email, password) => {
    try {
        const {data} = await $host.post('/api/client/login', { email, password });
        localStorage.setItem('token', data.accessToken);
        const decodedToken = jwtDecode(data.accessToken);
        console.log('Decoded token:', decodedToken);
        return decodedToken;
    } catch (error) {
        throw error.response?.data || { message: 'Ошибка при входе' };
    }
};

export const check = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Токен отсутствует');
        }
        const {data} = await $authHost.get('/api/client/check');
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return jwtDecode(data.token);
    } catch (error) {
        localStorage.removeItem('token');
        throw error.response?.data || { message: 'Ошибка при проверке авторизации' };
    }
};

export const logout = async () => {
    try {
        const {data} = await $authHost.post('/api/client/logout');
        localStorage.removeItem('token');
        return data;
    } catch (error) {
        localStorage.removeItem('token');
        throw error.response?.data || { message: 'Ошибка при выходе' };
    }
};
