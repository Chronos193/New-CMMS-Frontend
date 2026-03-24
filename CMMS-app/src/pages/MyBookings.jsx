import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { CalendarCheck, ArrowLeft, Loader2, QrCode, Utensils, Clock } from 'lucide-react';
import NavBar from '../components/utils/NavBar';
import api from '../Api';

const MyBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, notifRes, bookingsRes] = await Promise.all([
                    api.get('/api/profile/'),
                    api.get('/api/notifications/'),
                    api.get('/api/my-bookings/')
                ]);
                setProfile(profileRes.data);
                setNotifications(notifRes.data?.results || notifRes.data || []);
                setBookings(bookingsRes.data || []);
            } catch (err) {
                console.error("Error fetching bookings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const navLinks = [
        { name: "Daily Menu", path: "/menu" },
        { name: "Extra Meals", path: "/extras" },
        { name: "Leaves & Rebates", path: "/rebate" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 15 }
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'confirmed-not-scanned':
                return { label: 'Active', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-500' };
            case 'confirmed-scanned':
                return { label: 'Scanned', color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-100', dot: 'bg-slate-300', blur: true };
            case 'cancelled':
                return { label: 'Cancelled', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', dot: 'bg-rose-500', blur: true };
            default:
                return { label: status, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', dot: 'bg-indigo-500' };
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <NavBar
                profile={profile}
                notifications={notifications}
                navLinks={navLinks}
                onOpenNotifications={() => {}}
            />

            <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
                <button
                    onClick={() => navigate('/extras')}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-8 transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Extras
                </button>

                <header className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
                        My Bookings
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Present these QR codes at the mess counters to collect your items.
                    </p>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                        <p className="text-slate-500 font-medium animate-pulse">Loading your bookings...</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                            <QrCode className="text-slate-300 w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No active bookings</h3>
                        <p className="text-slate-500 font-medium mb-8 max-w-xs mx-auto">You haven't placed any orders yet. Head over to Extra Meals to book something delicious!</p>
                        <button
                            onClick={() => navigate('/extras')}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                        >
                            Explore Menu
                        </button>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {bookings.map((booking) => {
                            const config = getStatusConfig(booking.status);
                            return (
                                <motion.div
                                    key={booking.id}
                                    variants={itemVariants}
                                    whileHover={{ y: -4 }}
                                    className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 overflow-hidden flex flex-col p-8 group relative"
                                >
                                    {/* Status Header */}
                                    <div className="flex justify-between items-center mb-6">
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.border} border`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
                                            <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${config.color}`}>
                                                {config.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <Utensils size={12} />
                                            <span>Qty: {booking.quantity}</span>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-xl font-black text-slate-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors duration-300">
                                            {booking.item_name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                                            <Clock size={12} />
                                            <span>
                                                {new Date(booking.booked_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* QR Code Area */}
                                    <div className="relative mb-8 aspect-square w-full">
                                        <div className={`absolute inset-0 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col items-center justify-center p-8 transition-all duration-500 group-hover:bg-white ${config.blur ? 'blur-[8px]' : ''}`}>
                                            <QRCodeSVG value={booking.qr_code_id} size={200} className="w-full h-full drop-shadow-sm" />
                                        </div>
                                        
                                        {/* Status Overlays */}
                                        {config.blur && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                                <div className={`w-12 h-12 ${config.bg} rounded-2xl flex items-center justify-center mb-4 border ${config.border} shadow-sm`}>
                                                    {booking.status === 'cancelled' ? <Utensils className="text-rose-500 rotate-45" size={24} /> : <QrCode className={config.color} size={24} />}
                                                </div>
                                                <h4 className={`text-sm font-black uppercase tracking-widest ${config.color}`}>{config.label}</h4>
                                                <p className="text-[10px] text-slate-500 font-bold mt-1 px-4 leading-relaxed">
                                                    {booking.status === 'cancelled' ? 'This order has been cancelled.' : 'Collected from the mess counter.'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Bill</span>
                                            <span className={`text-xl font-black ${config.blur ? 'text-slate-400' : 'text-slate-900 group-hover:text-indigo-600'} transition-colors`}>₹{booking.item_cost * booking.quantity}</span>
                                        </div>
                                        <div className="font-mono text-[9px] text-slate-300 font-bold uppercase tracking-[0.1em] group-hover:text-slate-400 transition-colors">
                                            {booking.qr_code_id}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default MyBookings;
