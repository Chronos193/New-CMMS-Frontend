import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/validation';
import api from '../../Api'; // Import the configured Axios instance

export default function Login({ setView, initialRole = 'student' }) {
    const [formData, setFormData] = useState({ email: '', password: '', role: initialRole });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(formData.email)) {
            return setError('Please enter a valid email address');
        }
        if (!formData.password) {
            return setError('Password is required');
        }

        setLoading(true);
        try {
            // Endpoint to hit the django backend
            const res = await api.post('/api/login/', formData);
            console.log('Login Success:', res.data);
            // Route based on user role
            const userRole = res.data.user?.role;
            if (userRole === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/first');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                <p className="text-slate-500">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 flex flex-col">
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-xl px-10 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                        required
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-xl px-10 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                        required
                    />
                </div>

                <div className="flex justify-end items-center text-sm px-1">
                    <button
                        type="button"
                        onClick={() => setView('forgot-password')}
                        className="text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                        Forgot Password?
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl py-3 font-medium transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                            Sign In
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-slate-500 text-sm">
                Don&apos;t have an account?{' '}
                <button
                    onClick={() => setView('signup')}
                    className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                    Sign Up
                </button>
            </div>
        </motion.div>
    );
}
