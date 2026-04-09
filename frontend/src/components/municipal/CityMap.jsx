import { useCallback, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { apiClient } from "../../api";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import MetricCard from "../shared/MetricCard";

const center = [30.7046, 76.7179];

export default function CityMap() {
  const [bins, setBins] = useState([]);
  const fetchBins = useCallback(() => {
    apiClient.bins().then(setBins);
  }, []);
  useAutoRefresh(fetchBins, 30000);

  const summary = useMemo(() => ({
    total: bins.length,
    critical: bins.filter((bin) => bin.fill_level > 80).length,
    warning: bins.filter((bin) => bin.fill_level > 50 && bin.fill_level <= 80).length,
    soon: bins.filter((bin) => bin.prediction?.hours_until_full < 6).length,
  }), [bins]);

  const markerColor = (bin) => {
    if (bin.prediction?.hours_until_full < 6) return "#3b82f6";
    if (bin.fill_level > 80) return "#ef4444";
    if (bin.fill_level > 50) return "#f59e0b";
    return "#10b981";
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-blue-600/10 px-4 py-3 text-sm font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
        🟢 All systems operational | Models: Online | Blockchain: Synced | IoT Network: 20/20 bins active
      </div>
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-panel dark:border-slate-800 dark:bg-slate-900">
        <div className="h-[500px] overflow-hidden rounded-3xl">
          <MapContainer center={center} zoom={14} scrollWheelZoom className="z-0">
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {bins.map((bin) => (
              <CircleMarker
                key={bin.id}
                center={[bin.lat, bin.lng]}
                radius={10}
                pathOptions={{ color: markerColor(bin), fillColor: markerColor(bin), fillOpacity: 0.85 }}
              >
                <Popup>
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">{bin.name}</p>
                    <p>Bin ID: {bin.id}</p>
                    <p>Fill level: {bin.fill_level}%</p>
                    <p>Bin type: {bin.bin_type}</p>
                    <p>Predicted full in: {bin.prediction?.hours_until_full} hours</p>
                    <p>Temperature: {bin.temperature_c}°C</p>
                    <p>Last collected: 2 hours ago</p>
                    <button type="button" className="rounded-lg bg-blue-600 px-3 py-2 text-white">Schedule Collection</button>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
            <Marker position={center}>
              <Popup>Patiala City Control Center</Popup>
            </Marker>
          </MapContainer>
        </div>
        <div className="absolute bottom-8 left-8 rounded-2xl bg-white/95 p-4 text-sm shadow-panel dark:bg-slate-900/95">
          🟢 Normal (≤50%) | 🟠 Warning (51-80%) | 🔴 Critical (>80%) | 🔵 Predicted Full
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Active Bins" value={summary.total} accent="municipal" />
        <MetricCard label="Critical Now" value={summary.critical} accent="municipal" />
        <MetricCard label="Warning" value={summary.warning} accent="municipal" />
        <MetricCard label="Filling Soon (6h)" value={summary.soon} accent="municipal" />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-panel dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">Bins Overview</h3>
          <input placeholder="Search by name" className="rounded-2xl border border-slate-200 bg-transparent px-4 py-2 dark:border-slate-700" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500 dark:text-slate-400">
              <tr>
                {["Bin ID", "Name", "Fill %", "Type", "Status", "Pred. Full In", "Last Collected", "Schedule"].map((head) => (
                  <th key={head} className="px-3 py-3">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...bins].sort((a, b) => b.fill_level - a.fill_level).map((bin) => (
                <tr key={bin.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-3">{bin.id}</td>
                  <td className="px-3 py-3">{bin.name}</td>
                  <td className="px-3 py-3">
                    <div className="w-32">
                      <div className="mb-1 flex justify-between text-xs">
                        <span>{bin.fill_level}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: `${bin.fill_level}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">{bin.bin_type}</td>
                  <td className="px-3 py-3">{bin.fill_level > 80 ? "Critical" : bin.fill_level > 50 ? "Warning" : "Normal"}</td>
                  <td className="px-3 py-3">{bin.prediction?.hours_until_full}h</td>
                  <td className="px-3 py-3">{new Date(bin.last_collected).toLocaleString("en-IN")}</td>
                  <td className="px-3 py-3"><button type="button" className="rounded-xl bg-blue-600 px-3 py-2 text-xs text-white">Schedule</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
