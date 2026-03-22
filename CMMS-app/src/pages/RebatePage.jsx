import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Info, CheckCircle2, Clock, AlertTriangle, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '../components/utils/NavBar';
import api from '../Api';

const RebatePage = () => {
    const navigate = useNavigate();
    
    // Profile & Notifications state for NavBar
    const [profile, setProfile] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);

    // Form State
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [location, setLocation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Rebate Data
    const [rebates, setRebates] = useState([]);

    useEffect(() => {
        // Fetch real API data for NavBar (Consistent with ExtrasPage)
        const fetchDashboardData = async () => {
            try {
                const [profileRes, notifRes, rebatesRes] = await Promise.all([
                    api.get('/api/profile/'),
                    api.get('/api/notifications/'),
                    api.get('/api/rebates/')
                ]);
                setProfile(profileRes.data);
                setNotifications(notifRes.data?.results || notifRes.data || []);
                setRebates(rebatesRes.data || []);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                // Fallback for visual testing
                setProfile({
                    name: "Shubham",
                    email: "shubhamkp24@iitk.ac.in",
                    role: "student"
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
        { name: "Leaves & Rebates", path: "/rebate" },
    ];

    const handleApplyRebate = async (e) => {
        e.preventDefault();
        if (!startDate || !endDate || !location) {
            alert("Please fill in all fields.");
            return;
        }
        
        setIsSubmitting(true);
        try {
            const response = await api.post('/api/rebates/', {
                start_date: startDate,
                end_date: endDate,
                location: location
            });
            setRebates([response.data, ...rebates]);
            setStartDate("");
            setEndDate("");
            setLocation("");
        } catch (error) {
            console.error('Failed to submit rebate application:', error);
            alert("Failed to submit rebate application. Please check your inputs.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusStyles = (status) => {
        const s = status?.toLowerCase();
        switch(s) {
            case 'approved': return 'bg-slate-900 text-white';
            case 'pending': 
            case 'processing': return 'bg-white text-slate-900 border border-slate-200';
            case 'rejected': return 'bg-rose-500 text-white';
            default: return 'bg-slate-100 text-slate-500';
        }
    };

    const getStatusIcon = (status) => {
        const s = status?.toLowerCase();
        switch(s) {
            case 'approved': return <CheckCircle2 size={12} />;
            case 'pending':
            case 'processing': return <Clock size={12} />;
            case 'rejected': return <AlertTriangle size={12} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <NavBar 
                profile={profile} 
                notifications={notifications} 
                navLinks={navLinks} 
                onOpenNotifications={handleOpenNotifications} 
            />

            <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                {loadingProfile ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                        <p className="text-slate-500 font-medium animate-pulse">Loading rebate portal...</p>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Page Header */}
                        <header>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
                                Student Mess Rebate Application
                            </h1>
                            <p className="text-slate-500 font-medium">
                                Apply for mess leave rebates and track your application status
                            </p>
                        </header>

                        {/* Eligibility & Deadlines Card */}
                        <section className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
                            <div className="flex gap-3 mb-4">
                                <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
                                <h2 className="font-bold text-blue-900">Eligibility & Deadlines:</h2>
                            </div>
                            <ul className="space-y-2 ml-8 text-sm text-blue-800 font-medium list-disc">
                                <li>Minimum leave duration: 3 consecutive days</li>
                                <li>Applications must be submitted at least 2 days before leave start date</li>
                                <li>Rebate rate: ₹150 per day</li>
                                <li>Maximum 30 days of leave per semester</li>
                                <li>Applications submitted after the deadline will not be processed</li>
                            </ul>
                        </section>

                        {/* New Rebate Application Form */}
                        <section className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-800 mb-1">New Rebate Application</h2>
                            <p className="text-slate-500 text-sm font-medium mb-8">Select your mess leave dates to apply for a rebate</p>
                            
                            <form onSubmit={handleApplyRebate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Leave Start Date</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors" size={18} />
                                            <input 
                                                type="date" 
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Leave End Date</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors" size={18} />
                                            <input 
                                                type="date" 
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Location / Reason</label>
                                        <div className="relative group">
                                            <input 
                                                type="text" 
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="Where will you be?"
                                                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="px-8 py-3.5 bg-slate-700 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                                    disabled={!startDate || !endDate || !location || isSubmitting}
                                >
                                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                    <span>{isSubmitting ? "Submitting..." : "Apply for Rebate"}</span>
                                </button>
                            </form>
                        </section>

                        {/* Application Status History */}
                        <section className="space-y-6">
                            <div className="flex flex-col">
                                <h2 className="text-lg font-bold text-slate-800">Application Status History</h2>
                                <p className="text-slate-500 text-sm font-medium">View the status of your previous rebate applications</p>
                            </div>

                            <div className="space-y-4">
                                <AnimatePresence initial={false}>
                                    {rebates.map((item, index) => {
                                        const sDate = new Date(item.start_date);
                                        const eDate = new Date(item.end_date);
                                        const diffTime = eDate - sDate;
                                        const durationDays = diffTime >= 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 : 0;
                                        const amount = durationDays * 150;
                                        const displayId = `RBT-${item.id}`;
                                        const displayStatus = item.status || 'Processing';
                                        
                                        return (
                                        <motion.div 
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                                        >
                                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                                <div className="space-y-4">
                                                    {/* ID and Status */}
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-slate-800">{displayId}</span>
                                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyles(displayStatus)}`}>
                                                            {getStatusIcon(displayStatus)}
                                                            {displayStatus}
                                                        </div>
                                                    </div>

                                                    {/* Details Grid */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2">
                                                        <div className="flex gap-2">
                                                            <span className="text-slate-400 font-bold text-xs uppercase tracking-tight min-w-[100px]">Leave Period:</span>
                                                            <span className="text-sm font-semibold text-slate-700">{item.start_date} to {item.end_date}</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-slate-400 font-bold text-xs uppercase tracking-tight min-w-[100px]">Duration:</span>
                                                            <span className="text-sm font-semibold text-slate-700">{durationDays} days</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-slate-400 font-bold text-xs uppercase tracking-tight min-w-[100px]">Submitted:</span>
                                                            <span className="text-sm font-semibold text-slate-700">{new Date(item.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-slate-400 font-bold text-xs uppercase tracking-tight min-w-[100px]">Location:</span>
                                                            <span className="text-sm font-semibold text-slate-600">{item.location}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Amount */}
                                                <div className="flex flex-col md:text-right justify-center">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount</span>
                                                    <span className="text-2xl font-black text-slate-900">₹{amount}</span>
                                                </div>
                                            </div>

                                            {/* Hover indicator */}
                                            <div className="absolute left-0 top-0 h-full w-1 bg-indigo-600 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                                        </motion.div>
                                    )})}
                                </AnimatePresence>
                            </div>
                        </section>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default RebatePage;