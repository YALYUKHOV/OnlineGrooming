import React, { useState, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { REGISTRATION_ROUTE, LOGIN_ROUTE, HOME_ROUTE } from '../utils/consts';
import '../styles/CommonStyles.css';
import { registration, login } from '../http/userAPI';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';

const Auth = observer(() => {
  const {user} = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === LOGIN_ROUTE;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const validatePhone = (phone) => {
    return /^\+[0-9]{11}$/.test(phone);
  };

  const click = async () => {
    try {
      let data;
      setError('');
      if (isLogin) {
        data = await login(email, password);
      } else {
        if (!validatePhone(phone)) {
          setError('Телефон должен быть в формате +7XXXXXXXXXX');
          return;
        }
        data = await registration(email, password, name, phone);
      }
      user.setUser(data);
      user.setIsAuth(true);
      navigate(HOME_ROUTE);
    } catch (e) {
      alert(e.response?.data?.errors?.[0]?.msg || 'Произошла ошибка');
      console.error('Auth error:', e);
      setError(e.response?.data?.errors?.[0]?.msg || 'Произошла ошибка');
    }
  };

  return (
    <Container className='d-flex justify-content-center align-items-center' style={{height: window.innerHeight - 54}}>
      <Card style={{width: 600}} className='p-5 auth-form'>
        <h2 className='m-auto form-title'>{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
        <Form className='d-flex flex-column justify-content-center'>
          {!isLogin && (
            <>
              <Form.Control
                className='mt-3'
                placeholder='Введите ваше имя...'
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <Form.Control
                className='mt-3'
                placeholder='Введите ваш телефон...'
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </>
          )}
          <Form.Control
            className='mt-3'
            placeholder='Введите ваш email...'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Form.Control
            className='mt-3'
            placeholder='Введите ваш пароль...'
            value={password}
            onChange={e => setPassword(e.target.value)}
            type='password'
          />
          {error && <div className='text-danger mt-2'>{error}</div>}
          <Row className='d-flex justify-content-between mt-3 ps-3 pe-3 align-items-center'>
            <div className='text-muted'>
              {isLogin ? 'Нет аккаунта?' : 'Есть аккаунт?'} <NavLink to={isLogin ? REGISTRATION_ROUTE : LOGIN_ROUTE} className='text-decoration-none'>{isLogin ? 'Зарегистрируйтесь' : 'Войдите'}</NavLink>
            </div>
            <Col className='d-flex justify-content-end'>
              <Button 
                variant={'outline-success'} 
                className='px-4'
                onClick={click}
              >
                {isLogin ? 'Войти' : 'Регистрация'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );
});

export default Auth;