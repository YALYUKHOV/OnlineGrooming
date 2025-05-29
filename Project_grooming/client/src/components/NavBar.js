import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Context } from '../index';
import { SHOP_ROUTE, ADMIN_ROUTE, LOGIN_ROUTE } from '../utils/consts';
import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = observer(() => {
    const {user} = useContext(Context);
    const navigate = useNavigate();
    

    const handleLogout = () => {
        user.setIsAuth(false);
        user.setUser({});
        navigate(LOGIN_ROUTE);
    };

    return (
        <Navbar className="modern-navbar" expand="lg">
            <Container>
                <NavLink className="navbar-brand" to="/">
                    <span className="brand-text">PetGrooming</span>
                </NavLink>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Button 
                            className="nav-button services-button" 
                            onClick={() => navigate(SHOP_ROUTE)}
                        >
                            <i className="bi bi-scissors me-2"></i>
                            Услуги
                        </Button>
                    </Nav>
                    <Nav className="ms-auto">
                        {user.isAuth ? (
                            <>
                                {user.isAdmin && (
                                    <Button 
                                        className="nav-button admin-button" 
                                        onClick={() => navigate(ADMIN_ROUTE)}
                                    >
                                        <i className="bi bi-gear me-2"></i>
                                        Админ панель
                                    </Button>
                                )}
                                <Button 
                                    className="nav-button logout-button" 
                                    onClick={handleLogout}
                                >
                                    <i className="bi bi-box-arrow-right me-2"></i>
                                    Выйти
                                </Button>
                            </>
                        ) : (
                            <Button 
                                className="nav-button login-button" 
                                onClick={() => navigate(LOGIN_ROUTE)}
                            >
                                <i className="bi bi-person me-2"></i>
                                Войти
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
});

export default NavBar;
