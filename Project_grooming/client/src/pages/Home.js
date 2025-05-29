import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SHOP_ROUTE } from '../utils/consts';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section text-center">
                <div className="container">
                    <h1 className="display-4 mb-4">Добро пожаловать в наш салон красоты</h1>
                    <p className="lead mb-5">Профессиональный уход за вашими питомцами</p>
                    <button 
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate(SHOP_ROUTE)}
                    >
                        Наши услуги
                    </button>
                </div>
            </section>

            {/* Welcome Section */}
            <section className="py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="welcome-image">
                                <img 
                                    src="/images/welcome.jpg" 
                                    alt="Welcome" 
                                    className="img-fluid rounded"
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h2 className="mb-4">О нашем салоне</h2>
                            <p className="lead">
                                Мы предлагаем полный спектр услуг по уходу за вашими питомцами.
                                Наши профессиональные грумеры обеспечат вашему любимцу
                                первоклассный уход и внимание.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-5 bg-light">
                <div className="container">
                    <h2 className="text-center mb-5">Наши услуги</h2>
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="service-card card h-100">
                                <div className="card-body text-center">
                                    <div className="service-icon mb-3">
                                        <i className="fas fa-cut"></i>
                                    </div>
                                    <h3 className="h5">Стрижка</h3>
                                    <p>Профессиональная стрижка для собак и кошек</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="service-card card h-100">
                                <div className="card-body text-center">
                                    <div className="service-icon mb-3">
                                        <i className="fas fa-bath"></i>
                                    </div>
                                    <h3 className="h5">Мытье</h3>
                                    <p>Гигиенические процедуры с использованием профессиональных средств</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="service-card card h-100">
                                <div className="card-body text-center">
                                    <div className="service-icon mb-3">
                                        <i className="fas fa-paw"></i>
                                    </div>
                                    <h3 className="h5">Уход за лапами</h3>
                                    <p>Стрижка когтей и уход за подушечками лап</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="feature-box text-center">
                                <div className="feature-icon mb-3">
                                    <i className="fas fa-certificate"></i>
                                </div>
                                <h3>Профессионализм</h3>
                                <p>Опытные мастера с многолетним стажем</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="feature-box text-center">
                                <div className="feature-icon mb-3">
                                    <i className="fas fa-heart"></i>
                                </div>
                                <h3>Забота</h3>
                                <p>Индивидуальный подход к каждому питомцу</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="feature-box text-center">
                                <div className="feature-icon mb-3">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <h3>Удобство</h3>
                                <p>Гибкое расписание и онлайн-запись</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section py-5">
                <div className="container">
                    <h2 className="mb-4">Запишитесь на прием прямо сейчас</h2>
                    <p className="lead mb-4">Подарите своему питомцу профессиональный уход</p>
                    <button 
                        className="btn btn-outline-light btn-lg"
                        onClick={() => navigate(SHOP_ROUTE)}
                    >
                        Записаться
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home; 