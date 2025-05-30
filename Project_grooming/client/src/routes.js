import { ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SERVICE_ROUTE, SHOP_ROUTE, APPOINTMENTS_ROUTE } from "./utils/consts";
import Admin from "./pages/Admin";
import Basket from "./pages/Basket";
import Auth from "./pages/Auth";
import Shop from "./pages/Shop";
import ServicePage from "./pages/ServicePage";
import Home from "./pages/Home";
import UserAppointments from "./pages/UserAppointments";

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: APPOINTMENTS_ROUTE,
        Component: UserAppointments
    }
]

export const publicRoutes = [
    {
        path: '/',
        Component: Home
    },
    {
        path: SHOP_ROUTE,
        Component: Shop
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: SERVICE_ROUTE + '/:id',
        Component: ServicePage
    }
]


