import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { QRCodeSVG } from 'qrcode.react';
import { Utensils, ArrowLeft, CheckCircle2, ShoppingBag } from 'lucide-react';

const ExtrasPage = () => {
  const navigate = useNavigate();
  const [selectedHall, setSelectedHall] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Mock Data
  const [hallMenus, setHallMenus] = useState({
    "Hall 1": [
      { id: 101, name: 'Veg Noodles', price: 40, stockCount: 5 },
      { id: 102, name: 'Manchurian', price: 50, stockCount: 10 },
    ],
    "Hall 4": [
      { id: 401, name: 'Chicken Biryani', price: 120, stockCount: 2 },
      { id: 402, name: 'Paneer Tikka', price: 80, stockCount: 8 },
    ],
    "GH1": [
      { id: 901, name: 'Pasta', price: 70, stockCount: 15 },
    ]
  });

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
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-900">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/home')} 
          className="flex items-center gap-2 text-indigo-600 font-bold hover:underline transition-all"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        <div className="flex items-center gap-3">
           <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
              <ShoppingBag size={20} className="text-white" />
           </div>
           <h1 className="text-2xl md:text-3xl font-black tracking-tight">Mess Extras Store</h1>
        </div>
        <div className="w-24 hidden md:block"></div> 
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Hall Selection Dropdown */}
        <div className="mb-10 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 max-w-md">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
            Your Location
          </label>
          <select 
            value={selectedHall} 
            onChange={(e) => setSelectedHall(e.target.value)}
            className="w-full p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-indigo-500 bg-gray-50 transition-all font-bold text-gray-700 cursor-pointer"
          >
            <option value="">Select a Hall (1-13, GH1)</option>
            {[...Array(13)].map((_, i) => (
              <option key={i+1} value={`Hall ${i+1}`}>Hall {i+1}</option>
            ))}
            <option value="GH1">GH1</option>
          </select>
        </div>

        {/* Dynamic Content Area */}
        {!selectedHall ? (
          // Empty State with Icon
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-200 shadow-inner flex flex-col items-center justify-center">
            <div className="bg-slate-50 p-8 rounded-full mb-6 border border-slate-100">
                <Utensils size={64} strokeWidth={1.5} className="text-slate-300" />
            </div>
            <p className="text-gray-400 text-lg font-bold tracking-tight">
              Please select a hall to browse today's menu.
            </p>
          </div>
        ) : currentMenu.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentMenu.map((item) => (
              <div key={item.id} className="bg-white p-7 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-black text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {item.name}
                    </h2>
                    <span className="text-indigo-600 font-black text-xl">₹{item.price}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-8">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.stockCount > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    <p className={`text-xs font-black uppercase tracking-widest ${item.stockCount > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {item.stockCount > 0 ? `${item.stockCount} Available` : 'Sold Out'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleBooking(item)}
                  disabled={item.stockCount === 0}
                  className={`w-full py-4 rounded-2xl font-black text-lg transition-all transform active:scale-95 ${
                    item.stockCount > 0 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {item.stockCount > 0 ? 'Book Now' : 'Not Available'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          // No Extras Found State
          <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200 shadow-inner">
            <div className="text-5xl mb-4">🥣</div>
            <h3 className="text-xl font-black text-gray-800">No Extras Today</h3>
            <p className="text-gray-500 mt-2 font-medium">There are currently no items listed for {selectedHall}.</p>
          </div>
        )}
      </div>

      {/* QR MODAL */}
      {showQR && bookingDetails && (
        <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-[3rem] max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-center mb-4">
               <CheckCircle2 size={48} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">Booking Success!</h2>
            <p className="text-gray-400 text-xs mb-8 font-bold uppercase tracking-widest">Show QR at {bookingDetails.hall}</p>
            
            <div className="flex justify-center mb-8 p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-inner">
              <QRCodeSVG value={bookingDetails.token} size={180} />
            </div>

            <div className="bg-indigo-50/50 p-5 rounded-2xl text-left mb-8 border border-indigo-100">
               <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black text-indigo-400 uppercase">Item</span>
                  <span className="font-bold text-sm">{bookingDetails.name}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-indigo-400 uppercase">Price</span>
                  <span className="font-black text-indigo-600">₹{bookingDetails.price}</span>
               </div>
            </div>

            <button 
              onClick={() => setShowQR(false)}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtrasPage;