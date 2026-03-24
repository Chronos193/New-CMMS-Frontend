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
  Minus: (p) => <Icon {...p}><line x1="5" y1="12" x2="19" y2="12" /></Icon>,
  Edit: (p) => <Icon {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Icon>,
  Trash: (p) => <Icon {...p}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></Icon>,
  X: (p) => <Icon {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>,
  Check: (p) => <Icon {...p}><polyline points="20 6 9 17 4 12" /></Icon>,
  Save: (p) => <Icon {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></Icon>,
  RefreshCw: (p) => <Icon {...p}><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></Icon>,
  Package: (p) => <Icon {...p}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></Icon>,
  AlertTriangle: (p) => <Icon {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></Icon>,
  CheckCircle2: (p) => <Icon {...p}><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /><path d="m9 12 2 2 4-4" /></Icon>,
  ShoppingBag: (p) => <Icon {...p}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></Icon>,
  Hash: (p) => <Icon {...p}><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></Icon>,
  Activity: (p) => <Icon {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Icon>,
  Eye: (p) => <Icon {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Icon>
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

// ── Seed data — mirrors ExtrasPage.jsx hallMenus ───────────────────────────
let _id = 1000;
const mk = (name, price, stock) => ({ id: ++_id, name, price, stock, sold: 0 });

const INITIAL_MENUS = {
  "Hall 1": [mk("Veg Noodles", 40, 5), mk("Manchurian", 50, 10), mk("Masala Dosa", 35, 8)],
  "Hall 2": [mk("Paneer Butter Masala", 80, 6), mk("Lassi", 20, 20), mk("Curd Rice", 30, 12)],
  "Hall 3": [mk("Veg Fried Rice", 60, 7), mk("Samosa (2 pcs)", 10, 30), mk("Nimbu Pani", 10, 25)],
  "Hall 4": [mk("Chicken Biryani", 120, 2), mk("Paneer Tikka", 80, 8), mk("Egg Biryani", 100, 5)],
  "Hall 5": [mk("Cold Coffee", 30, 15), mk("Gulab Jamun", 15, 20)],
  "Hall 6": [mk("Juice (Mixed Fruit)", 25, 18), mk("Chicken Roll", 55, 6)],
  "Hall 7": [mk("Palak Paneer", 75, 4), mk("Curd (200ml)", 10, 30)],
  "Hall 9": [mk("Fish Curry", 90, 3), mk("Mutton Curry", 130, 2)],
  "Hall 13": [mk("Chicken Lollipop", 20, 15), mk("Chicken Noodles", 40, 10)],
  "GH1": [mk("Pasta", 70, 15), mk("Pizza Slice", 60, 8)],
};

// ── Simulated order feed (student bookings) ────────────────────────────────
const STUDENT_NAMES = ["Shubham", "Ananya", "Rohan", "Priya", "Aditya", "Kavya", "Rahul", "Sneha", "Varun", "Manya"];
const mkOrder = (hallName, itemName, price) => ({
  id: Math.random().toString(36).slice(2, 8).toUpperCase(),
  student: STUDENT_NAMES[Math.floor(Math.random() * STUDENT_NAMES.length)],
  hall: hallName, item: itemName, price,
  time: new Date().toLocaleTimeString(),
  token: "IITK-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
});

// ── Reusable small components ──────────────────────────────────────────────
function AiBtn({ color, hoverBg, title, onClick, disabled, children }) {
  const [h, setH] = useState(false);
  return (
    <button title={title} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${h && !disabled ? hoverBg : T.border}`, background: h && !disabled ? hoverBg : T.surface, color: h && !disabled ? "#fff" : disabled ? "#c5c7d8" : color, cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s", opacity: disabled ? .5 : 1 }}>
      {children}
    </button>
  );
}

function StatCard({ label, value, sub, iconBg, iconColor, Ic }) {
  return (
    <div style={{ background: T.surface, borderRadius: T.radiusSm, padding: "18px 20px", boxShadow: T.shadow, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Ic size={20} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.text, lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{sub}</div>}
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 600, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

// ── Stock stepper ──────────────────────────────────────────────────────────
function StockStepper({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(String(value));

  const commit = () => {
    const n = parseInt(inputVal);
    if (!isNaN(n) && n >= 0) onChange(n);
    else setInputVal(String(value));
    setEditing(false);
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <button onClick={() => onChange(Math.max(0, value - 1))}
        style={{ width: 28, height: 28, borderRadius: 7, border: `1.5px solid ${T.border}`, background: T.surface2, color: T.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, transition: "all .12s" }}
        onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#ef4444"; }}
        onMouseLeave={e => { e.currentTarget.style.background = T.surface2; e.currentTarget.style.color = T.muted; }}>
        <Icons.Minus size={12} />
      </button>

      {editing ? (
        <input autoFocus type="number" value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onBlur={commit} onKeyDown={e => e.key === "Enter" && commit()}
          style={{ width: 52, textAlign: "center", padding: "3px 6px", border: `1.5px solid ${T.accent}`, borderRadius: 7, fontFamily: "inherit", fontSize: 14, fontWeight: 800, color: T.text, outline: "none", background: T.accentL }} />
      ) : (
        <span onClick={() => { setInputVal(String(value)); setEditing(true); }}
          title="Click to type a value"
          style={{
            minWidth: 36, textAlign: "center", fontSize: 15, fontWeight: 800,
            color: value === 0 ? "#ef4444" : value <= 3 ? "#f59e0b" : "#22c55e",
            cursor: "pointer", padding: "3px 6px", borderRadius: 7, background: value === 0 ? "#fee2e2" : value <= 3 ? "#fef3c7" : "#dcfce7"
          }}>
          {value}
        </span>
      )}

      <button onClick={() => onChange(value + 1)}
        style={{ width: 28, height: 28, borderRadius: 7, border: `1.5px solid ${T.border}`, background: T.surface2, color: T.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, transition: "all .12s" }}
        onMouseEnter={e => { e.currentTarget.style.background = "#dcfce7"; e.currentTarget.style.color = "#22c55e"; }}
        onMouseLeave={e => { e.currentTarget.style.background = T.surface2; e.currentTarget.style.color = T.muted; }}>
        <Icons.Plus size={12} />
      </button>
    </div>
  );
}

// ── Add / Edit Item Modal ──────────────────────────────────────────────────
function ItemModal({ initial, hallName, onSave, onCancel }) {
  const blank = { name: "", price: "", stock: "" };
  const [form, setForm] = useState(initial ? { ...initial, price: String(initial.price), stock: String(initial.stock) } : blank);
  const [errors, setErrors] = useState({});
  const isEdit = !!initial;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Item name is required";
    if (!form.price || isNaN(form.price) || +form.price <= 0) e.price = "Enter a valid price";
    if (form.stock === "" || isNaN(form.stock) || +form.stock < 0) e.stock = "Enter a valid stock (≥ 0)";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, price: Number(form.price), stock: Number(form.stock) });
  };

  const F = (label, key, type = "text", ph = "") => (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <input type={type} value={form[key]} placeholder={ph}
        onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: "" })); }}
        style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${errors[key] ? "#ef4444" : T.border}`, borderRadius: T.radiusSm, fontFamily: "inherit", fontSize: 14, color: T.text, background: T.surface2, outline: "none" }} />
      {errors[key] && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4, fontWeight: 600 }}>{errors[key]}</div>}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,27,58,.45)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={e => e.target === e.currentTarget && onCancel()}>
      <div style={{ background: T.surface, borderRadius: T.radius, padding: 32, width: 440, maxWidth: "95vw", boxShadow: T.shadowMd, animation: "slideUp .22s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{isEdit ? "Edit Item" : "Add New Item"}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{hallName}</div>
          </div>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icons.X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          {F("Item Name", "name", "text", "e.g. Chicken Biryani")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {F("Price (₹)", "price", "number", "e.g. 80")}
            {F("Stock Count", "stock", "number", "e.g. 10")}
          </div>
        </div>

        {/* Preview */}
        <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{form.name || "Item Name"}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Stock: {form.stock || "0"}</div>
          </div>
          <div style={{ fontWeight: 800, fontSize: 16, color: T.accent }}>₹{form.price || "0"}</div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <MBtn color={T.accent} onClick={handleSave}><Icons.Save size={15} /> {isEdit ? "Save Changes" : "Add Item"}</MBtn>
          <MBtn color="#94a3b8" onClick={onCancel}><Icons.X size={15} /> Cancel</MBtn>
        </div>
      </div>
    </div>
  );
}

// ── Restock All Modal ──────────────────────────────────────────────────────
function RestockModal({ hall, items, onConfirm, onCancel }) {
  const [counts, setCounts] = useState(Object.fromEntries(items.map(i => [i.id, i.stock])));
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,27,58,.45)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={e => e.target === e.currentTarget && onCancel()}>
      <div style={{ background: T.surface, borderRadius: T.radius, padding: 32, width: 480, maxWidth: "95vw", maxHeight: "85vh", overflowY: "auto", boxShadow: T.shadowMd, animation: "slideUp .22s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Restock — {hall}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Set new stock counts for all items</div>
          </div>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><Icons.X size={18} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {items.map(item => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: T.surface2, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "12px 16px" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 1 }}>₹{item.price} · Sold: {item.sold}</div>
              </div>
              <StockStepper value={counts[item.id]} onChange={v => setCounts(c => ({ ...c, [item.id]: v }))} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <MBtn color={T.accent} onClick={() => onConfirm(counts)}><Icons.RefreshCw size={15} /> Apply Restock</MBtn>
          <MBtn color="#94a3b8" onClick={onCancel}><Icons.X size={15} /> Cancel</MBtn>
        </div>
      </div>
    </div>
  );
}

function MBtn({ color, onClick, children }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ flex: 1, padding: "11px 0", borderRadius: T.radiusSm, border: "none", background: color, color: "#fff", fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: h ? .88 : 1, transform: h ? "translateY(-1px)" : "none", transition: "all .15s" }}>
      {children}
    </button>
  );
}

function DeleteConfirm({ item, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,27,58,.45)", backdropFilter: "blur(4px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: T.surface, borderRadius: T.radius, padding: 32, width: 380, maxWidth: "95vw", boxShadow: T.shadowMd, animation: "slideUp .22s ease", textAlign: "center" }}>
        <div style={{ width: 52, height: 52, background: "#fee2e2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#ef4444" }}>
          <Icons.AlertTriangle size={24} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Remove Item?</div>
        <div style={{ fontSize: 14, color: T.muted, marginBottom: 24, lineHeight: 1.6 }}>
          Remove <strong style={{ color: T.text }}>{item.name}</strong> from this hall's menu?
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <MBtn color="#ef4444" onClick={onConfirm}><Icons.Trash size={15} /> Remove</MBtn>
          <MBtn color="#94a3b8" onClick={onCancel}><Icons.X size={15} /> Cancel</MBtn>
        </div>
      </div>
    </div>
  );
}

