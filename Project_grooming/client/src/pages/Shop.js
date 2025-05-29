import React, { useContext, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../styles/CommonStyles.css';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { fetchCategoryService } from '../http/serviceAPI';
import TypeBar from '../components/TypeBar';
import ServiceItem from '../components/ServiceItem';

const Shop = observer(() => {
  const {service} = useContext(Context);

  useEffect(() => {
    console.log('Shop component mounted');
    service.loadServices();
  }, []);

  if (service.loading) {
    return <div>Загрузка...</div>;
  }

  if (service.error) {
    return <div>Ошибка: {service.error}</div>;
  }

  const displayServices = service.filteredServices || service.services;
  console.log('Display services:', displayServices);

  return (
    <Container className="page-container">
      <h2 className="mb-4">Наши услуги</h2>
      <TypeBar />
      <Row>
        {displayServices.map(service => (
          <Col key={service.id} md={4} className="mb-4">
            <ServiceItem service={service} />
          </Col>
        ))}
      </Row>
    </Container>
  );
});

export default Shop;