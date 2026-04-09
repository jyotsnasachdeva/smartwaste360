import { formatDateTime } from "../../utils/formatters";
import { truncateTxHash } from "../../utils/blockchain";

export default function BlockchainTable({ records = [] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              {["TX Hash", "Event", "Details", "Timestamp", "Verified"].map((head) => (
                <th key={head} className="px-4 py-3 font-medium">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={record.tx_hash + index} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 font-mono text-xs">{truncateTxHash(record.tx_hash)}</td>
                <td className="px-4 py-3">{record.event_type}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{JSON.stringify(record.payload_json).slice(0, 60)}...</td>
                <td className="px-4 py-3">{formatDateTime(record.timestamp)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    ✓ Verified
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
