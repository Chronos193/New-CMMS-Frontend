import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../Api';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // We use /api/my/ which returns { is_logged_in: true/false }
                const res = await api.get('/api/my/');
                if (res.data.is_logged_in) {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                setIsAuthorized(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthorized === null) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="mt-4 text-slate-500 font-medium">Verifying access...</p>
            </div>
        );
    }

    return isAuthorized ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
