import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { fetchAllAppointments, updateAppointmentStatus } from '../http/appointmentAPI';
import { Button, Card, Container, Row, Col, Form } from 'react-bootstrap';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const AdminAppointments = observer(() => {
    const { user } = useContext(Context);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const data = await fetchAllAppointments();
            setAppointments(data);
        } catch (error) {
            console.error('Ошибка при загрузке записей:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateAppointmentStatus(id, newStatus);
            await loadAppointments();
        } catch (error) {
            console.error('Ошибка при обновлении статуса:', error);
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <Container className="mt-4">
            <h2>Управление записями</h2>
            {appointments.length === 0 ? (
                <p>Нет активных записей</p>
            ) : (
                <Row>
                    {appointments.map((appointment) => (
                        <Col key={appointment.id} md={6} lg={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{appointment.service_name}</Card.Title>
                                    <Card.Text>
                                        ID записи: {appointment.id}
                                        <br />
                                        Клиент: {appointment.client_name}
                                        <br />
                                        Телефон: {appointment.client_phone}
                                        <br />
                                        Email: {appointment.client_email}
                                        <br />
                                        Дата: {format(new Date(appointment.date_time), 'dd MMMM yyyy', { locale: ru })}
                                        <br />
                                        Время: {format(new Date(appointment.date_time), 'HH:mm', { locale: ru })}
                                        <br />
                                        Стоимость: {appointment.service_price} ₽
                                        <br />
                                        Статус: {appointment.status}
                                    </Card.Text>
                                    <Form.Select
                                        value={appointment.status}
                                        onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                                    >
                                        <option value="запланировано">Запланировано</option>
                                        <option value="подтверждено">Подтверждено</option>
                                        <option value="завершено">Завершено</option>
                                        <option value="отменено">Отменено</option>
                                    </Form.Select>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
});

export default AdminAppointments; 