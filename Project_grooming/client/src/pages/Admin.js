import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import CreateService from '../components/modals/CreateService';
import '../styles/CommonStyles.css';

const Admin = () => {
  const [serviceVisible, setServiceVisible] = useState(false);
  return (
    <Container className='d-flex flex-column align-items-center justify-content-center page-container'>
      <Button variant={'outline-dark'} className='mt-3 p-2' onClick={() => setServiceVisible(true)}>Добавить услугу</Button>
      <CreateService show={serviceVisible} onHide={() => setServiceVisible(false)} />
    </Container>
  );
};

export default Admin;
