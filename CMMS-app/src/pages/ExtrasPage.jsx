import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Utensils, ArrowLeft, CheckCircle2, ShoppingBag, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '../components/utils/NavBar';
import api from '../Api';
import { useCart } from '../components/CartPage/CartContext';

const ExtrasPage = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, fetchCartSync } = useCart();
  const [selectedHall, setSelectedHall] = useState("");
  const [addingItemId, setAddingItemId] = useState(null);

  useEffect(() => {
    fetchCartSync();
  }, []);

  // Profile & Notifications state for NavBar
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);


  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    // Fetch real API data for NavBar
    const fetchDashboardData = async () => {
      try {
        const [profileRes, notifRes, hallsRes] = await Promise.all([
          api.get('/api/profile/'),
          api.get('/api/notifications/'),
          api.get('/api/halls/')
        ]);
        setProfile(profileRes.data);
        setNotifications(notifRes.data?.results || notifRes.data || []);
        setHalls(hallsRes.data || []);
        
        // If profile has a hall_of_residence, we might want to default the select to it
        if (profileRes.data?.hall_of_residence) {
            setSelectedHall(profileRes.data.hall_of_residence);
        } else if (hallsRes.data?.length > 0) {
            setSelectedHall(hallsRes.data[0].name || hallsRes.data[0].id);
        }
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
        setHalls([{id: 1, name: 'Hall 1'}, {id: 2, name: 'Hall 2'}, {id: 3, name: 'GH1'}]);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch bookings whenever selectedHall changes (or we can just fetch all if hall_id maps nicely)
  useEffect(() => {
    const fetchBookings = async () => {
      setLoadingBookings(true);
      try {
        // If we know how to map selectedHall to hall_id, we could append it: `?hall_id=${hallId}`
        // For now, we'll try fetching without hall_id and rely on the backend's default (user's hall)
        // Or we pass the selectedHall string if backend expects string. Assuming we just fetch and let backend handle.
        const res = await api.get('/api/bookings/');
        setBookings(res.data || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
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

  const formatItemDetails = (b) => {
    const itemId = b.item?.id || b.item_id || b.item;
    const name = b.item?.name || b.item_name || 'Extra Item';
    const price = b.item?.cost || b.item_cost || b.cost || b.item?.price || b.item_price || b.price || 0;
    const stockCount = b.available_count !== undefined ? b.available_count : (b.stockCount || 0);
    const description = b.item?.description || b.description || "Fresh and hot extra item prepared daily at the mess.";
    const hallName = b.hall?.name || b.hall_name || b.hall;
    
    // format time string e.g. "Tue, 6:00 PM"
    const timeStr = b.day_and_time ? new Intl.DateTimeFormat('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(b.day_and_time)) : '';

    return { ...b, itemId, name, price, stockCount, description, hallName, timeStr, mappedHall: String(hallName) };
  };

  const processedBookings = bookings.map(formatItemDetails);

  // If selectedHall is chosen, filter by hall. If not, show all bookings.
  const currentMenu = processedBookings.filter(b => {
    if (!selectedHall) return true;
    const shStr = String(selectedHall).toLowerCase();
    const bhStr = b.mappedHall.toLowerCase();
    return bhStr === shStr || bhStr === `hall ${shStr}` || `hall ${bhStr}` === shStr;
  });

  const handleBooking = async (item) => {
    if (addingItemId === item.id) return;
    setAddingItemId(item.id);

    try {
      // Add to cart safely via CartContext (which handles the API call and sync)
      await addToCart(item);
    } catch (err) {
      console.error("Failed to add to cart on backend:", err);
      alert("Failed to add to cart");
    } finally {
      setAddingItemId(null);
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
                      {halls.map((h, i) => (
                        <option key={h.id || i} value={h.name || h.id}>{h.name || `Hall ${h.id}`}</option>
                      ))}
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
                      className="group bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col gap-1.5 pr-4">
                          <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {item.name}
                          </h3>
                          {item.timeStr && (
                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                              {item.timeStr} &bull; {item.mappedHall}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="text-2xl font-black text-slate-900">₹{item.price}</span>
                          {/* Available Badge */}
                          {item.stockCount > 0 ? (
                            <div className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm">
                              Avail: {item.stockCount}
                            </div>
                          ) : (
                            <div className="bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm">
                              Sold Out
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                        {item.description || "Fresh and hot extra item prepared daily at the mess."}
                      </p>

                    {(() => {
                      const currentCartItem = cartItems.find(ci => ci.itemId === item.itemId);
                      const quantityInCart = currentCartItem ? currentCartItem.quantity : 0;
                      const isMaxReached = quantityInCart >= item.stockCount;

                      return (
                        <button
                          onClick={() => handleBooking(item)}
                          disabled={item.stockCount === 0 || addingItemId === item.id || isMaxReached}
                          className={`group/btn w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] ${
                              item.stockCount > 0 && addingItemId !== item.id && !isMaxReached
                              ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                          {addingItemId === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            item.stockCount > 0 && !isMaxReached && <Plus size={16} className="group-hover/btn:rotate-90 transition-transform" />
                          )}
                          <span>
                            {addingItemId === item.id 
                              ? 'Adding...' 
                              : item.stockCount === 0 
                                ? 'Out of Stock' 
                                : isMaxReached 
                                  ? 'Max Reached' 
                                  : 'Add to Order'}
                          </span>
                        </button>
                      );
                    })()}
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
    </div>
  );
};

export default ExtrasPage;