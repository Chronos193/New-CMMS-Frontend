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
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {bookings.map((booking) => (
                            <motion.div
                                key={booking.id}
                                variants={itemVariants}
                                whileHover={{ y: -4 }}
                                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col p-6"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                            {booking.item_name}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                                            <Utensils size={12} />
                                            <span>Quantity: {booking.quantity}</span>
                                        </div>
                                    </div>
                                    <div className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                                        {booking.status}
                                    </div>
                                </div>

                                <div className="bg-slate-50 flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-100 mb-6 group-hover:bg-white transition-colors duration-300">
                                    <QRCodeSVG value={booking.qr_code_id} size={150} className="drop-shadow-sm" />
                                    <p className="mt-4 font-mono text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                                        {booking.qr_code_id}
                                    </p>
                                </div>

                                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-slate-400" />
                                        <span className="text-xs font-medium">
                                            {new Date(booking.booked_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900">₹{booking.item_cost * booking.quantity}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default MyBookings;
