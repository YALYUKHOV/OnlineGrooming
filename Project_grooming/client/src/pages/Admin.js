import React, { useState, useContext, useEffect } from 'react';
import { Container, Button, Table } from 'react-bootstrap';
import CreateService from '../components/modals/CreateService';
import { Context } from '../index';
import { fetchAdminServices, toggleServiceStatus } from '../http/serviceAPI';
import '../styles/CommonStyles.css';

const Admin = () => {
  const [serviceVisible, setServiceVisible] = useState(false);
  const { service } = useContext(Context);
  const [adminServices, setAdminServices] = useState([]);

  useEffect(() => {
    loadAdminServices();
  }, []);

  const loadAdminServices = async () => {
    try {
      const services = await fetchAdminServices();
      setAdminServices(services);
    } catch (error) {
      console.error('Error loading admin services:', error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleServiceStatus(id);
      await loadAdminServices(); // Перезагружаем список услуг
    } catch (error) {
      console.error('Error toggling service status:', error);
    }
  };

  return (
    <Container className='d-flex flex-column align-items-center justify-content-center page-container'>
      <h2 className="mb-4">Панель администратора</h2>
      <Button 
        variant={'outline-dark'} 
        className='mb-4 p-2' 
        onClick={() => setServiceVisible(true)}
      >
        Добавить услугу
      </Button>

      <Table striped bordered hover className="w-100">
        <thead>
          <tr>
            <th>Название</th>
            <th>Категория</th>
            <th>Цена</th>
            <th>Длительность</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {adminServices.map(service => (
            <tr key={service.id}>
              <td>{service.name}</td>
              <td>{service.category}</td>
              <td>{service.price} ₽</td>
              <td>{service.duration} мин</td>
              <td>
                <span className={`badge ${service.isActive ? 'bg-success' : 'bg-danger'}`}>
                  {service.isActive ? 'Активна' : 'Неактивна'}
                </span>
              </td>
              <td>
                <Button
                  variant={service.isActive ? 'outline-danger' : 'outline-success'}
                  size="sm"
                  onClick={() => handleToggleStatus(service.id)}
                >
                  {service.isActive ? 'Скрыть' : 'Показать'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <CreateService show={serviceVisible} onHide={() => setServiceVisible(false)} />
    </Container>
  );
};

export default Admin;
