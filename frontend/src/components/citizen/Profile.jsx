import { useEffect, useState } from "react";
import { apiClient } from "../../api";
import { useAppContext } from "../../context/AppContext";
import MetricCard from "../shared/MetricCard";
import BlockchainTable from "../shared/BlockchainTable";

const getRank = (points) => {
  if (points > 1000) return "💎 Platinum Eco-Warrior";
  if (points > 500) return "🥇 Gold Recycler";
  if (points > 100) return "🥈 Silver Recycler";
  return "🥉 Bronze Recycler";
};

export default function Profile() {
  const { user } = useAppContext();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    apiClient.blockchainUser(user.id).then(setRecords);
  }, [user.id]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-3xl font-semibold text-white">RS</div>
          <div>
            <h2 className="text-3xl font-semibold">{user.name}</h2>
            <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
            <p className="text-slate-500 dark:text-slate-400">{user.city}</p>
            <p className="mt-2 text-sm">{getRank(user.greenPoints)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Items Classified" value={user.itemsClassified} />
        <MetricCard label="Successfully Recycled" value={user.itemsRecycled} />
        <MetricCard label="Complaints Raised" value={user.complaintsRaised} />
        <MetricCard label="CO₂ Saved" value={`${(user.itemsRecycled * 0.5).toFixed(1)} kg`} />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Progress to next rank</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">450 more points to Gold!</p>
          </div>
          <button type="button" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm dark:border-slate-700">Download My Report</button>
        </div>
        <div className="mt-4 h-3 rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: "55%" }} />
        </div>
      </div>

      <div>
        <div className="mb-3">
          <h3 className="text-xl font-semibold">🔗 My Blockchain Ledger</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Every action verified on chain</p>
        </div>
        <BlockchainTable records={records.slice(0, 15)} />
      </div>
    </div>
  );
}
