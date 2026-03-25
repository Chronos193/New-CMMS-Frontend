import { useState, useMemo, useEffect, useCallback } from "react";
import api from "../Api";
import AdminNavBar from "../components/utils/AdminNavBar";

// ── Icons ──────────────────────────────────────────────────────────────────
const Icon = {
  FileText: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Clock: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  CheckCircle: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  XCircle: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  Rupee: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="M6 13l8.5 8"/><path d="M6 13h3a4 4 0 0 0 0-8"/></svg>,
  Search: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Eye: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Check: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ArrowRight: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Calendar: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Inbox: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
  CheckCircle2: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/><path d="m9 12 2 2 4-4"/></svg>,
};

// ── Constants ─────────────────────────────────────────────────────────────
const PER_PAGE = 8;
const STATUS_LABELS = { pending: "Pending", approved: "Approved", rejected: "Rejected" };
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// ── Helpers ───────────────────────────────────────────────────────────────
const diffDays = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  const res = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
  return res > 0 ? res : 0;
};

const getMonthFromDate = (dateStr) => {
    const d = new Date(dateStr);
    return MONTH_NAMES[d.getMonth()];
};

/* ─── Toast hook ─── */
function useToast() {
    const [toast, setToast] = useState({ visible: false, msg: "" });
    const showToast = useCallback((msg) => {
        setToast({ visible: true, msg });
        setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800);
    }, []);
    return { toast, showToast };
}

