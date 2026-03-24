import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, CheckCircle2, Utensils, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '../components/utils/NavBar';
import api from '../Api';
import { useCart } from '../components/CartPage/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartChanges, removeFromCart, fetchCartSync, clearCart, loading: cartLoading, addToCart } = useCart();
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Remote Checkout Data
  const [checkoutData, setCheckoutData] = useState([]);
  
  // Profile & Notifications state for NavBar
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, notifRes] = await Promise.all([
          api.get('/api/profile/'),
          api.get('/api/notifications/')
        ]);
        setProfile(profileRes.data);
        setNotifications(notifRes.data?.results || notifRes.data || []);
        
        // Context already syncs on mount, but we can force it if needed
        await fetchCartSync();
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchDashboardData();
  }, []);

  const cartTotal = cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);

  const handleDelete = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleAdd = async (item) => {
    await addToCart(item);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await api.post('/api/cart/checkout/');
      setCheckoutData(res.data.details || []);
      setShowQR(true);
      clearCart();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseQR = () => {
    setShowQR(false);
    navigate('/my-bookings');
  } ;

  const navLinks = [
    { name: "Daily Menu", path: "/menu" },
    { name: "Extra Meals", path: "/extras" },
    { name: "Leaves & Rebates", path: "/rebate" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <NavBar
        profile={profile}
        notifications={notifications}
        navLinks={navLinks}
      />

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <button
          onClick={() => navigate('/extras')}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Menu
        </button>

        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            Your Cart
          </h1>
          <p className="text-slate-500 font-medium">
            Review your selection and proceed to checkout.
          </p>
        </header>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
              <ShoppingBag className="text-slate-300 w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Your cart is empty</h3>
            <p className="text-slate-500 font-medium mb-8">Looks like you haven't added anything yet.</p>
            <button
              onClick={() => navigate('/extras')}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
            >
              Exlpore Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartChanges.length > 0 && (
                <div className="bg-amber-50 text-amber-800 p-4 rounded-xl mb-6 border border-amber-200 text-sm">
                  <h4 className="font-bold mb-2">Cart Updates:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {cartChanges.map((change, idx) => (
                      <li key={idx}>{change.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                    <Utensils className="text-slate-300 w-8 h-8" />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{item.name}</h3>
                    <p className="text-indigo-600 font-bold">₹{item.price}</p>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">{item.hall}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
                      <button
                        onClick={() => handleDelete(item.itemId)}
                        className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-500"
                      >
                        {item.quantity === 1 ? <Trash2 size={16} className="text-rose-500" /> : <Minus size={16} />}
                      </button>
                      <span className="w-8 text-center font-bold text-slate-700">{item.quantity}</span>
                      <button
                        onClick={() => handleAdd(item)}
                        disabled={item.quantity >= item.availableCount}
                        className={`p-1 rounded-md transition-all ${
                          item.quantity >= item.availableCount 
                            ? 'text-slate-200 cursor-not-allowed' 
                            : 'hover:bg-white hover:shadow-sm text-slate-500'
                        }`}
                        title={item.quantity >= item.availableCount ? "Maximum available stock reached" : "Add more"}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    {item.quantity >= item.availableCount && (
                      <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                        MAX REACHED
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-32">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-slate-500 font-medium">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 font-medium">
                    <span>Tax</span>
                    <span>₹0</span>
                  </div>
                  <div className="h-px bg-slate-100 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-black text-indigo-600">₹{cartTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:bg-slate-300"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                  <span>Place Order</span>
                </button>

                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6">
                  Items will be billed to your mess account
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Loader Backdrop */}
      <AnimatePresence>
        {(cartLoading || loading) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
              <ShoppingBag className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-indigo-600 w-6 h-6" />
            </div>
            <p className="text-slate-900 font-bold text-lg animate-pulse">Syncing Cart...</p>
            <p className="text-slate-400 text-xs font-medium mt-1">Checking mess availability & prices</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR MODAL */}
      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseQR}
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

                <h2 className="text-2xl font-bold text-slate-900 mb-1">Order Placed!</h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                  Present QR code at counters
                </p>

                <div className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl text-center mb-8">
                  <p className="text-sm font-medium text-slate-600 leading-relaxed">
                    Your order has been successfully placed and billed to your account. You can find your collection QR codes in the bookings section.
                  </p>
                </div>

                  <button
                    onClick={handleCloseQR}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                  >
                    View My Bookings
                  </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;
