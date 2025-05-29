import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Context } from '../../index';
import '../../styles/CommonStyles.css';
import { createService } from '../../http/serviceAPI';

const CreateService = ({ show, onHide }) => {
    const { service } = useContext(Context);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [category, setCategory] = useState('');
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [mainImage, setMainImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [categories, setCategories] = useState([]);

    

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrls([url]);
        }
    };

 с

    const addService = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('duration', duration);
        
        if (isNewCategory) {
            formData.append('category', newCategory);
        } else {
            formData.append('category', category);
        }

        console.log('Main image:', mainImage);
        console.log('Additional images:', additionalImages);

        // Добавляем все изображения в массив images
        if (mainImage) {
            console.log('Appending main image:', mainImage.name);
            formData.append('images', mainImage);
        }
        additionalImages.forEach((image, index) => {
            console.log(`Appending additional image ${index}:`, image.name);
            formData.append('images', image);
        });

        // Проверяем содержимое FormData
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        try {
            await createService(formData);
            onHide();
            setName('');
            setDescription('');
            setPrice('');
            setDuration('');
            setCategory('');
            setIsNewCategory(false);
            setNewCategory('');
            setMainImage(null);
            setAdditionalImages([]);
            setPreviewUrls([]);
            service.loadServices();
        } catch (error) {
            console.error('Error creating service:', error);
            alert(error.response?.data?.message || 'Произошла ошибка при создании услуги');
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            className="create-service-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>Добавить услугу</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Название услуги</Form.Label>
                        <Form.Control
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Введите название услуги"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Описание</Form.Label>
                        <Form.Control
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Введите описание услуги"
                            as="textarea"
                            rows={3}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Стоимость</Form.Label>
                        <Form.Control
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            placeholder="Введите стоимость услуги"
                            type="number"
                            min="0"
                            step="100"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Длительность (в минутах)</Form.Label>
                        <Form.Control
                            value={duration}
                            onChange={e => setDuration(e.target.value)}
                            placeholder="Введите длительность услуги"
                            type="number"
                            min="0"
                            step="10"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            label="Ввести новую категорию"
                            checked={isNewCategory}
                            onChange={e => setIsNewCategory(e.target.checked)}
                        />
                    </Form.Group>
                    {isNewCategory ? (
                        <Form.Group className="mb-3">
                            <Form.Label>Новая категория</Form.Label>
                            <Form.Control
                                value={newCategory}
                                onChange={e => setNewCategory(e.target.value)}
                                placeholder="Введите название новой категории"
                            />
                        </Form.Group>
                    ) : (
                        <Form.Group className="mb-3">
                            <Form.Label>Категория</Form.Label>
                            <Form.Select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                            >
                                <option value="">Выберите категорию</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label>Основное изображение</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleMainImageChange}
                            accept="image/*"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Дополнительные изображения</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleAdditionalImagesChange}
                            accept="image/*"
                            multiple
                        />
                    </Form.Group>
                    {previewUrls.length > 0 && (
                        <div className="image-preview-container mb-3">
                            <h6>Предпросмотр изображений:</h6>
                            <div className="d-flex flex-wrap gap-2">
                                {previewUrls.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>
                    Закрыть
                </Button>
                <Button variant="outline-success" onClick={addService}>
                    Добавить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateService;
useEffect(() => {
        // Получаем уникальные категории из существующих услуг
        const uniqueCategories = [...new Set(service.services.map(s => s.category))].filter(Boolean);
        setCategories(uniqueCategories);
    }, [service.services]);