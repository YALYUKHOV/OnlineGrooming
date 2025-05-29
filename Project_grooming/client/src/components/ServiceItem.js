import React, { useState } from 'react';
import { Card, Carousel } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import '../styles/CommonStyles.css';

const ServiceItem = observer(({ service }) => {
    const [showCarousel, setShowCarousel] = useState(false);
    const [imageError, setImageError] = useState(false);
    const images = service.images || [];

    console.log('Service:', service);
    console.log('Service images:', images);
    console.log('API URL:', process.env.REACT_APP_API_URL);

    const getImageUrl = (imageName) => {
        if (!imageName) return '';
        const baseUrl = process.env.REACT_APP_API_URL?.endsWith('/') 
            ? process.env.REACT_APP_API_URL.slice(0, -1) 
            : process.env.REACT_APP_API_URL;
        return `${baseUrl}/static/${imageName}`;
    };

    const handleImageError = () => {
        console.error('Failed to load image:', getImageUrl(images[0]));
        setImageError(true);
    };

    return (
        <Card 
            className="service-card h-100"
            onMouseEnter={() => setShowCarousel(true)}
            onMouseLeave={() => setShowCarousel(false)}
        >
            <div className="service-image-container">
                {showCarousel && images.length > 1 ? (
                    <Carousel 
                        fade 
                        interval={3000} 
                        controls={true} 
                        indicators={true}
                        className="service-carousel"
                    >
                        {images.map((img, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100"
                                    src={getImageUrl(img)}
                                    alt={`${service.name} - изображение ${index + 1}`}
                                    style={{ height: 200, objectFit: 'cover' }}
                                    onError={handleImageError}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                ) : (
                    <Card.Img
                        variant="top"
                        src={getImageUrl(images[0])}
                        style={{ height: 200, objectFit: 'cover' }}
                        onError={handleImageError}
                    />
                )}
            </div>
            <Card.Body className="d-flex flex-column">
                <Card.Title>{service.name}</Card.Title>
                <Card.Text className="flex-grow-1">{service.description}</Card.Text>
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                        <strong>Цена: {service.price} ₽</strong>
                    </div>
                    <div>
                        <small>Длительность: {service.duration} мин.</small>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
});

export default ServiceItem;
