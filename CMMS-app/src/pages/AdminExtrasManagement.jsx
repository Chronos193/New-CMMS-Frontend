import { useState, useMemo, useCallback, useEffect } from "react";

// ── Inline SVG Icons ───────────────────────────────────────────────────────
const Icon = ({ children, size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={`inline-block align-middle shrink-0 ${className}`}>
    {children}
  </svg>
);
const Icons = {
  Plus: (p) => <Icon {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>,
  Minus: (p) => <Icon {...p}><line x1="5" y1="12" x2="19" y2="12" /></Icon>,
  Edit: (p) => <Icon {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Icon>,
  Trash: (p) => <Icon {...p}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></Icon>,
  X: (p) => <Icon {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>,
  Check: (p) => <Icon {...p}><polyline points="20 6 9 17 4 12" /></Icon>,
  Save: (p) => <Icon {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></Icon>,
  Package: (p) => <Icon {...p}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></Icon>,
  AlertTriangle: (p) => <Icon {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></Icon>,
  CheckCircle2: (p) => <Icon {...p}><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /><path d="m9 12 2 2 4-4" /></Icon>,
  ShoppingBag: (p) => <Icon {...p}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></Icon>,
  Activity: (p) => <Icon {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Icon>,
  Eye: (p) => <Icon {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Icon>,
};

import AdminNavBar from "../components/utils/AdminNavBar";
import api from "../Api";

// ── Reusable small components ──────────────────────────────────────────────
function AiBtn({ hoverCls, title, onClick, disabled, children, colorCls }) {
  return (
    <button title={title} onClick={onClick} disabled={disabled}
      className={`w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none hover:text-white hover:border-transparent ${colorCls} ${hoverCls}`}>
      {children}
    </button>
  );
}

function StatCard({ label, value, sub, iconBg, iconColor, Ic }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-3 border border-slate-100">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: iconBg, color: iconColor }}>
        <Ic size={20} />
      </div>
      <div>
        <div className="text-2xl font-extrabold text-slate-800 leading-none">{value}</div>
        {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
        <div className="text-xs text-slate-500 font-semibold mt-0.5">{label}</div>
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

  const stockCls = value === 0 ? "text-red-500 bg-red-50" : value <= 3 ? "text-amber-500 bg-amber-50" : "text-green-500 bg-green-50";

  return (
    <div className="inline-flex items-center gap-1.5">
      <button onClick={() => onChange(Math.max(0, value - 1))}
        className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 flex items-center justify-center font-extrabold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
        <Icons.Minus size={12} />
      </button>

      {editing ? (
        <input autoFocus type="number" value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onBlur={commit} onKeyDown={e => e.key === "Enter" && commit()}
          className="w-12 text-center py-0.5 px-1.5 border border-indigo-400 rounded-lg text-sm font-extrabold text-slate-800 bg-indigo-50 outline-none" />
      ) : (
        <span onClick={() => { setInputVal(String(value)); setEditing(true); }}
          title="Click to type a value"
          className={`min-w-9 text-center text-sm font-extrabold cursor-pointer px-1.5 py-0.5 rounded-lg ${stockCls}`}>
          {value}
        </span>
      )}

      <button onClick={() => onChange(value + 1)}
        className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 flex items-center justify-center font-extrabold hover:bg-green-50 hover:text-green-500 hover:border-green-200 transition-all">
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

  const Field = (label, key, type = "text", ph = "") => (
    <div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</div>
      <input type={type} value={form[key]} placeholder={ph}
        onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: "" })); }}
        className={`w-full px-3.5 py-2.5 border rounded-xl text-sm text-slate-800 bg-slate-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all ${errors[key] ? "border-red-400" : "border-slate-200"}`} />
      {errors[key] && <div className="text-xs text-red-500 mt-1 font-semibold">{errors[key]}</div>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-lg font-extrabold text-slate-800">{isEdit ? "Edit Item" : "Add New Item"}</div>
            <div className="text-xs text-slate-400 mt-0.5">{hallName}</div>
          </div>
          <button onClick={onCancel} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
            <Icons.X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          {Field("Item Name", "name", "text", "e.g. Chicken Biryani")}
          <div className="grid grid-cols-2 gap-4">
            {Field("Price (₹)", "price", "number", "e.g. 80")}
            {Field("Stock Count", "stock", "number", "e.g. 10")}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center justify-between mb-6">
          <div>
            <div className="font-bold text-sm text-slate-800">{form.name || "Item Name"}</div>
            <div className="text-xs text-slate-400 mt-0.5">Stock: {form.stock || "0"}</div>
          </div>
          <div className="font-extrabold text-base text-indigo-600">₹{form.price || "0"}</div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20">
            <Icons.Save size={15} /> {isEdit ? "Save Changes" : "Add Item"}
          </button>
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-300 transition-colors">
            <Icons.X size={15} /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ item, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="w-13 h-13 w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
          <Icons.AlertTriangle size={24} />
        </div>
        <div className="text-lg font-extrabold text-slate-800 mb-2">Remove Item?</div>
        <div className="text-sm text-slate-500 mb-6 leading-relaxed">
          Remove <strong className="text-slate-800">{item.name}</strong> from this hall's menu?
        </div>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-600 transition-colors">
            <Icons.Trash size={15} /> Remove
          </button>
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-300 transition-colors">
            <Icons.X size={15} /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ msg, show }) {
  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] transition-all duration-300 transform ${show ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90 pointer-events-none'}`}>
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2.5 shadow-2xl border border-white/10">
        <span className="text-emerald-400"><Icons.CheckCircle2 size={16} /></span>
        <span>{msg}</span>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AdminExtrasManagement() {
  const [menus, setMenus] = useState({});
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeHall, setActiveHall] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const fetchDashboard = useCallback(async () => {
    try {
      const [dashRes, profileRes] = await Promise.all([
        api.get('/api/admin/extras/dashboard/'),
        api.get('/api/profile/')
      ]);
      setMenus(dashRes.data.menus);
      setOrders(dashRes.data.orders);
      setProfile(profileRes.data);
      if (!activeHall && Object.keys(dashRes.data.menus).length > 0) {
        setActiveHall(Object.keys(dashRes.data.menus)[0]);
      }
    } catch (err) {
      console.error("Failed to fetch extras dashboard:", err);
      showToast("Error fetching data");
    }
  }, [activeHall]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

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
  const addItem = async (form) => {
    try {
      await api.post('/api/admin/extras/items/', {
        name: form.name,
        price: form.price,
        stock: form.stock,
        hallName: activeHall
      });
      showToast(`"${form.name}" added to ${activeHall}`);
      setAddOpen(false);
      fetchDashboard();
    } catch (err) {
      showToast("Failed to add item");
    }
  };

  const saveEdit = async (form) => {
    try {
      await api.put('/api/admin/extras/items/', {
        id: editItem.id,
        name: form.name,
        price: form.price,
        stock: form.stock
      });
      showToast(`"${form.name}" updated`);
      setEditItem(null);
      fetchDashboard();
    } catch (err) {
      showToast("Failed to update item");
    }
  };

  const deleteItemFn = async () => {
    try {
      await api.delete('/api/admin/extras/items/', { data: { id: deleteItem.id } });
      showToast(`"${deleteItem.name}" removed from ${activeHall}`);
      setDeleteItem(null);
      fetchDashboard();
    } catch (err) {
      showToast("Failed to remove item");
    }
  };

  // ── Stock controls ─────────────────────────────────────────────────────
  const setStock = async (itemId, newStock) => {
    try {
      await api.put('/api/admin/extras/items/', { id: itemId, stock: newStock });
      fetchDashboard();
    } catch (err) {
      showToast("Failed to update stock");
    }
  };

  // ── Stock level classes ────────────────────────────────────────────────
  const stockCls = (s) => s === 0 ? "text-red-500 bg-red-50" : s <= 3 ? "text-amber-500 bg-amber-50" : "text-green-500 bg-green-50";
  const stockDot = (s) => s === 0 ? "bg-red-500" : s <= 3 ? "bg-amber-500" : "bg-green-500";
  const stockLabel = (s) => s === 0 ? "Out of Stock" : s <= 3 ? "Low Stock" : "In Stock";

  return (
    <div className="min-h-screen bg-[#f0f1fb] font-sans text-slate-800 pb-12">
      {addOpen && <ItemModal hallName={activeHall} initial={null} onSave={addItem} onCancel={() => setAddOpen(false)} />}
      {editItem && <ItemModal hallName={activeHall} initial={editItem} onSave={saveEdit} onCancel={() => setEditItem(null)} />}
      {deleteItem && <DeleteConfirm item={deleteItem} onConfirm={deleteItemFn} onCancel={() => setDeleteItem(null)} />}

      <AdminNavBar profile={profile} />

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">

        {/* Hero */}
        <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-wrap items-center gap-4 shadow-sm mb-7 border border-slate-100">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
            <Icons.ShoppingBag size={26} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">Extras Stock Management</h1>
            <p className="text-slate-400 text-sm font-medium mt-0.5">Control item availability and stock counts across all halls. Changes reflect instantly for students.</p>
          </div>
          {stats.outOfStock > 0 && (
            <div className="flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-full text-xs font-bold border border-red-100 whitespace-nowrap">
              <Icons.AlertTriangle size={14} /> {stats.outOfStock} item{stats.outOfStock > 1 ? "s" : ""} out of stock
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          <StatCard label="Total Items"   value={stats.totalItems}  iconBg="#ededfd" iconColor="#5b5ef4" Ic={Icons.Package} />
          <StatCard label="Out of Stock"  value={stats.outOfStock}  iconBg="#fee2e2" iconColor="#ef4444" Ic={Icons.AlertTriangle} />
          <StatCard label="Low Stock (≤3)" value={stats.lowStock}   iconBg="#fef3c7" iconColor="#f59e0b" Ic={Icons.Activity} />
          <StatCard label="Total Orders"  value={stats.totalOrders} sub="this session" iconBg="#dcfce7" iconColor="#22c55e" Ic={Icons.ShoppingBag} />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">

          {/* LEFT — Hall tabs + Item table */}
          <div>
            {/* Hall tabs — scrollable on mobile */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {halls.map(h => {
                const hallItems = menus[h];
                const hasOOS = hallItems.some(i => i.stock === 0);
                const hasLow = hallItems.some(i => i.stock > 0 && i.stock <= 3);
                const isActive = h === activeHall;
                return (
                  <button key={h} onClick={() => setActiveHall(h)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold whitespace-nowrap transition-all duration-150 ${
                      isActive ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300"
                    }`}>
                    {h}
                    {(hasOOS || hasLow) && !isActive && (
                      <span className={`w-2 h-2 rounded-full inline-block ${hasOOS ? "bg-red-500" : "bg-amber-500"}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hall card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Card header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="font-extrabold text-base text-slate-800">{activeHall}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{items.length} item{items.length !== 1 ? "s" : ""} · {items.filter(i => i.stock > 0).length} available</div>
                </div>
                <button onClick={() => setAddOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition-colors">
                  <Icons.Plus size={14} /> Add Item
                </button>
              </div>

              {/* Table */}
              {items.length === 0 ? (
                <div className="py-16 text-center text-slate-400 font-semibold">
                  <div className="text-4xl mb-3">🥣</div>
                  No items in {activeHall}. Add one to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[700px]">
                    <thead className="bg-slate-50">
                      <tr>
                        {["#", "Item Name", "Price", "Stock Count", "Status", "Sold Today", "Actions"].map(h => (
                          <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, i) => (
                        <tr key={item.id} className={`transition-colors hover:bg-slate-50/60 ${i < items.length - 1 ? "border-b border-slate-100" : ""}`}>
                          <td className="px-5 py-4 text-xs font-bold text-slate-400">{i + 1}</td>
                          <td className="px-5 py-4 font-bold text-sm text-slate-800">{item.name}</td>
                          <td className="px-5 py-4 font-extrabold text-sm text-indigo-600">₹{item.price}</td>
                          <td className="px-5 py-4">
                            <StockStepper value={item.stock} onChange={v => setStock(item.id, v)} />
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${stockCls(item.stock)}`}>
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${stockDot(item.stock)}`} />
                              {stockLabel(item.stock)}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-bold text-sm text-slate-800">{item.sold}</div>
                            <div className="text-xs text-slate-400">orders</div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-1.5">
                              <AiBtn colorCls="text-amber-500" hoverCls="hover:bg-amber-400" title="Edit item" onClick={() => setEditItem(item)}><Icons.Edit size={15} /></AiBtn>
                              <AiBtn colorCls="text-red-500" hoverCls="hover:bg-red-500" title="Remove item" onClick={() => setDeleteItem(item)}><Icons.Trash size={15} /></AiBtn>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Hall summary footer */}
              {items.length > 0 && (
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-4">
                  {[
                    ["Total stock", items.reduce((a, i) => a + i.stock, 0) + " units", "text-slate-800"],
                    ["Out of stock", items.filter(i => i.stock === 0).length + " items", "text-red-500"],
                    ["Low stock", items.filter(i => i.stock > 0 && i.stock <= 3).length + " items", "text-amber-500"],
                    ["Sold today", items.reduce((a, i) => a + i.sold, 0) + " orders", "text-green-500"],
                  ].map(([l, v, c]) => (
                    <div key={l} className="text-xs">
                      <span className="text-slate-400 font-semibold">{l}: </span>
                      <span className={`font-bold ${c}`}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Live Order Feed */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:sticky lg:top-20">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-green-50 text-green-500 flex items-center justify-center">
                <Icons.Activity size={16} />
              </div>
              <div>
                <div className="font-extrabold text-sm text-slate-800">Live Order Feed</div>
                <div className="text-xs text-slate-400">Student bookings, real-time</div>
              </div>
              {orders.length > 0 && (
                <span className="ml-auto bg-indigo-600 text-white rounded-full text-xs font-bold px-2 py-0.5">{orders.length}</span>
              )}
            </div>

            <div className="max-h-[520px] overflow-y-auto">
              {orders.length === 0 ? (
                <div className="py-10 px-5 text-center text-slate-400">
                  <div className="text-3xl mb-2">📋</div>
                  <div className="text-sm font-semibold">No orders yet</div>
                </div>
              ) : orders.map((o, i) => (
                <div key={o.id} className={`px-4 py-3 border-b border-slate-50 ${i === 0 ? "bg-indigo-50/60" : ""}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-sm text-slate-800">{o.item}</div>
                    <div className="font-extrabold text-sm text-indigo-600">₹{o.price}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      <span className="font-semibold text-slate-700">{o.student}</span> · {o.hall}
                    </div>
                    <div className="text-[10px] text-slate-400">{o.time}</div>
                  </div>
                  <div className="mt-1 inline-block bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-400 tracking-wide">
                    {o.token}
                  </div>
                </div>
              ))}
            </div>

            {orders.length > 0 && (
              <div className="px-4 py-3 border-t border-slate-100 text-center">
                <button onClick={() => setOrders([])}
                  className="text-xs text-slate-400 font-semibold hover:text-slate-600 transition-colors">
                  Clear feed
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Toast show={toast.show} msg={toast.msg} />
    </div>
  );
}
