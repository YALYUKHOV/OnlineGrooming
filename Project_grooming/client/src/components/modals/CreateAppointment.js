import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createAppointment } from '../../http/appointmentAPI';
import { fetchAvailableSlots } from '../../http/scheduleAPI';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ru } from 'date-fns/locale';

const CreateAppointment = ({ show, onHide, service }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show && selectedDate) {
            loadAvailableSlots();
        }
    }, [show, selectedDate]);

    const loadAvailableSlots = async () => {
        try {
            setLoading(true);
            const formattedDate = selectedDate.toISOString().split('T')[0];//форматируем дату в формате YYYY-MM-DD
            const slots = await fetchAvailableSlots(formattedDate);//получаем доступные слоты
            setAvailableSlots(slots);//записываем доступные слоты в state
        } catch (error) {
            console.error('Error loading available slots:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {//обработчик отправки формы
        try {
            if (!selectedSlot || !service) return;

            const appointmentData = {//данные для создания записи
                serviceId: service.id,
                scheduleId: selectedSlot.id,
                dateTime: selectedSlot.date_time
            };

            await createAppointment(appointmentData);
            onHide();//скрываем модальное окно
        } catch (error) {
            console.error('Error creating appointment:', error);
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Запись на услугу</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {service && (
                    <div className="mb-4">
                        <h5>{service.name}</h5>
                        <p>Длительность: {service.duration} мин</p>
                        <p>Цена: {service.price} ₽</p>
                    </div>
                )}

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Выберите дату</Form.Label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={date => {
                                setSelectedDate(date);
                                setSelectedSlot(null);
                            }}
                            locale={ru}
                            dateFormat="dd.MM.yyyy"
                            minDate={new Date()}
                            className="form-control"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Выберите время</Form.Label>
                        {loading ? (
                            <p>Загрузка доступного времени...</p>
                        ) : availableSlots.length > 0 ? (
                            <div className="d-flex flex-wrap gap-2">
                                {availableSlots.map(slot => (
                                    <Button
                                        key={slot.id}
                                        variant={selectedSlot?.id === slot.id ? "primary" : "outline-primary"}
                                        onClick={() => setSelectedSlot(slot)}
                                        disabled={!slot.is_available}
                                    >
                                        {formatTime(slot.date_time)}
                                    </Button>
                                ))}
                            </div>
                        ) : (
                            <p>Нет доступного времени на выбранную дату</p>
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Отмена
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleSubmit}
                    disabled={!selectedSlot || loading}
                >
                    Записаться
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateAppointment; 