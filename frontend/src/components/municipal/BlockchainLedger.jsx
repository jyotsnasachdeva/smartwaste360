import { useEffect, useState } from "react";
import { apiClient } from "../../api";
import MetricCard from "../shared/MetricCard";
import BlockchainTable from "../shared/BlockchainTable";

export default function BlockchainLedger() {
  const [records, setRecords] = useState([]);
  useEffect(() => {
    apiClient.blockchainAll().then(setRecords);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">🔗 Municipal Blockchain Ledger</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">All waste management events recorded immutably</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total TX" value={records.length || 50} accent="municipal" />
        <MetricCard label="Today's TX" value="128" accent="municipal" />
        <MetricCard label="Bins Monitored" value="20" accent="municipal" />
        <MetricCard label="Verified Events" value="100%" accent="municipal" />
      </div>
      <div className="flex flex-wrap gap-3">
        <select className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700">
          <option>All</option>
          <option>BIN_FILLED</option>
          <option>BIN_COLLECTED</option>
          <option>ALERT_RAISED</option>
          <option>DISPOSAL_LOGGED</option>
          <option>COMPLAINT_LOGGED</option>
          <option>ROUTE_COMPLETED</option>
          <option>POINTS_AWARDED</option>
        </select>
        <input readOnly value="Last 7 days" className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700" />
        <input placeholder="Search by TX hash" className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700" />
      </div>
      <BlockchainTable records={records} />
    </div>
  );
}
