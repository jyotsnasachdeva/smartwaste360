import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Download, Send } from "lucide-react";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { apiClient } from "../../api";
import LoadingSkeleton from "../shared/LoadingSkeleton";

const center = [30.7046, 76.7179];

export default function RouteOptimizer() {
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    apiClient.predictAll().then(setPredictions);
  }, []);

  const generateRoutes = async () => {
    setLoading(true);
    const result = await new Promise((resolve) => setTimeout(async () => resolve(await apiClient.routeOptimize()), 2000));
    setRouteData(result);
    setLoading(false);
  };

  const exportRoute = () => {
    if (!routeData) return;
    const content = routeData.route.map((stop) => `Stop ${stop.stop}: ${stop.name} (${stop.fill_level}%) ETA ${stop.eta}`).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "smartwaste360-route.txt";
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={generateRoutes} className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white">
          ⚡ Generate Optimal Routes
        </button>
        <p className="text-sm text-slate-500 dark:text-slate-400">Last optimized: {routeData ? new Date(routeData.optimized_at).toLocaleString("en-IN") : "Not yet"}</p>
      </div>

      {loading ? (
        <div className="grid gap-6 xl:grid-cols-[1.4fr,1fr]">
          <LoadingSkeleton className="h-[420px]" />
          <LoadingSkeleton className="h-[420px]" />
        </div>
      ) : routeData ? (
        <div className="grid gap-6 xl:grid-cols-[1.4fr,1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-panel dark:border-slate-800 dark:bg-slate-900">
            <div className="h-[420px] overflow-hidden rounded-3xl">
              <MapContainer center={center} zoom={14} className="z-0">
                <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polyline positions={routeData.route.map((stop) => [stop.lat, stop.lng])} pathOptions={{ color: "#2563eb", weight: 5 }} />
                {routeData.route.map((stop) => <Marker key={stop.bin_id} position={[stop.lat, stop.lng]} />)}
              </MapContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"><p className="text-sm text-slate-500">Total Stops</p><p className="text-2xl font-semibold">{routeData.stats.total_stops}</p></div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"><p className="text-sm text-slate-500">Total Distance</p><p className="text-2xl font-semibold">{routeData.stats.total_distance_km} km</p></div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"><p className="text-sm text-slate-500">Fuel Saved</p><p className="text-2xl font-semibold">{routeData.stats.fuel_saved_litres} L</p></div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"><p className="text-sm text-slate-500">CO₂ Saved</p><p className="text-2xl font-semibold">{routeData.stats.co2_saved_kg} kg</p></div>
            </div>
            <div className="mt-5 max-h-72 space-y-3 overflow-y-auto">
              {routeData.route.map((stop) => (
                <div key={stop.bin_id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <p className="font-semibold">Stop {stop.stop} → {stop.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Fill: {stop.fill_level}% • ETA: {stop.eta} • {stop.bin_type}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={exportRoute} className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold dark:border-slate-700">
                <Download className="mr-2 inline" size={16} />
                Export Route
              </button>
              <button type="button" onClick={() => toast.success("Route sent! (demo)")} className="flex-1 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">
                <Send className="mr-2 inline" size={16} />
                Send to Driver App
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-panel dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-xl font-semibold">LSTM Predictions Table</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500 dark:text-slate-400">
              <tr>
                {["Bin", "Fill %", "Fill Rate", "Predicted Full At", "Hours Left", "Priority"].map((head) => (
                  <th key={head} className="px-3 py-3">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {predictions.sort((a, b) => a.hours_until_full - b.hours_until_full).map((item) => (
                <tr key={item.bin_id} className={`border-t border-slate-100 dark:border-slate-800 ${item.hours_until_full < 4 ? "bg-rose-50 dark:bg-rose-500/10" : item.hours_until_full < 8 ? "bg-amber-50 dark:bg-amber-500/10" : "bg-emerald-50/40 dark:bg-emerald-500/5"}`}>
                  <td className="px-3 py-3">{item.name}</td>
                  <td className="px-3 py-3">{item.fill_level}%</td>
                  <td className="px-3 py-3">{item.fill_rate_per_hour}/h</td>
                  <td className="px-3 py-3">{new Date(item.predicted_full_datetime).toLocaleString("en-IN")}</td>
                  <td className="px-3 py-3">{item.hours_until_full}h</td>
                  <td className="px-3 py-3">{item.hours_until_full < 4 ? "Critical" : item.hours_until_full < 8 ? "Watch" : "Stable"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
