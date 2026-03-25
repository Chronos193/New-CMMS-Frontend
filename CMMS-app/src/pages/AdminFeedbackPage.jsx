import { useState, useMemo, useCallback, useEffect } from "react";
import api from "../Api";
import AdminNavBar from "../components/utils/AdminNavBar";



/* ─── SVG Icons ─── */
const Icon = {
    Menu: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
    Logo: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></svg>,
    Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
    User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    Chat: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><line x1="12" y1="8" x2="12" y2="14" /><line x1="9" y1="11" x2="15" y2="11" /></svg>,
    Clock: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    Refresh: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>,
    CheckCircle: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
    XCircle: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>,
    Search: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    Eye: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
    Check: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
    X: ({ size = 15 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    Save: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>,
    Inbox: () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>,
    CheckCircle2: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /><path d="m9 12 2 2 4-4" /></svg>,
};

const STATUS_LABEL = { pending: "Pending", inprogress: "In Progress", resolved: "Resolved" };

const StatusIcon = ({ status, size = 11 }) => {
    const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" };
    if (status === "pending") return <svg {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
    if (status === "inprogress") return <svg {...props}><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>;
    if (status === "resolved") return <svg {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
    return null;
};

/* ─── Initial data ─── */
const INITIAL_DATA = [];

const PER_PAGE = 8;

/* ─── Toast hook ─── */
function useToast() {
    const [toast, setToast] = useState({ visible: false, msg: "" });
    const showToast = useCallback((msg) => {
        setToast({ visible: true, msg });
        setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800);
    }, []);
    return { toast, showToast };
}

/* ══════════════════════════════════════════
   Main Component
══════════════════════════════════════════ */
export default function AdminFeedbackPage() {
    const [data, setData] = useState(INITIAL_DATA);
    const [search, setSearch] = useState("");
    const [catFilter, setCatFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [modalItem, setModalItem] = useState(null);
    const [modalStatus, setModalStatus] = useState("");
    const [profile, setProfile] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const { toast, showToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [feedbackRes, profileRes, notifRes] = await Promise.all([
                    api.get('/api/feedbacks/'),
                    api.get('/api/profile/'),
                    api.get('/api/notifications/')
                ]);

                const mappedData = feedbackRes.data.map(item => ({
                    ...item,
                    student: item.user_name,
                    roll: item.user_email,
                    desc: item.content,
                    status: item.status === "in_progress" ? "inprogress" : item.status
                }));
                setData(mappedData);
                setProfile(profileRes.data);
                setNotifications(notifRes.data?.results || notifRes.data || []);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    /* ── Counts ── */
    const counts = useMemo(() => ({
        pending: data.filter(d => d.status === "pending").length,
        inprogress: data.filter(d => d.status === "inprogress").length,
        resolved: data.filter(d => d.status === "resolved").length,
    }), [data]);

    /* ── Filtered rows ── */
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return data.filter(d =>
            (!q || d.student.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q) || d.roll.toLowerCase().includes(q)) &&
            (!catFilter || d.category === catFilter) &&
            (!statusFilter || d.status === statusFilter)
        );
    }, [data, search, catFilter, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const pageRows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

    /* Reset to page 1 when filters change */
    // useEffect(() => { setPage(1); }, [search, catFilter, statusFilter]);

    /* ── Actions ── */
    const quickStatus = (id, status) => {
        const backendStatus = status === "inprogress" ? "in_progress" : status;
        api.post('/api/admin/feedbacks/update-status/', { id, status: backendStatus })
            .then(() => {
                setData(prev => prev.map(d => d.id === id ? { ...d, status } : d));
                showToast(`Status updated to "${STATUS_LABEL[status]}"`);
            })
            .catch(err => console.error("Error updating status:", err));
    };

    const openModal = (item) => { setModalItem(item); setModalStatus(item.status); };
    const closeModal = () => setModalItem(null);

    const saveModal = () => {
        if (!modalItem) return;
        
        const backendStatus = modalStatus === "inprogress" ? "in_progress" : modalStatus;
        api.post('/api/admin/feedbacks/update-status/', { id: modalItem.id, status: backendStatus })
            .then(() => {
                setData(prev =>
                    prev.map(d =>
                        d.id === modalItem.id
                            ? { ...d, status: modalStatus }
                            : d
                    )
                );
                showToast(`Complaint #${modalItem.id} updated to "${STATUS_LABEL[modalStatus]}"`);
                closeModal();
            })
            .catch(err => console.error("Error updating status via modal:", err));
    };

    const filterByStatus = (s) => { setStatusFilter(s); setPage(1); };

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

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 pb-12">
            <AdminNavBar profile={profile} notifications={notifications} onOpenNotifications={handleOpenNotifications} />

            <main className="max-w-[1320px] mx-auto px-4 md:px-10 py-8">

                {/* ── HERO ── */}
                <div className="bg-white rounded-2xl p-7 md:p-8 flex items-center gap-5 shadow-sm shadow-indigo-100/50 mb-7 border border-slate-100">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                        <Icon.Chat />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-extrabold tracking-tight">Feedback &amp; Complaints</h1>
                        <p className="text-slate-500 text-sm font-medium mt-0.5">Review, manage, and respond to all student submissions from one place.</p>
                    </div>
                    <div className="hidden md:block bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-md shadow-indigo-500/20">
                        {data.length} Total Submissions
                    </div>
                </div>

                {/* ── STATS ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { key: "pending", label: "Pending", bg: "bg-amber-50", color: "text-amber-600", border: "border-amber-100", Icon: Icon.Clock },
                        { key: "inprogress", label: "In Progress", bg: "bg-blue-50", color: "text-blue-600", border: "border-blue-100", Icon: Icon.Refresh },
                        { key: "resolved", label: "Resolved", bg: "bg-emerald-50", color: "text-emerald-600", border: "border-emerald-100", Icon: Icon.CheckCircle },
                    ].map((stat) => {
                        const StatIcon = stat.Icon;
                        return (
                            <button 
                                key={stat.key} 
                                className={`bg-white rounded-xl p-5 shadow-sm shadow-indigo-100/30 border border-slate-100 flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${statusFilter === stat.key ? 'ring-2 ring-indigo-500/20 border-indigo-200' : ''}`}
                                onClick={() => filterByStatus(stat.key)}
                            >
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color} border ${stat.border}`}>
                                    <StatIcon size={20} />
                                </div>
                                <div className="text-left">
                                    <div className="text-2xl font-extrabold leading-none">{counts[stat.key]}</div>
                                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1.5">{stat.label}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* ── TOOLBAR ── */}
                <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
                    <div className="relative flex-1 w-full">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <Icon.Search />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by student, roll number, description…"
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <select 
                            className="flex-1 sm:flex-none appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2212%22_height=%2212%22_viewBox=%220_0_24_24%22_fill=%22none%22_stroke=%22%2364748b%22_stroke-width=%222.5%22%3E%3Cpath_d=%22M6_9l6_6_6-6%22/%3E%3C/svg%3E')] bg-[length:14px] bg-[right_12px_center] bg-no-repeat"
                            value={catFilter} 
                            onChange={e => setCatFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {["Food", "Hygiene", "Library", "Hostel", "Internet", "Other"].map(c => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                        <select 
                            className="flex-1 sm:flex-none appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2212%22_height=%2212%22_viewBox=%220_0_24_24%22_fill=%22none%22_stroke=%22%2364748b%22_stroke-width=%222.5%22%3E%3Cpath_d=%22M6_9l6_6_6-6%22/%3E%3C/svg%3E')] bg-[length:14px] bg-[right_12px_center] bg-no-repeat"
                            value={statusFilter} 
                            onChange={e => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="inprogress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                </div>

                {/* ── TABLE ── */}
                <div className="bg-white rounded-2xl shadow-sm shadow-indigo-100/50 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto overflow-y-visible">
                        <table className="w-full border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">#</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Submitted</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {pageRows.map((d, i) => (
                                    <tr key={d.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-xs font-bold text-slate-400">
                                            {(safePage - 1) * PER_PAGE + i + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-800 leading-tight">{d.student}</div>
                                            <div className="text-[11px] font-medium text-slate-400 mt-0.5">{d.roll}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold tracking-tight border border-indigo-100">
                                                {d.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-[300px]">
                                            <div className="text-sm font-medium text-slate-600 truncate mb-1">{d.desc}</div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                <Icon.Clock size={10} /> {d.date}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-500 whitespace-nowrap">
                                            {d.date}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-tight shadow-sm border ${
                                                d.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                d.status === 'inprogress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            }`}>
                                                <StatusIcon status={d.status} /> {STATUS_LABEL[d.status]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                                                    title="View details" 
                                                    onClick={() => openModal(d)}
                                                >
                                                    <Icon.Eye />
                                                </button>
                                                {d.status !== "inprogress" && (
                                                    <button 
                                                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                                                        title="Mark In Progress" 
                                                        onClick={() => quickStatus(d.id, "inprogress")}
                                                    >
                                                        <Icon.Refresh size={15} />
                                                    </button>
                                                )}
                                                {d.status !== "resolved" && (
                                                    <button 
                                                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm"
                                                        title="Mark Resolved" 
                                                        onClick={() => quickStatus(d.id, "resolved")}
                                                    >
                                                        <Icon.Check />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pageRows.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                            <div className="text-slate-200 mb-4 scale-125"><Icon.Inbox /></div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No matching submissions found</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-5 border-t border-slate-50 mt-auto bg-slate-50/30">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Page {safePage} of {totalPages}
                            </span>
                            <div className="flex gap-1.5">
                                <button 
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                    onClick={() => setPage(p => p - 1)} 
                                    disabled={safePage === 1}
                                >&#8249;</button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button 
                                        key={p} 
                                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                                            p === safePage 
                                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                                            : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                                        }`}
                                        onClick={() => setPage(p)}
                                    >{p}</button>
                                ))}
                                <button 
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                    onClick={() => setPage(p => p + 1)} 
                                    disabled={safePage === totalPages}
                                >&#8250;</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* ── MODAL ── */}
            {modalItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
                    <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-extrabold text-lg text-slate-800">Complaint Details</h3>
                            <button className="p-2 hover:bg-slate-200/50 rounded-xl text-slate-400 transition-colors" onClick={closeModal}><Icon.X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                            <div className="flex gap-8">
                                <div className="space-y-1 flex-1">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student</div>
                                    <div className="text-sm font-bold text-slate-900">{modalItem.student}</div>
                                </div>
                                <div className="space-y-1 flex-1 text-right">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</div>
                                    <div><span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold border border-indigo-100 uppercase tracking-tight">{modalItem.category}</span></div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</div>
                                <div className="text-sm font-semibold text-slate-700">{modalItem.roll}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submission Date</div>
                                <div className="text-sm font-semibold text-slate-700">{modalItem.date}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</div>
                                <div className="bg-slate-50 rounded-xl p-4 text-sm font-medium text-slate-600 border border-slate-100 leading-relaxed italic line-clamp-none">
                                    "{modalItem.desc}"
                                </div>
                            </div>
                            <div className="pt-2">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Update Status</div>
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <select 
                                            className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2212%22_height=%2212%22_viewBox=%220_0_24_24%22_fill=%22none%22_stroke=%22%2364748b%22_stroke-width=%222.5%22%3E%3Cpath_d=%22M6_9l6_6_6-6%22/%3E%3C/svg%3E')] bg-[length:14px] bg-[right_12px_center] bg-no-repeat"
                                            value={modalStatus} 
                                            onChange={e => setModalStatus(e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="inprogress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                        </select>
                                    </div>
                                    <button 
                                        className="h-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-2 grow-0 shrink-0"
                                        onClick={saveModal}
                                    >
                                        <Icon.Save /> Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── TOAST ── */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] transition-all duration-300 transform ${toast.visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90 pointer-events-none'}`}>
                <div className="bg-slate-900/95 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2.5 shadow-2xl border border-white/10 ring-4 ring-slate-900/10">
                    <div className="text-emerald-400"><Icon.CheckCircle2 /></div>
                    <span>{toast.msg}</span>
                </div>
            </div>
        </div>
    );
}