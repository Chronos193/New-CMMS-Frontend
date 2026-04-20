import { useState } from "react";

export default function RebateForm({ onSubmit }) {
  const [form, setForm] = useState({
    rollNo: "",
    hallNo: "",
    startDate: "",
    endDate: "",
    days: 0,
    reason: "",
  });
  const [dateError, setDateError] = useState("");

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diff = (e - s) / (1000 * 60 * 60 * 24) + 1;
    return diff > 0 ? diff : 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updated = { ...form, [name]: value };

    if (name === "startDate") {
      // If the new start date is after the current end date, reset end date.
      if (updated.endDate && value > updated.endDate) {
        updated.endDate = "";
        updated.days = 0;
      } else {
        updated.days = calculateDays(value, updated.endDate);
      }
      setDateError("");
    } else if (name === "endDate") {
      updated.days = calculateDays(updated.startDate, value);
      setDateError("");
    }

    setForm(updated);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.startDate || !form.endDate) {
      setDateError("Please select both start and end dates.");
      return;
    }
    if (form.endDate < form.startDate) {
      setDateError("End date cannot be before start date.");
      return;
    }

    setDateError("");
    onSubmit(form); // send data to parent
  };
  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-2xl">
      <h2 className="text-xl font-bold text-blue-600 mb-4">
        Apply for Rebate
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="rollNo"
          placeholder="Roll Number"
          value={form.rollNo}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="hallNo"
          placeholder="Hall Number"
          value={form.hallNo}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            min={form.startDate || undefined}
            className="border p-2 rounded"
          />
        </div>

        {dateError && (
          <p className="text-red-500 text-sm">{dateError}</p>
        )}

        <input
          type="number"
          value={form.days}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
        />

        <textarea
          name="reason"
          placeholder="Reason"
          value={form.reason}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
}