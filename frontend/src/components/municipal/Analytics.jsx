import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import MetricCard from "../shared/MetricCard";

const dailyWaste = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
  day,
  kg: Math.round(800 + Math.random() * 600),
  recyclable: Math.round(220 + Math.random() * 80),
  incorrect: Math.round(30 + Math.random() * 20),
  nonRecyclable: Math.round(130 + Math.random() * 50),
  incidents: Math.round(Math.random() * 6),
  baseline: Math.round(65 + Math.random() * 12),
  optimized: Math.round(42 + Math.random() * 10),
  bin1: Math.round(40 + Math.random() * 20),
  bin2: Math.round(45 + Math.random() * 25),
  bin3: Math.round(35 + Math.random() * 30),
  bin4: Math.round(30 + Math.random() * 35),
  bin5: Math.round(25 + Math.random() * 40),
}));

const composition = [
  { name: "Plastic", value: 32, color: "#10b981" },
  { name: "Organic", value: 28, color: "#14b8a6" },
  { name: "Paper", value: 18, color: "#f59e0b" },
  { name: "Metal", value: 12, color: "#3b82f6" },
  { name: "Glass", value: 6, color: "#06b6d4" },
  { name: "Other", value: 4, color: "#94a3b8" },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <input value="Last 7 days" readOnly className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700" />
        <button type="button" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700">Export PDF</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Total Waste Collected" value="8,720 kg" accent="municipal" />
        <MetricCard label="Avg Bin Fill Time" value="11.4 hours" accent="municipal" />
        <MetricCard label="Fuel Saved This Month" value="82 litres" accent="municipal" />
        <MetricCard label="CO₂ Avoided" value="189 kg" accent="municipal" />
        <MetricCard label="Active Citizens" value="2,341" accent="municipal" />
        <MetricCard label="Complaints Resolved" value="42/51" accent="municipal" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Daily Waste Collected (kg)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyWaste}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="kg" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Top 5 Bins Fill Rate Trend">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyWaste}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              {["bin1", "bin2", "bin3", "bin4", "bin5"].map((key, index) => (
                <Line key={key} type="monotone" dataKey={key} stroke={["#10b981", "#3b82f6", "#f59e0b", "#14b8a6", "#6366f1"][index]} strokeWidth={2} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Waste Composition">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={composition} dataKey="value" nameKey="name" outerRadius={90} label>
                {composition.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Daily Classification Activity">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyWaste}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="recyclable" stackId="a" fill="#10b981" />
              <Bar dataKey="incorrect" stackId="a" fill="#f59e0b" />
              <Bar dataKey="nonRecyclable" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Illegal Dumping Incidents">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyWaste}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Route Efficiency vs Baseline">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyWaste}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="baseline" fill="#94a3b8" />
              <Bar dataKey="optimized" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xl font-semibold">SDG 11.6 Compliance Dashboard</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            ["Waste Diversion Rate", "67.3%", "70%", "96%"],
            ["Collection Efficiency", "+43% improvement", "50%", "86%"],
            ["Emission Reduction", "38.2% vs baseline", "45%", "84%"],
          ].map(([label, value, target, width]) => (
            <div key={label} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
              <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-semibold">{value}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Target: {target}</p>
              <div className="mt-4 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-2 rounded-full bg-blue-600" style={{ width }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-xl font-semibold">{title}</h3>
      {children}
    </div>
  );
}
