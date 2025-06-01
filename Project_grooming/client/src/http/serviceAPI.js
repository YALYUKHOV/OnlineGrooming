import axios from 'axios';
import { $authHost, $host } from "./index";

// Получение всех активных услуг
export const fetchServices = async () => {
    const {data} = await $host.get('/api/service');
    return data;
};

// Получение всех услуг для админ-панели
export const fetchAdminServices = async () => {
    const {data} = await $authHost.get('/api/service/admin');
    return data;
};


// Создание новой услуги (только для админа)
export const createService = async (service) => {
    const {data} = await $authHost.post('/api/service', service, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return data;
};


// Загрузка изображения для услуги (только для админа)
export const uploadServiceImage = async (file) => {
    const formData = new FormData();
    formData.append('img', file);
    const {data} = await $authHost.post('/api/service/upload', formData);
    return data;
};

// Переключение статуса услуги (только для админа)
export const toggleServiceStatus = async (id) => {
    const {data} = await $authHost.put(`/api/service/${id}/toggle`);
    return data;
}; 