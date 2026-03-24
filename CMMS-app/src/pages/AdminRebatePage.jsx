import { useState, useMemo } from "react";

// ── Inline SVG Icon Components ─────────────────────────────────────────────
const Icon = ({ children, size = 20, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}>
    {children}
  </svg>
);

const Icons = {
  Menu: (p) => <Icon {...p}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></Icon>,
  Utensils: (p) => <Icon {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></Icon>,
  Bell: (p) => <Icon {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></Icon>,
  User: (p) => <Icon {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>,
  FileText: (p) => <Icon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></Icon>,
  Clock: (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>,
  CheckCircle: (p) => <Icon {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></Icon>,
  XCircle: (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></Icon>,
  Rupee: (p) => <Icon {...p}><path d="M6 3h12"/><path d="M6 8h12"/><path d="M6 13l8.5 8"/><path d="M6 13h3a4 4 0 0 0 0-8"/></Icon>,
  Search: (p) => <Icon {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Icon>,
  Eye: (p) => <Icon {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></Icon>,
  Check: (p) => <Icon {...p}><polyline points="20 6 9 17 4 12"/></Icon>,
  X: (p) => <Icon {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>,
  ArrowRight: (p) => <Icon {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></Icon>,
  Calendar: (p) => <Icon {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Icon>,
  Inbox: (p) => <Icon {...p}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></Icon>,
  Save: (p) => <Icon {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></Icon>,
  CheckCircle2: (p) => <Icon {...p}><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/><path d="m9 12 2 2 4-4"/></Icon>,
};

// ── Constants ─────────────────────────────────────────────────────────────
const DAILY_RATE = 120;

const INITIAL_DATA = [
  { id:1,  name:"Shubham Kumar Pandey", roll:"220850", mess:"Hall 5 Mess", from:"2026-03-10", to:"2026-03-17", days:7,  reason:"Going home for Holi festival celebrations",              applied:"2026-03-05", status:"Pending",  note:"" },
  { id:2,  name:"Ananya Sharma",        roll:"220123", mess:"Hall 2 Mess", from:"2026-03-14", to:"2026-03-20", days:6,  reason:"Medical leave — fever and viral infection",              applied:"2026-03-12", status:"Approved", note:"Medical certificate verified." },
  { id:3,  name:"Rohan Verma",          roll:"210456", mess:"Hall 7 Mess", from:"2026-03-01", to:"2026-03-05", days:4,  reason:"College sports tournament away match",                   applied:"2026-02-28", status:"Approved", note:"Sports captain approval attached." },
  { id:4,  name:"Priya Nair",           roll:"220789", mess:"Hall 4 Mess", from:"2026-03-18", to:"2026-03-25", days:7,  reason:"Family function — sister wedding",                       applied:"2026-03-15", status:"Pending",  note:"" },
  { id:5,  name:"Aditya Singh",         roll:"210987", mess:"Hall 5 Mess", from:"2026-02-20", to:"2026-02-25", days:5,  reason:"Internship interview travel to Bangalore",               applied:"2026-02-18", status:"Rejected", note:"Insufficient advance notice period." },
  { id:6,  name:"Kavya Menon",          roll:"220654", mess:"Hall 2 Mess", from:"2026-03-22", to:"2026-03-30", days:8,  reason:"Research conference presentation at IIT Bombay",        applied:"2026-03-20", status:"Pending",  note:"" },
  { id:7,  name:"Rahul Gupta",          roll:"210321", mess:"Hall 7 Mess", from:"2026-02-10", to:"2026-02-15", days:5,  reason:"Home visit — parents unwell",                            applied:"2026-02-08", status:"Approved", note:"" },
  { id:8,  name:"Sneha Patel",          roll:"220543", mess:"Hall 4 Mess", from:"2026-03-05", to:"2026-03-07", days:2,  reason:"Dental surgery appointment",                             applied:"2026-03-03", status:"Approved", note:"Doctor slip received." },
  { id:9,  name:"Varun Joshi",          roll:"210765", mess:"Hall 5 Mess", from:"2026-03-25", to:"2026-04-01", days:7,  reason:"Summer internship preparation and travel",               applied:"2026-03-22", status:"Pending",  note:"" },
  { id:10, name:"Manya Agarwal",        roll:"220198", mess:"Hall 2 Mess", from:"2026-01-15", to:"2026-01-20", days:5,  reason:"Aunt marriage function in Jaipur",                       applied:"2026-01-12", status:"Approved", note:"" },
  { id:11, name:"Deepak Chauhan",       roll:"210876", mess:"Hall 7 Mess", from:"2026-02-28", to:"2026-03-03", days:3,  reason:"National level chess tournament",                        applied:"2026-02-25", status:"Rejected", note:"Application submitted too late." },
  { id:12, name:"Neha Mishra",          roll:"220432", mess:"Hall 4 Mess", from:"2026-03-12", to:"2026-03-18", days:6,  reason:"International student exchange visit to NUS Singapore",  applied:"2026-03-10", status:"Pending",  note:"" },
].map(d => ({ ...d, amount: d.days * DAILY_RATE }));

// ── Status helpers ────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Pending:  { bg: "#fef3c7", color: "#f59e0b", Icon: Icons.Clock },
  Approved: { bg: "#dcfce7", color: "#22c55e", Icon: Icons.CheckCircle },
  Rejected: { bg: "#fee2e2", color: "#ef4444", Icon: Icons.XCircle },
};

// ── Styles (CSS-in-JS objects) ────────────────────────────────────────────
const S = {
  // layout
  body:       { fontFamily:"'Manrope', sans-serif", background:"#f0f1fb", minHeight:"100vh", color:"#1a1b3a" },
  nav:        { background:"#fff", borderBottom:"1px solid #e5e6f7", display:"flex", alignItems:"center", padding:"0 28px", height:64, gap:14, position:"sticky", top:0, zIndex:100 },
  navIcon:    { width:38, height:38, background:"#5b5ef4", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0 },
  navTitle:   { fontWeight:800, fontSize:17, color:"#1a1b3a", lineHeight:1.1 },
  navSub:     { fontSize:10, letterSpacing:".12em", color:"#7b7da8", fontWeight:600, textTransform:"uppercase" },
  navAvatar:  { width:36, height:36, borderRadius:"50%", background:"#f7f7fd", display:"flex", alignItems:"center", justifyContent:"center", color:"#7b7da8", cursor:"pointer", border:"2px solid #e5e6f7" },
  navBellWrap:{ position:"relative", cursor:"pointer", display:"flex", alignItems:"center", color:"#7b7da8" },
  navDot:     { position:"absolute", top:0, right:0, width:8, height:8, background:"#ef4444", borderRadius:"50%", border:"2px solid #fff" },
  main:       { padding:"32px 40px", maxWidth:1320, margin:"0 auto" },

  // hero
  hero:       { background:"#fff", borderRadius:16, padding:"28px 32px", display:"flex", alignItems:"center", gap:20, boxShadow:"0 2px 16px rgba(91,94,244,0.07)", marginBottom:28 },
  heroIcon:   { width:52, height:52, background:"#ededfd", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", color:"#5b5ef4", flexShrink:0 },
  heroBadge:  { marginLeft:"auto", background:"#5b5ef4", color:"#fff", padding:"6px 16px", borderRadius:50, fontSize:12, fontWeight:700, whiteSpace:"nowrap" },

  // stats
  statsGrid:  { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 },
  statCard:   { background:"#fff", borderRadius:10, padding:"20px 22px", boxShadow:"0 2px 16px rgba(91,94,244,0.07)", display:"flex", alignItems:"center", gap:14, cursor:"pointer", transition:"transform .18s, box-shadow .18s" },
  statIcon:   { width:42, height:42, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  statNum:    { fontSize:26, fontWeight:800, color:"#1a1b3a", lineHeight:1 },
  statLabel:  { fontSize:12, color:"#7b7da8", fontWeight:600, marginTop:3 },

  // toolbar
  toolbar:    { display:"flex", alignItems:"center", gap:12, marginBottom:20, flexWrap:"wrap" },
  searchWrap: { position:"relative", flex:1, minWidth:200 },
  searchIcon: { position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#7b7da8", display:"flex", alignItems:"center", pointerEvents:"none" },
  input:      { width:"100%", padding:"10px 14px 10px 38px", border:"1.5px solid #e5e6f7", borderRadius:10, background:"#fff", fontFamily:"inherit", fontSize:14, color:"#1a1b3a", outline:"none" },
  select:     { padding:"10px 32px 10px 14px", border:"1.5px solid #e5e6f7", borderRadius:10, background:"#fff", fontFamily:"inherit", fontSize:14, color:"#1a1b3a", outline:"none", cursor:"pointer", appearance:"none",
                backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237b7da8' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center" },

  // table
  tableWrap:  { background:"#fff", borderRadius:16, boxShadow:"0 2px 16px rgba(91,94,244,0.07)", overflow:"hidden" },
  thead:      { background:"#f7f7fd" },
  th:         { padding:"14px 18px", textAlign:"left", fontSize:11, fontWeight:700, color:"#7b7da8", textTransform:"uppercase", letterSpacing:".1em", borderBottom:"1.5px solid #e5e6f7" },
  td:         { padding:"16px 18px", fontSize:14, verticalAlign:"middle", borderBottom:"1px solid #e5e6f7" },

  // badges
  catBadge:   { display:"inline-block", padding:"4px 10px", borderRadius:6, fontSize:11, fontWeight:700, letterSpacing:".06em", background:"#ededfd", color:"#5b5ef4" },
  daysBadge:  { display:"inline-flex", alignItems:"center", gap:4, background:"#ededfd", color:"#5b5ef4", padding:"4px 10px", borderRadius:6, fontSize:12, fontWeight:700 },

  // action btns
  aibtn:      { width:32, height:32, borderRadius:8, border:"1.5px solid #e5e6f7", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", background:"#fff", transition:"all .15s" },

  // modal
  overlay:    { position:"fixed", inset:0, background:"rgba(26,27,58,.45)", backdropFilter:"blur(4px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" },
  modal:      { background:"#fff", borderRadius:16, padding:32, width:560, maxWidth:"95vw", boxShadow:"0 4px 24px rgba(91,94,244,0.12)", animation:"slideUp .22s ease" },
  mlabel:     { fontSize:11, fontWeight:700, color:"#7b7da8", letterSpacing:".1em", textTransform:"uppercase", marginBottom:6 },
  mval:       { fontSize:14, fontWeight:600, color:"#1a1b3a" },
  mdesc:      { background:"#f7f7fd", border:"1.5px solid #e5e6f7", borderRadius:10, padding:14, fontSize:14, lineHeight:1.65, color:"#1a1b3a" },
  calcBox:    { background:"#ededfd", borderRadius:10, padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 },
  mnote:      { width:"100%", padding:"10px 14px", border:"1.5px solid #e5e6f7", borderRadius:10, fontFamily:"inherit", fontSize:14, color:"#1a1b3a", background:"#f7f7fd", outline:"none", resize:"vertical", minHeight:72 },
};

// ── Sub-components ────────────────────────────────────────────────────────

function StatusBadge({ status, size = 11 }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  const Ic = cfg.Icon;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 11px", borderRadius:50, fontSize:12, fontWeight:700, background:cfg.bg, color:cfg.color }}>
      <Ic size={size} /> {status}
    </span>
  );
}

function ActionBtn({ onClick, color, hoverBg, title, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button title={title} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...S.aibtn, color: hov ? "#fff" : color, background: hov ? hoverBg : "#fff", borderColor: hov ? hoverBg : "#e5e6f7" }}>
      {children}
    </button>
  );
}

function StatCard({ label, value, iconBg, iconColor, IconComp, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...S.statCard, transform: hov ? "translateY(-2px)" : "none", boxShadow: hov ? "0 4px 24px rgba(91,94,244,0.12)" : "0 2px 16px rgba(91,94,244,0.07)" }}>
      <div style={{ ...S.statIcon, background: iconBg, color: iconColor }}>
        <IconComp size={20} />
      </div>
      <div>
        <div style={S.statNum}>{value}</div>
        <div style={S.statLabel}>{label}</div>
      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────
function RebateModal({ item, onClose, onAction }) {
  const [note, setNote] = useState(item.note || "");

  if (!item) return null;

  const handleAction = (status) => {
    onAction(item.id, status, note);
    onClose();
  };

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
          <div style={{ fontSize:18, fontWeight:800 }}>Rebate Application</div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#7b7da8", width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icons.X size={18} />
          </button>
        </div>

        {/* Student info */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
          {[["Student Name", item.name], ["Roll No.", item.roll], ["Mess", item.mess], ["Applied On", item.applied]].map(([label, val]) => (
            <div key={label}>
              <div style={S.mlabel}>{label}</div>
              <div style={S.mval}>{val}</div>
            </div>
          ))}
        </div>

        <hr style={{ border:"none", borderTop:"1px solid #e5e6f7", margin:"0 0 16px" }} />

        {/* Leave details */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
          {[["From Date", item.from], ["To Date", item.to], ["Total Days", item.days + " days"], ["Daily Rate", "₹" + DAILY_RATE + " / day"]].map(([label, val]) => (
            <div key={label}>
              <div style={S.mlabel}>{label}</div>
              <div style={S.mval}>{val}</div>
            </div>
          ))}
        </div>

        {/* Reason */}
        <div style={{ marginBottom:16 }}>
          <div style={S.mlabel}>Reason for Leave</div>
          <div style={S.mdesc}>{item.reason}</div>
        </div>

        {/* Rebate calc */}
        <div style={S.calcBox}>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:"#5b5ef4" }}>Calculated Rebate Amount</div>
            <div style={{ fontSize:11, color:"#5b5ef4", opacity:.7, marginTop:1 }}>{item.days}d × ₹{DAILY_RATE}/day</div>
          </div>
          <div style={{ fontSize:22, fontWeight:800, color:"#5b5ef4" }}>₹{item.amount.toLocaleString("en-IN")}</div>
        </div>

        {/* Admin note */}
        <div style={{ marginBottom:20 }}>
          <div style={S.mlabel}>Admin Note (optional)</div>
          <textarea style={S.mnote} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note for the student…" />
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:10 }}>
          <ModalBtn color="#22c55e" onClick={() => handleAction("Approved")}>
            <Icons.Check size={15} /> Approve
          </ModalBtn>
          <ModalBtn color="#ef4444" onClick={() => handleAction("Rejected")}>
            <Icons.X size={15} /> Reject
          </ModalBtn>
        </div>
      </div>
    </div>
  );
}

function ModalBtn({ color, onClick, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ flex:1, padding:12, borderRadius:10, fontFamily:"inherit", fontSize:14, fontWeight:700, cursor:"pointer", border:"none", background:color, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", gap:6, opacity: hov ? .88 : 1, transform: hov ? "translateY(-1px)" : "none", transition:"all .15s" }}>
      {children}
    </button>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────
function Toast({ msg, show }) {
  return (
    <div style={{
      position:"fixed", bottom:28, left:"50%",
      transform: show ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(80px)",
      background:"#1a1b3a", color:"#fff", padding:"12px 22px", borderRadius:50,
      fontSize:14, fontWeight:600, zIndex:300, pointerEvents:"none", whiteSpace:"nowrap",
      display:"flex", alignItems:"center", gap:8,
      transition:"transform .3s cubic-bezier(.34,1.56,.64,1)",
    }}>
      <Icons.CheckCircle2 size={16} /> <span>{msg}</span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function AdminRebatePage() {
  const [data, setData] = useState(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeId, setActiveId] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const PER = 8;

  // Stats
  const stats = useMemo(() => ({
    pending:  data.filter(d => d.status === "Pending").length,
    approved: data.filter(d => d.status === "Approved").length,
    rejected: data.filter(d => d.status === "Rejected").length,
    total:    data.filter(d => d.status === "Approved").reduce((s, d) => s + d.amount, 0),
  }), [data]);

  // Filtered
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(d =>
      (!q || d.name.toLowerCase().includes(q) || d.roll.includes(q) || d.reason.toLowerCase().includes(q)) &&
      (!statusFilter || d.status === statusFilter) &&
      (!monthFilter || d.from.startsWith(monthFilter) || d.to.startsWith(monthFilter))
    );
  }, [data, search, statusFilter, monthFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const safePage = Math.min(currentPage, pages);
  const slice = filtered.slice((safePage - 1) * PER, safePage * PER);

  const activeItem = data.find(d => d.id === activeId) || null;

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2800);
  };

  const quickStatus = (id, status) => {
    const item = data.find(d => d.id === id);
    setData(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    showToast((status === "Approved" ? "✓ Approved: " : "✗ Rejected: ") + item?.name);
  };

  const handleModalAction = (id, status, note) => {
    const item = data.find(d => d.id === id);
    setData(prev => prev.map(d => d.id === id ? { ...d, status, note } : d));
    showToast((status === "Approved" ? "✓ Rebate approved — " : "✗ Application rejected — ") + item?.name);
    setActiveId(null);
  };

  const filterByStatus = (s) => { setStatusFilter(s); setCurrentPage(1); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Manrope', sans-serif; }
        @keyframes slideUp { from { transform: translateY(20px); opacity:0; } to { transform: none; opacity:1; } }
        tr:hover td { background: #f7f7fd; }
        input:focus { border-color: #5b5ef4 !important; }
        select:focus { border-color: #5b5ef4 !important; }
        textarea:focus { border-color: #5b5ef4 !important; }
      `}</style>

      <div style={S.body}>

        {/* ── NAV ── */}
        <nav style={S.nav}>
          <div style={{ cursor:"pointer", color:"#7b7da8", display:"flex", alignItems:"center" }}>
            <Icons.Menu size={20} />
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={S.navIcon}><Icons.Utensils size={19} /></div>
            <div>
              <div style={S.navTitle}>CMMS</div>
              <div style={S.navSub}>Centralized Mess Management</div>
            </div>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:16 }}>
            <div style={S.navBellWrap}>
              <Icons.Bell size={20} />
              <div style={S.navDot} />
            </div>
            <div style={S.navAvatar}><Icons.User size={18} /></div>
          </div>
        </nav>

        {/* ── MAIN ── */}
        <main style={S.main}>

          {/* Hero */}
          <div style={S.hero}>
            <div style={S.heroIcon}><Icons.FileText size={26} /></div>
            <div>
              <h1 style={{ fontSize:24, fontWeight:800, color:"#1a1b3a" }}>Rebate Management</h1>
              <p style={{ color:"#7b7da8", fontSize:14, marginTop:2, fontWeight:500 }}>Review and approve student mess leave and rebate applications.</p>
            </div>
            <div style={S.heroBadge}>{data.length} Total Applications</div>
          </div>

          {/* Stats */}
          <div style={S.statsGrid}>
            <StatCard label="Pending"        value={stats.pending}  iconBg="#fef3c7" iconColor="#f59e0b" IconComp={Icons.Clock}       onClick={() => filterByStatus("Pending")} />
            <StatCard label="Approved"       value={stats.approved} iconBg="#dcfce7" iconColor="#22c55e" IconComp={Icons.CheckCircle}  onClick={() => filterByStatus("Approved")} />
            <StatCard label="Rejected"       value={stats.rejected} iconBg="#fee2e2" iconColor="#ef4444" IconComp={Icons.XCircle}      onClick={() => filterByStatus("Rejected")} />
            <StatCard label="Total Approved" value={"₹" + stats.total.toLocaleString("en-IN")} iconBg="#ededfd" iconColor="#5b5ef4" IconComp={Icons.Rupee} onClick={() => filterByStatus("")} />
          </div>

          {/* Toolbar */}
          <div style={S.toolbar}>
            <div style={S.searchWrap}>
              <div style={S.searchIcon}><Icons.Search size={15} /></div>
              <input style={S.input} placeholder="Search by roll no, name, reason…" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
            </div>
            <select style={S.select} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select style={S.select} value={monthFilter} onChange={e => { setMonthFilter(e.target.value); setCurrentPage(1); }}>
              <option value="">All Months</option>
              <option value="2026-01">Jan 2026</option>
              <option value="2026-02">Feb 2026</option>
              <option value="2026-03">Mar 2026</option>
            </select>
          </div>

          {/* Table */}
          <div style={S.tableWrap}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead style={S.thead}>
                <tr>
                  {["#","Student","Leave Period","Days","Reason","Applied On","Rebate Amt","Status","Actions"].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slice.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign:"center", padding:"60px 20px", color:"#7b7da8", fontWeight:600 }}>
                      <div style={{ display:"flex", justifyContent:"center", marginBottom:12, color:"#e5e6f7" }}>
                        <Icons.Inbox size={48} />
                      </div>
                      No rebate applications match your filters.
                    </td>
                  </tr>
                ) : slice.map((d, i) => (
                  <tr key={d.id}>
                    <td style={{ ...S.td, color:"#7b7da8", fontWeight:700, fontSize:13 }}>{(safePage-1)*PER+i+1}</td>

                    <td style={S.td}>
                      <div style={{ fontWeight:700 }}>{d.name}</div>
                      <div style={{ fontSize:12, color:"#7b7da8", marginTop:2 }}>{d.roll} · {d.mess}</div>
                    </td>

                    <td style={S.td}>
                      <div style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:13, fontWeight:600 }}>
                        <span>{d.from}</span>
                        <span style={{ color:"#7b7da8" }}><Icons.ArrowRight size={12} /></span>
                        <span>{d.to}</span>
                      </div>
                    </td>

                    <td style={S.td}>
                      <span style={S.daysBadge}>
                        <Icons.Calendar size={11} /> {d.days}d
                      </span>
                    </td>

                    <td style={S.td}>
                      <span style={{ color:"#1a1b3a", fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:180, display:"block" }}>{d.reason}</span>
                    </td>

                    <td style={{ ...S.td, color:"#7b7da8", fontSize:13, fontWeight:600 }}>{d.applied}</td>

                    <td style={S.td}>
                      <div style={{ fontWeight:800, fontSize:14 }}>₹{d.amount.toLocaleString("en-IN")}</div>
                      <div style={{ fontSize:11, color:"#7b7da8", marginTop:1 }}>{d.days}d × ₹{DAILY_RATE}</div>
                    </td>

                    <td style={S.td}><StatusBadge status={d.status} /></td>

                    <td style={{ ...S.td, borderBottom: i === slice.length - 1 ? "none" : "1px solid #e5e6f7" }}>
                      <div style={{ display:"flex", gap:6 }}>
                        <ActionBtn color="#5b5ef4" hoverBg="#5b5ef4" title="View & Manage" onClick={() => setActiveId(d.id)}>
                          <Icons.Eye size={15} />
                        </ActionBtn>
                        {d.status !== "Approved" && (
                          <ActionBtn color="#22c55e" hoverBg="#22c55e" title="Approve" onClick={() => quickStatus(d.id, "Approved")}>
                            <Icons.Check size={15} />
                          </ActionBtn>
                        )}
                        {d.status !== "Rejected" && (
                          <ActionBtn color="#ef4444" hoverBg="#ef4444" title="Reject" onClick={() => quickStatus(d.id, "Rejected")}>
                            <Icons.X size={15} />
                          </ActionBtn>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:8, padding:"16px 18px", borderTop:"1px solid #e5e6f7" }}>
                <span style={{ fontSize:13, color:"#7b7da8", fontWeight:600, marginRight:4 }}>Page {safePage} of {pages}</span>
                <PgBtn disabled={safePage === 1}   onClick={() => setCurrentPage(p => p - 1)}>‹</PgBtn>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <PgBtn key={p} active={p === safePage} onClick={() => setCurrentPage(p)}>{p}</PgBtn>
                ))}
                <PgBtn disabled={safePage === pages} onClick={() => setCurrentPage(p => p + 1)}>›</PgBtn>
              </div>
            )}
          </div>
        </main>

        {/* Modal */}
        {activeId && activeItem && (
          <RebateModal item={activeItem} onClose={() => setActiveId(null)} onAction={handleModalAction} />
        )}

        {/* Toast */}
        <Toast show={toast.show} msg={toast.msg} />
      </div>
    </>
  );
}

function PgBtn({ onClick, disabled, active, children }) {
  const [hov, setHov] = useState(false);
  const highlight = active || hov;
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width:34, height:34, borderRadius:9, border:"1.5px solid " + (highlight ? "#5b5ef4" : "#e5e6f7"), background: highlight ? "#5b5ef4" : "#fff", color: highlight ? "#fff" : "#1a1b3a", fontFamily:"inherit", fontSize:13, fontWeight:700, cursor: disabled ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", opacity: disabled ? .35 : 1, transition:"all .15s" }}>
      {children}
    </button>
  );
}
