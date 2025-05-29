import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { Context } from '../index';
import { Row, Col } from 'react-bootstrap';
import ServiceItem from './ServiceItem';

const ServiceList = observer(() => {
    const {service} = useContext(Context);
    
    useEffect(() => {
        console.log('ServiceList mounted');
        console.log('Current services:', service.services);
    }, [service.services]);

    if (service.loading) {
        console.log('Services are loading...');
        return <div>Загрузка...</div>;
    }

    if (service.error) {
        console.error('Error loading services:', service.error);
        return <div>Ошибка: {service.error}</div>;
    }

    if (!service.services || service.services.length === 0) {
        console.log('No services available');
        return <div>Нет доступных услуг</div>;
    }

    console.log('Rendering services:', service.services);
    
    return (
        <Row className='d-flex'>
            {service.services.map(service => {
                console.log('Rendering service:', service);
                return <ServiceItem key={service.id} service={service} />;
            })}
        </Row>
    );
});

export default ServiceList;
