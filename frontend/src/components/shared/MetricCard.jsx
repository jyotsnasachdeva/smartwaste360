export default function MetricCard({ label, value, subtext, accent = "brand" }) {
  const accentClass = accent === "municipal" ? "from-blue-500/15 to-indigo-500/5" : "from-emerald-500/15 to-teal-500/5";
  return (
    <div className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${accentClass} p-5 shadow-panel dark:border-slate-800`}>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {subtext ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtext}</p> : null}
    </div>
  );
}
