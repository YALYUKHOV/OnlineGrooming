import { $authHost } from "./index";

// Получение записей пользователя
export const fetchUserAppointments = async () => {
    try {
        const {data} = await $authHost.get('/api/appointment/user');
        return data;
    } catch (error) {
        console.error('Error in fetchUserAppointments:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw error;
    }
};

// Создание новой записи
export const createAppointment = async (appointmentData) => {
    try {
        const {data} = await $authHost.post('/api/appointment', appointmentData);
        return data;
    } catch (error) {
        console.error('Error in createAppointment:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw error;
    }
};

// Отмена записи
export const cancelAppointment = async (id) => {
    try {
        const {data} = await $authHost.put(`/api/appointment/${id}/cancel`);
        return data;
    } catch (error) {
        console.error('Error in cancelAppointment:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw error;
    }
}; 