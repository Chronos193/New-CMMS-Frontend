import { useState } from "react";
import { categories } from "../../constant";
import { Send } from "lucide-react";

export default function ComplaintForm({ onSubmit }) {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !description) {
      alert("Please fill all fields.");
      return;
    }

    setSubmitting(true);
    await onSubmit({
      category,
      content: description,
    });
    setSubmitting(false);
    setCategory("");
    setDescription("");
  };

  return (
    <form
      className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-5"
      onSubmit={handleSubmit}
    >
      <h2 className="text-lg font-bold text-slate-800 tracking-tight">
        Submit New Feedback
      </h2>

      {/* Category */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          Category
        </label>
        <select
          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm appearance-none cursor-pointer transition"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((c, i) => (
            <option key={i}>{c}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          Description
        </label>
        <textarea
          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 h-28 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm transition"
          placeholder="Please describe your complaint or feedback in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transform transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        <Send size={16} strokeWidth={2.5} />
        {submitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}