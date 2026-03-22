import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, Receipt, ArrowLeft, Info, Calendar, ShieldCheck, Coffee, Download, AlertCircle, Loader2 } from 'lucide-react';
import api from '../Api';
import NavBar from '../components/utils/NavBar';

const BillingPage = () => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // New State variables
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [bills, setBills] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('March');
  
  // Available months (just month names now, backend assumes current year)
  const availableMonths = [
    "January", "February", "March", 
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
  ];

  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        const [profileRes, notifRes] = await Promise.all([
          api.get('/api/profile/').catch(() => ({ data: {} })),
          api.get('/api/notifications/').catch(() => ({ data: [] }))
        ]);
        setProfile(profileRes.data);
        setNotifications(notifRes.data?.results || notifRes.data || []);
      } catch (error) {
        console.error('Failed to fetch base data:', error);
      }
    };
    fetchBaseData();
  }, []);

  useEffect(() => {
    const fetchBillingData = async () => {
      setLoading(true);
      try {
        // Pass the target month to force backend to return data for that month 
        // even if no extra meal bookings exist.
        const billingsRes = await api.get(`/api/mess-bill/?month=${encodeURIComponent(selectedMonth)}`).catch(() => ({ data: [] }));
        
        const billsData = Array.isArray(billingsRes.data) ? billingsRes.data : [];
        setBills(billsData);
      } catch (error) {
        console.error('Failed to fetch billing data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (selectedMonth) {
        fetchBillingData();
    }
  }, [selectedMonth]);

  const handleOpenNotifications = async () => {
      const hasUnseen = notifications.some(n => n.category === 'unseen');
      if (!hasUnseen) return;
      setNotifications(prev => prev.map(n => ({ ...n, category: 'seen' })));
      try {
          await api.post('/api/notifications/mark-seen/');
      } catch (error) {
          console.error('Failed to mark notifications as seen', error);
      }
  };

  const currentBill = bills.find(b => b.month === selectedMonth) || bills[0] || {};
  
  const studentName = profile?.name || "Student";
  const rollNo = profile?.roll_no || "N/A";
  const hall = typeof profile?.hall_of_residence === 'object' ? profile.hall_of_residence?.name : (profile?.hall_of_residence || "N/A");
  
  const billMonth = currentBill.month || "Current Month";
  const dueDate = "10th of Next Month"; 
  
  const getDaysInMonth = (monthStr) => {
      if (!monthStr || monthStr === "Current Month") return 30;
      const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const monthIndex = monthNames.indexOf(monthStr);
      if (monthIndex === -1) return 30;
      const year = new Date().getFullYear();
      return new Date(year, monthIndex + 1, 0).getDate();
  };
  const totalDaysInMonth = getDaysInMonth(billMonth);
  const messClosureDays = 0; 
  const studentRebateDays = currentBill.rebate_days || 0; 
  const billableDays = totalDaysInMonth - messClosureDays - studentRebateDays;
  
  const basicMessBill = currentBill.total_fixed_charges || 0; 
  const totalExtras = currentBill.total_item_cost || 0;
  const rebateRefund = currentBill.rebate_refund || 0;
  // Ensure the grand total doesn't go below 0 if rebate refund is very large
  const grandTotal = Math.max(0, currentBill.total_bill || 0);

  const handleDownload = () => {
    setIsDownloading(true);
    
    // Quick approach using html2pdf via CDN
    const element = document.getElementById('billing-content');
    if (!element) return;
    
    const opt = {
      margin:       0.5,
      filename:     `MessBill_${billMonth.replace(' ', '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    if (typeof window.html2pdf === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        window.html2pdf().set(opt).from(element).save().then(() => setIsDownloading(false));
      };
      document.body.appendChild(script);
    } else {
      window.html2pdf().set(opt).from(element).save().then(() => setIsDownloading(false));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 relative">
      <NavBar profile={profile} notifications={notifications} navLinks={[
        { name: "Daily Menu", path: "/menu" },
        { name: "Extra Meals", path: "/page-2" },
        { name: "Leaves & Rebates", path: "/page-3" },
      ]} onOpenNotifications={handleOpenNotifications} />
      <div className="max-w-5xl mx-auto p-4 md:p-10 w-full">
        
        {/* Navigation & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 text-indigo-600 font-bold hover:opacity-80 transition w-fit"
            >
              <ArrowLeft size={20} /> Back to Dashboard
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-500">Month:</span>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-white border border-indigo-100 text-indigo-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 font-bold shadow-sm outline-none cursor-pointer"
              >
                {availableMonths.map(m => (
                   <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm border border-amber-200">
            <AlertCircle size={14} /> PAYMENT DUE: {dueDate}
          </div>
        </div>

        {/* STUDENT PROFILE & ATTENDANCE SUMMARY - HIGH PRECISION VERSION */}
        <div id="billing-content">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-8 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 h-14 w-14 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-indigo-100">
              {studentName[0]}
            </div>
            <div>
              <h2 className="font-black text-slate-800 text-xl leading-none">{studentName}</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Roll: {rollNo} • {hall}</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Month Days</p>
              <p className="font-black text-slate-800">{totalDaysInMonth}</p>
            </div>

            <div className="flex flex-col items-center border-l border-slate-100 pl-6 md:pl-10 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mess Open</p>
              <p className="font-black text-slate-800">{totalDaysInMonth - messClosureDays} <span className="text-[10px] text-slate-400 font-medium ml-1">Days</span></p>
              <p className="text-[9px] text-amber-500 font-bold mt-1 uppercase tracking-tighter">({messClosureDays} Closed)</p>
            </div>

            <div className="flex flex-col items-center border-l border-slate-100 pl-6 md:pl-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Your Rebates</p>
              <p className="font-black text-emerald-600">-{studentRebateDays} Days</p>
            </div>

            <div className="flex flex-col items-center border-l border-slate-100 pl-6 md:pl-10">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Net Billable</p>
              <p className="font-black text-indigo-600 border-b-2 border-indigo-100 inline-block">{billableDays} Days</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* TOTAL DUES & DOWNLOAD */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-indigo-100 text-xs font-black uppercase tracking-widest mb-2">{billMonth.toUpperCase()} BILL SUMMARY</p>
                <h2 className="text-5xl font-black flex items-center mb-8">
                  <IndianRupee size={40} strokeWidth={3} /> {grandTotal}
                </h2>
                
                <div className="space-y-4 pt-6 border-t border-indigo-400/50 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-80 flex items-center gap-2"><Calendar size={14}/> Basic Mess Bill</span>
                    <span className="font-bold">₹{basicMessBill}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-indigo-200">
                    <span className="opacity-80 flex items-center gap-2">(- Rebate Refund)</span>
                    <span className="font-bold">-₹{rebateRefund}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-80 flex items-center gap-2"><Coffee size={14}/> Extras Total</span>
                    <span className="font-bold">₹{totalExtras}</span>
                  </div>
                </div>

                <button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-50 transition shadow-lg disabled:opacity-50"
                >
                  <Download size={18} />
                  {isDownloading ? 'GENERATING PDF...' : `DOWNLOAD ${billMonth.split(' ')[0].toUpperCase()} BILL`}
                </button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex gap-4 items-start shadow-sm">
              <div className="bg-amber-50 text-amber-500 p-2 rounded-xl"><ShieldCheck size={20}/></div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">BILLING POLICY</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
                  Basic bill is calculated based on net billable days. Please pay by <span className="font-bold text-slate-700">{dueDate}</span> to avoid late fines.
                </p>
              </div>
            </div>
          </div>

          {/* EXTRAS LEDGER */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-7 border-b border-slate-50 flex items-center gap-3">
                <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl"><Receipt size={20}/></div>
                <h3 className="font-black text-slate-800 uppercase tracking-widest">EXTRAS TRANSACTION HISTORY</h3>
              </div>
              
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    <p className="text-slate-500 font-medium text-sm animate-pulse">Loading billing statements...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-slate-50/30">
                    {(!currentBill.items_bought || currentBill.items_bought.length === 0) ? (
                      <div className="col-span-full py-12 text-center text-slate-400 font-medium text-sm flex flex-col items-center justify-center space-y-3">
                        <Receipt className="w-10 h-10 text-slate-200" />
                        <p>No transaction history found.</p>
                      </div>
                    ) : (
                      currentBill.items_bought.map((item, idx) => (
                        <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group flex flex-col justify-between items-start relative overflow-hidden">
                          {/* Decorative accent */}
                          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          
                          <div className="flex justify-between w-full items-start gap-4">
                              <div>
                                <h4 className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
                                  {item.item_name}
                                </h4>
                                <div className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 inline-block px-2 py-1 rounded-md">
                                  {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                              </div>
                              <div className="text-right flex flex-col items-end">
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-[10px] text-slate-400 font-black">₹</span>
                                    <span className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{item.total_cost}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-bold tracking-tight mt-1 bg-indigo-50/50 text-indigo-500 px-2 py-0.5 rounded-full">
                                    {item.quantity} × ₹{item.cost_per_item}
                                  </div>
                              </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <div className="p-6 bg-slate-50/50 text-center border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic tracking-widest">END OF STATEMENT</p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;