import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createContext } from 'react';
import UserStore from './store/UserStore';
import ServiceStore from './store/ServiceStore';
import 'bootstrap-icons/font/bootstrap-icons.css';
export const Context = createContext(null);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context.Provider value={{
    user: new UserStore(),
    service: new ServiceStore()
  }}>

    <App />
  </Context.Provider>,
);
