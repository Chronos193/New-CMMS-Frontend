import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Utensils, ArrowLeft, CheckCircle2, ShoppingBag, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '../components/utils/NavBar';
import api from '../Api';

const ExtrasPage = () => {
  const navigate = useNavigate();
  const [selectedHall, setSelectedHall] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Profile & Notifications state for NavBar
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Mock Data with descriptions added to match the reference image
  const [hallMenus, setHallMenus] = useState({
    "Hall 1": [
      { id: 101, name: 'Veg Noodles', price: 40, stockCount: 5, description: "Stir-fried noodles with fresh seasonal vegetables and soy sauce." },
      { id: 102, name: 'Manchurian', price: 50, stockCount: 10, description: "Crispy vegetable balls tossed in a spicy, tangy Indo-Chinese sauce." },
    ],
    "Hall 4": [
      { id: 401, name: 'Chicken Biryani', price: 120, stockCount: 2, description: "Aromatic basmati rice cooked with tender chicken pieces and traditional spices." },
      { id: 402, name: 'Paneer Tikka', price: 80, stockCount: 8, description: "Char-grilled cottage cheese cubes marinated in yogurt and spices." },
    ],
    "GH1": [
      { id: 901, name: 'Pasta', price: 70, stockCount: 15, description: "Creamy white sauce pasta with bell peppers and Italian herbs." },
    ]
  });

  useEffect(() => {
    // Fetch real API data for NavBar
    const fetchDashboardData = async () => {
      try {
        const [profileRes, notifRes] = await Promise.all([
          api.get('/api/profile/'),
          api.get('/api/notifications/')
        ]);
        setProfile(profileRes.data);
        setNotifications(notifRes.data?.results || notifRes.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        // Fallback for visual testing
        setProfile({
          name: "Shubham",
          email: "shubhamkp24@iitk.ac.in",
          role: "student"
        });
        setNotifications([
          { id: 1, title: "Meal Confirmed", content: "Friday dinner confirmed.", category: "unseen", time: new Date().toISOString() }
        ]);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleOpenNotifications = async () => {
    const hasUnseen = notifications.some(n => n.category === 'unseen');
    if (!hasUnseen) return;
    setNotifications(prev => prev.map(n => ({ ...n, category: 'seen' })));
    try {
      await api.post('/api/notifications/mark-seen/');
    } catch (error) {
      console.error('Failed to mark notifications as seen on backend:', error);
    }
  };

  const navLinks = [
    { name: "Daily Menu", path: "/menu" },
    { name: "Extra Meals", path: "/extras" },
    { name: "Leaves & Rebates", path: "/rebate" },
  ];

  const currentMenu = hallMenus[selectedHall] || [];

  const handleBooking = (item) => {
    const token = `IITK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const newMenus = { ...hallMenus };
    const itemIdx = newMenus[selectedHall].findIndex(i => i.id === item.id);

    if (newMenus[selectedHall][itemIdx].stockCount > 0) {
      newMenus[selectedHall][itemIdx].stockCount -= 1;
      setHallMenus(newMenus);
      setBookingDetails({ ...item, token, hall: selectedHall, time: new Date().toLocaleTimeString() });
      setShowQR(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <NavBar
        profile={profile}
        notifications={notifications}
        navLinks={navLinks}
        onOpenNotifications={handleOpenNotifications}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {loadingProfile ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">Loading menu...</p>
          </div>
        ) : (
          <>
            {/* Page Header */}
            <header className="mb-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
                    Order Extra Items
                  </h1>
                  <p className="text-slate-500 font-medium max-w-xl">
                    Select from our menu of additional food items and guest meals to supplement your daily mess.
                  </p>
                </div>

                {/* Hall Selection Styled for the new theme */}
                <div className="w-full md:w-72">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    Select Hall
                  </label>
                  <div className="relative">
                    <select
                      value={selectedHall}
                      onChange={(e) => setSelectedHall(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 pr-10 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
                    >
                      <option value="">Select Hall</option>
                      {[...Array(13)].map((_, i) => (
                        <option key={i + 1} value={`Hall ${i + 1}`}>Hall {i + 1}</option>
                      ))}
                      <option value="GH1">GH1</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Plus size={16} className="rotate-45" />
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Content Area */}
            <AnimatePresence mode="wait">
              {!selectedHall ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center py-20 px-6 text-center"
                >
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                    <Utensils className="text-slate-300 w-10 h-10" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to explore?</h3>
                  <p className="text-slate-500 font-medium max-w-xs">
                    Select your hall from the menu above to see what's cooking today.
                  </p>
                </motion.div>
              ) : currentMenu.length > 0 ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {currentMenu.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -4 }}
                      className="group bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      {/* Image Placeholder - Reduced Height */}
                      <div className="relative h-40 bg-slate-100/50 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Utensils className="w-12 h-12 text-slate-200 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />

                        {/* Available Badge */}
                        {item.stockCount > 0 && (
                          <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1.25 rounded-md shadow-lg">
                            Available
                          </div>
                        )}
                        {item.stockCount === 0 && (
                          <div className="absolute top-3 right-3 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1.25 rounded-md shadow-lg">
                            Sold Out
                          </div>
                        )}
                      </div>

                      {/* Card Content - Reduced Padding */}
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex justify-between items-baseline mb-1.5">
                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate pr-2">
                            {item.name}
                          </h3>
                          <span className="text-base font-bold text-slate-900 shrink-0">₹{item.price}</span>
                        </div>

                        <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-grow line-clamp-2">
                          {item.description || "Fresh and hot extra item prepared daily at the mess."}
                        </p>

                        <button
                          onClick={() => handleBooking(item)}
                          disabled={item.stockCount === 0}
                          className={`group/btn w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] ${item.stockCount > 0
                              ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                          {item.stockCount > 0 && <Plus size={16} className="group-hover/btn:rotate-90 transition-transform" />}
                          <span>{item.stockCount > 0 ? 'Add to Order' : 'Out of Stock'}</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-center"
                >
                  <div className="text-6xl mb-4 grayscale opacity-50">🥣</div>
                  <h3 className="text-xl font-bold text-slate-800">No Extras Found</h3>
                  <p className="text-slate-500 font-medium mt-2">There are currently no additional items listed for {selectedHall}.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </main>

      {/* QR MODAL (Refined for the new theme) */}
      <AnimatePresence>
        {showQR && bookingDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQR(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white p-8 rounded-[2rem] max-w-sm w-full shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />

              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                  <CheckCircle2 size={28} className="text-emerald-500" />
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-1">Booking Confirmed!</h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                  Present this QR at {bookingDetails.hall} counters
                </p>

                <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 shadow-inner mb-8 transition-all hover:scale-[1.02]">
                  <QRCodeSVG value={bookingDetails.token} size={180} />
                </div>

                <div className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-left mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Item</span>
                    <span className="font-bold text-slate-800">{bookingDetails.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount</span>
                    <span className="text-lg font-black text-indigo-600">₹{bookingDetails.price}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowQR(false)}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                >
                  Close & Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExtrasPage;