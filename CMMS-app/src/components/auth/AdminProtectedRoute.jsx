import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../Api';
import { Loader2 } from 'lucide-react';

const AdminProtectedRoute = ({ children }) => {
    const [authState, setAuthState] = useState(null); // null = loading, 'admin' = authorized, 'denied' = not admin/not logged in

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/api/my/');
                if (res.data.is_logged_in && res.data.user?.role === 'admin') {
                    setAuthState('admin');
                } else {
                    setAuthState('denied');
                }
            } catch (err) {
                console.error("Admin auth check failed:", err);
                setAuthState('denied');
            }
        };

        checkAuth();
    }, []);

    if (authState === null) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="mt-4 text-slate-500 font-medium">Verifying admin access...</p>
            </div>
        );
    }

    return authState === 'admin' ? children : <Navigate to="/login" replace />;
};

export default AdminProtectedRoute;
