import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/CommonStyles.css';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import TypeBar from '../components/TypeBar';
import ServiceItem from '../components/ServiceItem';
import CreateAppointment from '../components/modals/CreateAppointment';

const Shop = observer(() => {
  const { service } = useContext(Context);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    service.loadServices();
  }, [service]);

  const handleBookClick = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  if (service.loading) {
    return <div>Загрузка...</div>;
  }

  if (service.error) {
    return <div>Ошибка: {service.error}</div>;
  }

  const displayServices = service.filteredServices || service.services;

  return (
    <Container className="page-container">
      <h2 className="mb-4">Наши услуги</h2>
      <TypeBar />
      <Row>
        {displayServices.map(service => (
          <Col key={service.id} md={4} className="mb-4">
            <ServiceItem 
              service={service} 
              onBookClick={handleBookClick}
            />
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

export default Shop;