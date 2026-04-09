import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { apiClient } from "../../api";

const types = ["Overflow Bin", "Illegal Dumping", "Missed Collection", "Damaged Bin", "Foul Smell", "Other"];
const statusColors = {
  Pending: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  "In Review": "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  Resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
};

export default function Complaints() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", type: types[0], description: "", location: "" });

  const load = () => apiClient.complaints(1).then(setItems);

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const created = await apiClient.createComplaint({ ...form, user_id: 1 });
    toast.success(`Complaint logged to blockchain! TX: ${created.tx_hash.slice(0, 10)}...`);
    setOpen(false);
    setForm({ title: "", type: types[0], description: "", location: "" });
    load();
  };

  const counts = {
    Total: items.length,
    Pending: items.filter((item) => item.status === "Pending").length,
    "In Review": items.filter((item) => item.status === "In Review").length,
    Resolved: items.filter((item) => item.status === "Resolved").length,
  };

  return (
    <div className="relative space-y-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">My Complaints</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track and raise service issues with on-chain audit visibility.</p>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">
          <Plus className="mr-2 inline" size={16} />
          Raise Complaint
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {Object.entries(counts).map(([label, value]) => (
          <span key={label} className="rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700">
            {label}: {value}
          </span>
        ))}
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[item.status]}`}>{item.status}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800">{item.type}</span>
            </div>
            <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span>{item.location}</span>
              <span>{new Date(item.created_at).toLocaleDateString("en-IN")}</span>
              <span title={item.tx_hash}>View on Blockchain</span>
            </div>
          </div>
        ))}
      </div>

      <div className={`absolute inset-y-0 right-0 z-30 w-full max-w-md transform border-l border-slate-200 bg-white p-6 shadow-2xl transition ${open ? "translate-x-0" : "translate-x-full"} dark:border-slate-800 dark:bg-slate-950`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Raise Complaint</h3>
          <button type="button" onClick={() => setOpen(false)} className="text-sm text-slate-500">Close</button>
        </div>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <input required value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Title" className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700" />
          <select value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700">
            {types.map((type) => <option key={type}>{type}</option>)}
          </select>
          <textarea required value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} rows="5" placeholder="Description" className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700" />
          <input required value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} placeholder="e.g. Near Main Bazaar Gate 2" className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700" />
          <input type="file" accept="image/*" className="w-full rounded-2xl border border-dashed border-slate-300 p-3 dark:border-slate-700" />
          <button type="submit" className="w-full rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white">Submit Complaint</button>
        </form>
      </div>
    </div>
  );
}
