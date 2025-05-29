import React, {useContext, useState, useEffect} from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import { check } from './http/userAPI';

const App = observer(() => {
  const {user} = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    check()
      .then(data => {
        user.setUser(data);
        user.setIsAuth(true);
      })
      .catch(error => {
        console.error('Auth check failed:', error);
        user.setUser({});
        user.setIsAuth(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <Spinner animation="grow" variant="primary" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  );
});

export default App;