// ══════════════════════════════════════════
// Main Component
// ══════════════════════════════════════════
export default function AdminRebatePage() {
  const [data, setData] = useState([]);
  const [rates, setRates] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { toast, showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rebateRes, profileRes, notifRes, ratesRes] = await Promise.all([
          api.get('/api/rebates/'),
          api.get('/api/profile/'),
          api.get('/api/notifications/'),
          api.get('/api/daily-rebate-refund/')
        ]);

        const currentRates = ratesRes.data || [];
        setRates(currentRates);

        const mapped = rebateRes.data.map(d => {
          const days = diffDays(d.start_date, d.end_date);
          const month = getMonthFromDate(d.start_date);
          const rateObj = currentRates.find(r => r.month.toLowerCase() === month.toLowerCase());
          const rate = rateObj ? parseFloat(rateObj.cost) : 120; // fallback to 120 if not found

          return {
            ...d,
            name: d.user_name,
            roll: d.user_email.split('@')[0],
            mess: "Hall Mess", 
            from: d.start_date,
            to: d.end_date,
            days: days,
            reason: d.location,
            applied: new Date(d.created_at).toISOString().split('T')[0],
            rate: rate,
            amount: days * rate,
            status: d.status.toLowerCase()
          };
        });

        setData(mapped);
        setProfile(profileRes.data);
        setNotifications(notifRes.data?.results || notifRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
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

  const updateRebateStatus = async (id, newStatus, note = "") => {
    try {
      await api.post('/api/admin/rebates/update-status/', {
        rebate_id: id,
        status: newStatus.toLowerCase(),
        note: note
      });
      setData(prev => prev.map(d => d.id === id ? { ...d, status: newStatus.toLowerCase(), note } : d));
      const item = data.find(d => d.id === id);
      showToast(`${newStatus}: ${item?.name}`);
      setActiveId(null);
    } catch (err) {
      console.error("Error updating rebate:", err);
      showToast("Failed to update status");
    }
  };

  // ── Stats ──
  const stats = useMemo(() => ({
    pending: data.filter(d => d.status === "pending").length,
    approved: data.filter(d => d.status === "approved").length,
    rejected: data.filter(d => d.status === "rejected").length,
    total: data.filter(d => d.status === "approved").reduce((s, d) => s + d.amount, 0),
  }), [data]);

  // ── Filtered ──
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(d =>
      (!q || d.name.toLowerCase().includes(q) || d.roll.includes(q) || d.reason.toLowerCase().includes(q)) &&
      (!statusFilter || d.status === statusFilter) &&
      (!monthFilter || d.from.startsWith(monthFilter) || d.to.startsWith(monthFilter))
    );
  }, [data, search, statusFilter, monthFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const activeItem = data.find(d => d.id === activeId) || null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 pb-12">
      <AdminNavBar profile={profile} notifications={notifications} onOpenNotifications={handleOpenNotifications} />

      <main className="max-w-[1320px] mx-auto px-4 md:px-10 py-8">

        {/* ── HERO ── */}
        <div className="bg-white rounded-2xl p-7 md:p-8 flex items-center gap-5 shadow-sm shadow-indigo-100/50 mb-7 border border-slate-100">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
            <Icon.FileText size={26} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Rebate Management</h1>
            <p className="text-slate-500 text-sm font-medium mt-0.5">Review and approve student mess leave and rebate applications.</p>
          </div>
          <div className="hidden md:block bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-md shadow-indigo-500/20">
            {data.length} Total Applications
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 text-slate-900">
          {[
            { key: "pending", label: "Pending", val: stats.pending, bg: "bg-amber-50", color: "text-amber-600", border: "border-amber-100", Ic: Icon.Clock },
            { key: "approved", label: "Approved", val: stats.approved, bg: "bg-emerald-50", color: "text-emerald-600", border: "border-emerald-100", Ic: Icon.CheckCircle },
            { key: "rejected", label: "Rejected", val: stats.rejected, bg: "bg-rose-50", color: "text-rose-600", border: "border-rose-100", Ic: Icon.XCircle },
            { key: "total", label: "Total Approved", val: "₹" + stats.total.toLocaleString("en-IN"), bg: "bg-indigo-50", color: "text-indigo-600", border: "border-indigo-100", Ic: Icon.Rupee },
          ].map((s) => {
            const SIcon = s.Ic;
            return (
              <button 
                key={s.key} 
                className={`bg-white rounded-xl p-5 shadow-sm shadow-indigo-100/30 border border-slate-100 flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${statusFilter === s.key ? 'ring-2 ring-indigo-500/20 border-indigo-200' : ''}`}
                onClick={() => { setStatusFilter(s.key === "total" ? "" : s.key); setPage(1); }}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.bg} ${s.color} border ${s.border}`}>
                  <SIcon size={20} />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-extrabold leading-none">{s.val}</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1.5">{s.label}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── TOOLBAR ── */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <div className="relative flex-1 w-full">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Icon.Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search by roll, name, reason…"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              className="flex-1 sm:flex-none appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2212%22_height=%2212%22_viewBox=%220_0_24_24%22_fill=%22none%22_stroke=%22%2364748b%22_stroke-width=%222.5%22%3E%3Cpath_d=%22M6_9l6_6_6-6%22/%3E%3C/svg%3E')] bg-[length:14px] bg-[right_12px_center] bg-no-repeat shadow-sm"
              value={statusFilter} 
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_LABELS).map(([k,v]) => (<option key={k} value={k}>{v}</option>))}
            </select>
            <select 
              className="flex-1 sm:flex-none appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2212%22_height=%2212%22_viewBox=%220_0_24_24%22_fill=%22none%22_stroke=%22%2364748b%22_stroke-width=%222.5%22%3E%3Cpath_d=%22M6_9l6_6_6-6%22/%3E%3C/svg%3E')] bg-[length:14px] bg-[right_12px_center] bg-no-repeat shadow-sm"
              value={monthFilter} 
              onChange={e => { setMonthFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Months</option>
              {["2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12"].map(m => (
                <option key={m} value={m}>{new Date(m).toLocaleString('default', { month: 'short', year: 'numeric' })}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="bg-white rounded-2xl shadow-sm shadow-indigo-100/50 border border-slate-100 overflow-hidden text-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">#</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leave Period</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Days</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reason/Location</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applied</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rebate Amount</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {slice.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center opacity-30 grayscale scale-110">
                        <Icon.Inbox size={48} />
                        <p className="mt-4 text-sm font-bold tracking-widest uppercase">No applications found</p>
                      </div>
                    </td>
                  </tr>
                ) : slice.map((d, i) => (
                  <tr key={d.id} className="hover:bg-indigo-50/20 transition-colors group">
                    <td className="px-6 py-5 text-xs font-bold text-slate-300">{(safePage - 1) * PER_PAGE + i + 1}</td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-slate-800">{d.name}</div>
                      <div className="text-[11px] font-medium text-slate-400 mt-0.5">{d.roll} · {d.mess}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <span>{d.from}</span>
                        <Icon.ArrowRight size={12} className="text-slate-300" />
                        <span>{d.to}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-bold border border-indigo-100">
                        <Icon.Calendar size={11} /> {d.days}d
                      </span>
                    </td>
                    <td className="px-6 py-5 max-w-[200px]">
                      <div className="text-sm font-medium text-slate-500 truncate">{d.reason}</div>
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-slate-400">{d.applied}</td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-extrabold text-slate-800">₹{d.amount.toLocaleString("en-IN")}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{d.days}d × ₹{d.rate}</div>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm" onClick={() => setActiveId(d.id)} title="View & Manage">
                          <Icon.Eye size={16} />
                        </button>
                        {d.status !== "approved" && (
                          <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm" onClick={() => updateRebateStatus(d.id, "approved")} title="Approve">
                            <Icon.Check size={16} />
                          </button>
                        )}
                        {d.status !== "rejected" && (
                          <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-sm" onClick={() => updateRebateStatus(d.id, "rejected")} title="Reject">
                            <Icon.X size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div className="px-6 py-5 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Page {safePage} of {totalPages}</span>
              <div className="flex gap-1.5">
                <PaginationBtn disabled={safePage === 1} onClick={() => setPage(p => p - 1)}>&#8249;</PaginationBtn>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <PaginationBtn key={p} active={p === safePage} onClick={() => setPage(p)}>{p}</PaginationBtn>
                ))}
                <PaginationBtn disabled={safePage === totalPages} onClick={() => setPage(p => p + 1)}>&#8250;</PaginationBtn>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── MODAL ── */}
      {activeId && activeItem && (
        <RebateModal item={activeItem} onClose={() => setActiveId(null)} onAction={updateRebateStatus} />
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

function StatusBadge({ status }) {
  const configs = {
    pending: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", Ic: Icon.Clock },
    approved: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", Ic: Icon.CheckCircle },
    rejected: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", Ic: Icon.XCircle },
  };
  const c = configs[status] || configs.pending;
  const Ic = c.Ic;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-tight shadow-sm border ${c.bg} ${c.text} ${c.border}`}>
      <Ic size={11} /> {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function PaginationBtn({ onClick, disabled, active, children }) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all shadow-sm ${
        active 
        ? "bg-indigo-600 text-white shadow-indigo-600/20" 
        : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 disabled:pointer-events-none"
      }`}
    >
      {children}
    </button>
  );
}

function RebateModal({ item, onClose, onAction }) {
  const [note, setNote] = useState(item.note || "");
  const handleAction = (status) => onAction(item.id, status, note);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-extrabold text-xl text-slate-800">Rebate Application Details</h3>
          <button className="p-2 hover:bg-slate-200/50 rounded-xl text-slate-400 transition-colors" onClick={onClose}><Icon.X size={20} /></button>
        </div>
        
        <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-8">
            <InfoItem label="Student Name" val={item.name} />
            <InfoItem label="Roll / Email" val={item.roll} />
            <InfoItem label="Applied Period" val={`${item.from} — ${item.to}`} />
            <InfoItem label="Mess Hall" val={item.mess} />
            <InfoItem label="Total Duration" val={`${item.days} Days`} />
            <InfoItem label="Applied Date" val={item.applied} />
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reason for mess leave</div>
            <div className="text-sm font-medium text-slate-600 leading-relaxed italic italic">"{item.reason}"</div>
          </div>

          {/* Refund Calc */}
          <div className="bg-indigo-600 rounded-2xl p-6 text-white flex items-center justify-between shadow-xl shadow-indigo-600/20">
            <div>
              <div className="text-xs font-bold text-indigo-100 uppercase tracking-widest">Calculated Rebate</div>
              <div className="text-[11px] text-indigo-100 font-medium mt-0.5">{item.days}d × ₹{item.rate}/day</div>
            </div>
            <div className="text-3xl font-extrabold tracking-tight text-white">₹{item.amount.toLocaleString("en-IN")}</div>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Response Note</div>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all min-h-[100px] resize-none"
              placeholder="Provide a reason for approval or rejection (optional)…"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button className="flex-1 bg-emerald-600 text-white rounded-2xl py-4 font-bold text-sm shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2" onClick={() => handleAction("approved")}>
              <Icon.Check size={18} /> Approve Application
            </button>
            <button className="flex-1 bg-rose-600 text-white rounded-2xl py-4 font-bold text-sm shadow-xl shadow-rose-600/20 hover:bg-rose-700 transition-all flex items-center justify-center gap-2" onClick={() => handleAction("rejected")}>
              <Icon.X size={18} /> Reject Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, val }) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
      <div className="text-sm font-bold text-slate-800">{val}</div>
    </div>
  );
}
