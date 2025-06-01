import { $authHost, $host } from "./index";

// Получение доступных слотов на день
export const fetchAvailableSlots = async (date) => {
    const {data} = await $host.get('/api/schedule/available', {
        params: { date }
    });
    return data;
};


// Создание слотов на день (только для админа)
export const createDaySlots = async (date) => {
    const {data} = await $authHost.post('/api/schedule/create-day', { date });
    return data;
}; 