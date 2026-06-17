import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { UseAuth } from '@/context/AuthContext';
import { LOGIN_PATH } from '@/routes';

export function PrivateRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated, loading } = UseAuth();

    if (loading)
        return (
            <div className="fixed top-0 left-0 w-screen min-h-screen bg-white dark:bg-[#0d1117] transition-colors flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );

    if (!isAuthenticated) {
        return <Navigate to={LOGIN_PATH} replace />;
    }

    return children;
}
