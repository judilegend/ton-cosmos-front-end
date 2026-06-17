import { createBrowserRouter, Navigate } from 'react-router-dom';

import DefaultLayout from '@/layouts/default';
import AdminLayout from '@/layouts/adminLayout';

import LandingPage from '@/pages/landing/LandingPage';
import NotFound from '@/pages/NotFound';
import LoginPage from '@/pages/auth/LoginPage';
import ForgotPage from '@/pages/auth/ForgotPage';
import ResetPage from '@/pages/auth/ResetPassword';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminOrder from '@/pages/admin/AdminOrder';
import Settings from '@/pages/admin/Settings';

import { PrivateRoute } from '@/guards/PrivateRoute';
import { AuthRoute } from '@/guards/AuthRoute';
import SelectPlanPage from '@/pages/landing/PricingSelect';
import PayementPage from '@/pages/landing/Payment';
import PayementSuccessPage from '@/pages/landing/Success';

const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />,
    },
    {
        path: '/choose-plans',
        element: <SelectPlanPage />,
    },
    {
        path: '/payments',
        element: <PayementPage />,
    },
    {
        path: '/payments-success',
        element: <PayementSuccessPage />,
    },
    {
        path: '/administrator',
        element: <DefaultLayout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Navigate to="auth/login" replace /> },
            {
                path: 'auth/login',
                element: (
                    <AuthRoute>
                        <LoginPage />
                    </AuthRoute>
                ),
            },
            {
                path: 'auth/forgot-password',
                element: (
                    <AuthRoute>
                        <ForgotPage />
                    </AuthRoute>
                ),
            }
        ],
    },
    {
        path: '/administrator/managery',
        element: <AdminLayout />,
        errorElement: <NotFound />,
        children: [
            { path: '', element: <Navigate to="dashboard" replace /> },
            {
                path: 'dashboard',
                element: (
                    <PrivateRoute>
                        <AdminDashboard />
                    </PrivateRoute>
                ),
            },
            {
                path: 'orders',
                element: (
                    <PrivateRoute>
                        <AdminOrder />
                    </PrivateRoute>
                ),
            },
            {
                path: 'settings',
                element: (
                    <PrivateRoute>
                        <Settings />
                    </PrivateRoute>
                ),
            },
        ],
    },

    {
        path: '/administrator/reset-password',
        element: (
            <AuthRoute>
                <ResetPage />
            </AuthRoute>
        ),
    },

    { path: '*', element: <NotFound /> },
]);

export const LOGIN_PATH = '/administrator/auth/login';
export const FORGOT_PASSWORD_PATH = '/administrator/auth/forgot-password';
export const RESET_PASSWORD_PATH = '/administrator/reset-password';
export const ADMIN_DASHBOARD_PATH = '/administrator/managery/dashboard';
export const ADMIN_ORDER_PATH = '/administrator/managery/orders';
export const ADMIN_SETTINGS_PATH = '/administrator/managery/settings';

export default router;
