import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { fetchUserAppointments, cancelAppointment } from '../http/appointmentAPI';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';

const UserAppointments = observer(() => {
    const { user } = useContext(Context);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const data = await fetchUserAppointments();
            setAppointments(data);
        } catch (error) {
            console.error('Ошибка при загрузке записей:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        try {
            await cancelAppointment(id);
            await loadAppointments();
        } catch (error) {
            console.error('Ошибка при отмене записи:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <Container className="mt-4">
            <h2>Мои записи</h2>
            {appointments.length === 0 ? (
                <p>У вас пока нет записей</p>
            ) : (
                <Row>
                    {appointments.map((appointment) => (
                        <Col key={appointment.id} md={6} lg={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        {appointment.service_name}
                                    </Card.Title>
                                    <Card.Text>
                                        Дата: {formatDate(appointment.date_time)}
                                        <br />
                                        Время: {formatTime(appointment.date_time)}
                                        <br />
                                        Статус: {appointment.status}
                                        <br />
                                        Стоимость: {appointment.service_price} ₽
                                    </Card.Text>
                                    {appointment.status === 'запланировано' && (
                                        <Button 
                                            variant="danger" 
                                            onClick={() => handleCancel(appointment.id)}
                                        >
                                            Отменить запись
                                        </Button>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
});

export default UserAppointments; 