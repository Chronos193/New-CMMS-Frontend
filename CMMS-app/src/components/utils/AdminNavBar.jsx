import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Utensils, LogOut, X, Phone, Home, Building, Menu, ReceiptText, Sparkles, Star, CalendarClock, ShoppingBag } from 'lucide-react';
import api from '../../Api';

export default function AdminNavBar({ profile, notifications: propNotifs, onOpenNotifications }) {
    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [localNotifs, setLocalNotifs] = useState([]);
    const navigate = useNavigate();

    const profileRef = useRef(null);
    const notifRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfile(false);
            if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
            if (menuRef.current && !menuRef.current.contains(event.target)) setShowMenu(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/api/notifications/');
            setLocalNotifs(res.data?.results || res.data || []);
        } catch (err) {
            console.error("Failed to fetch notifications in navbar:", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleLogout = async () => {
        try {
            await api.post('/api/logout/');
        } catch (err) {
            console.error("Logout failed:", err);
        }
        window.location.href = '/login';
    };

    const adminMenuLinks = [
        { name: "Dashboard", path: "/admin-dashboard", icon: Home },
        { name: "Billing Management", path: "/admin-billing", icon: ReceiptText },
        { name: "Extras Management", path: "/admin-extra-management", icon: ShoppingBag },
        { name: "Feedback", path: "/admin-feedback", icon: Star },
        { name: "Rebate Management", path: "/admin-rebate", icon: CalendarClock },
        { name: "Menu Management", path: "/admin-menu-management", icon: Sparkles },
    ];

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200 py-6 px-6 md:px-12 flex justify-between items-center shadow-sm shadow-slate-100 sticky top-0 z-50"
        >

            {/* Left Section: Menu Toggle & Logo */}
            <div className="flex items-center gap-6">
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <AnimatePresence>
                        {showMenu && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="absolute left-0 top-full mt-4 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 py-2"
                            >
                                {adminMenuLinks.map((link) => (
                                    <button
                                        key={link.path}
                                        onClick={() => { navigate(link.path); setShowMenu(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        <link.icon className="w-5 h-5" /> {link.name}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/admin-dashboard')}>
                    <div className="bg-indigo-600 p-2.5 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
                        <Utensils className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-xl leading-tight tracking-tight text-slate-900">CMMS</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                            Admin Panel
                        </span>
                    </div>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6 ml-auto">

                {/* Notifications */}
                <div className="relative flex items-center" ref={notifRef}>
                    <button
                        onClick={async () => {
                            const willShow = !showNotifications;
                            setShowNotifications(willShow);
                            setShowProfile(false);
                            setShowMenu(false);
                            if (willShow) {
                                await fetchNotifications();
                                if (onOpenNotifications) {
                                    onOpenNotifications();
                                } else {
                                    // Default mark as seen if prop not provided
                                    const hasUnseen = localNotifs.some(n => n.category === 'unseen');
                                    if (hasUnseen) {
                                        setLocalNotifs(prev => prev.map(n => ({ ...n, category: 'seen' })));
                                        api.post('/api/notifications/mark-seen/').catch(()=>null);
                                    }
                                }
                            }
                        }}
                        className="relative p-2.5 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                        <Bell className="w-5 h-5" strokeWidth={1.5} />
                        {localNotifs?.some(n => n.category === 'unseen') && (
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white pointer-events-none"></span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden z-50 origin-top-right"
                            >
                                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur-sm">
                                    <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                                    <button onClick={() => setShowNotifications(false)} className="hover:bg-slate-200 p-1.5 rounded-full transition-colors">
                                        <X className="w-4 h-4 text-slate-500" />
                                    </button>
                                </div>
                                <div className="max-h-[350px] overflow-y-auto">
                                    {localNotifs?.map((notif) => (
                                        <div key={notif.id || Math.random()} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer text-sm">
                                            <div className="flex justify-between font-medium mb-1.5">
                                                <span className={notif.category === 'unseen' ? 'text-slate-900 font-bold flex items-center gap-2' : 'text-slate-600 flex items-center gap-2'}>
                                                    {notif.category === 'unseen' && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full inline-block"></span>}
                                                    {notif.title}
                                                </span>
                                                <span className="text-xs text-slate-400 whitespace-nowrap ml-2 font-medium">
                                                    {new Date(notif.time).toLocaleDateString() === new Date().toLocaleDateString() ?
                                                        new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                                                        new Date(notif.time).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className={`text-xs leading-relaxed ${notif.category === 'unseen' ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>{notif.content}</p>
                                        </div>
                                    ))}
                                    {(!localNotifs || localNotifs.length === 0) && (
                                        <div className="p-8 flex flex-col items-center justify-center text-center">
                                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                                <Bell className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-600">No new notifications</p>
                                            <p className="text-xs text-slate-400 mt-1">We'll let you know when something comes up.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile */}
                <div className="relative flex items-center" ref={profileRef}>
                    <button
                        onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); setShowMenu(false); }}
                        className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center border-2 border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <User className="w-5 h-5 text-indigo-600" strokeWidth={2} />
                    </button>

                    <AnimatePresence>
                        {showProfile && profile && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden z-50 origin-top-right"
                            >
                                <div className="p-6 text-center bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 border-b border-slate-100">
                                    <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                                        <span className="font-extrabold text-2xl tracking-tight">{profile.name ? profile.name.charAt(0).toUpperCase() : '?'}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{profile.name}</h3>
                                    <p className="text-sm text-slate-500 font-medium">{profile.email}</p>

                                    <div className="mt-4 flex items-center justify-center gap-2">
                                        <div className="px-3 py-1 bg-amber-100/80 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-widest border border-amber-200/50 shadow-sm">
                                            Admin
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Active</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-white divide-y divide-slate-50 max-h-[250px] overflow-y-auto w-full text-left">
                                    {profile.contact_no && (
                                        <div className="py-2.5 px-2 flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center"><Phone className="w-3.5 h-3.5 text-slate-400" /></div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Contact Number</p>
                                                <p className="text-sm font-semibold text-slate-700">{profile.contact_no}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-3 bg-slate-50 border-t border-slate-100">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" strokeWidth={2.5} /> Logout
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.nav>
    );
}
