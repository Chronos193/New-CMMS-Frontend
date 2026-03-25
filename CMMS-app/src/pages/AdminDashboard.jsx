import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminNavBar from '../components/utils/AdminNavBar';
import { ReceiptText, ShoppingBag, Star, CalendarClock, Sparkles, Loader2, Bell } from 'lucide-react';
import api from '../Api';

export default function AdminDashboard() {
    const [profile, setProfile] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const profileRes = await api.get('/api/profile/');
                setProfile(profileRes.data);

                const notifRes = await api.get('/api/notifications/');
                setNotifications(notifRes.data?.results || notifRes.data || []);
            } catch (err) {
                console.error("Error fetching admin dashboard data:", err);
                setProfile({
                    name: "Admin",
                    email: "admin@iitk.ac.in",
                    role: "admin",
                    contact_no: "",
                });
                setNotifications([]);
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleOpenNotifications = async () => {
        const hasUnseen = notifications.some(n => n.category === 'unseen');
        if (!hasUnseen) return;
        setNotifications(prev => prev.map(n => ({ ...n, category: 'seen' })));
        try {
            await api.post('/api/notifications/mark-seen/');
        } catch (error) {
            console.error('Failed to mark notifications as seen:', error);
        }
    };

    const dashboardCards = [
        {
            title: "Billing Management",
            desc: "View and manage student mess bills and payments.",
            icon: ReceiptText,
            link: "/admin-billing",
            color: "from-emerald-500 to-teal-500",
            bgLight: "bg-emerald-50"
        },
        {
            title: "Extras Management",
            desc: "Manage extra meal items, pricing, and availability.",
            icon: ShoppingBag,
            link: "/admin-extra-management",
            color: "from-purple-500 to-fuchsia-500",
            bgLight: "bg-purple-50"
        },
        {
            title: "Feedback",
            desc: "Review and respond to student feedback and complaints.",
            icon: Star,
            link: "/admin-feedback",
            color: "from-cyan-500 to-blue-500",
            bgLight: "bg-cyan-50"
        },
        {
            title: "Rebate Management",
            desc: "Process and manage student rebate applications.",
            icon: CalendarClock,
            link: "/admin-rebate",
            color: "from-rose-500 to-orange-500",
            bgLight: "bg-rose-50"
        },
        {
            title: "Send Notification",
            desc: "Target messages to specific student(s) or broadcast to all students.",
            icon: Bell,
            link: "/admin-notifications",
            color: "from-indigo-500 to-cyan-500",
            bgLight: "bg-cyan-50"
        },
        {
            title: "Menu Management",
            desc: "Update daily mess menus and meal schedules.",
            icon: Sparkles,
            link: "/admin-menu-management",
            color: "from-blue-500 to-indigo-500",
            bgLight: "bg-blue-50"
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 15 },
        },
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden relative">
            <AdminNavBar profile={profile} notifications={notifications} onOpenNotifications={handleOpenNotifications} />

            {/* Abstract Background Blobs */}
            <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-300/20 rounded-full blur-[100px] pointer-events-none" />

            <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 md:py-12 relative z-10 w-full">
                {loadingProfile ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                        <p className="text-slate-500 font-medium animate-pulse">Loading admin dashboard...</p>
                    </div>
                ) : (
                    <div className="max-w-[1000px] w-full space-y-12">

                        {/* Welcome Section */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-indigo-500 rounded-3xl blur opacity-25"></div>

                            {profile && (
                                <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 md:px-10 md:py-8 border border-white/50 shadow-xl flex items-center justify-between overflow-hidden">
                                    <div className="relative z-10">
                                        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
                                            Welcome, {profile.name.split(' ')[0]} 👋
                                        </h2>
                                        <p className="text-sm md:text-base text-slate-500 mt-2 max-w-lg font-medium">Manage mess operations, review student billing, process rebates, and oversee the entire system from your admin dashboard.</p>
                                    </div>
                                    <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-amber-50/50 to-transparent pointer-events-none"></div>
                                </div>
                            )}
                        </motion.div>

                        {/* Action Cards */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {dashboardCards.map((card, index) => (
                                <motion.a
                                    key={index}
                                    href={card.link}
                                    variants={itemVariants}
                                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                    className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 flex flex-col text-left group relative overflow-hidden"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`} />

                                    <div className={`w-14 h-14 ${card.bgLight} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                                        <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                                        <card.icon className={`w-7 h-7 text-slate-700 group-hover:text-indigo-600 transition-colors duration-300 relative z-10`} strokeWidth={2} />
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-800 mb-2 relative z-10 group-hover:text-indigo-600 transition-colors duration-300">{card.title}</h3>
                                    <p className="text-sm text-slate-500 mb-6 leading-relaxed flex-grow relative z-10 font-medium">
                                        {card.desc}
                                    </p>

                                    <div className="mt-auto flex items-center gap-2 group-hover:gap-3 transition-all duration-300 relative z-10">
                                        <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors duration-300">
                                            <span className="text-indigo-600 font-bold leading-none transform group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                                        </div>
                                    </div>

                                    <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${card.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                                </motion.a>
                            ))}
                        </motion.div>

                    </div>
                )}
            </main>
        </div>
    );
}
