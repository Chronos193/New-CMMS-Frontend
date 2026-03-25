import { useState, useEffect, useMemo } from "react";
import AdminNavBar from '../components/utils/AdminNavBar';
import api from '../Api';

// ── Inline SVG Icons ───────────────────────────────────────────────────────
const Icon = ({ children, size = 20, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ display:"inline-block", verticalAlign:"middle", flexShrink:0, ...style }}>
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
  Loader:       (p) => <Icon {...p}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></Icon>,
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const STATUS_CFG = {
  Unpaid:    { bg:"#fef3c7", color:"#f59e0b", Icon: Icons.Clock       },
  Paid:      { bg:"#dcfce7", color:"#22c55e", Icon: Icons.CheckCircle },
  Overdue:   { bg:"#fee2e2", color:"#ef4444", Icon: Icons.AlertCircle },
  Waived:    { bg:"#ededfd", color:"#5b5ef4", Icon: Icons.CheckCircle2},
};

// ── Shared style tokens ────────────────────────────────────────────────────
const T = {
  accent:"#5b5ef4", accentL:"#ededfd", accentD:"#3b3ec2",
  bg:"#f0f1fb", surface:"#fff", surface2:"#f7f7fd",
  border:"#e5e6f7", text:"#1a1b3a", muted:"#7b7da8",
  radius:16, radiusSm:10,
  shadow:"0 2px 16px rgba(91,94,244,0.07)",
  shadowMd:"0 4px 24px rgba(91,94,244,0.12)",
};

const sel = {
  padding:"10px 32px 10px 14px", border:`1.5px solid ${T.border}`, borderRadius:T.radiusSm,
  background:T.surface, fontFamily:"inherit", fontSize:14, color:T.text,
  outline:"none", cursor:"pointer", appearance:"none",
  backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237b7da8' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center",
};

// ── Small reusable ─────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.Unpaid;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 11px", borderRadius:50, fontSize:12, fontWeight:700, background:c.bg, color:c.color }}>
      <c.Icon size={11} /> {status}
    </span>
  );
}

function AiBtn({ color, hoverBg, title, onClick, children }) {
  const [h,setH]=useState(false);
  return (
    <button title={title} onClick={onClick}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ width:32, height:32, borderRadius:8, border:`1.5px solid ${h?hoverBg:T.border}`, background:h?hoverBg:T.surface, color:h?"#fff":color, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>
      {children}
    </button>
  );
}

function StatCard({ label, value, sub, iconBg, iconColor, Ic, onClick }) {
  const [h,setH]=useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:T.surface, borderRadius:T.radiusSm, padding:"20px 22px", boxShadow:h?T.shadowMd:T.shadow, display:"flex", alignItems:"center", gap:14, cursor:"pointer", transition:"transform .18s, box-shadow .18s", transform:h?"translateY(-2px)":"none" }}>
      <div style={{ width:42, height:42, borderRadius:12, background:iconBg, color:iconColor, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Ic size={20} />
      </div>
      <div>
        <div style={{ fontSize:22, fontWeight:800, color:T.text, lineHeight:1 }}>{value}</div>
        {sub && <div style={{ fontSize:11, color:T.muted, fontWeight:500, marginTop:2 }}>{sub}</div>}
        <div style={{ fontSize:12, color:T.muted, fontWeight:600, marginTop:sub?2:3 }}>{label}</div>
      </div>
    </div>
  );
}

function PgBtn({ onClick, disabled, active, children }) {
  const [h,setH]=useState(false);
  const hi=active||h;
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ width:34, height:34, borderRadius:9, border:`1.5px solid ${hi?T.accent:T.border}`, background:hi?T.accent:T.surface, color:hi?"#fff":T.text, fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:disabled?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", opacity:disabled?.35:1, transition:"all .15s" }}>
      {children}
    </button>
  );
}

function MoBtn({ color, onClick, children }) {
  const [h,setH]=useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ flex:1, padding:"11px 0", borderRadius:T.radiusSm, border:"none", background:color, color:"#fff", fontFamily:"inherit", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, opacity:h?.88:1, transform:h?"translateY(-1px)":"none", transition:"all .15s" }}>
      {children}
    </button>
  );
}

