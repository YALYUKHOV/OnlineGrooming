import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { createService } from '../../http/serviceAPI';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import '../../styles/CommonStyles.css';

const CreateService = observer(({ show, onHide }) => {
    const { service } = useContext(Context);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [mainImage, setMainImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (show) {
            service.loadServices();
        }
    }, [show]);

    useEffect(() => {
        // Получаем уникальные категории из существующих услуг
        const uniqueCategories = [...new Set(service.services.map(s => s.category))].filter(Boolean);
        setCategories(uniqueCategories);
    }, [service.services]);

    const handleMainImageChange = (e) => {//обработчик изменения основного изображения
        const file = e.target.files[0];
        if (file) {
            setMainImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrls([url]);
        }
    };

    const handleAdditionalImagesChange = (e) => {//обработчик изменения дополнительных изображений
        const files = Array.from(e.target.files);//получаем все файлы из input
        setAdditionalImages(prev => [...prev, ...files]);//добавляем новые файлы в массив
        
        // Создаем URL для предпросмотра
        const newUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newUrls]);
    };

    const handleSubmit = async () => {
        try {
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

            if (mainImage) {
                formData.append('images', mainImage);
            }
            additionalImages.forEach(image => {
                formData.append('images', image);
            });

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
                        <Form.Label>Цена</Form.Label>
                        <Form.Control
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            placeholder="Введите цену"
                            type="number"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Длительность (в минутах)</Form.Label>
                        <Form.Control
                            value={duration}
                            onChange={e => setDuration(e.target.value)}
                            placeholder="Введите длительность"
                            type="number"
                        />
                    </Form.Group>
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
                <Button variant="outline-success" onClick={handleSubmit}>
                    Добавить
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateService;