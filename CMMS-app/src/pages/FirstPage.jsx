import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NavBar from '../components/utils/NavBar';
import { CalendarCheck, Utensils, ReceiptText, Wallet, MessageSquarePlus, Loader2 } from 'lucide-react';
import api from '../Api';

export default function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        // Fetch real API data
        const fetchDashboardData = async () => {
            try {
                // Fetch profile
                const profileRes = await api.get('/api/profile/');
                setProfile(profileRes.data);

                // Fetch notifications
                const notifRes = await api.get('/api/notifications/');
                // Backend returning standard DRF format or simple list
                setNotifications(notifRes.data?.results || notifRes.data || []);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                // Fallback for visual testing if api fails immediately.
                setProfile({
                    name: "Shubham",
                    email: "shubhamkp24@iitk.ac.in",
                    role: "student",
                    contact_no: "+91 9876543210",
                    roll_no: "241010",
                    hall_of_residence: "Hall 3",
                    room_no: "B-215"
                });
                setNotifications([
                    { id: 1, title: "Meal Confirmed", content: "Friday dinner confirmed.", category: "unseen", time: new Date().toISOString() }
                ]);
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
            console.error('Failed to mark notifications as seen on backend:', error);
        }
    };

    const navLinks = [
        { name: "Daily Menu", path: "/menu" },
        { name: "Extra Meals", path: "/extras" },
        { name: "Leaves & Rebates", path: "/page-3" },
    ];

    const dashboardCards = [
        {
            title: "Daily Menu",
            desc: "View daily menus and timings.",
            icon: CalendarCheck,
            link: "/menu",
            color: "from-blue-500 to-indigo-500",
            bgLight: "bg-blue-50"
        },
        {
            title: "Extra Meals",
            desc: "Book extra items for upcoming meals.",
            icon: Utensils,
            link: "/extras",
            color: "from-purple-500 to-fuchsia-500",
            bgLight: "bg-purple-50"
        },
        {
            title: "Rebates",
            desc: "Apply for leaves and manage rebates.",
            icon: ReceiptText,
            link: "/rebate",
            color: "from-rose-500 to-orange-500",
            bgLight: "bg-rose-50"
        },
        {
            title: "My Account",
            desc: "Check your mess dues and billing.",
            icon: Wallet,
            link: "/page-4",
            color: "from-emerald-500 to-teal-500",
            bgLight: "bg-emerald-50"
        },
        {
            title: "Feedbacks",
            desc: "Submit your feedbacks and complaints.",
            icon: MessageSquarePlus,
            link: "/feedbacks",
            color: "from-cyan-500 to-blue-500",
            bgLight: "bg-cyan-50"
        },
        {
            title: "Billing",
            desc: "Check your mess dues and billing.",
            icon: Wallet,
            link: "/billing",
            color: "from-emerald-500 to-teal-500",
            bgLight: "bg-emerald-50"
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
    // Matching HomePage theme: bg-slate-50
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden relative">
        <NavBar profile={profile} notifications={notifications} navLinks={navLinks} onOpenNotifications={handleOpenNotifications} />

        {/* Abstract Background Blobs for fanciness */}
        <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-300/20 rounded-full blur-[100px] pointer-events-none" />

        <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 md:py-12 relative z-10 w-full">
            {loadingProfile ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Loading dashboard...</p>
                </div>
            ) : (
                <div className="max-w-[1000px] w-full space-y-12">

                    {/* Welcome Back Section */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        {/* Decorative background element behind welcome card */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur opacity-25"></div>

                        {profile && (
                            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 md:px-10 md:py-8 border border-white/50 shadow-xl flex items-center justify-between overflow-hidden">
                                <div className="relative z-10">
                                    <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
                                        Welcome back, {profile.name.split(' ')[0]} 👋
                                    </h2>
                                    <p className="text-sm md:text-base text-slate-500 mt-2 max-w-lg font-medium">Manage your daily mess bookings, bills, and leaves efficiently, all in one centralized place.</p>
                                </div>
                                {/* Visual Flourish inside card */}
                                <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none"></div>
                            </div>
                        )}
                    </motion.div>

                    {/* Fancier Action Cards Container */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {dashboardCards.map((card, index) => (
                            <motion.a
                                key={index}
                                href={card.link}
                                variants={itemVariants}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                // Modern fancy card styling
                                className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 flex flex-col text-left group relative overflow-hidden"
                            >
                                {/* Fancy glowing background layer */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`} />

                                {/* Fancier Icon Wrapper */}
                                <div className={`w-14 h-14 ${card.bgLight} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                                    <card.icon className={`w-7 h-7 text-slate-700 group-hover:text-indigo-600 transition-colors duration-300 relative z-10`} strokeWidth={2} />
                                </div>

                                <h3 className="text-lg font-bold text-slate-800 mb-2 relative z-10 group-hover:text-indigo-600 transition-colors duration-300">{card.title}</h3>
                                <p className="text-sm text-slate-500 mb-6 leading-relaxed flex-grow relative z-10 font-medium">
                                    {card.desc}
                                </p>

                                {/* Visual affordance for clickable card - styled as an arrow button */}
                                <div className="mt-auto flex items-center gap-2 group-hover:gap-3 transition-all duration-300 relative z-10">
                                    <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors duration-300">
                                        <span className="text-indigo-600 font-bold leading-none transform group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                                    </div>
                                </div>

                                {/* Border accent active strictly on hover bottom line */}
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