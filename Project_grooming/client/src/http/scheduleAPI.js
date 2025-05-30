import { $authHost, $host } from "./index";

// Получение доступных слотов на день
export const fetchAvailableSlots = async (date) => {
    const {data} = await $host.get('/api/schedule/available', {
        params: { date }
    });
    return data;
};

// Проверка доступности слотов для услуги
export const checkSlotsAvailability = async (date, serviceId, duration) => {
    const {data} = await $host.get('/api/schedule/check', {
        params: { date, serviceId, duration }
    });
    return data;
};

// Создание слотов на день (только для админа)
export const createDaySlots = async (date) => {
    const {data} = await $authHost.post('/api/schedule/create-day', { date });
    return data;
}; 