// ── Bill Detail Modal ──────────────────────────────────────────────────────
function BillModal({ student, selectedMonth, onClose, onUpdateStatus, onSendReminder }) {
  const [note, setNote] = useState("");
  if (!student) return null;

  const dueDate = selectedMonth ? `${selectedMonth} End` : "—";

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(26,27,58,.45)", backdropFilter:"blur(4px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:T.surface, borderRadius:T.radius, padding:32, width:600, maxWidth:"95vw", maxHeight:"90vh", overflowY:"auto", boxShadow:T.shadowMd, animation:"slideUp .22s ease" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:800 }}>Bill Details</div>
            <div style={{ fontSize:12, color:T.muted, fontWeight:500, marginTop:2 }}>{selectedMonth || "All Months"}</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:T.muted, width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icons.X size={18} />
          </button>
        </div>

        {/* Student card */}
        <div style={{ background:T.surface2, border:`1.5px solid ${T.border}`, borderRadius:T.radiusSm, padding:"16px 20px", display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:T.accent, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, flexShrink:0 }}>
            {student.name[0]}
          </div>
          <div>
            <div style={{ fontWeight:800, fontSize:16 }}>{student.name}</div>
            <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{student.roll_no} · {student.hall}</div>
          </div>
          <div style={{ marginLeft:"auto" }}><StatusBadge status={student.payStatus || "Unpaid"} /></div>
        </div>

        {/* Bill breakdown */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.muted, letterSpacing:".1em", textTransform:"uppercase", marginBottom:12 }}>Bill Breakdown</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", background:T.surface2, borderRadius:T.radiusSm }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:14, color:T.muted }}>
                <Icons.Calendar size={14}/> Fixed Charges
              </div>
              <div style={{ fontWeight:800, fontSize:14 }}>₹{student.fixed_charges?.toLocaleString("en-IN") || 0}</div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", background:T.surface2, borderRadius:T.radiusSm }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:14, color:T.muted }}>
                <Icons.Coffee size={14}/> Extras Total
                <span style={{ fontSize:11 }}>({student.extras?.length || 0} items)</span>
              </div>
              <div style={{ fontWeight:800, fontSize:14 }}>₹{student.total_extras?.toLocaleString("en-IN") || 0}</div>
            </div>
            {student.rebate_refund > 0 && (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", background:"#dcfce7", borderRadius:T.radiusSm }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:14, color:"#22c55e" }}>
                  <Icons.CheckCircle size={14}/> Rebate Refund
                  <span style={{ fontSize:11 }}>({student.rebate_days}d × ₹{student.daily_refund_rate})</span>
                </div>
                <div style={{ fontWeight:800, fontSize:14, color:"#22c55e" }}>−₹{student.rebate_refund?.toLocaleString("en-IN") || 0}</div>
              </div>
            )}
            {/* Grand total */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px", background:T.accentL, borderRadius:T.radiusSm, border:`1.5px solid ${T.accent}22` }}>
              <div style={{ fontSize:14, fontWeight:700, color:T.accent }}>Grand Total</div>
              <div style={{ fontSize:20, fontWeight:800, color:T.accent }}>₹{student.grand_total?.toLocaleString("en-IN") || 0}</div>
            </div>
          </div>
        </div>

        {/* Extras table */}
        {student.extras?.length > 0 && (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.muted, letterSpacing:".1em", textTransform:"uppercase", marginBottom:12 }}>Extras Transaction History</div>
            <div style={{ background:T.surface2, border:`1px solid ${T.border}`, borderRadius:T.radiusSm, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                    {["Date","Item","Hall","Amount"].map(h=>(
                      <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".08em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {student.extras.map((e,i)=>(
                    <tr key={i} style={{ borderTop:`1px solid ${T.border}` }}>
                      <td style={{ padding:"10px 14px", fontSize:13, color:T.muted, fontWeight:600 }}>{e.date}</td>
                      <td style={{ padding:"10px 14px", fontSize:13, fontWeight:700 }}>{e.item_name}</td>
                      <td style={{ padding:"10px 14px" }}><span style={{ fontSize:11, fontWeight:700, background:T.accentL, color:T.accent, padding:"2px 8px", borderRadius:5 }}>{e.hall}</span></td>
                      <td style={{ padding:"10px 14px", fontSize:13, fontWeight:800, textAlign:"right" }}>₹{e.total_cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Admin note */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.muted, letterSpacing:".1em", textTransform:"uppercase", marginBottom:6 }}>Admin Note</div>
          <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Add a note or reason (optional)…"
            style={{ width:"100%", padding:"10px 14px", border:`1.5px solid ${T.border}`, borderRadius:T.radiusSm, fontFamily:"inherit", fontSize:14, color:T.text, background:T.surface2, outline:"none", resize:"vertical", minHeight:64 }} />
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:10 }}>
          <MoBtn color={T.accent} onClick={async () => {
            await onSendReminder(student.id, note);
            onClose();
          }}>
            <Icons.Send size={15}/> Send Reminder
          </MoBtn>
          {student.payStatus !== "Paid" && (
            <MoBtn color="#22c55e" onClick={async () => {
              await onUpdateStatus(student.id, 'paid', note);
              onClose();
            }}>
              <Icons.Check size={15}/> Mark as Paid
            </MoBtn>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────
function Toast({ msg, show }) {
  return (
    <div style={{ position:"fixed", bottom:28, left:"50%", transform:show?"translateX(-50%) translateY(0)":"translateX(-50%) translateY(80px)", background:T.text, color:"#fff", padding:"12px 22px", borderRadius:50, fontSize:14, fontWeight:600, zIndex:300, pointerEvents:"none", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:8, transition:"transform .3s cubic-bezier(.34,1.56,.64,1)" }}>
      <Icons.CheckCircle2 size={16}/><span>{msg}</span>
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
        // Map backend data to local format with payStatus defaulting to "Unpaid"
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
      // Update local state
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        .admin-billing-page{font-family:'Manrope',sans-serif;}
        @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:none;opacity:1}}
        .admin-billing-page tbody tr:hover td{background:#f7f7fd;}
        .admin-billing-page input:focus,.admin-billing-page select:focus,.admin-billing-page textarea:focus{border-color:#5b5ef4!important;}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-track{background:#f0f1fb}
        ::-webkit-scrollbar-thumb{background:#c7c8ee;border-radius:99px}
        @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
      `}</style>

      <div className="admin-billing-page" style={{ fontFamily:"'Manrope',sans-serif", background:T.bg, minHeight:"100vh", color:T.text }}>

        {/* AdminNavBar */}
        <AdminNavBar profile={profile} notifications={notifications} onOpenNotifications={handleOpenNotifications} />

        <main style={{ padding:"32px 40px", maxWidth:1320, margin:"0 auto" }}>

          {/* Hero */}
          <div style={{ background:T.surface, borderRadius:T.radius, padding:"28px 32px", display:"flex", alignItems:"center", gap:20, boxShadow:T.shadow, marginBottom:28 }}>
            <div style={{ width:52, height:52, background:T.accentL, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", color:T.accent, flexShrink:0 }}>
              <Icons.Receipt size={26}/>
            </div>
            <div>
              <h1 style={{ fontSize:24, fontWeight:800 }}>Billing Management</h1>
              <p style={{ color:T.muted, fontSize:14, marginTop:2, fontWeight:500 }}>
                {selectedMonth} mess bills · Student billing overview
              </p>
            </div>
            {/* outstanding alert pill */}
            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8, background:"#fef3c7", color:"#f59e0b", padding:"8px 16px", borderRadius:50, fontSize:12, fontWeight:700, border:"1px solid #fde68a", whiteSpace:"nowrap" }}>
              <Icons.AlertCircle size={14}/> Outstanding: ₹{stats.outstanding.toLocaleString("en-IN")}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:16, marginBottom:28 }}>
            <StatCard label="Unpaid"    value={stats.unpaid}  iconBg="#fef3c7" iconColor="#f59e0b" Ic={Icons.Clock}        onClick={()=>{setStatusF("Unpaid"); setPage(1);}} />
            <StatCard label="Paid"      value={stats.paid}    iconBg="#dcfce7" iconColor="#22c55e" Ic={Icons.CheckCircle}  onClick={()=>{setStatusF("Paid");   setPage(1);}} />
            <StatCard label="Overdue"   value={stats.overdue} iconBg="#fee2e2" iconColor="#ef4444" Ic={Icons.AlertCircle}  onClick={()=>{setStatusF("Overdue");setPage(1);}} />
            <StatCard label="Total Collected" value={"₹"+stats.total.toLocaleString("en-IN")} sub={`${stats.paid} students`} iconBg="#dcfce7" iconColor="#22c55e" Ic={Icons.Wallet}  onClick={()=>{setStatusF("Paid");setPage(1);}} />
            <StatCard label="All Students"    value={students.length} sub={selectedMonth} iconBg={T.accentL} iconColor={T.accent} Ic={Icons.Users} onClick={()=>{setStatusF("");setPage(1);}} />
          </div>

          {/* Toolbar */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, flexWrap:"wrap" }}>
            <div style={{ position:"relative", flex:1, minWidth:200 }}>
              <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:T.muted, display:"flex", alignItems:"center", pointerEvents:"none" }}>
                <Icons.Search size={15}/>
              </div>
              <input style={{ width:"100%", padding:"10px 14px 10px 38px", border:`1.5px solid ${T.border}`, borderRadius:T.radiusSm, background:T.surface, fontFamily:"inherit", fontSize:14, color:T.text, outline:"none" }}
                placeholder="Search by name or roll no…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
            </div>
            <select style={sel} value={statusF} onChange={e=>{setStatusF(e.target.value);setPage(1);}}>
              <option value="">All Statuses</option>
              <option>Unpaid</option><option>Paid</option><option>Overdue</option><option>Waived</option>
            </select>
            <select style={sel} value={hallF} onChange={e=>{setHallF(e.target.value);setPage(1);}}>
              <option value="">All Halls</option>
              {halls.map(h=><option key={h}>{h}</option>)}
            </select>
            <select style={sel} value={selectedMonth} onChange={e=>{setSelectedMonth(e.target.value);setPage(1);}}>
              {MONTHS.map(m=><option key={m}>{m}</option>)}
            </select>

            {/* CSV Export Button (placeholder — not implemented yet) */}
            <div style={{ position:"relative" }}>
              <button
                onClick={()=>showToast("CSV export coming soon!")}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px", background:T.accent, color:"#fff", border:"none", borderRadius:T.radiusSm, fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", boxShadow:"0 2px 8px rgba(91,94,244,.25)", transition:"opacity .15s" }}
                onMouseEnter={e=>e.currentTarget.style.opacity=".88"}
                onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                <Icons.FileSpreadsheet size={16}/> Export CSV
                <Icons.ChevronDown size={14}/>
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ background:T.surface, borderRadius:T.radius, boxShadow:T.shadow, overflow:"hidden" }}>
            {loading ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 20px", gap:12 }}>
                <Icons.Loader size={32} style={{ color:T.accent, animation:"spin 1s linear infinite" }}/>
                <div style={{ fontSize:14, color:T.muted, fontWeight:600 }}>Loading billing data…</div>
              </div>
            ) : (
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead style={{ background:T.surface2 }}>
                  <tr>
                    {["#","Student","Hall","Rebate Days","Fixed Charges","Extras","Grand Total","Status","Actions"].map(h=>(
                      <th key={h} style={{ padding:"14px 18px", textAlign:"left", fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".1em", borderBottom:`1.5px solid ${T.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {slice.length===0 ? (
                    <tr><td colSpan={9} style={{ textAlign:"center", padding:"60px 20px", color:T.muted, fontWeight:600 }}>
                      <div style={{ display:"flex", justifyContent:"center", marginBottom:12, color:T.border }}><Icons.Inbox size={48}/></div>
                      No billing records match your filters.
                    </td></tr>
                  ) : slice.map((s,i)=>(
                    <tr key={s.id}>
                      <td style={{ padding:"16px 18px", fontSize:13, color:T.muted, fontWeight:700, borderBottom:`1px solid ${T.border}` }}>{(safePg-1)*PER+i+1}</td>
                      <td style={{ padding:"16px 18px", borderBottom:`1px solid ${T.border}` }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:34, height:34, borderRadius:10, background:T.accentL, color:T.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, flexShrink:0 }}>{s.name?.[0] || "?"}</div>
                          <div>
                            <div style={{ fontWeight:700, fontSize:14 }}>{s.name}</div>
                            <div style={{ fontSize:12, color:T.muted, marginTop:1 }}>{s.roll_no}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"16px 18px", borderBottom:`1px solid ${T.border}` }}>
                        <span style={{ fontSize:12, fontWeight:700, background:T.accentL, color:T.accent, padding:"4px 10px", borderRadius:6, letterSpacing:".06em" }}>{s.hall}</span>
                      </td>
                      <td style={{ padding:"16px 18px", fontSize:14, fontWeight:700, borderBottom:`1px solid ${T.border}` }}>
                        {s.rebate_days > 0 ? (
                          <><div style={{ color:"#22c55e" }}>{s.rebate_days} days</div>
                          <div style={{ fontSize:11, color:T.muted, marginTop:1 }}>−₹{s.rebate_refund?.toLocaleString("en-IN")}</div></>
                        ) : <span style={{ fontSize:12, color:T.muted }}>—</span>}
                      </td>
                      <td style={{ padding:"16px 18px", fontSize:14, fontWeight:700, borderBottom:`1px solid ${T.border}` }}>₹{s.fixed_charges?.toLocaleString("en-IN") || 0}</td>
                      <td style={{ padding:"16px 18px", borderBottom:`1px solid ${T.border}` }}>
                        {s.total_extras > 0
                          ? <><div style={{ fontSize:14, fontWeight:700 }}>₹{s.total_extras?.toLocaleString("en-IN")}</div><div style={{ fontSize:11, color:T.muted }}>{s.extras?.length} item{s.extras?.length>1?"s":""}</div></>
                          : <span style={{ fontSize:12, color:T.muted }}>—</span>}
                      </td>
                      <td style={{ padding:"16px 18px", borderBottom:`1px solid ${T.border}` }}>
                        <div style={{ fontSize:15, fontWeight:800, color:T.text }}>₹{s.grand_total?.toLocaleString("en-IN") || 0}</div>
                      </td>
                      <td style={{ padding:"16px 18px", borderBottom:`1px solid ${T.border}` }}>
                        <StatusBadge status={s.payStatus} />
                      </td>
                      <td style={{ padding:"16px 18px", borderBottom: i===slice.length-1?"none":`1px solid ${T.border}` }}>
                        <div style={{ display:"flex", gap:6 }}>
                          <AiBtn color={T.accent}   hoverBg={T.accent}   title="View full bill"  onClick={()=>setActiveId(s.id)}><Icons.Eye size={15}/></AiBtn>
                          <AiBtn color="#475569"  hoverBg="#475569"  title="Send Reminder" onClick={()=>handleSendReminder(s.id)}><Icons.Send size={15}/></AiBtn>
                          {s.payStatus !== "Paid" && (
                            <AiBtn color="#22c55e"  hoverBg="#22c55e"  title="Mark as Paid" onClick={()=>handleMarkAs(s.id, 'paid')}><Icons.Check size={15}/></AiBtn>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!loading && pages>1 && (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:8, padding:"16px 18px", borderTop:`1px solid ${T.border}` }}>
                <span style={{ fontSize:13, color:T.muted, fontWeight:600, marginRight:4 }}>Page {safePg} of {pages}</span>
                <PgBtn disabled={safePg===1}     onClick={()=>setPage(p=>p-1)}>‹</PgBtn>
                {Array.from({length:pages},(_,i)=>i+1).map(p=><PgBtn key={p} active={p===safePg} onClick={()=>setPage(p)}>{p}</PgBtn>)}
                <PgBtn disabled={safePg===pages} onClick={()=>setPage(p=>p+1)}>›</PgBtn>
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
    </>
  );
}
