import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Context } from './index';
import { adminRoutes, publicRoutes, authRoutes } from './routes';
import { SHOP_ROUTE, ADMIN_ROUTE, LOGIN_ROUTE } from './utils/consts';
import AdminAppointments from './pages/AdminAppointments';
import Services from './pages/Services';

const AppRouter = () => {
    const { user } = useContext(Context);

    return (
        <Routes>
            <Route path={SHOP_ROUTE} element={<Services />} />
            {user.isAuth && (
                <>
                    {authRoutes.map(({ path, Component }) => (
                        <Route key={path} path={path} element={<Component />} />
                    ))}
                    {user.user.role === 'ADMIN' && (
                        <Route path={ADMIN_ROUTE} element={<AdminAppointments />} />
                    )}
                </>
            )}
            {publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}
            <Route path="*" element={<Navigate to={SHOP_ROUTE} />} />
        </Routes>
    );
};

export default AppRouter; 