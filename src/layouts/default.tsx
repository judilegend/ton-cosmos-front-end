import ScrollToTop from '@/components/ScrollToTop';
import { Outlet } from 'react-router-dom';

export default function DefaultLayout() {
    return (
        <>
            <ScrollToTop />
            <Outlet />
        </>
    );
}
