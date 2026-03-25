import { useState, useEffect, useMemo } from "react";
import AdminNavBar from '../components/utils/AdminNavBar';
import api from '../Api';

// ── Inline SVG Icons ───────────────────────────────────────────────────────
const Icon = ({ children, size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={`inline-block align-middle shrink-0 ${className}`}>
    {children}
  </svg>
);

const Icons = {
  Rupee:        (p) => <Icon {...p}><path d="M6 3h12"/><path d="M6 8h12"/><path d="M6 13l8.5 8"/><path d="M6 13h3a4 4 0 0 0 0-8"/></Icon>,
  Receipt:      (p) => <Icon {...p}><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="16" x2="12" y2="16"/></Icon>,
  Search:       (p) => <Icon {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Icon>,
  Eye:          (p) => <Icon {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></Icon>,
  Check:        (p) => <Icon {...p}><polyline points="20 6 9 17 4 12"/></Icon>,
  X:            (p) => <Icon {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>,
  CheckCircle:  (p) => <Icon {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></Icon>,
  XCircle:      (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></Icon>,
  Clock:        (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>,
  AlertCircle:  (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Icon>,
  Send:         (p) => <Icon {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></Icon>,
  Coffee:       (p) => <Icon {...p}><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></Icon>,
  Calendar:     (p) => <Icon {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Icon>,
  Download:     (p) => <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Icon>,
  Inbox:        (p) => <Icon {...p}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></Icon>,
  CheckCircle2: (p) => <Icon {...p}><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/><path d="m9 12 2 2 4-4"/></Icon>,
  ChevronDown:  (p) => <Icon {...p}><polyline points="6 9 12 15 18 9"/></Icon>,
  Users:        (p) => <Icon {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>,
  Wallet:       (p) => <Icon {...p}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></Icon>,
  FileSpreadsheet:(p)=><Icon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><line x1="12" y1="13" x2="12" y2="17"/></Icon>,
  Loader:       (p) => <Icon {...p} className="animate-spin"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></Icon>,
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const STATUS_CFG = {
  Unpaid:  { cls: "bg-amber-50 text-amber-500",   Icon: Icons.Clock        },
  Paid:    { cls: "bg-green-50 text-green-500",    Icon: Icons.CheckCircle  },
  Overdue: { cls: "bg-red-50 text-red-500",        Icon: Icons.AlertCircle  },
  Waived:  { cls: "bg-indigo-50 text-indigo-500",  Icon: Icons.CheckCircle2 },
};

// ── Small reusable ─────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.Unpaid;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${c.cls}`}>
      <c.Icon size={11} /> {status}
    </span>
  );
}

function AiBtn({ color, hoverColor, title, onClick, children }) {
  return (
    <button title={title} onClick={onClick}
      className={`w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center transition-all duration-150 hover:text-white hover:border-transparent ${hoverColor}`}
      style={{ color }}>
      {children}
    </button>
  );
}

function StatCard({ label, value, sub, iconBg, iconColor, Ic, onClick }) {
  return (
    <div onClick={onClick}
      className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md border border-slate-100">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: iconBg, color: iconColor }}>
        <Ic size={20} />
      </div>
      <div>
        <div className="text-2xl font-extrabold text-slate-800 leading-none">{value}</div>
        {sub && <div className="text-xs text-slate-400 font-medium mt-0.5">{sub}</div>}
        <div className="text-xs text-slate-500 font-semibold mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function PgBtn({ onClick, disabled, active, children }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`w-9 h-9 rounded-xl border text-sm font-bold flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none ${
        active ? "bg-indigo-600 border-indigo-600 text-white shadow-md" : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600"
      }`}>
      {children}
    </button>
  );
}

function MoBtn({ color, onClick, children }) {
  return (
    <button onClick={onClick}
      className="flex-1 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all duration-150 hover:opacity-90 hover:-translate-y-px"
      style={{ background: color }}>
      {children}
    </button>
  );
}

// ── Bill Detail Modal ──────────────────────────────────────────────────────
function BillModal({ student, selectedMonth, onClose, onUpdateStatus, onSendReminder }) {
  const [note, setNote] = useState("");
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-5 border-b border-slate-100">
          <div>
            <div className="text-lg font-extrabold text-slate-800">Bill Details</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">{selectedMonth || "All Months"}</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
            <Icons.X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Student card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg font-extrabold shrink-0">
              {student.name[0]}
            </div>
            <div>
              <div className="font-extrabold text-slate-800">{student.name}</div>
              <div className="text-xs text-slate-400 mt-0.5">{student.roll_no} · {student.hall}</div>
            </div>
            <div className="ml-auto"><StatusBadge status={student.payStatus || "Unpaid"} /></div>
          </div>

          {/* Bill breakdown */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Bill Breakdown</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-slate-500"><Icons.Calendar size={14}/> Fixed Charges</div>
                <div className="font-extrabold text-sm text-slate-800">₹{student.fixed_charges?.toLocaleString("en-IN") || 0}</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-slate-500"><Icons.Coffee size={14}/> Extras Total <span className="text-xs">({student.extras?.length || 0} items)</span></div>
                <div className="font-extrabold text-sm text-slate-800">₹{student.total_extras?.toLocaleString("en-IN") || 0}</div>
              </div>
              {student.rebate_refund > 0 && (
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-green-600"><Icons.CheckCircle size={14}/> Rebate Refund <span className="text-xs">({student.rebate_days}d × ₹{student.daily_refund_rate})</span></div>
                  <div className="font-extrabold text-sm text-green-600">−₹{student.rebate_refund?.toLocaleString("en-IN") || 0}</div>
                </div>
              )}
              <div className="flex justify-between items-center p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                <div className="text-sm font-bold text-indigo-600">Grand Total</div>
                <div className="text-xl font-extrabold text-indigo-600">₹{student.grand_total?.toLocaleString("en-IN") || 0}</div>
              </div>
            </div>
          </div>

          {/* Extras table */}
          {student.extras?.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Extras Transaction History</div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[380px]">
                    <thead>
                      <tr className="border-b border-slate-200">
                        {["Date","Item","Hall","Amount"].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {student.extras.map((e,i) => (
                        <tr key={i} className="border-t border-slate-100">
                          <td className="px-4 py-2.5 text-xs text-slate-400 font-semibold">{e.date}</td>
                          <td className="px-4 py-2.5 text-xs font-bold text-slate-700">{e.item_name}</td>
                          <td className="px-4 py-2.5"><span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">{e.hall}</span></td>
                          <td className="px-4 py-2.5 text-xs font-extrabold text-right text-slate-800">₹{e.total_cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Admin note */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Admin Note</div>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note or reason (optional)…"
              className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 resize-y min-h-[64px] transition-all" />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <MoBtn color="#5b5ef4" onClick={async () => { await onSendReminder(student.id, note); onClose(); }}>
              <Icons.Send size={15}/> Send Reminder
            </MoBtn>
            {student.payStatus !== "Paid" && (
              <MoBtn color="#22c55e" onClick={async () => { await onUpdateStatus(student.id, 'paid', note); onClose(); }}>
                <Icons.Check size={15}/> Mark as Paid
              </MoBtn>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────
function Toast({ msg, show }) {
  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] transition-all duration-300 transform whitespace-nowrap flex items-center gap-2.5 ${show ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90 pointer-events-none'}`}>
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 shadow-2xl border border-white/10">
        <span className="text-emerald-400"><Icons.CheckCircle2 size={16}/></span>
        <span>{msg}</span>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function AdminBillingPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]       = useState("");
  const [statusF, setStatusF]     = useState("");
  const [hallF, setHallF]         = useState("");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return MONTHS[now.getMonth()];
  });
  const [page, setPage]           = useState(1);
  const [activeId, setActiveId]   = useState(null);
  const [toast, setToast]         = useState({ show:false, msg:"" });
  const [profile, setProfile]     = useState(null);
  const [notifications, setNotifications] = useState([]);
  const PER = 8;

  // Fetch admin profile + notifications
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await api.get('/api/profile/');
        setProfile(profileRes.data);
        const notifRes = await api.get('/api/notifications/');
        setNotifications(notifRes.data?.results || notifRes.data || []);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  // Fetch billing data when month changes
  useEffect(() => {
    const fetchBillingData = async () => {
      setLoading(true);
      try {
        const params = selectedMonth ? { month: selectedMonth } : {};
        const res = await api.get('/api/admin/billing/', { params });
        const mapped = (res.data || []).map(s => ({
          ...s,
          payStatus: s.payStatus || "Unpaid",
        }));
        setStudents(mapped);
      } catch (err) {
        console.error("Error fetching billing data:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBillingData();
  }, [selectedMonth]);

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

  const stats = useMemo(()=>({
    unpaid:  students.filter(s=>s.payStatus==="Unpaid").length,
    paid:    students.filter(s=>s.payStatus==="Paid").length,
    overdue: students.filter(s=>s.payStatus==="Overdue").length,
    total:   students.filter(s=>s.payStatus==="Paid").reduce((a,s)=>a+(s.grand_total||0),0),
    outstanding: students.filter(s=>["Unpaid","Overdue"].includes(s.payStatus)).reduce((a,s)=>a+(s.grand_total||0),0),
  }),[students]);

  const filtered = useMemo(()=>{
    const q=search.toLowerCase();
    return students.filter(s=>
      (!q || s.name?.toLowerCase().includes(q) || s.roll_no?.includes(q)) &&
      (!statusF || s.payStatus===statusF) &&
      (!hallF   || s.hall===hallF)
    );
  },[students,search,statusF,hallF]);

  const pages   = Math.max(1, Math.ceil(filtered.length/PER));
  const safePg  = Math.min(page, pages);
  const slice   = filtered.slice((safePg-1)*PER, safePg*PER);
  const active  = students.find(s=>s.id===activeId)||null;

  const showToast = msg => { setToast({show:true,msg}); setTimeout(()=>setToast({show:false,msg:""}),2800); };

  const handleMarkAs = async (id, newStatus, note = "") => {
    try {
      const res = await api.post('/api/admin/billing/update-status/', {
        user_id: id,
        month: selectedMonth,
        status: newStatus,
        note: note
      });
      setStudents(prev=>prev.map(x=>x.id===id?{...x, payStatus: res.data.payStatus, paid_on: res.data.paid_on}:x));
      const s = students.find(x=>x.id===id);
      showToast(`${s?.name} marked as ${newStatus}`);
    } catch (err) {
      console.error('Failed to update status:', err);
      showToast('Failed to update status');
    }
  };

  const handleSendReminder = async (id, note = "") => {
    try {
      const res = await api.post('/api/admin/billing/send-reminder/', {
        user_id: id,
        month: selectedMonth,
        note: note
      });
      showToast(res.data.message || 'Reminder sent!');
    } catch (err) {
      console.error('Failed to send reminder:', err);
      showToast('Failed to send reminder');
    }
  };

  const halls = [...new Set(students.map(s=>s.hall).filter(Boolean))].sort();
  const selectCls = "appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer shadow-sm";

  return (
    <div className="min-h-screen bg-[#f0f1fb] font-sans text-slate-800 pb-12">
      <AdminNavBar profile={profile} notifications={notifications} onOpenNotifications={handleOpenNotifications} />

      <main className="max-w-[1320px] mx-auto px-4 md:px-8 py-8">

        {/* Hero */}
        <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-wrap items-center gap-4 shadow-sm mb-7 border border-slate-100">
          <div className="w-13 h-13 w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
            <Icons.Receipt size={26}/>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">Billing Management</h1>
            <p className="text-slate-400 text-sm font-medium mt-0.5">{selectedMonth} mess bills · Student billing overview</p>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 text-amber-500 px-4 py-2 rounded-full text-xs font-bold border border-amber-100 whitespace-nowrap">
            <Icons.AlertCircle size={14}/> Outstanding: ₹{stats.outstanding.toLocaleString("en-IN")}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-7">
          <StatCard label="Unpaid"    value={stats.unpaid}  iconBg="#fef3c7" iconColor="#f59e0b" Ic={Icons.Clock}        onClick={()=>{setStatusF("Unpaid"); setPage(1);}} />
          <StatCard label="Paid"      value={stats.paid}    iconBg="#dcfce7" iconColor="#22c55e" Ic={Icons.CheckCircle}  onClick={()=>{setStatusF("Paid");   setPage(1);}} />
          <StatCard label="Overdue"   value={stats.overdue} iconBg="#fee2e2" iconColor="#ef4444" Ic={Icons.AlertCircle}  onClick={()=>{setStatusF("Overdue");setPage(1);}} />
          <StatCard label="Total Collected" value={"₹"+stats.total.toLocaleString("en-IN")} sub={`${stats.paid} students`} iconBg="#dcfce7" iconColor="#22c55e" Ic={Icons.Wallet}  onClick={()=>{setStatusF("Paid");setPage(1);}} />
          <StatCard label="All Students"    value={students.length} sub={selectedMonth} iconBg="#ededfd" iconColor="#5b5ef4" Ic={Icons.Users} onClick={()=>{setStatusF("");setPage(1);}} />
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Icons.Search size={15}/>
            </div>
            <input className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
              placeholder="Search by name or roll no…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
          </div>
          <select className={selectCls} value={statusF} onChange={e=>{setStatusF(e.target.value);setPage(1);}}>
            <option value="">All Statuses</option>
            <option>Unpaid</option><option>Paid</option><option>Overdue</option><option>Waived</option>
          </select>
          <select className={selectCls} value={hallF} onChange={e=>{setHallF(e.target.value);setPage(1);}}>
            <option value="">All Halls</option>
            {halls.map(h=><option key={h}>{h}</option>)}
          </select>
          <select className={selectCls} value={selectedMonth} onChange={e=>{setSelectedMonth(e.target.value);setPage(1);}}>
            {MONTHS.map(m=><option key={m}>{m}</option>)}
          </select>
          <button
            onClick={()=>showToast("CSV export coming soon!")}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20 hover:opacity-90 transition-opacity whitespace-nowrap">
            <Icons.FileSpreadsheet size={16}/> Export CSV <Icons.ChevronDown size={14}/>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Icons.Loader size={32} className="text-indigo-600"/>
              <div className="text-sm text-slate-400 font-semibold">Loading billing data…</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[900px]">
                <thead className="bg-slate-50/60">
                  <tr>
                    {["#","Student","Hall","Rebate Days","Fixed Charges","Extras","Grand Total","Status","Actions"].map(h=>(
                      <th key={h} className="px-5 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {slice.length===0 ? (
                    <tr><td colSpan={9} className="py-16 text-center text-slate-400 font-semibold">
                      <div className="flex justify-center mb-3 text-slate-200"><Icons.Inbox size={48}/></div>
                      No billing records match your filters.
                    </td></tr>
                  ) : slice.map((s,i)=>(
                    <tr key={s.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 text-xs font-bold text-slate-400">{(safePg-1)*PER+i+1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-extrabold shrink-0">{s.name?.[0] || "?"}</div>
                          <div>
                            <div className="font-bold text-sm text-slate-800">{s.name}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{s.roll_no}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg tracking-wide">{s.hall}</span>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-800">
                        {s.rebate_days > 0 ? (
                          <><div className="text-green-500">{s.rebate_days} days</div>
                          <div className="text-xs text-slate-400 mt-0.5">−₹{s.rebate_refund?.toLocaleString("en-IN")}</div></>
                        ) : <span className="text-xs text-slate-400">—</span>}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-800">₹{s.fixed_charges?.toLocaleString("en-IN") || 0}</td>
                      <td className="px-5 py-4">
                        {s.total_extras > 0
                          ? <><div className="text-sm font-bold text-slate-800">₹{s.total_extras?.toLocaleString("en-IN")}</div><div className="text-xs text-slate-400">{s.extras?.length} item{s.extras?.length>1?"s":""}</div></>
                          : <span className="text-xs text-slate-400">—</span>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-base font-extrabold text-slate-800">₹{s.grand_total?.toLocaleString("en-IN") || 0}</div>
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={s.payStatus} /></td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1.5">
                          <AiBtn color="#5b5ef4" hoverColor="hover:bg-indigo-600"  title="View full bill"  onClick={()=>setActiveId(s.id)}><Icons.Eye size={15}/></AiBtn>
                          <AiBtn color="#475569" hoverColor="hover:bg-slate-600"   title="Send Reminder"  onClick={()=>handleSendReminder(s.id)}><Icons.Send size={15}/></AiBtn>
                          {s.payStatus !== "Paid" && (
                            <AiBtn color="#22c55e" hoverColor="hover:bg-green-500" title="Mark as Paid"   onClick={()=>handleMarkAs(s.id, 'paid')}><Icons.Check size={15}/></AiBtn>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && pages>1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Page {safePg} of {pages}</span>
              <div className="flex gap-1.5">
                <PgBtn disabled={safePg===1}     onClick={()=>setPage(p=>p-1)}>‹</PgBtn>
                {Array.from({length:pages},(_,i)=>i+1).map(p=><PgBtn key={p} active={p===safePg} onClick={()=>setPage(p)}>{p}</PgBtn>)}
                <PgBtn disabled={safePg===pages} onClick={()=>setPage(p=>p+1)}>›</PgBtn>
              </div>
            </div>
          )}
        </div>
      </main>

      {activeId && active && (
        <BillModal student={active} selectedMonth={selectedMonth} onClose={()=>setActiveId(null)}
          onUpdateStatus={handleMarkAs}
          onSendReminder={handleSendReminder}
        />
      )}
      <Toast show={toast.show} msg={toast.msg}/>
    </div>
  );
}
