import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { fetchServices } from '../http/serviceAPI';
import CreateAppointment from '../components/modals/CreateAppointment';

const Services = observer(() => {
    const { service } = useContext(Context);
    const [selectedService, setSelectedService] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        service.loadServices();
    }, []);

    const handleBookClick = (service) => {
        setSelectedService(service);
        setShowModal(true);
    };

    if (service.loading) {
        return <div>Загрузка услуг...</div>;
    }

    if (service.error) {
        return <div>Ошибка при загрузке услуг: {service.error}</div>;
    }

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Наши услуги</h2>
            <Row>
                {service.services.map(service => (
                    <Col key={service.id} md={6} lg={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{service.name}</Card.Title>
                                <Card.Text>
                                    <strong>Категория:</strong> {service.category}
                                    <br />
                                    <strong>Длительность:</strong> {service.duration} мин
                                    <br />
                                    <strong>Цена:</strong> {service.price} ₽
                                    
                                </Card.Text>
                                <Button 
                                    variant="primary" 
                                    onClick={() => handleBookClick(service)}
                                >
                                    Записаться
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <CreateAppointment
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setSelectedService(null);
                }}
                service={selectedService}
            />
        </Container>
    );
});


export default Services; 