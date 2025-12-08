import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        const isAuth = localStorage.getItem('isAuthenticated');
        if (!isAuth) {
            navigate('/login');
        }
    }, [navigate]);

    // Minimal wrapper - child components handle their own layout
    return <Outlet />;
}
