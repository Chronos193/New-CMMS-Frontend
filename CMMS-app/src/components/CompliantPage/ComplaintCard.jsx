import { Clock } from "lucide-react";

export default function ComplaintCard({ item }) {
  const statusStyles = {
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
      label: "Pending",
    },
    in_progress: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-500",
      label: "In Progress",
    },
    resolved: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
      label: "Resolved",
    },
  };

  const style = statusStyles[item.status] || {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
    label: item.status,
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-center mb-3">
        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
          {item.category}
        </span>

        <span
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${style.bg} ${style.text} ${style.border}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
          {style.label}
        </span>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed font-medium">
        {item.content}
      </p>

      <div className="flex items-center gap-1.5 mt-3">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <p className="text-xs text-slate-400 font-medium">
          Submitted on {item.date}
        </p>
      </div>
    </div>
  );
}