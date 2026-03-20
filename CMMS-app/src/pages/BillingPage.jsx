import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, Receipt, ArrowLeft, Info, Calendar, ShieldCheck, Coffee, Download, AlertCircle } from 'lucide-react';

const BillingPage = () => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);

  // --- MOCK DATA ---
  const studentName = "Kavita Kumari";
  const rollNo = "230552";
  const hall = "H6";
  const billMonth = "March 2026";
  const dueDate = "April 10, 2026"; 
  const totalDaysInMonth = 31;
  const messClosureDays = 2; 
  const studentRebateDays = 5; 
  const billableDays = totalDaysInMonth - messClosureDays - studentRebateDays;
  
  const basicMessBill = 2280; 
  const extrasHistory = [
    { id: 1, date: '2026-03-18', item: 'Chicken Noodles', hall: 'Hall 1', price: 40 },
    { id: 2, date: '2026-03-15', item: 'Chicken Biryani', hall: 'Hall 4', price: 120 },
    { id: 3, date: '2026-03-12', item: 'Chicken Lollipop', hall: 'Hall 13', price: 20 },
  ];

  const totalExtras = extrasHistory.reduce((sum, item) => sum + item.price, 0);
  const grandTotal = basicMessBill + totalExtras;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert(`Receipt for ${billMonth} downloaded successfully!`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <button 
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-indigo-600 font-bold hover:opacity-80 transition w-fit"
          >
            <ArrowLeft size={20} /> Back to Dashboard
          </button>
          <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm border border-amber-200">
            <AlertCircle size={14} /> PAYMENT DUE: {dueDate}
          </div>
        </div>

        {/* STUDENT PROFILE & ATTENDANCE SUMMARY - HIGH PRECISION VERSION */}
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
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {extrasHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-indigo-50/20 transition-colors group">
                        <td className="px-8 py-6 text-sm font-bold text-slate-400">{item.date}</td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{item.item}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{item.hall}</p>
                        </td>
                        <td className="px-8 py-6 text-sm font-black text-slate-900 text-right">₹{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-slate-50/50 text-center border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic tracking-widest">END OF STATEMENT</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;