function Toast({ msg, show }) {
  return (
    <div style={{ position: "fixed", bottom: 28, left: "50%", transform: show ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(80px)", background: T.text, color: "#fff", padding: "12px 22px", borderRadius: 50, fontSize: 14, fontWeight: 600, zIndex: 400, pointerEvents: "none", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8, transition: "transform .3s cubic-bezier(.34,1.56,.64,1)" }}>
      <Icons.CheckCircle2 size={16} /><span>{msg}</span>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AdminExtrasManagement() {
  const [menus, setMenus] = useState(INITIAL_MENUS);
  const [activeHall, setActiveHall] = useState("Hall 1");
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [restockOpen, setRestockOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback(msg => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2800);
  }, []);

  const halls = Object.keys(menus);
  const items = menus[activeHall] || [];

  // ── Global stats ──────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const allItems = Object.values(menus).flat();
    return {
      totalItems: allItems.length,
      outOfStock: allItems.filter(i => i.stock === 0).length,
      lowStock: allItems.filter(i => i.stock > 0 && i.stock <= 3).length,
      totalOrders: allItems.reduce((a, i) => a + i.sold, 0),
    };
  }, [menus]);

  // ── Item CRUD ──────────────────────────────────────────────────────────
  const addItem = (form) => {
    const newItem = { id: ++_id, name: form.name, price: form.price, stock: form.stock, sold: 0 };
    setMenus(m => ({ ...m, [activeHall]: [...m[activeHall], newItem] }));
    setAddOpen(false);
    showToast(`"${form.name}" added to ${activeHall}`);
  };

  const saveEdit = (form) => {
    setMenus(m => ({ ...m, [activeHall]: m[activeHall].map(i => i.id === editItem.id ? { ...i, name: form.name, price: form.price, stock: form.stock } : i) }));
    setEditItem(null);
    showToast(`"${form.name}" updated`);
  };

  const deleteItemFn = () => {
    setMenus(m => ({ ...m, [activeHall]: m[activeHall].filter(i => i.id !== deleteItem.id) }));
    showToast(`"${deleteItem.name}" removed from ${activeHall}`);
    setDeleteItem(null);
  };

  // ── Stock controls ─────────────────────────────────────────────────────
  const setStock = (itemId, newStock) => {
    setMenus(m => ({ ...m, [activeHall]: m[activeHall].map(i => i.id === itemId ? { ...i, stock: newStock } : i) }));
  };

  const applyRestock = (counts) => {
    setMenus(m => ({ ...m, [activeHall]: m[activeHall].map(i => ({ ...i, stock: counts[i.id] ?? i.stock })) }));
    setRestockOpen(false);
    showToast(`${activeHall} restocked successfully`);
  };

  // ── Simulate a student booking (demo button) ───────────────────────────
  const simulateOrder = () => {
    const available = items.filter(i => i.stock > 0);
    if (!available.length) { showToast("All items are out of stock!"); return; }
    const item = available[Math.floor(Math.random() * available.length)];
    setMenus(m => ({ ...m, [activeHall]: m[activeHall].map(i => i.id === item.id ? { ...i, stock: i.stock - 1, sold: i.sold + 1 } : i) }));
    const order = mkOrder(activeHall, item.name, item.price);
    setOrders(prev => [order, ...prev].slice(0, 20));
    showToast(`Student booked: ${item.name} — stock now ${item.stock - 1}`);
  };

  // ── Stock level color ──────────────────────────────────────────────────
  const stockColor = (s) => s === 0 ? "#ef4444" : s <= 3 ? "#f59e0b" : "#22c55e";
  const stockBg = (s) => s === 0 ? "#fee2e2" : s <= 3 ? "#fef3c7" : "#dcfce7";
  const stockLabel = (s) => s === 0 ? "Out of Stock" : s <= 3 ? "Low Stock" : "In Stock";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Manrope',sans-serif;}
        @keyframes slideUp{from{transform:translateY(16px);opacity:0}to{transform:none;opacity:1}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
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
            <div style={{ width: 38, height: 38, background: T.accent, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <Icons.Utensils size={19} />
            </div>
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

        <main style={{ padding: "32px 40px", maxWidth: 1400, margin: "0 auto" }}>

          {/* Hero */}
          <div style={{ background: T.surface, borderRadius: T.radius, padding: "28px 32px", display: "flex", alignItems: "center", gap: 20, boxShadow: T.shadow, marginBottom: 28 }}>
            <div style={{ width: 52, height: 52, background: T.accentL, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent, flexShrink: 0 }}>
              <Icons.ShoppingBag size={26} />
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800 }}>Extras Stock Management</h1>
              <p style={{ color: T.muted, fontSize: 14, marginTop: 2, fontWeight: 500 }}>Control item availability and stock counts across all halls. Changes reflect instantly for students.</p>
            </div>
            {stats.outOfStock > 0 && (
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, background: "#fee2e2", color: "#ef4444", padding: "8px 16px", borderRadius: 50, fontSize: 12, fontWeight: 700, border: "1px solid #fecaca", whiteSpace: "nowrap" }}>
                <Icons.AlertTriangle size={14} /> {stats.outOfStock} item{stats.outOfStock > 1 ? "s" : ""} out of stock
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
            <StatCard label="Total Items" value={stats.totalItems} iconBg={T.accentL} iconColor={T.accent} Ic={Icons.Package} />
            <StatCard label="Out of Stock" value={stats.outOfStock} iconBg="#fee2e2" iconColor="#ef4444" Ic={Icons.AlertTriangle} />
            <StatCard label="Low Stock (≤3)" value={stats.lowStock} iconBg="#fef3c7" iconColor="#f59e0b" Ic={Icons.Activity} />
            <StatCard label="Total Orders" value={stats.totalOrders} sub="this session" iconBg="#dcfce7" iconColor="#22c55e" Ic={Icons.ShoppingBag} />
          </div>

          {/* Two-column layout: left = hall+table, right = order feed */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>

            {/* LEFT — Hall tabs + Item table */}
            <div>
              {/* Hall tabs */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {halls.map(h => {
                  const hallItems = menus[h];
                  const hasOOS = hallItems.some(i => i.stock === 0);
                  const hasLow = hallItems.some(i => i.stock > 0 && i.stock <= 3);
                  const active = h === activeHall;
                  return (
                    <button key={h} onClick={() => setActiveHall(h)}
                      style={{ padding: "8px 16px", borderRadius: 50, border: `1.5px solid ${active ? T.accent : T.border}`, background: active ? T.accent : T.surface, color: active ? "#fff" : T.text, fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all .15s", position: "relative" }}>
                      {h}
                      {/* status dot */}
                      {(hasOOS || hasLow) && !active && (
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: hasOOS ? "#ef4444" : "#f59e0b", display: "inline-block" }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Hall card */}
              <div style={{ background: T.surface, borderRadius: T.radius, boxShadow: T.shadow, overflow: "hidden" }}>

                {/* Card header */}
                <div style={{ padding: "18px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{activeHall}</div>
                    <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{items.length} item{items.length !== 1 ? "s" : ""} · {items.filter(i => i.stock > 0).length} available</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {/* Simulate student order */}
                    <button onClick={simulateOrder}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: T.surface2, color: T.muted, border: `1.5px solid ${T.border}`, borderRadius: T.radiusSm, fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      title="Simulate a student booking (demo)">
                      <Icons.Eye size={14} /> Simulate Order
                    </button>
                    <button onClick={() => setRestockOpen(true)}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#dcfce7", color: "#16a34a", border: `1.5px solid #bbf7d0`, borderRadius: T.radiusSm, fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      <Icons.RefreshCw size={14} /> Restock All
                    </button>
                    <button onClick={() => setAddOpen(true)}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: T.accent, color: "#fff", border: "none", borderRadius: T.radiusSm, fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(91,94,244,.25)" }}>
                      <Icons.Plus size={14} /> Add Item
                    </button>
                  </div>
                </div>

                {/* Table */}
                {items.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: T.muted, fontWeight: 600 }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>🥣</div>
                    No items in {activeHall}. Add one to get started.
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ background: T.surface2 }}>
                      <tr>
                        {["#", "Item Name", "Price", "Stock Count", "Status", "Sold Today", "Actions"].map(h => (
                          <th key={h} style={{ padding: "12px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: ".1em", borderBottom: `1.5px solid ${T.border}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, i) => (
                        <tr key={item.id} style={{ borderBottom: i === items.length - 1 ? "none" : `1px solid ${T.border}` }}>
                          <td style={{ padding: "14px 18px", fontSize: 13, color: T.muted, fontWeight: 700 }}>{i + 1}</td>

                          <td style={{ padding: "14px 18px" }}>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</div>
                          </td>

                          <td style={{ padding: "14px 18px" }}>
                            <div style={{ fontWeight: 800, color: T.accent, fontSize: 14 }}>₹{item.price}</div>
                          </td>

                          {/* ── Live stock stepper ── */}
                          <td style={{ padding: "14px 18px" }}>
                            <StockStepper value={item.stock} onChange={v => setStock(item.id, v)} />
                          </td>

                          {/* Status pill */}
                          <td style={{ padding: "14px 18px" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 50, fontSize: 11, fontWeight: 700, background: stockBg(item.stock), color: stockColor(item.stock) }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: stockColor(item.stock), flexShrink: 0 }} />
                              {stockLabel(item.stock)}
                            </span>
                          </td>

                          <td style={{ padding: "14px 18px" }}>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{item.sold}</div>
                            <div style={{ fontSize: 11, color: T.muted }}>orders</div>
                          </td>

                          <td style={{ padding: "14px 18px" }}>
                            <div style={{ display: "flex", gap: 6 }}>
                              <AiBtn color="#f59e0b" hoverBg="#f59e0b" title="Edit item" onClick={() => setEditItem(item)}><Icons.Edit size={15} /></AiBtn>
                              <AiBtn color="#ef4444" hoverBg="#ef4444" title="Remove item" onClick={() => setDeleteItem(item)}><Icons.Trash size={15} /></AiBtn>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Hall summary footer */}
                {items.length > 0 && (
                  <div style={{ padding: "12px 18px", background: T.surface2, borderTop: `1px solid ${T.border}`, display: "flex", gap: 20 }}>
                    {[
                      ["Total stock", items.reduce((a, i) => a + i.stock, 0) + " units", T.text],
                      ["Out of stock", items.filter(i => i.stock === 0).length + " items", "#ef4444"],
                      ["Low stock", items.filter(i => i.stock > 0 && i.stock <= 3).length + " items", "#f59e0b"],
                      ["Sold today", items.reduce((a, i) => a + i.sold, 0) + " orders", "#22c55e"],
                    ].map(([l, v, c]) => (
                      <div key={l} style={{ fontSize: 12 }}>
                        <span style={{ color: T.muted, fontWeight: 600 }}>{l}: </span>
                        <span style={{ fontWeight: 800, color: c }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — Live Order Feed */}
            <div style={{ background: T.surface, borderRadius: T.radius, boxShadow: T.shadow, overflow: "hidden", position: "sticky", top: 80 }}>
              <div style={{ padding: "18px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: "#dcfce7", color: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icons.Activity size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>Live Order Feed</div>
                  <div style={{ fontSize: 11, color: T.muted }}>Student bookings, real-time</div>
                </div>
                {orders.length > 0 && (
                  <span style={{ marginLeft: "auto", background: T.accent, color: "#fff", borderRadius: 50, fontSize: 11, fontWeight: 700, padding: "2px 8px" }}>{orders.length}</span>
                )}
              </div>

              <div style={{ maxHeight: 520, overflowY: "auto" }}>
                {orders.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: T.muted }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>No orders yet</div>
                    <div style={{ fontSize: 11, marginTop: 4 }}>Hit "Simulate Order" to test</div>
                  </div>
                ) : orders.map((o, i) => (
                  <div key={o.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, animation: "fadeIn .3s ease", background: i === 0 ? T.accentL + "88" : T.surface }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{o.item}</div>
                      <div style={{ fontWeight: 800, color: T.accent, fontSize: 13 }}>₹{o.price}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontSize: 11, color: T.muted }}>
                        <span style={{ fontWeight: 600, color: T.text }}>{o.student}</span> · {o.hall}
                      </div>
                      <div style={{ fontSize: 10, color: T.muted }}>{o.time}</div>
                    </div>
                    <div style={{ marginTop: 5, display: "inline-block", background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 5, padding: "2px 7px", fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: ".05em" }}>
                      {o.token}
                    </div>
                  </div>
                ))}
              </div>

              {orders.length > 0 && (
                <div style={{ padding: "12px 16px", borderTop: `1px solid ${T.border}`, textAlign: "center" }}>
                  <button onClick={() => setOrders([])}
                    style={{ background: "none", border: "none", color: T.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    Clear feed
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {addOpen && <ItemModal hallName={activeHall} initial={null} onSave={addItem} onCancel={() => setAddOpen(false)} />}
      {editItem && <ItemModal hallName={activeHall} initial={editItem} onSave={saveEdit} onCancel={() => setEditItem(null)} />}
      {deleteItem && <DeleteConfirm item={deleteItem} onConfirm={deleteItemFn} onCancel={() => setDeleteItem(null)} />}
      {restockOpen && <RestockModal hall={activeHall} items={items} onConfirm={applyRestock} onCancel={() => setRestockOpen(false)} />}

      <Toast show={toast.show} msg={toast.msg} />
    </>
  );
}
