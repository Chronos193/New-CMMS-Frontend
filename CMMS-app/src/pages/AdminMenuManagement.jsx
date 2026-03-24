import { useState, useMemo, useCallback } from "react";

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
  Rupee: (p) => <Icon {...p}><path d="M6 3h12" /><path d="M6 8h12" /><path d="M6 13l8.5 8" /><path d="M6 13h3a4 4 0 0 0 0-8" /></Icon>,
  TrendingUp: (p) => <Icon {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></Icon>,
  Info: (p) => <Icon {...p}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Icon>,
  Settings: (p) => <Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></Icon>,
};

// ── Constants ──────────────────────────────────────────────────────────────
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEALS = ["Breakfast", "Lunch", "Snacks", "Dinner"];
const HALLS = ["Hall 1", "Hall 2", "Hall 3", "Hall 4", "Hall 5", "Hall 6", "Hall 7", "Hall 8", "Hall 9", "Hall 10", "Hall 11", "Hall 12", "Hall 13", "GH1"];
const CATEGORIES = ["Veg", "Non-Veg", "Vegan", "Dairy", "Beverage"];

const MEAL_META = {
  Breakfast: { color: "#f59e0b", bg: "#fef3c7", darkBg: "#fde68a", Icon: Icons.Sun, label: "Breakfast" },
  Lunch: { color: "#5b5ef4", bg: "#ededfd", darkBg: "#c7d2fe", Icon: Icons.Utensils, label: "Lunch" },
  Snacks: { color: "#f97316", bg: "#ffedd5", darkBg: "#fed7aa", Icon: Icons.Coffee, label: "Snacks" },
  Dinner: { color: "#6366f1", bg: "#eef2ff", darkBg: "#c7d2fe", Icon: Icons.Moon, label: "Dinner" },
};

// ── Seed data (cost in ₹ per dish — hostel-appropriate low values) ─────────
let _itemId = 100;
const dish = (name, cat = "Veg", cost = 0) => ({ id: ++_itemId, name, category: cat, cost });

const buildMenu = () => {
  const m = {};
  DAYS.forEach(d => { m[d] = {}; MEALS.forEach(ml => { m[d][ml] = []; }); });
  return m;
};

const HALL_SEED = {
  "Hall 1": (() => {
    const m = buildMenu();
    // Monday
    m.Monday.Breakfast = [dish("Poha", "Veg", 12), dish("Banana", "Vegan", 5), dish("Tea", "Beverage", 5)];
    m.Monday.Lunch = [dish("Dal Tadka", "Veg", 18), dish("Paneer Butter Masala", "Veg", 28), dish("Rice", "Veg", 10), dish("Roti", "Veg", 8), dish("Salad", "Vegan", 5)];
    m.Monday.Snacks = [dish("Samosa", "Veg", 10), dish("Chai", "Beverage", 5)];
    m.Monday.Dinner = [dish("Rajma", "Veg", 18), dish("Jeera Rice", "Veg", 12), dish("Roti", "Veg", 8), dish("Kheer", "Dairy", 10)];
    // Tuesday
    m.Tuesday.Breakfast = [dish("Idli", "Veg", 10), dish("Sambar", "Veg", 8), dish("Coconut Chutney", "Veg", 4)];
    m.Tuesday.Lunch = [dish("Chole", "Veg", 20), dish("Bhature", "Veg", 12), dish("Lassi", "Dairy", 12)];
    m.Tuesday.Snacks = [dish("Bread Pakoda", "Veg", 12), dish("Juice", "Beverage", 8)];
    m.Tuesday.Dinner = [dish("Dal Makhani", "Veg", 22), dish("Butter Naan", "Veg", 12), dish("Mixed Veg", "Veg", 18)];
    // Wednesday
    m.Wednesday.Breakfast = [dish("Aloo Paratha", "Veg", 15), dish("Curd", "Dairy", 8), dish("Pickle", "Veg", 3)];
    m.Wednesday.Lunch = [dish("Kadhi", "Veg", 16), dish("Steamed Rice", "Veg", 10), dish("Papad", "Veg", 4)];
    m.Wednesday.Snacks = [dish("Veg Cutlet", "Veg", 12), dish("Chai", "Beverage", 5)];
    m.Wednesday.Dinner = [dish("Egg Curry", "Non-Veg", 25), dish("Roti", "Veg", 8), dish("Rice", "Veg", 10), dish("Raita", "Dairy", 8)];
    // Thursday
    m.Thursday.Breakfast = [dish("Upma", "Veg", 12), dish("Coconut Chutney", "Veg", 4), dish("Milk", "Dairy", 8)];
    m.Thursday.Lunch = [dish("Pav Bhaji", "Veg", 22), dish("Butter Pav", "Veg", 10)];
    m.Thursday.Snacks = [dish("Fruit Salad", "Vegan", 15), dish("Cold Coffee", "Beverage", 10)];
    m.Thursday.Dinner = [dish("Chicken Curry", "Non-Veg", 35), dish("Butter Naan", "Veg", 12), dish("Rice", "Veg", 10), dish("Salad", "Vegan", 5)];
    // Friday
    m.Friday.Breakfast = [dish("Dosa", "Veg", 14), dish("Sambar", "Veg", 8), dish("Red Chutney", "Veg", 4)];
    m.Friday.Lunch = [dish("Palak Paneer", "Veg", 25), dish("Roti", "Veg", 8), dish("Dal", "Veg", 15)];
    m.Friday.Snacks = [dish("Cookies", "Veg", 8), dish("Tea", "Beverage", 5)];
    m.Friday.Dinner = [dish("Fish Curry", "Non-Veg", 38), dish("Steamed Rice", "Veg", 10), dish("Roti", "Veg", 8)];
    // Saturday
    m.Saturday.Breakfast = [dish("Bread Toast", "Veg", 10), dish("Butter", "Dairy", 5), dish("Eggs", "Non-Veg", 12), dish("Milk", "Dairy", 8)];
    m.Saturday.Lunch = [dish("Biryani", "Non-Veg", 40), dish("Raita", "Dairy", 8), dish("Shorba", "Non-Veg", 12)];
    m.Saturday.Snacks = [dish("Cake Slice", "Veg", 15), dish("Juice", "Beverage", 8)];
    m.Saturday.Dinner = [dish("Paneer Tikka", "Veg", 28), dish("Dal", "Veg", 15), dish("Roti", "Veg", 8), dish("Ice Cream", "Dairy", 12)];
    // Sunday
    m.Sunday.Breakfast = [dish("Chole Bhature", "Veg", 25), dish("Lassi", "Dairy", 12)];
    m.Sunday.Lunch = [dish("Special Thali", "Veg", 45), dish("Sweet", "Dairy", 12), dish("Buttermilk", "Dairy", 8)];
    m.Sunday.Snacks = [dish("Pakoda", "Veg", 12), dish("Chai", "Beverage", 5)];
    m.Sunday.Dinner = [dish("Mutton Curry", "Non-Veg", 45), dish("Butter Naan", "Veg", 12), dish("Pulao", "Veg", 15), dish("Gulab Jamun", "Dairy", 10)];
    return m;
  })(),
};
HALLS.forEach(h => { if (!HALL_SEED[h]) HALL_SEED[h] = buildMenu(); });

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
const mealCost = (items) => items.reduce((s, i) => s + (i.cost || 0), 0);
const dayCost = (dayMenu) => MEALS.reduce((s, ml) => s + mealCost(dayMenu[ml]), 0);

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

