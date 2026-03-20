import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, MessageSquarePlus } from "lucide-react";
import ComplaintForm from "../components/CompliantPage/ComplaintForm";
import ComplaintCard from "../components/CompliantPage/ComplaintCard";
import NavBar from "../components/utils/NavBar";
import api from "../Api";

export default function ComplaintPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const [feedbackRes, profileRes, notifRes] = await Promise.all([
          api.get("/api/feedbacks/"),
          api.get("/api/profile/"),
          api.get("/api/notifications/"),
        ]);
        setComplaints(feedbackRes.data);
        setProfile(profileRes.data);
        setNotifications(notifRes.data?.results || notifRes.data || []);
      } catch (error) {
        console.error("Error initializing complaint page:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleOpenNotifications = async () => {
    const hasUnseen = notifications.some((n) => n.category === "unseen");
    if (!hasUnseen) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, category: "seen" })));
    try {
      await api.post("/api/notifications/mark-seen/");
    } catch (error) {
      console.error("Failed to mark notifications as seen:", error);
    }
  };

  const addComplaint = async (data) => {
    try {
      await api.post("/api/feedbacks/", data);
      // Re-fetch to get all server-generated fields (date, status, id)
      const fetchRes = await api.get("/api/feedbacks/");
      setComplaints(fetchRes.data);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden relative">
      <NavBar
        profile={profile}
        notifications={notifications}
        onOpenNotifications={handleOpenNotifications}
      />

      {/* Background Blobs */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-300/20 rounded-full blur-[100px] pointer-events-none" />

      <main className="flex-grow flex flex-col items-center px-4 py-8 md:py-12 relative z-10 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">
              Loading feedbacks...
            </p>
          </div>
        ) : (
          <div className="max-w-2xl w-full space-y-8">

            {/* Header */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur opacity-20" />
              <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 md:px-10 md:py-8 border border-white/50 shadow-xl overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center shadow-sm">
                    <MessageSquarePlus className="w-7 h-7 text-indigo-600" strokeWidth={2} />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
                      Feedback & Complaints
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                      Submit your feedback or complaint and track its status
                    </p>
                  </div>
                </div>
                <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none" />
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <ComplaintForm onSubmit={addComplaint} />
            </motion.div>

            {/* Complaints List */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4 tracking-tight">
                Previously Submitted
              </h2>

              {complaints.length > 0 ? (
                <div className="space-y-4">
                  {complaints.map((c) => (
                    <motion.div
                      key={c.id}
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    >
                      <ComplaintCard item={c} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
                  <p className="text-slate-400 font-medium">
                    No complaints submitted yet. Use the form above to get started.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}