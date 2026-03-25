import { useState, useMemo, useCallback, useEffect } from "react";
import api from "../Api";
import AdminNavBar from "../components/utils/AdminNavBar";

// ── Inline SVG Icons ───────────────────────────────────────────────────────
const Icon = ({ children, size = 20, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}>
    {children}
  </svg>
);
const Icons = {
  Menu: (p) => <Icon {...p}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></Icon>,
  Utensils: (p) => <Icon {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></Icon>,
  Bell: (p) => <Icon {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></Icon>,
  User: (p) => <Icon {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon>,
  Plus: (p) => <Icon {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>,
  Edit: (p) => <Icon {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Icon>,
  Trash: (p) => <Icon {...p}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></Icon>,
  X: (p) => <Icon {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>,
  Save: (p) => <Icon {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></Icon>,
  Copy: (p) => <Icon {...p}><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></Icon>,
  ChevLeft: (p) => <Icon {...p}><polyline points="15 18 9 12 15 6" /></Icon>,
  ChevRight: (p) => <Icon {...p}><polyline points="9 18 15 12 9 6" /></Icon>,
  LayoutGrid: (p) => <Icon {...p}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></Icon>,
  CalendarDays: (p) => <Icon {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Icon>,
  CheckCircle2: (p) => <Icon {...p}><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /><path d="m9 12 2 2 4-4" /></Icon>,
  AlertTriangle: (p) => <Icon {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></Icon>,
  Coffee: (p) => <Icon {...p}><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></Icon>,
  Sun: (p) => <Icon {...p}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></Icon>,
  Moon: (p) => <Icon {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></Icon>,
};

// ── Constants ──────────────────────────────────────────────────────────────
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEALS = ["Breakfast", "Lunch", "Snacks", "Dinner"];
const CATEGORIES = ["Veg", "Non-Veg", "Vegan", "Dairy", "Beverage"];

const MEAL_META = {
  Breakfast: { color: "#f59e0b", bg: "#fef3c7", darkBg: "#fde68a", Icon: Icons.Sun, label: "Breakfast" },
  Lunch: { color: "#5b5ef4", bg: "#ededfd", darkBg: "#c7d2fe", Icon: Icons.Utensils, label: "Lunch" },
  Snacks: { color: "#f97316", bg: "#ffedd5", darkBg: "#fed7aa", Icon: Icons.Coffee, label: "Snacks" },
  Dinner: { color: "#6366f1", bg: "#eef2ff", darkBg: "#c7d2fe", Icon: Icons.Moon, label: "Dinner" },
};

// ── Design tokens ──────────────────────────────────────────────────────────
const T = {
  accent: "#5b5ef4", accentL: "#ededfd", accentD: "#3b3ec2",
  bg: "#f0f1fb", surface: "#fff", surface2: "#f7f7fd",
  border: "#e5e6f7", text: "#1a1b3a", muted: "#7b7da8",
  radius: 16, radiusSm: 10,
  shadow: "0 2px 16px rgba(91,94,244,0.07)",
  shadowMd: "0 4px 24px rgba(91,94,244,0.12)",
};
const SEL = { padding: "9px 32px 9px 14px", border: `1.5px solid ${T.border}`, borderRadius: T.radiusSm, fontFamily: "inherit", fontSize: 13, color: T.text, outline: "none", cursor: "pointer", appearance: "none", background: `${T.surface} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237b7da8' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 12px center` };

// ── Helpers ────────────────────────────────────────────────────────────────
const catColor = c => ({ Veg: "#16a34a", "Non-Veg": "#ef4444", Vegan: "#0284c7", Dairy: "#7c3aed", Beverage: "#f59e0b" }[c] || T.muted);
const catBg = c => ({ Veg: "#dcfce7", "Non-Veg": "#fee2e2", Vegan: "#dbeafe", Dairy: "#ede9fe", Beverage: "#fef3c7" }[c] || T.surface2);

// ── Small reusable ─────────────────────────────────────────────────────────
function MBtn({ color = "#94a3b8", onClick, children, disabled }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ flex: 1, padding: "11px 0", borderRadius: T.radiusSm, border: "none", background: color, color: "#fff", fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: disabled ? .5 : h ? .88 : 1, transform: h && !disabled ? "translateY(-1px)" : "none", transition: "all .15s" }}>
      {children}
    </button>
  );
}
function IBtn({ color, hoverBg, title, onClick, children }) {
  const [h, setH] = useState(false);
  return (
    <button title={title} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: 26, height: 26, borderRadius: 6, border: `1.5px solid ${h ? hoverBg : T.border}`, background: h ? hoverBg : T.surface, color: h ? "#fff" : color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>
      {children}
    </button>
  );
}
function Toast({ msg, show }) {
  return (
    <div style={{ position: "fixed", bottom: 28, left: "50%", transform: show ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(80px)", background: T.text, color: "#fff", padding: "12px 22px", borderRadius: 50, fontSize: 14, fontWeight: 600, zIndex: 400, pointerEvents: "none", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8, transition: "transform .3s cubic-bezier(.34,1.56,.64,1)" }}>
      <Icons.CheckCircle2 size={16} /><span>{msg}</span>
    </div>
  );
}

// ── Dish Modal ─────────────────────────────────────────────────────────────
function DishModal({ title, initial, onSave, onCancel }) {
  const [dish, setDish] = useState(initial?.dish || "");
  const [cat, setCat] = useState(initial?.category || "Veg");
  const [errors, setErrors] = useState({});

  const save = () => {
    if (!dish.trim()) {
      setErrors({ dish: "Dish name is required" });
      return;
    }
    onSave({ dish: dish.trim(), category: cat });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,27,58,.45)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={e => e.target === e.currentTarget && onCancel()}>
      <div style={{ background: T.surface, borderRadius: T.radius, padding: 28, width: 420, maxWidth: "95vw", boxShadow: T.shadowMd, animation: "slideUp .2s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 800 }}>{title}</div>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}><Icons.X size={17} /></button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>Dish Name</div>
          <input autoFocus value={dish} onChange={e => { setDish(e.target.value); setErrors({}); }}
            placeholder="e.g. Dal Tadka"
            style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${errors.dish ? "#ef4444" : T.border}`, borderRadius: T.radiusSm, fontFamily: "inherit", fontSize: 14, color: T.text, background: T.surface2, outline: "none" }}
            onKeyDown={e => e.key === "Enter" && save()} />
          {errors.dish && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4, fontWeight: 600 }}>{errors.dish}</div>}
        </div>

        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>Category</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)}
                style={{ padding: "5px 12px", borderRadius: 50, border: `1.5px solid ${cat === c ? T.accent : T.border}`, background: cat === c ? T.accentL : T.surface, color: cat === c ? T.accent : T.muted, fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all .12s" }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <MBtn color={T.accent} onClick={save}><Icons.Save size={14} /> Save Dish</MBtn>
          <MBtn onClick={onCancel}><Icons.X size={14} /> Cancel</MBtn>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ label, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,27,58,.45)", backdropFilter: "blur(4px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: T.surface, borderRadius: T.radius, padding: 28, width: 340, maxWidth: "95vw", boxShadow: T.shadowMd, textAlign: "center", animation: "slideUp .2s ease" }}>
        <div style={{ width: 48, height: 48, background: "#fee2e2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "#ef4444" }}><Icons.AlertTriangle size={22} /></div>
        <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>Remove Dish?</div>
        <div style={{ fontSize: 14, color: T.muted, marginBottom: 20, lineHeight: 1.6 }}>Remove <strong style={{ color: T.text }}>{label}</strong> from menu?</div>
        <div style={{ display: "flex", gap: 10 }}>
          <MBtn color="#ef4444" onClick={onConfirm}><Icons.Trash size={14} /> Remove</MBtn>
          <MBtn onClick={onCancel}><Icons.X size={14} /> Cancel</MBtn>
        </div>
      </div>
    </div>
  );
}

// ── MealCard ───────────────────────────────────────────────────────────────
function MealCard({ meal, items, onAdd, onEdit, onDelete }) {
  const meta = MEAL_META[meal];
  const Ic = meta.Icon;

  return (
    <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: T.radiusSm, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ background: meta.bg, padding: "10px 14px", display: "flex", alignItems: "center", gap: 6 }}>
        <Ic size={13} style={{ color: meta.color }} />
        <span style={{ fontSize: 12, fontWeight: 800, color: meta.color, textTransform: "uppercase", letterSpacing: ".06em" }}>{meal}</span>
      </div>

      <div style={{ padding: "8px 12px", flex: 1 }}>
        {items.length === 0 ? (
          <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic", padding: "6px 0", textAlign: "center" }}>No dishes</div>
        ) : items.map((item, i) => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", borderBottom: i < items.length - 1 ? `1px solid ${T.border}` : "none" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: catColor(item.category), flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: T.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.dish}</span>
            <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
              <IBtn color="#f59e0b" hoverBg="#f59e0b" title="Edit" onClick={() => onEdit(item)}><Icons.Edit size={10} /></IBtn>
              <IBtn color="#ef4444" hoverBg="#ef4444" title="Remove" onClick={() => onDelete(item)}><Icons.Trash size={10} /></IBtn>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onAdd}
        style={{ margin: "0 10px 10px", padding: "6px 0", background: T.accentL, color: T.accent, border: `1.5px dashed ${T.accent}66`, borderRadius: 7, fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
        <Icons.Plus size={12} /> Add Dish
      </button>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function AdminMenuManagement() {
  const [halls, setHalls] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [hallId, setHallId] = useState("");
  const [viewMode, setViewMode] = useState("single");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [addCtx, setAddCtx] = useState(null);
  const [editCtx, setEditCtx] = useState(null);
  const [delCtx, setDelCtx] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const showToast = useCallback(msg => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2600);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const [hRes, pRes, nRes] = await Promise.all([
          api.get("/api/halls/"),
          api.get("/api/profile/"),
          api.get("/api/notifications/")
        ]);
        setHalls(hRes.data);
        setProfile(pRes.data);
        setNotifications(nRes.data?.results || nRes.data || []);
        if (hRes.data.length > 0) {
          // Default to user's hall or first hall
          const userHall = pRes.data?.hall_of_residence;
          const initialHall = hRes.data.find(h => h.name === userHall) || hRes.data[0];
          setHallId(initialHall.id);
        }
      } catch (err) {
        console.error("Init fariled:", err);
      }
    };
    init();
  }, []);

  const fetchMenu = useCallback(async () => {
    if (!hallId) return;
    try {
      const menuRes = await api.get(`/api/menu/?hall_id=${hallId}`);
      setMenuItems(menuRes.data);
    } catch (err) {
      console.error("Fetch menu failed:", err);
    }
  }, [hallId]);

  useEffect(() => { fetchMenu(); }, [fetchMenu]);

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

  const handleUpdate = async ({ dish, category, id }) => {
    const ctx = addCtx || editCtx;
    const payload = {
      hall: hallId,
      day: ctx.day,
      meal_time: ctx.meal,
      dish,
      category,
      ...(id && { id })
    };
    try {
      await api.post("/api/admin/menu/update/", payload);
      showToast(id ? "Dish updated" : "Dish added");
      setAddCtx(null);
      setEditCtx(null);
      fetchMenu();
    } catch (err) {
      showToast("Operation failed");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/admin/menu/delete/${delCtx.item.id}/`);
      showToast("Dish removed");
      setDelCtx(null);
      fetchMenu();
    } catch (err) {
      showToast("Delete failed");
    }
  };

  const groupedMenu = useMemo(() => {
    const m = {};
    DAYS.forEach(d => {
      m[d] = {};
      MEALS.forEach(ml => {
        m[d][ml] = menuItems.filter(i => i.day === d && i.meal_time === ml);
      });
    });
    return m;
  }, [menuItems]);

  const prevDay = () => setSelectedDay(d => DAYS[(DAYS.indexOf(d) - 1 + 7) % 7]);
  const nextDay = () => setSelectedDay(d => DAYS[(DAYS.indexOf(d) + 1) % 7]);

  return (
    <>
      <div style={{ fontFamily: "'Manrope',sans-serif", background: T.bg, minHeight: "100vh", color: T.text }}>
        <AdminNavBar profile={profile} notifications={notifications} onOpenNotifications={handleOpenNotifications} />

        <main style={{ padding: "28px 32px", maxWidth: 1400, margin: "0 auto" }}>
          {/* Hero */}
          <div style={{ background: T.surface, borderRadius: T.radius, padding: "22px 28px", display: "flex", alignItems: "center", gap: 16, boxShadow: T.shadow, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, background: T.accentL, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent, flexShrink: 0 }}>
              <Icons.Utensils size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 21, fontWeight: 800 }}>Menu Management</h1>
              <p style={{ color: T.muted, fontSize: 13, marginTop: 2, fontWeight: 500 }}>Update and manage mess menu items for students.</p>
            </div>

            {/* Hall selector */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.muted }}>Hall:</span>
              <select value={hallId} onChange={e => setHallId(e.target.value)} style={SEL}>
                <option value="" disabled>Select Hall</option>
                {halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>

            {/* View toggle */}
            <div style={{ display: "flex", background: T.surface2, borderRadius: T.radiusSm, padding: 3, gap: 3, border: `1px solid ${T.border}` }}>
              {[["single", "Single Day", Icons.LayoutGrid], ["weekly", "Weekly", Icons.CalendarDays]].map(([v, l, Icon]) => (
                <button key={v} onClick={() => setViewMode(v)}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 13px", borderRadius: 7, border: "none", background: viewMode === v ? T.accent : T.surface2, color: viewMode === v ? "#fff" : T.muted, fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all .15s" }}>
                  <Icon size={12} /> {l}
                </button>
              ))}
            </div>
          </div>

          {!hallId ? (
            <div style={{ textAlign: "center", padding: "100px 0", color: T.muted }}>
              <Icons.Utensils size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
              <p style={{ fontWeight: 600 }}>Please select a hall to view and manage its menu.</p>
            </div>
          ) : viewMode === "single" ? (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={prevDay} style={{ width: 34, height: 34, border: `1.5px solid ${T.border}`, borderRadius: 9, background: T.surface, color: T.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icons.ChevLeft size={15} /></button>
                  <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)} style={{ ...SEL, fontSize: 14, fontWeight: 800, color: T.text }}>
                    {DAYS.map(d => <option key={d}>{d}</option>)}
                  </select>
                  <button onClick={nextDay} style={{ width: 34, height: 34, border: `1.5px solid ${T.border}`, borderRadius: 9, background: T.surface, color: T.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icons.ChevRight size={15} /></button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
                {MEALS.map(meal => (
                  <MealCard key={meal} meal={meal}
                    items={groupedMenu[selectedDay][meal]}
                    onAdd={() => setAddCtx({ day: selectedDay, meal })}
                    onEdit={item => setEditCtx({ day: selectedDay, meal, item })}
                    onDelete={item => setDelCtx({ day: selectedDay, meal, item })} />
                ))}
              </div>
            </>
          ) : (
            <div style={{ overflowX: "auto", paddingBottom: 12 }}>
              <table style={{ borderCollapse: "separate", borderSpacing: "8px 0", minWidth: 1100 }}>
                <thead>
                  <tr>
                    <th style={{ width: 76 }}></th>
                    {DAYS.map(d => (
                      <th key={d} style={{ padding: "6px 4px", minWidth: 170, textAlign: "left" }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: T.text }}>{d}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MEALS.map(meal => (
                    <tr key={meal}>
                      <td style={{ verticalAlign: "top", padding: "0 0 10px" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: MEAL_META[meal].bg, borderRadius: T.radiusSm, padding: "10px 5px" }}>
                          {(() => { const Ic = MEAL_META[meal].Icon; return <Ic size={14} style={{ color: MEAL_META[meal].color }} />; })()}
                          <span style={{ fontSize: 9, fontWeight: 800, color: MEAL_META[meal].color, textTransform: "uppercase", letterSpacing: ".05em", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>{meal}</span>
                        </div>
                      </td>
                      {DAYS.map(d => (
                        <td key={d} style={{ verticalAlign: "top", padding: "0 0 10px" }}>
                          <MealCard meal={meal}
                            items={groupedMenu[d][meal]}
                            onAdd={() => setAddCtx({ day: d, meal })}
                            onEdit={item => setEditCtx({ day: d, meal, item })}
                            onDelete={item => setDelCtx({ day: d, meal, item })} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {addCtx && <DishModal title={`Add Dish — ${addCtx.day} ${addCtx.meal}`} initial={null} onSave={val => handleUpdate(val)} onCancel={() => setAddCtx(null)} />}
      {editCtx && <DishModal title={`Edit Dish — ${editCtx.day} ${editCtx.meal}`} initial={editCtx.item} onSave={val => handleUpdate({ ...val, id: editCtx.item.id })} onCancel={() => setEditCtx(null)} />}
      {delCtx && <DeleteConfirm label={delCtx.item.dish} onConfirm={handleDelete} onCancel={() => setDelCtx(null)} />}
      <Toast show={toast.show} msg={toast.msg} />
    </>
  );
}
