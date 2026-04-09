import { useEffect, useState } from "react";
import { apiClient } from "../../api";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  useEffect(() => {
    apiClient.leaderboard().then(setLeaders);
  }, []);

  const podium = leaders.slice(0, 3);
  const rest = leaders.slice(3, 20);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-panel">
        <p className="text-sm font-medium">🎯 March Challenge: Classify 50 items → Win 500 bonus points</p>
        <div className="mt-4 h-3 rounded-full bg-white/25">
          <div className="h-3 rounded-full bg-white" style={{ width: "62%" }} />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold">🏆 Eco Champions — Patiala City</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Top recyclers this month</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {podium.map((leader, index) => (
          <div key={leader.id} className={`rounded-3xl p-6 text-center shadow-panel ${index === 0 ? "bg-amber-100 dark:bg-amber-500/15" : index === 1 ? "bg-slate-100 dark:bg-slate-800" : "bg-orange-100 dark:bg-orange-500/15"}`}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-xl font-semibold text-slate-800">{leader.name.split(" ").map((part) => part[0]).join("")}</div>
            <h3 className="mt-4 text-lg font-semibold">{leader.name}</h3>
            <p className="text-sm">{leader.green_points} pts</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-panel dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 rounded-2xl bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">
          Your rank: #8 of 2,341 citizens
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500 dark:text-slate-400">
              <tr>
                {["Rank", "Name", "Points", "Items", "CO₂ Saved", "Badge"].map((head) => (
                  <th key={head} className="px-3 py-3">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rest.map((leader, index) => (
                <tr key={leader.id} className={`border-t border-slate-100 dark:border-slate-800 ${leader.id === 1 ? "bg-teal-50 dark:bg-teal-500/10" : ""}`}>
                  <td className="px-3 py-3">{index + 4}</td>
                  <td className="px-3 py-3">{leader.name}</td>
                  <td className="px-3 py-3">{leader.green_points}</td>
                  <td className="px-3 py-3">{leader.items_classified}</td>
                  <td className="px-3 py-3">{leader.co2_saved} kg</td>
                  <td className="px-3 py-3">{leader.green_points > 500 ? "Gold" : "Silver"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
