import { $authHost } from "./index";

// Получение всех записей (для админа)
export const fetchAllAppointments = async () => {
    const {data} = await $authHost.get('/api/appointment');
    return data;
};

// Получение записей пользователя
export const fetchUserAppointments = async () => {
    const {data} = await $authHost.get('/api/appointment/user');
    return data;
};

// Создание новой записи
export const createAppointment = async (appointmentData) => {
    const {data} = await $authHost.post('/api/appointment', appointmentData);
    return data;
};

// Отмена записи
export const cancelAppointment = async (id) => {
    const {data} = await $authHost.put(`/api/appointment/${id}/cancel`);
    return data;
};

// Обновление статуса записи (для админа)
export const updateAppointmentStatus = async (id, status) => {
    const {data} = await $authHost.put(`/api/appointment/${id}/status`, { status });
    return data;
}; 