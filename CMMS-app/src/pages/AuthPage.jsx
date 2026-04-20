import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Utensils } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import ForgotPassword from '../components/auth/ForgotPassword';

export default function AuthPage() {
    // 'login', 'signup', or 'forgot-password'
    const [view, setView] = useState('login');
    const location = useLocation();
    const initialRole = location.state?.role || 'student';

    return (
        <div className="min-h-screen w-full flex flex-col bg-slate-50 relative overflow-hidden font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900">

            {/* Dynamic Background Elements - Adjusted for Snow Blue Theme */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ x: [0, -40, 0], y: [0, -50, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full blur-[120px]"
                />
            </div>

            {/* Navigation Bar */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 px-6 md:px-12 flex items-center justify-between shadow-sm"
            >
                <Link to="/" className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity">
                    <div className="bg-indigo-500 p-2 rounded-lg flex items-center justify-center shadow-sm">
                        <Utensils className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight tracking-tight text-slate-900">CMMS</h1>
                        <p className="text-xs text-slate-500 font-medium tracking-wide">Centralized Mess Management System</p>
                    </div>
                </Link>
            </motion.nav>

            {/* Main Content - Split Layout for Homepage Feel */}
            <main className="relative z-10 flex-grow flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto w-full px-6 lg:px-12 gap-12 lg:gap-24 py-12">

                {/* Left Side: Hero Value Proposition */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex-1 text-center lg:text-left space-y-6 max-w-2xl"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Smart Dining, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Simplified.</span>
                    </h2>
                    <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                        Access your daily menus, manage extra meal bookings, apply for rebates, and review analytics seamlessly through the centralized portal.
                    </p>

                    <div className="hidden lg:flex items-center gap-8 pt-6">
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-slate-900">24/7</span>
                            <span className="text-sm text-slate-500">Portal Access</span>
                        </div>
                        <div className="w-px h-10 bg-slate-300"></div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-slate-900">100%</span>
                            <span className="text-sm text-slate-500">Digital Workflow</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Auth Container */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    {/* Light theme glassmorphism card */}
                    <div className="w-full bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-indigo-900/5 rounded-3xl p-8 overflow-hidden">
                        <AnimatePresence mode="wait">
                            {view === 'login' && <Login key="login" setView={setView} initialRole={initialRole} />}
                            {view === 'signup' && <Signup key="signup" setView={setView} initialRole={initialRole} />}
                            {view === 'forgot-password' && <ForgotPassword key="forgot-password" setView={setView} />}
                        </AnimatePresence>
                    </div>
                </motion.div>

            </main>
        </div>
    );
}