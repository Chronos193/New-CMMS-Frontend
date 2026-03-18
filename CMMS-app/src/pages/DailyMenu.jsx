import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, LayoutGrid, CalendarDays } from "lucide-react";
import NavBar from "../components/utils/NavBar";
import api from "../Api";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const mealOrder = ["Breakfast", "Lunch", "Snacks", "Dinner"];

export default function DailyMenu() {
  const [viewMode, setViewMode] = useState("single"); // "single" | "weekly"
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedHallId, setSelectedHallId] = useState("");
  const [hostels, setHostels] = useState([]);
  const [weeklyMenuData, setWeeklyMenuData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const authRes = await api.get('/api/my/');
        if (!authRes.data.is_logged_in) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }
        setIsLoggedIn(true);

        const [hallsRes, profileRes, notifRes] = await Promise.all([
          api.get('/api/halls/'),
          api.get('/api/profile/'),
          api.get('/api/notifications/')
        ]);
        
        const fetchedHalls = hallsRes.data;
        setHostels(fetchedHalls);
        setProfile(profileRes.data);
        setNotifications(notifRes.data?.results || notifRes.data || []);

        // Default Hall selection logic
        const userHallId = profileRes.data?.hall_of_residence?.id || profileRes.data?.hall_of_residence;
        if (userHallId && fetchedHalls.find(h => h.id === userHallId)) {
          setSelectedHallId(userHallId);
        } else if (fetchedHalls.length > 0) {
          setSelectedHallId(fetchedHalls[0].id);
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setIsLoggedIn(false);
        setLoading(false);
      }
    };
    init();
  }, []);


  useEffect(() => {
    if (isLoggedIn === false || isLoggedIn === null) return;

    const fetchMenu = async () => {
      try {
        setLoading(true);
        const url = selectedHallId ? `/api/menu/?hall_id=${selectedHallId}` : '/api/menu/';
        const response = await api.get(url);
        const data = response.data;
        
        const formattedData = {};
        days.forEach(day => {
          formattedData[day] = {};
          mealOrder.forEach(meal => {
            formattedData[day][meal] = [];
          });
        });

        data.forEach(item => {
          if (formattedData[item.day] && formattedData[item.day][item.meal_time]) {
            formattedData[item.day][item.meal_time].push({
              name: item.dish,
              category: item.category || ""
            });
          }
        });

        setWeeklyMenuData(formattedData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
        setError("Failed to load menu data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [selectedHallId, isLoggedIn]);

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
    { name: "Extra Meals", path: "/page-2" },
    { name: "Leaves & Rebates", path: "/page-3" },
  ];

  const handlePrevDay = () => {
    const currentIndex = days.indexOf(selectedDay);
    if (currentIndex > 0) {
      setSelectedDay(days[currentIndex - 1]);
    } else {
      setSelectedDay(days[days.length - 1]);
    }
  };

  const handleNextDay = () => {
    const currentIndex = days.indexOf(selectedDay);
    if (currentIndex < days.length - 1) {
      setSelectedDay(days[currentIndex + 1]);
    } else {
      setSelectedDay(days[0]);
    }
  };

  const MealCard = ({ title, items = [], isWeeklyLayout = false }) => {
    if (items.length === 0) return null;
    return (
      <div className={`bg-white border border-slate-200 rounded-xl p-5 shadow-sm ${isWeeklyLayout ? 'min-w-[280px]' : ''}`}>
        <div className="mb-4">
          <span className="bg-blue-600/90 text-white text-sm font-semibold px-3 py-1.5 rounded-lg shadow-sm">
            {title}
          </span>
        </div>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center border-b border-slate-50 last:border-0 pb-2 last:pb-0">
              <span className="text-slate-800 font-medium text-sm">{item.name}</span>
              {item.category && <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{item.category}</span>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoggedIn === false) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
        <NavBar profile={profile} notifications={notifications} navLinks={navLinks} onOpenNotifications={handleOpenNotifications} />
        <main className="flex-grow flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Access Denied</h2>
            <p className="text-slate-500 mb-6 font-medium">You must be logged in to view the mess menu.</p>
            <a href="/login" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition inline-block">Go to Login</a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <NavBar profile={profile} notifications={notifications} navLinks={navLinks} onOpenNotifications={handleOpenNotifications} />

      <main className="flex-grow flex flex-col px-6 md:px-12 py-8 w-full max-w-[1400px] mx-auto overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6 mb-6">
          <div>
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit mb-4 md:hidden">
                <button
                  onClick={() => setViewMode("single")}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${viewMode === "single" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"}`}
                >
                  <LayoutGrid className="w-4 h-4" /> Single Day
                </button>
                <button
                  onClick={() => setViewMode("weekly")}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${viewMode === "weekly" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"}`}
                >
                  <CalendarDays className="w-4 h-4" /> Weekly View
                </button>
            </div>
            
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-blue-600/90 text-white px-5 py-2 rounded-xl shadow-md">
                Mess Menu
              </h1>
              <span className="text-slate-500 font-medium text-sm hidden md:inline-block tracking-wider">Weekly meal schedule</span>
            </div>
            <span className="text-slate-500 font-medium text-sm mt-2 block md:hidden tracking-wider">Weekly meal schedule</span>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <span className="text-slate-700 font-bold text-sm">Hostel:</span>
            <div className="relative">
              <select 
                value={selectedHallId}
                onChange={(e) => setSelectedHallId(e.target.value)}
                className="bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2.5 outline-none shadow-sm pr-10 appearance-none cursor-pointer"
                style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 55%', backgroundSize: '.65rem auto' }}
              >
                {hostels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Controls Section (Desktop) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex items-center w-full md:w-auto">
            {viewMode === "single" ? (
              <div className="flex flex-1 md:flex-none items-center justify-between md:justify-start gap-3">
                <button onClick={handlePrevDay} className="p-2.5 bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-blue-600 hover:border-blue-200 rounded-xl transition">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="bg-white border shadow-sm border-slate-200 text-slate-700 font-bold text-sm rounded-xl px-4 py-2.5 outline-none min-w-[140px] text-center flex-1 md:flex-none appearance-none cursor-pointer"
                  style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto' }}
                >
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <button onClick={handleNextDay} className="p-2.5 bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-blue-600 hover:border-blue-200 rounded-xl transition">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
                <div className="w-full flex-1"></div>
            )}
          </div>

          <div className="hidden md:flex bg-slate-200/50 p-1.5 rounded-xl shadow-inner">
            <button
              onClick={() => setViewMode("single")}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${viewMode === "single" ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"}`}
            >
              <LayoutGrid className="w-4 h-4" /> Single Day
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${viewMode === "weekly" ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"}`}
            >
              <CalendarDays className="w-4 h-4" /> Weekly View
            </button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center items-center py-20 flex-grow">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center font-medium my-10 border border-red-200 shadow-sm">{error}</div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === "single" ? (
              <motion.div
                key="single"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {weeklyMenuData[selectedDay] && mealOrder.map(meal => (
                  <MealCard key={meal} title={meal} items={weeklyMenuData[selectedDay][meal]} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="weekly"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
              >
                <div className="flex gap-6 min-w-max">
                  {days.map(day => (
                    <div key={day} className="flex flex-col gap-5">
                      <h3 className="text-slate-800 font-extrabold text-base mb-1 border-b-[3px] border-orange-400 inline-block pb-1.5 w-full">
                        {day}
                      </h3>
                      {mealOrder.map(meal => (
                         <MealCard key={meal} title={meal} items={weeklyMenuData[day]?.[meal]} isWeeklyLayout />
                      ))}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

      </main>
    </div>
  );
}