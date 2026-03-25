import { useState, useMemo, useCallback, useEffect } from "react";
import api from "../Api";
import AdminNavBar from "../components/utils/AdminNavBar";

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
  Utensils: (p) => <Icon {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></Icon>,
  Coffee: (p) => <Icon {...p}><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></Icon>,
  Sun: (p) => <Icon {...p}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></Icon>,
  Moon: (p) => <Icon {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></Icon>,
};

// ── Constants ──────────────────────────────────────────────────────────────
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEALS = ["Breakfast", "Lunch", "Snacks", "Dinner"];
const CATEGORIES = ["Veg", "Non-Veg", "Vegan", "Dairy", "Beverage"];

const MEAL_META = {
  Breakfast: { headerCls: "bg-amber-50 text-amber-500", Icon: Icons.Sun },
  Lunch:     { headerCls: "bg-indigo-50 text-indigo-500", Icon: Icons.Utensils },
  Snacks:    { headerCls: "bg-orange-50 text-orange-500", Icon: Icons.Coffee },
  Dinner:    { headerCls: "bg-purple-50 text-purple-500", Icon: Icons.Moon },
};

const CAT_CLS = {
  Veg: "text-green-600 bg-green-50",
  "Non-Veg": "text-red-500 bg-red-50",
  Vegan: "text-blue-500 bg-blue-50",
  Dairy: "text-violet-500 bg-violet-50",
  Beverage: "text-amber-500 bg-amber-50",
};
const CAT_DOT = {
  Veg: "bg-green-500", "Non-Veg": "bg-red-500", Vegan: "bg-blue-500", Dairy: "bg-violet-500", Beverage: "bg-amber-500",
};

// ── Toast ──────────────────────────────────────────────────────────────────
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

// ── Dish Modal ─────────────────────────────────────────────────────────────
function DishModal({ title, initial, onSave, onCancel }) {
  const [dish, setDish] = useState(initial?.dish || "");
  const [cat, setCat] = useState(initial?.category || "Veg");
  const [errors, setErrors] = useState({});

  const save = () => {
    if (!dish.trim()) { setErrors({ dish: "Dish name is required" }); return; }
    onSave({ dish: dish.trim(), category: cat });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between mb-5">
          <div className="text-lg font-extrabold text-slate-800">{title}</div>
          <button onClick={onCancel} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
            <Icons.X size={17} />
          </button>
        </div>

        <div className="mb-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Dish Name</div>
          <input autoFocus value={dish} onChange={e => { setDish(e.target.value); setErrors({}); }}
            placeholder="e.g. Dal Tadka"
            className={`w-full px-3.5 py-2.5 border rounded-xl text-sm text-slate-800 bg-slate-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all ${errors.dish ? "border-red-400" : "border-slate-200"}`}
            onKeyDown={e => e.key === "Enter" && save()} />
          {errors.dish && <div className="text-xs text-red-500 mt-1 font-semibold">{errors.dish}</div>}
        </div>

        <div className="mb-6">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Category</div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-3 py-1 rounded-full border text-xs font-bold transition-all ${
                  cat === c ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={save} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20">
            <Icons.Save size={14} /> Save Dish
          </button>
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-300 transition-colors">
            <Icons.X size={14} /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ label, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm z-[60] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
          <Icons.AlertTriangle size={22} />
        </div>
        <div className="text-lg font-extrabold text-slate-800 mb-2">Remove Dish?</div>
        <div className="text-sm text-slate-500 mb-6 leading-relaxed">Remove <strong className="text-slate-800">{label}</strong> from menu?</div>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-600 transition-colors">
            <Icons.Trash size={14} /> Remove
          </button>
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-300 transition-colors">
            <Icons.X size={14} /> Cancel
          </button>
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
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden flex flex-col">
      <div className={`px-3.5 py-2.5 flex items-center gap-2 ${meta.headerCls}`}>
        <Ic size={13} />
        <span className="text-xs font-extrabold uppercase tracking-wide">{meal}</span>
      </div>

      <div className="px-3 py-2 flex-1">
        {items.length === 0 ? (
          <div className="text-xs text-slate-400 italic py-1.5 text-center">No dishes</div>
        ) : items.map((item, i) => (
          <div key={item.id} className={`flex items-center gap-1.5 py-1.5 ${i < items.length - 1 ? "border-b border-slate-50" : ""}`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${CAT_DOT[item.category] || "bg-slate-300"}`} />
            <span className="text-sm font-semibold text-slate-700 flex-1 truncate">{item.dish}</span>
            <div className="flex gap-0.5 shrink-0">
              <button onClick={() => onEdit(item)}
                className="w-6 h-6 rounded flex items-center justify-center text-amber-500 hover:bg-amber-50 transition-colors" title="Edit">
                <Icons.Edit size={10} />
              </button>
              <button onClick={() => onDelete(item)}
                className="w-6 h-6 rounded flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors" title="Remove">
                <Icons.Trash size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onAdd}
        className="mx-2.5 mb-2.5 py-1.5 bg-indigo-50 text-indigo-600 border border-dashed border-indigo-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-indigo-100 transition-colors">
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
          const userHall = pRes.data?.hall_of_residence;
          const initialHall = hRes.data.find(h => h.name === userHall) || hRes.data[0];
          setHallId(initialHall.id);
        }
      } catch (err) {
        console.error("Init failed:", err);
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

  const selectCls = "appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer";

  return (
    <>
      <div className="min-h-screen bg-[#f0f1fb] font-sans text-slate-800 pb-12">
        <AdminNavBar profile={profile} notifications={notifications} onOpenNotifications={handleOpenNotifications} />

        <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">

          {/* Hero */}
          <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-wrap items-center gap-4 shadow-sm mb-7 border border-slate-100">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <Icons.Utensils size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">Menu Management</h1>
              <p className="text-slate-400 text-sm font-medium mt-0.5">Update and manage mess menu items for students.</p>
            </div>

            {/* Hall selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-400">Hall:</span>
              <select value={hallId} onChange={e => setHallId(e.target.value)} className={selectCls}>
                <option value="" disabled>Select Hall</option>
                {halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>

            {/* View toggle */}
            <div className="flex bg-slate-100 rounded-xl p-1 gap-1 border border-slate-200">
              {[["single", "Single Day", Icons.LayoutGrid], ["weekly", "Weekly", Icons.CalendarDays]].map(([v, l, Ic]) => (
                <button key={v} onClick={() => setViewMode(v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === v ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}>
                  <Ic size={12} /> {l}
                </button>
              ))}
            </div>
          </div>

          {!hallId ? (
            <div className="py-24 text-center text-slate-400">
              <Icons.Utensils size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-semibold">Please select a hall to view and manage its menu.</p>
            </div>
          ) : viewMode === "single" ? (
            <>
              {/* Day navigator */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <button onClick={prevDay} className="w-9 h-9 border border-slate-200 rounded-xl bg-white text-slate-400 flex items-center justify-center hover:border-indigo-300 hover:text-indigo-600 transition-all">
                    <Icons.ChevLeft size={15} />
                  </button>
                  <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)}
                    className={`${selectCls} text-sm font-extrabold`}>
                    {DAYS.map(d => <option key={d}>{d}</option>)}
                  </select>
                  <button onClick={nextDay} className="w-9 h-9 border border-slate-200 rounded-xl bg-white text-slate-400 flex items-center justify-center hover:border-indigo-300 hover:text-indigo-600 transition-all">
                    <Icons.ChevRight size={15} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="overflow-x-auto pb-4">
              <table className="border-separate min-w-[1100px]" style={{ borderSpacing: "8px 0" }}>
                <thead>
                  <tr>
                    <th className="w-20"></th>
                    {DAYS.map(d => (
                      <th key={d} className="py-1.5 px-1 min-w-[170px] text-left">
                        <span className="text-sm font-extrabold text-slate-800">{d}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MEALS.map(meal => {
                    const Ic = MEAL_META[meal].Icon;
                    return (
                      <tr key={meal}>
                        <td className="pb-3 align-top">
                          <div className={`flex flex-col items-center gap-1 rounded-xl py-2.5 px-1.5 ${MEAL_META[meal].headerCls}`}>
                            <Ic size={14} />
                            <span className="text-[9px] font-extrabold uppercase tracking-wide" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>{meal}</span>
                          </div>
                        </td>
                        {DAYS.map(d => (
                          <td key={d} className="pb-3 align-top">
                            <MealCard meal={meal}
                              items={groupedMenu[d][meal]}
                              onAdd={() => setAddCtx({ day: d, meal })}
                              onEdit={item => setEditCtx({ day: d, meal, item })}
                              onDelete={item => setDelCtx({ day: d, meal, item })} />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
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
