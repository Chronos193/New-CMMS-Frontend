import { useState, useMemo, useCallback } from "react";

/* ─── CSS Variables injected once ─── */
const GlobalStyle = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --accent: #5b5ef4; --accent-light: #ededfd; --accent-dark: #3b3ec2;
      --bg: #f0f1fb; --surface: #ffffff; --surface2: #f7f7fd;
      --border: #e5e6f7; --text: #1a1b3a; --muted: #7b7da8;
      --pending: #f59e0b; --pending-bg: #fef3c7;
      --inprogress: #3b82f6; --inprogress-bg: #dbeafe;
      --resolved: #22c55e; --resolved-bg: #dcfce7;
      --rejected: #ef4444; --rejected-bg: #fee2e2;
      --shadow: 0 2px 16px 0 rgba(91,94,244,0.07);
      --shadow-md: 0 4px 24px 0 rgba(91,94,244,0.12);
      --radius: 16px; --radius-sm: 10px;
    }
    body { font-family: 'Manrope', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
    svg { display: inline-block; vertical-align: middle; }

    /* NAV */
    .af-nav {
      background: var(--surface); border-bottom: 1px solid var(--border);
      display: flex; align-items: center; padding: 0 28px; height: 64px; gap: 14px;
      position: sticky; top: 0; z-index: 100;
    }
    .af-nav-hamburger { cursor: pointer; color: var(--muted); display: flex; align-items: center; }
    .af-nav-logo { display: flex; align-items: center; gap: 10px; }
    .af-nav-icon {
      width: 38px; height: 38px; background: var(--accent); border-radius: 10px;
      display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0;
    }
    .af-nav-title { font-weight: 800; font-size: 17px; color: var(--text); line-height: 1.1; }
    .af-nav-sub { font-size: 10px; letter-spacing: .12em; color: var(--muted); font-weight: 600; text-transform: uppercase; }
    .af-nav-right { margin-left: auto; display: flex; align-items: center; gap: 16px; }
    .af-nav-bell { position: relative; cursor: pointer; display: flex; align-items: center; color: var(--muted); }
    .af-nav-dot { position: absolute; top: 0; right: 0; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; border: 2px solid #fff; }
    .af-nav-avatar {
      width: 36px; height: 36px; border-radius: 50%; background: var(--surface2);
      display: flex; align-items: center; justify-content: center; color: var(--muted);
      cursor: pointer; border: 2px solid var(--border);
    }

    /* MAIN */
    .af-main { padding: 32px 40px; max-width: 1320px; margin: 0 auto; }

    /* Hero */
    .af-hero {
      background: var(--surface); border-radius: var(--radius); padding: 28px 32px;
      display: flex; align-items: center; gap: 20px; box-shadow: var(--shadow); margin-bottom: 28px;
    }
    .af-hero-icon {
      width: 52px; height: 52px; background: var(--accent-light); border-radius: 14px;
      display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0;
    }
    .af-hero h1 { font-size: 24px; font-weight: 800; color: var(--text); }
    .af-hero p { color: var(--muted); font-size: 14px; margin-top: 2px; font-weight: 500; }
    .af-hero-badge { margin-left: auto; background: var(--accent); color: #fff; padding: 6px 16px; border-radius: 50px; font-size: 12px; font-weight: 700; white-space: nowrap; }

    /* Stats */
    .af-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 28px; }
    .af-stat-card {
      background: var(--surface); border-radius: var(--radius-sm); padding: 20px 22px;
      box-shadow: var(--shadow); display: flex; align-items: center; gap: 14px;
      transition: transform .18s, box-shadow .18s; cursor: pointer; border: none; text-align: left; width: 100%;
    }
    .af-stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
    .af-stat-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .af-stat-num { font-size: 26px; font-weight: 800; color: var(--text); line-height: 1; }
    .af-stat-label { font-size: 12px; color: var(--muted); font-weight: 600; margin-top: 3px; }

    /* Toolbar */
    .af-toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    .af-search-wrap { position: relative; flex: 1; min-width: 200px; }
    .af-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--muted); display: flex; align-items: center; pointer-events: none; }
    .af-search-wrap input {
      width: 100%; padding: 10px 14px 10px 38px; border: 1.5px solid var(--border);
      border-radius: var(--radius-sm); background: var(--surface); font-family: inherit;
      font-size: 14px; color: var(--text); outline: none; transition: border-color .18s;
    }
    .af-search-wrap input:focus { border-color: var(--accent); }
    .af-select {
      padding: 10px 32px 10px 14px; border: 1.5px solid var(--border); border-radius: var(--radius-sm);
      background: var(--surface); font-family: inherit; font-size: 14px; color: var(--text);
      outline: none; cursor: pointer; transition: border-color .18s; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237b7da8' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 12px center;
    }
    .af-select:focus { border-color: var(--accent); }

    /* Table */
    .af-table-wrap { background: var(--surface); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; }
    .af-table { width: 100%; border-collapse: collapse; }
    .af-table thead { background: var(--surface2); }
    .af-table thead th { padding: 14px 18px; text-align: left; font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: .1em; border-bottom: 1.5px solid var(--border); }
    .af-table tbody tr { border-bottom: 1px solid var(--border); transition: background .15s; }
    .af-table tbody tr:last-child { border-bottom: none; }
    .af-table tbody tr:hover { background: var(--surface2); }
    .af-table td { padding: 16px 18px; font-size: 14px; vertical-align: middle; }
    .af-desc-text { color: var(--text); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px; display: block; }
    .af-desc-date { font-size: 12px; color: var(--muted); margin-top: 4px; display: flex; align-items: center; gap: 4px; }

    .af-cat-badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; letter-spacing: .06em; background: var(--accent-light); color: var(--accent); }

    .af-status-badge { display: inline-flex; align-items: center; gap: 5px; padding: 5px 11px; border-radius: 50px; font-size: 12px; font-weight: 700; }
    .af-s-pending    { background: var(--pending-bg);    color: var(--pending);    }
    .af-s-inprogress { background: var(--inprogress-bg); color: var(--inprogress); }
    .af-s-resolved   { background: var(--resolved-bg);   color: var(--resolved);   }
    .af-s-rejected   { background: var(--rejected-bg);   color: var(--rejected);   }

    /* Action buttons */
    .af-actions { display: flex; gap: 6px; }
    .af-aibtn {
      width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--border);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all .15s; background: var(--surface);
    }
    .af-aibtn-view  { color: var(--accent); }
    .af-aibtn-view:hover  { background: var(--accent);     color: #fff; border-color: var(--accent); }
    .af-aibtn-prog  { color: var(--inprogress); }
    .af-aibtn-prog:hover  { background: var(--inprogress); color: #fff; border-color: var(--inprogress); }
    .af-aibtn-res   { color: var(--resolved); }
    .af-aibtn-res:hover   { background: var(--resolved);   color: #fff; border-color: var(--resolved); }
    .af-aibtn-rej   { color: var(--rejected); }
    .af-aibtn-rej:hover   { background: var(--rejected);   color: #fff; border-color: var(--rejected); }

    /* Modal */
    .af-overlay {
      display: none; position: fixed; inset: 0; background: rgba(26,27,58,.45);
      backdrop-filter: blur(4px); z-index: 200; align-items: center; justify-content: center;
    }
    .af-overlay.open { display: flex; }
    .af-modal {
      background: var(--surface); border-radius: var(--radius); padding: 32px;
      width: 540px; max-width: 95vw; box-shadow: var(--shadow-md);
      animation: af-slideUp .22s ease;
    }
    @keyframes af-slideUp { from { transform: translateY(20px); opacity:0; } to { transform: none; opacity:1; } }
    .af-modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
    .af-modal-title { font-size: 18px; font-weight: 800; }
    .af-modal-close {
      background: none; border: none; cursor: pointer; color: var(--muted);
      width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center;
      justify-content: center; transition: background .15s;
    }
    .af-modal-close:hover { background: var(--border); }
    .af-mrow { margin-bottom: 16px; }
    .af-mlabel { font-size: 11px; font-weight: 700; color: var(--muted); letter-spacing: .1em; text-transform: uppercase; margin-bottom: 6px; }
    .af-mval { font-size: 14px; font-weight: 500; color: var(--text); }
    .af-mdesc { background: var(--surface2); border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 14px; font-size: 14px; line-height: 1.65; color: var(--text); }
    .af-mstatus-wrap { display: flex; align-items: center; gap: 10px; }
    .af-mstatus-sel {
      flex: 1; padding: 10px 14px; border: 1.5px solid var(--border); border-radius: var(--radius-sm);
      font-family: inherit; font-size: 14px; font-weight: 600; outline: none; cursor: pointer;
      background: var(--surface2); color: var(--text); transition: border-color .15s; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237b7da8' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px;
    }
    .af-mstatus-sel:focus { border-color: var(--accent); }
    .af-msave-btn {
      display: flex; align-items: center; gap: 6px; padding: 10px 18px;
      background: var(--accent); color: #fff; border: none; border-radius: var(--radius-sm);
      font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer;
      transition: background .15s, transform .12s; white-space: nowrap;
    }
    .af-msave-btn:hover { background: var(--accent-dark); transform: translateY(-1px); }

    /* Toast */
    .af-toast {
      position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(80px);
      background: var(--text); color: #fff; padding: 12px 22px; border-radius: 50px;
      font-size: 14px; font-weight: 600; z-index: 300; pointer-events: none; white-space: nowrap;
      display: flex; align-items: center; gap: 8px;
      transition: transform .3s cubic-bezier(.34,1.56,.64,1);
    }
    .af-toast.show { transform: translateX(-50%) translateY(0); }

    /* Empty */
    .af-empty { text-align: center; padding: 60px 20px; color: var(--muted); font-size: 15px; font-weight: 600; }
    .af-empty-icon { display: flex; justify-content: center; margin-bottom: 12px; color: var(--border); }

    /* Pagination */
    .af-pagination { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 16px 18px; border-top: 1px solid var(--border); }
    .af-pgbtn { width: 34px; height: 34px; border-radius: 9px; border: 1.5px solid var(--border); background: var(--surface); font-family: inherit; font-size: 13px; font-weight: 700; color: var(--text); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; }
    .af-pgbtn:hover, .af-pgbtn.active { background: var(--accent); color: #fff; border-color: var(--accent); }
    .af-pgbtn:disabled { opacity: .35; pointer-events: none; }
    .af-pginfo { font-size: 13px; color: var(--muted); font-weight: 600; margin-right: 4px; }

    @media (max-width: 900px) {
      .af-main { padding: 20px 16px; }
      .af-stats { grid-template-columns: repeat(2,1fr); }
      .af-table-wrap { overflow-x: auto; }
      .af-table { min-width: 800px; }
      .af-hero { flex-wrap: wrap; }
      .af-hero-badge { margin-left: 0; }
    }
  `}</style>
);

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

const STATUS_LABEL = { pending: "Pending", inprogress: "In Progress", resolved: "Resolved", rejected: "Rejected" };
const STATUS_CLASS = { pending: "af-s-pending", inprogress: "af-s-inprogress", resolved: "af-s-resolved", rejected: "af-s-rejected" };

const StatusIcon = ({ status, size = 11 }) => {
    const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" };
    if (status === "pending") return <svg {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
    if (status === "inprogress") return <svg {...props}><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>;
    if (status === "resolved") return <svg {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
    if (status === "rejected") return <svg {...props}><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>;
    return null;
};

/* ─── Initial data ─── */
const INITIAL_DATA = [
    { id: 1, student: "Shubham Kumar Pandey", roll: "shubhamkp25@iitk.ac.in", category: "Library", desc: "The book named Ross is not available in library", date: "2026-03-19", status: "pending" },
    { id: 2, student: "Shubham Kumar Pandey", roll: "shubhamkp25@iitk.ac.in", category: "Food", desc: "The food in canteen is very limited", date: "2026-03-19", status: "pending" },
    { id: 3, student: "Ananya Sharma", roll: "ananya22@iitk.ac.in", category: "Hygiene", desc: "Washrooms near mess block are not cleaned daily, causing discomfort", date: "2026-03-18", status: "inprogress" },
    { id: 4, student: "Rohan Verma", roll: "rverma21@iitk.ac.in", category: "Hostel", desc: "Hot water supply is intermittent in Hall 5 corridor", date: "2026-03-17", status: "resolved" },
    { id: 5, student: "Priya Nair", roll: "priya24@iitk.ac.in", category: "Food", desc: "Vegan options not available for dinner on weekdays", date: "2026-03-16", status: "pending" },
    { id: 6, student: "Aditya Singh", roll: "aditya23@iitk.ac.in", category: "Internet", desc: "WiFi speed in reading room drops to 0 after midnight", date: "2026-03-15", status: "rejected" },
    { id: 7, student: "Kavya Menon", roll: "kavyam22@iitk.ac.in", category: "Library", desc: "Reference section chairs are broken and not replaced", date: "2026-03-14", status: "inprogress" },
    { id: 8, student: "Rahul Gupta", roll: "rgupta24@iitk.ac.in", category: "Food", desc: "Quality of dal has degraded significantly this semester", date: "2026-03-13", status: "resolved" },
    { id: 9, student: "Sneha Patel", roll: "sneha23@iitk.ac.in", category: "Hygiene", desc: "Dustbins in corridors overflow by afternoon daily", date: "2026-03-12", status: "pending" },
    { id: 10, student: "Varun Joshi", roll: "varun21@iitk.ac.in", category: "Other", desc: "Mess closing time on Sundays is too early at 8 PM", date: "2026-03-11", status: "pending" },
    { id: 11, student: "Manya Agarwal", roll: "manya25@iitk.ac.in", category: "Hostel", desc: "Power outages in Hall 3 study rooms lasting 20-30 min", date: "2026-03-10", status: "inprogress" },
    { id: 12, student: "Deepak Chauhan", roll: "deepak22@iitk.ac.in", category: "Internet", desc: "VPN blocks access to several research databases", date: "2026-03-09", status: "resolved" },
];

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
    const { toast, showToast } = useToast();

    /* ── Counts ── */
    const counts = useMemo(() => ({
        pending: data.filter(d => d.status === "pending").length,
        inprogress: data.filter(d => d.status === "inprogress").length,
        resolved: data.filter(d => d.status === "resolved").length,
        rejected: data.filter(d => d.status === "rejected").length,
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
        setData(prev => prev.map(d => d.id === id ? { ...d, status } : d));
        showToast(`Status updated to "${STATUS_LABEL[status]}"`);
    };

    const openModal = (item) => { setModalItem(item); setModalStatus(item.status); };
    const closeModal = () => setModalItem(null);

    const saveModal = () => {
        if (!modalItem) return;

        setData(prev =>
            prev.map(d =>
                d.id === modalItem.id
                    ? { ...d, status: modalStatus }
                    : d
            )
        );

        showToast(`Complaint #${modalItem.id} updated to "${STATUS_LABEL[modalStatus]}"`);
        closeModal();
    };

    const filterByStatus = (s) => { setStatusFilter(s); setPage(1); };

    return (
        <>
            <GlobalStyle />

            {/* ── NAV ── */}
            <nav className="af-nav">
                <div className="af-nav-hamburger"><Icon.Menu /></div>
                <div className="af-nav-logo">
                    <div className="af-nav-icon"><Icon.Logo /></div>
                    <div>
                        <div className="af-nav-title">CMMS</div>
                        <div className="af-nav-sub">Centralized Mess Management</div>
                    </div>
                </div>
                <div className="af-nav-right">
                    <div className="af-nav-bell">
                        <Icon.Bell />
                        <div className="af-nav-dot" />
                    </div>
                    <div className="af-nav-avatar"><Icon.User /></div>
                </div>
            </nav>

            <main className="af-main">

                {/* ── HERO ── */}
                <div className="af-hero">
                    <div className="af-hero-icon"><Icon.Chat /></div>
                    <div>
                        <h1>Feedback &amp; Complaints</h1>
                        <p>Review, manage, and respond to all student submissions from one place.</p>
                    </div>
                    <div className="af-hero-badge">{data.length} Total Submissions</div>
                </div>

                {/* ── STATS ── */}
                <div className="af-stats">
                    {[
                        { key: "pending", label: "Pending", bg: "var(--pending-bg)", color: "var(--pending)", Icon: Icon.Clock },
                        { key: "inprogress", label: "In Progress", bg: "var(--inprogress-bg)", color: "var(--inprogress)", Icon: Icon.Refresh },
                        { key: "resolved", label: "Resolved", bg: "var(--resolved-bg)", color: "var(--resolved)", Icon: Icon.CheckCircle },
                        { key: "rejected", label: "Rejected", bg: "var(--rejected-bg)", color: "var(--rejected)", Icon: Icon.XCircle },
                    ].map((stat) => {
                        const StatIcon = stat.Icon;
                        return (
                            <button key={stat.key} className="af-stat-card" onClick={() => filterByStatus(stat.key)}>
                                <div className="af-stat-icon" style={{ background: stat.bg, color: stat.color }}>
                                    <StatIcon />
                                </div>
                                <div>
                                    <div className="af-stat-num">{counts[stat.key]}</div>
                                    <div className="af-stat-label">{stat.label}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* ── TOOLBAR ── */}
                <div className="af-toolbar">
                    <div className="af-search-wrap">
                        <div className="af-search-icon"><Icon.Search /></div>
                        <input
                            type="text"
                            placeholder="Search by student, description…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select className="af-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                        <option value="">All Categories</option>
                        {["Food", "Hygiene", "Library", "Hostel", "Internet", "Other"].map(c => (
                            <option key={c}>{c}</option>
                        ))}
                    </select>
                    <select className="af-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="inprogress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* ── TABLE ── */}
                <div className="af-table-wrap">
                    <table className="af-table">
                        <thead>
                            <tr>
                                <th>#</th><th>Student</th><th>Category</th><th>Description</th>
                                <th>Submitted</th><th>Status</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageRows.map((d, i) => (
                                <tr key={d.id}>
                                    <td style={{ color: "var(--muted)", fontWeight: 700, fontSize: 13 }}>
                                        {(safePage - 1) * PER_PAGE + i + 1}
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 700, fontSize: 14 }}>{d.student}</div>
                                        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{d.roll}</div>
                                    </td>
                                    <td><span className="af-cat-badge">{d.category.toUpperCase()}</span></td>
                                    <td>
                                        <span className="af-desc-text">{d.desc}</span>
                                        <span className="af-desc-date">
                                            <Icon.Clock size={11} /> {d.date}
                                        </span>
                                    </td>
                                    <td style={{ color: "var(--muted)", fontSize: 13, fontWeight: 600 }}>{d.date}</td>
                                    <td>
                                        <span className={`af-status-badge ${STATUS_CLASS[d.status]}`}>
                                            <StatusIcon status={d.status} /> {STATUS_LABEL[d.status]}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="af-actions">
                                            <button className="af-aibtn af-aibtn-view" title="View details" onClick={() => openModal(d)}><Icon.Eye /></button>
                                            {d.status !== "inprogress" && <button className="af-aibtn af-aibtn-prog" title="Mark In Progress" onClick={() => quickStatus(d.id, "inprogress")}><Icon.Refresh size={15} /></button>}
                                            {d.status !== "resolved" && <button className="af-aibtn af-aibtn-res" title="Mark Resolved" onClick={() => quickStatus(d.id, "resolved")}><Icon.Check /></button>}
                                            {d.status !== "rejected" && <button className="af-aibtn af-aibtn-rej" title="Reject" onClick={() => quickStatus(d.id, "rejected")}><Icon.X /></button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {pageRows.length === 0 && (
                        <div className="af-empty">
                            <div className="af-empty-icon"><Icon.Inbox /></div>
                            No records match your filters.
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="af-pagination">
                            <span className="af-pginfo">Page {safePage} of {totalPages}</span>
                            <button className="af-pgbtn" onClick={() => setPage(p => p - 1)} disabled={safePage === 1}>&#8249;</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} className={`af-pgbtn${p === safePage ? " active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                            ))}
                            <button className="af-pgbtn" onClick={() => setPage(p => p + 1)} disabled={safePage === totalPages}>&#8250;</button>
                        </div>
                    )}
                </div>
            </main>

            {/* ── MODAL ── */}
            <div className={`af-overlay${modalItem ? " open" : ""}`} onClick={e => e.target === e.currentTarget && closeModal()}>
                {modalItem && (
                    <div className="af-modal">
                        <div className="af-modal-header">
                            <div className="af-modal-title">Complaint Details</div>
                            <button className="af-modal-close" onClick={closeModal}><Icon.X size={18} /></button>
                        </div>
                        <div className="af-mrow"><div className="af-mlabel">Student</div><div className="af-mval">{modalItem.student}</div></div>
                        <div className="af-mrow"><div className="af-mlabel">Email</div><div className="af-mval">{modalItem.roll}</div></div>
                        <div className="af-mrow">
                            <div className="af-mlabel">Category</div>
                            <div className="af-mval"><span className="af-cat-badge">{modalItem.category.toUpperCase()}</span></div>
                        </div>
                        <div className="af-mrow"><div className="af-mlabel">Submitted On</div><div className="af-mval">{modalItem.date}</div></div>
                        <div className="af-mrow"><div className="af-mlabel">Description</div><div className="af-mdesc">{modalItem.desc}</div></div>
                        <div className="af-mrow" style={{ marginBottom: 0 }}>
                            <div className="af-mlabel">Update Status</div>
                            <div className="af-mstatus-wrap">
                                <select className="af-mstatus-sel" value={modalStatus} onChange={e => setModalStatus(e.target.value)}>
                                    <option value="pending">Pending</option>
                                    <option value="inprogress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <button className="af-msave-btn" onClick={saveModal}>
                                    <Icon.Save /> Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── TOAST ── */}
            <div className={`af-toast${toast.visible ? " show" : ""}`}>
                <Icon.CheckCircle2 /> <span>{toast.msg}</span>
            </div>
        </>
    );
}