// ── Dish Modal — with cost field ───────────────────────────────────────────
function DishModal({ title, initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [cat, setCat] = useState(initial?.category || "Veg");
  const [cost, setCost] = useState(initial?.cost != null ? String(initial.cost) : "");
  const [errors, setErrors] = useState({});

  const save = () => {
    const e = {};
    if (!name.trim()) e.name = "Dish name is required";
    if (cost === "" || isNaN(cost) || Number(cost) < 0) e.cost = "Enter a valid cost (₹)";
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ name: name.trim(), category: cat, cost: Number(cost) });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,27,58,.45)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={e => e.target === e.currentTarget && onCancel()}>
      <div style={{ background: T.surface, borderRadius: T.radius, padding: 28, width: 420, maxWidth: "95vw", boxShadow: T.shadowMd, animation: "slideUp .2s ease" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 800 }}>{title}</div>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}><Icons.X size={17} /></button>
        </div>

        {/* Dish name */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>Dish Name</div>
          <input autoFocus value={name} onChange={e => { setName(e.target.value); setErrors(er => ({ ...er, name: "" })); }}
            placeholder="e.g. Dal Tadka"
            style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${errors.name ? "#ef4444" : T.border}`, borderRadius: T.radiusSm, fontFamily: "inherit", fontSize: 14, color: T.text, background: T.surface2, outline: "none" }}
            onKeyDown={e => e.key === "Enter" && save()} />
          {errors.name && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4, fontWeight: 600 }}>{errors.name}</div>}
        </div>

        {/* Cost */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>
            Cost per Dish (₹)
            <span style={{ fontWeight: 500, textTransform: "none", letterSpacing: 0, marginLeft: 6, color: T.muted }}>— hostel ingredient cost</span>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontWeight: 800, color: T.accent, fontSize: 14 }}>₹</span>
            <input type="number" min="0" max="200" value={cost} onChange={e => { setCost(e.target.value); setErrors(er => ({ ...er, cost: "" })); }}
              placeholder="e.g. 18"
              style={{ width: "100%", padding: "10px 14px 10px 28px", border: `1.5px solid ${errors.cost ? "#ef4444" : T.border}`, borderRadius: T.radiusSm, fontFamily: "inherit", fontSize: 14, color: T.text, background: T.surface2, outline: "none" }} />
          </div>
          {errors.cost && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4, fontWeight: 600 }}>{errors.cost}</div>}
          {/* Suggested costs hint */}
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {[5, 8, 10, 12, 15, 18, 20, 25, 30].map(v => (
              <button key={v} onClick={() => { setCost(String(v)); setErrors(er => ({ ...er, cost: "" })); }}
                style={{ padding: "3px 10px", borderRadius: 50, border: `1px solid ${T.border}`, background: cost === String(v) ? T.accentL : T.surface2, color: cost === String(v) ? T.accent : T.muted, fontFamily: "inherit", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                ₹{v}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
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

        {/* Preview */}
        <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 700, background: catBg(cat), color: catColor(cat), padding: "2px 7px", borderRadius: 4, letterSpacing: ".05em" }}>{cat.toUpperCase()}</span>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{name || "Dish Name"}</span>
          </div>
          <div style={{ fontWeight: 800, color: T.accent, fontSize: 15 }}>₹{cost || "0"}</div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <MBtn color={T.accent} onClick={save}><Icons.Save size={14} /> Save Dish</MBtn>
          <MBtn onClick={onCancel}><Icons.X size={14} /> Cancel</MBtn>
        </div>
      </div>
    </div>
  );
}

// ── Copy Day Modal ─────────────────────────────────────────────────────────
function CopyModal({ fromDay, onConfirm, onCancel }) {
  const [toDay, setToDay] = useState(DAYS.find(d => d !== fromDay));
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,27,58,.45)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={e => e.target === e.currentTarget && onCancel()}>
      <div style={{ background: T.surface, borderRadius: T.radius, padding: 28, width: 360, maxWidth: "95vw", boxShadow: T.shadowMd, animation: "slideUp .2s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 800 }}>Copy Day Menu</div>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}><Icons.X size={17} /></button>
        </div>
        <div style={{ fontSize: 14, color: T.muted, marginBottom: 14 }}>Copy all meals from <strong style={{ color: T.text }}>{fromDay}</strong> to:</div>
        <select value={toDay} onChange={e => setToDay(e.target.value)} style={{ ...SEL, width: "100%", marginBottom: 20 }}>
          {DAYS.filter(d => d !== fromDay).map(d => <option key={d}>{d}</option>)}
        </select>
        <div style={{ display: "flex", gap: 10 }}>
          <MBtn color={T.accent} onClick={() => onConfirm(toDay)}><Icons.Copy size={14} /> Copy</MBtn>
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
        <div style={{ fontSize: 14, color: T.muted, marginBottom: 20, lineHeight: 1.6 }}>Remove <strong style={{ color: T.text }}>{label}</strong>?</div>
        <div style={{ display: "flex", gap: 10 }}>
          <MBtn color="#ef4444" onClick={onConfirm}><Icons.Trash size={14} /> Remove</MBtn>
          <MBtn onClick={onCancel}><Icons.X size={14} /> Cancel</MBtn>
        </div>
      </div>
    </div>
  );
}

// ── MealCard — editable + shows meal cost ──────────────────────────────────
function MealCard({ day, meal, items, onAdd, onEdit, onDelete }) {
  const meta = MEAL_META[meal];
  const Ic = meta.Icon;
  const total = mealCost(items);

  return (
    <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: T.radiusSm, overflow: "hidden", display: "flex", flexDirection: "column" }}>

      {/* Meal header */}
      <div style={{ background: meta.bg, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Ic size={13} style={{ color: meta.color }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: meta.color, textTransform: "uppercase", letterSpacing: ".06em" }}>{meal}</span>
        </div>
        {/* Meal cost badge */}
        <span style={{ fontSize: 12, fontWeight: 800, color: meta.color, background: meta.darkBg || meta.bg, padding: "2px 8px", borderRadius: 6, border: `1px solid ${meta.color}33` }}>
          ₹{total}
        </span>
      </div>

      {/* Dish rows */}
      <div style={{ padding: "8px 12px", flex: 1 }}>
        {items.length === 0 ? (
          <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic", padding: "6px 0", textAlign: "center" }}>No dishes</div>
        ) : items.map((item, i) => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", borderBottom: i < items.length - 1 ? `1px solid ${T.border}` : "none" }}>
            {/* Cat dot */}
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: catColor(item.category), flexShrink: 0 }} />
            {/* Name */}
            <span style={{ fontSize: 13, fontWeight: 600, color: T.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
            {/* Cost */}
            <span style={{ fontSize: 12, fontWeight: 800, color: T.accent, minWidth: 32, textAlign: "right", flexShrink: 0 }}>
              {item.cost > 0 ? `₹${item.cost}` : <span style={{ color: "#fca5a5", fontSize: 10 }}>—</span>}
            </span>
            {/* Actions */}
            <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
              <IBtn color="#f59e0b" hoverBg="#f59e0b" title="Edit" onClick={() => onEdit(item)}><Icons.Edit size={10} /></IBtn>
              <IBtn color="#ef4444" hoverBg="#ef4444" title="Remove" onClick={() => onDelete(item)}><Icons.Trash size={10} /></IBtn>
            </div>
          </div>
        ))}
      </div>

      {/* Add dish */}
      <button onClick={onAdd}
        style={{ margin: "0 10px 10px", padding: "6px 0", background: T.accentL, color: T.accent, border: `1.5px dashed ${T.accent}66`, borderRadius: 7, fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
        <Icons.Plus size={12} /> Add Dish
      </button>
    </div>
  );
}

// ── BDMR Summary Panel ─────────────────────────────────────────────────────
function BDMRPanel({ menu }) {
  const rows = useMemo(() => DAYS.map(d => {
    const dc = dayCost(menu[d]);
    const mc = Object.fromEntries(MEALS.map(ml => [ml, mealCost(menu[d][ml])]));
    return { day: d, total: dc, ...mc };
  }), [menu]);

  const weekTotal = rows.reduce((s, r) => s + r.total, 0);
  const avgBDMR = Math.round(weekTotal / 7);
  const maxDay = rows.reduce((a, r) => r.total > a.total ? r : a, rows[0]);
  const minDay = rows.reduce((a, r) => r.total < a.total ? r : a, rows[0]);
  const monthlyEst = avgBDMR * 26; // ~26 billable days

  return (
    <div style={{ background: T.surface, borderRadius: T.radius, boxShadow: T.shadow, overflow: "hidden", marginBottom: 24 }}>

      {/* Header */}
      <div style={{ padding: "18px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, background: T.accentL, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent }}>
          <Icons.Rupee size={18} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>BDMR — Basic Daily Mess Rate</div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 1 }}>Computed from dish costs across all meals</div>
        </div>

        {/* KPI pills */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            ["Avg BDMR / day", `₹${avgBDMR}`, T.accent, T.accentL],
            ["Est. Monthly Bill", `₹${monthlyEst.toLocaleString("en-IN")}`, "#22c55e", "#dcfce7"],
            ["Highest day", `${maxDay?.day?.slice(0, 3)} ₹${maxDay?.total}`, "#f59e0b", "#fef3c7"],
            ["Lowest day", `${minDay?.day?.slice(0, 3)} ₹${minDay?.total}`, "#6366f1", "#eef2ff"],
          ].map(([l, v, color, bg]) => (
            <div key={l} style={{ background: bg, borderRadius: 8, padding: "8px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color, opacity: .7, textTransform: "uppercase", letterSpacing: ".07em" }}>{l}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: T.surface2 }}>
            <tr>
              <th style={{ padding: "11px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: ".08em", borderBottom: `1px solid ${T.border}` }}>Day</th>
              {MEALS.map(ml => (
                <th key={ml} style={{ padding: "11px 16px", textAlign: "center", fontSize: 11, fontWeight: 700, color: MEAL_META[ml].color, textTransform: "uppercase", letterSpacing: ".08em", borderBottom: `1px solid ${T.border}` }}>
                  {ml}
                </th>
              ))}
              <th style={{ padding: "11px 20px", textAlign: "right", fontSize: 11, fontWeight: 700, color: T.text, textTransform: "uppercase", letterSpacing: ".08em", borderBottom: `1px solid ${T.border}` }}>
                Daily BDMR
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const isMax = r.total === maxDay.total;
              const isMin = r.total === minDay.total && r.total !== maxDay.total;
              return (
                <tr key={r.day} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <td style={{ padding: "12px 20px", fontWeight: 700, fontSize: 14 }}>{r.day}</td>
                  {MEALS.map(ml => (
                    <td key={ml} style={{ padding: "12px 16px", textAlign: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: r[ml] > 0 ? MEAL_META[ml].color : T.border }}>
                        {r[ml] > 0 ? `₹${r[ml]}` : "—"}
                      </span>
                    </td>
                  ))}
                  <td style={{ padding: "12px 20px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      {/* Mini bar */}
                      <div style={{ width: 60, height: 6, borderRadius: 3, background: T.border, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.min(100, (r.total / (maxDay.total || 1)) * 100)}%`, background: isMax ? "#ef4444" : isMin ? "#22c55e" : T.accent, borderRadius: 3, transition: "width .3s" }} />
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 800, color: isMax ? "#ef4444" : isMin ? "#22c55e" : T.text, minWidth: 36, textAlign: "right" }}>
                        ₹{r.total}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* Footer totals */}
          <tfoot>
            <tr style={{ background: T.accentL }}>
              <td style={{ padding: "12px 20px", fontSize: 12, fontWeight: 800, color: T.accent, textTransform: "uppercase", letterSpacing: ".06em" }}>Weekly Total</td>
              {MEALS.map(ml => {
                const mTotal = rows.reduce((s, r) => s + r[ml], 0);
                return (
                  <td key={ml} style={{ padding: "12px 16px", textAlign: "center", fontSize: 13, fontWeight: 800, color: T.accent }}>{mTotal > 0 ? `₹${mTotal}` : "—"}</td>
                );
              })}
              <td style={{ padding: "12px 20px", textAlign: "right", fontSize: 15, fontWeight: 800, color: T.accent }}>₹{weekTotal}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Info note */}
      <div style={{ padding: "12px 20px", background: "#f0fdf4", borderTop: `1px solid #bbf7d0`, display: "flex", alignItems: "flex-start", gap: 8 }}>
        <Icons.Info size={14} style={{ color: "#16a34a", marginTop: 1, flexShrink: 0 }} />
        <div style={{ fontSize: 12, color: "#15803d", fontWeight: 500, lineHeight: 1.5 }}>
          <strong>BDMR = sum of all dish costs for that day.</strong> Monthly bill = BDMR × billable days (total − closure − rebate). Estimated at 26 billable days/month → <strong>₹{monthlyEst.toLocaleString("en-IN")}/month</strong>. Dishes with no cost assigned (—) are counted as ₹0.
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function AdminMenuManagement() {
  const [menus, setMenus] = useState(HALL_SEED);
  const [hall, setHall] = useState("Hall 1");
  const [viewMode, setViewMode] = useState("single");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [addCtx, setAddCtx] = useState(null);
  const [editCtx, setEditCtx] = useState(null);
  const [delCtx, setDelCtx] = useState(null);
  const [copyCtx, setCopyCtx] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback(msg => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2600);
  }, []);

  const menu = menus[hall];

  // ── CRUD ──────────────────────────────────────────────────────────────
  const update = (day, meal, fn) =>
    setMenus(p => ({ ...p, [hall]: { ...p[hall], [day]: { ...p[hall][day], [meal]: fn(p[hall][day][meal]) } } }));

  const addDish = ({ name, category, cost }) => { update(addCtx.day, addCtx.meal, a => [...a, { id: ++_itemId, name, category, cost }]); setAddCtx(null); showToast(`"${name}" added — ₹${cost}`); };
  const saveDish = ({ name, category, cost }) => { update(editCtx.day, editCtx.meal, a => a.map(i => i.id === editCtx.item.id ? { ...i, name, category, cost } : i)); setEditCtx(null); showToast(`"${name}" updated — ₹${cost}`); };
  const delDish = () => { update(delCtx.day, delCtx.meal, a => a.filter(i => i.id !== delCtx.item.id)); showToast(`"${delCtx.item.name}" removed`); setDelCtx(null); };
  const copyDay = (toDay) => {
    const src = menu[copyCtx.day];
    setMenus(p => ({ ...p, [hall]: { ...p[hall], [toDay]: Object.fromEntries(MEALS.map(ml => [ml, src[ml].map(d => ({ ...d, id: ++_itemId }))])) } }));
    setCopyCtx(null); showToast(`${copyCtx.day} → ${toDay} copied`);
  };
  const clearDay = (day) => {
    setMenus(p => ({ ...p, [hall]: { ...p[hall], [day]: Object.fromEntries(MEALS.map(ml => [ml, []])) } }));
    showToast(`${day} cleared`);
  };

  const prevDay = () => setSelectedDay(d => DAYS[(DAYS.indexOf(d) - 1 + 7) % 7]);
  const nextDay = () => setSelectedDay(d => DAYS[(DAYS.indexOf(d) + 1) % 7]);

  // Day BDMR for the header display
  const todayBDMR = dayCost(menu[selectedDay]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Manrope',sans-serif;}
        @keyframes slideUp{from{transform:translateY(16px);opacity:0}to{transform:none;opacity:1}}
        input:focus,select:focus{border-color:#5b5ef4!important;}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-track{background:#f0f1fb}
        ::-webkit-scrollbar-thumb{background:#c7c8ee;border-radius:99px}
      `}</style>

      <div style={{ fontFamily: "'Manrope',sans-serif", background: T.bg, minHeight: "100vh", color: T.text }}>

        {/* NAV */}
        <nav style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 28px", height: 64, gap: 14, position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ cursor: "pointer", color: T.muted, display: "flex" }}><Icons.Menu size={20} /></div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, background: T.accent, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Icons.Utensils size={19} /></div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, lineHeight: 1.1 }}>CMMS</div>
              <div style={{ fontSize: 10, letterSpacing: ".12em", color: T.muted, fontWeight: 600, textTransform: "uppercase" }}>Centralized Mess Management</div>
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", cursor: "pointer", display: "flex", color: T.muted }}>
              <Icons.Bell size={20} />
              <div style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, background: "#ef4444", borderRadius: "50%", border: "2px solid #fff" }} />
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: T.surface2, display: "flex", alignItems: "center", justifyContent: "center", color: T.muted, cursor: "pointer", border: `2px solid ${T.border}` }}>
              <Icons.User size={18} />
            </div>
          </div>
        </nav>

        <main style={{ padding: "28px 32px", maxWidth: 1400, margin: "0 auto" }}>

          {/* Hero */}
          <div style={{ background: T.surface, borderRadius: T.radius, padding: "22px 28px", display: "flex", alignItems: "center", gap: 16, boxShadow: T.shadow, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, background: T.accentL, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent, flexShrink: 0 }}>
              <Icons.CalendarDays size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 21, fontWeight: 800 }}>Menu Management</h1>
              <p style={{ color: T.muted, fontSize: 13, marginTop: 2, fontWeight: 500 }}>Menu of month — <strong style={{ color: T.text }}>{new Date().toLocaleString("default", { month: "long", year: "numeric" })}</strong></p>
            </div>

            {/* Hall selector */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.muted }}>Hall:</span>
              <select value={hall} onChange={e => setHall(e.target.value)} style={SEL}>{HALLS.map(h => <option key={h}>{h}</option>)}</select>
            </div>

            {/* View toggle */}
            <div style={{ display: "flex", background: T.surface2, borderRadius: T.radiusSm, padding: 3, gap: 3, border: `1px solid ${T.border}` }}>
              {[["single", "Single Day", Icons.LayoutGrid],
              ["weekly", "Weekly", Icons.CalendarDays],
              ["bdmr", "BDMR", Icons.Rupee]
              ].map((item) => {
                const v = item[0];
                const l = item[1];
                const Icon = item[2];

                return (
                  <button
                    key={v}
                    onClick={() => setViewMode(v)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "7px 13px",
                      borderRadius: 7,
                      border: "none",
                      background: viewMode === v ? T.accent : T.surface2,
                      color: viewMode === v ? "#fff" : T.muted,
                      fontFamily: "inherit",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all .15s"
                    }}
                  >
                    <Icon size={12} />
                    {l}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── BDMR PANEL (always visible above the menu views) ── */}
          {viewMode === "bdmr" && <BDMRPanel menu={menu} />}

          {/* ── SINGLE DAY VIEW ── */}
          {viewMode === "single" && (
            <>
              {/* Day controls + BDMR chip */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={prevDay} style={{ width: 34, height: 34, border: `1.5px solid ${T.border}`, borderRadius: 9, background: T.surface, color: T.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icons.ChevLeft size={15} /></button>
                  <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)} style={{ ...SEL, fontSize: 14, fontWeight: 800, color: T.text }}>
                    {DAYS.map(d => <option key={d}>{d}</option>)}
                  </select>
                  <button onClick={nextDay} style={{ width: 34, height: 34, border: `1.5px solid ${T.border}`, borderRadius: 9, background: T.surface, color: T.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icons.ChevRight size={15} /></button>

                  {/* BDMR chip */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.accentL, border: `1.5px solid ${T.accent}33`, borderRadius: 50, padding: "6px 14px" }}>
                    <Icons.Rupee size={13} style={{ color: T.accent }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>BDMR</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: T.accent }}>₹{todayBDMR}</span>
                  </div>

                  {/* Per-meal mini breakdown */}
                  {MEALS.map(ml => {
                    const c = mealCost(menu[selectedDay][ml]);
                    return c > 0 ? (
                      <div key={ml} style={{ fontSize: 11, fontWeight: 700, color: MEAL_META[ml].color, background: MEAL_META[ml].bg, padding: "4px 9px", borderRadius: 6 }}>
                        {ml.slice(0, 3)} ₹{c}
                      </div>
                    ) : null;
                  })}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setCopyCtx({ day: selectedDay })} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 13px", background: T.surface, color: T.muted, border: `1.5px solid ${T.border}`, borderRadius: T.radiusSm, fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    <Icons.Copy size={13} /> Copy Day
                  </button>
                  <button onClick={() => clearDay(selectedDay)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 13px", background: "#fee2e2", color: "#ef4444", border: `1.5px solid #fecaca`, borderRadius: T.radiusSm, fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    <Icons.Trash size={13} /> Clear Day
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
                {MEALS.map(meal => (
                  <MealCard key={meal} day={selectedDay} meal={meal}
                    items={menu[selectedDay][meal]}
                    onAdd={() => setAddCtx({ day: selectedDay, meal })}
                    onEdit={item => setEditCtx({ day: selectedDay, meal, item })}
                    onDelete={item => setDelCtx({ day: selectedDay, meal, item })} />
                ))}
              </div>
            </>
          )}

          {/* ── WEEKLY VIEW ── */}
          {viewMode === "weekly" && (
            <div style={{ overflowX: "auto", paddingBottom: 12 }}>
              <table style={{ borderCollapse: "separate", borderSpacing: "8px 0", minWidth: 1100 }}>
                <thead>
                  <tr>
                    <th style={{ width: 76, padding: "8px 8px", fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase" }}></th>
                    {DAYS.map(d => {
                      const dc = dayCost(menu[d]);
                      return (
                        <th key={d} style={{ padding: "6px 4px", minWidth: 170 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: T.text }}>{d}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              {/* BDMR badge per day */}
                              <span style={{ fontSize: 11, fontWeight: 800, color: T.accent, background: T.accentL, padding: "2px 7px", borderRadius: 5 }}>₹{dc}</span>
                              <button onClick={() => setCopyCtx({ day: d })} title="Copy" style={{ width: 22, height: 22, borderRadius: 5, border: `1px solid ${T.border}`, background: T.surface2, color: T.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icons.Copy size={10} /></button>
                              <button onClick={() => clearDay(d)} title="Clear" style={{ width: 22, height: 22, borderRadius: 5, border: `1px solid #fecaca`, background: "#fee2e2", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icons.Trash size={10} /></button>
                            </div>
                          </div>
                        </th>
                      );
                    })}
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
                          <MealCard day={d} meal={meal}
                            items={menu[d][meal]}
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

      {/* Modals */}
      {addCtx && <DishModal title={`Add — ${addCtx.day} ${addCtx.meal}`} initial={null} onSave={addDish} onCancel={() => setAddCtx(null)} />}
      {editCtx && <DishModal title={`Edit — ${editCtx.day} ${editCtx.meal}`} initial={editCtx.item} onSave={saveDish} onCancel={() => setEditCtx(null)} />}
      {delCtx && <DeleteConfirm label={delCtx.item.name} onConfirm={delDish} onCancel={() => setDelCtx(null)} />}
      {copyCtx && <CopyModal fromDay={copyCtx.day} onConfirm={copyDay} onCancel={() => setCopyCtx(null)} />}
      <Toast show={toast.show} msg={toast.msg} />
    </>
  );
}

