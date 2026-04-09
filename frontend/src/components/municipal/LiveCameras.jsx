import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Camera, LoaderCircle, Upload } from "lucide-react";
import { apiClient } from "../../api";

const cameras = [
  "Main Bazaar Bin",
  "Mall Road Bin",
  "Railway Station Bin",
  "Sanauri Gate Bin",
  "Urban Estate Bin",
  "Govt Medical College",
];

const makeCanvasImage = async () => {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext("2d");
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, "#cbd5e1");
  sky.addColorStop(1, "#e2e8f0");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 640, 260);

  const ground = ctx.createLinearGradient(0, 260, 0, 480);
  ground.addColorStop(0, "#94a3b8");
  ground.addColorStop(1, "#64748b");
  ctx.fillStyle = ground;
  ctx.fillRect(0, 260, 640, 220);

  ctx.fillStyle = "#475569";
  ctx.fillRect(0, 300, 640, 18);

  ctx.fillStyle = "#16a34a";
  ctx.fillRect(40, 135, 95, 155);
  ctx.fillStyle = "#14532d";
  ctx.fillRect(52, 148, 70, 18);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(60, 168, 54, 72);

  ctx.fillStyle = "#2563eb";
  ctx.fillRect(172, 158, 88, 132);
  ctx.fillStyle = "#1e3a8a";
  ctx.fillRect(186, 172, 60, 18);

  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.arc(355, 335, 54, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#334155";
  ctx.fillRect(430, 300, 78, 72);
  ctx.fillRect(510, 286, 90, 94);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(446, 316, 24, 18);
  ctx.fillRect(534, 314, 30, 20);

  ctx.fillStyle = "#22c55e";
  ctx.fillRect(288, 214, 16, 84);
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(296, 204, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.globalAlpha = 0.82;
  ctx.fillRect(18, 18, 150, 30);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText("SMARTWASTE CCTV", 28, 39);
  ctx.fillStyle = "#dc2626";
  ctx.beginPath();
  ctx.arc(603, 36, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 14px sans-serif";
  ctx.fillText("REC", 568, 41);

  ctx.fillStyle = "#0f172a";
  ctx.globalAlpha = 0.42;
  ctx.fillRect(22, 426, 230, 32);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("Mall Road Bin - Zone A", 34, 448);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg"));
  return new File([blob], "camera-frame.jpg", { type: "image/jpeg" });
};

export default function LiveCameras() {
  const fileInputsRef = useRef({});
  const [alerts, setAlerts] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});

  const beep = () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const context = new AudioCtx();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.frequency.value = 880;
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.3);
    oscillator.stop(context.currentTime + 0.3);
  };

  const simulate = async (cameraId, location, overrideFile) => {
    setLoading((prev) => ({ ...prev, [cameraId]: true }));
    try {
      const file = overrideFile || selectedFiles[cameraId] || (await makeCanvasImage());
      const result = await new Promise((resolve) =>
        setTimeout(async () => resolve(await apiClient.detectCamera({ file, cameraId, location })), 1500),
      );
      setResults((prev) => ({ ...prev, [cameraId]: result }));
      if (result.is_illegal_dumping) {
        beep();
        setAlerts((prev) => [
          {
            timestamp: new Date().toISOString(),
            cameraId,
            location,
            detected: result.detections[0]?.class_name,
            confidence: result.detections[0]?.confidence,
            status: "Open",
            tx_hash: result.tx_hash,
          },
          ...prev,
        ]);
        toast.success("Alert logged to blockchain! 🚨");
      } else {
        toast.success(`Scan complete for ${cameraId}`);
      }
    } catch {
      toast.error("Camera detection failed. Retrying with demo frame is recommended.");
    } finally {
      setLoading((prev) => ({ ...prev, [cameraId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {alerts[0] ? (
        <div className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-medium text-white">
          ⚠️ ALERT: Illegal dumping detected at {alerts[0].location} — 8 min ago
        </div>
      ) : null}
      <div className="grid gap-4 xl:grid-cols-3">
        {cameras.map((location, index) => {
          const cameraId = `CAM-0${index + 1}`;
          const result = results[cameraId];
          const isLoading = loading[cameraId];
          const selectedFile = selectedFiles[cameraId];
          return (
            <div key={cameraId} className={`rounded-3xl border bg-white p-4 shadow-panel dark:bg-slate-900 ${result?.is_illegal_dumping ? "border-rose-500" : "border-slate-200 dark:border-slate-800"}`}>
              <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-slate-800 text-slate-300">
                {result?.annotated_image ? <img src={result.annotated_image} alt={cameraId} className="h-full w-full object-cover" /> : <Camera size={42} />}
                <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2 py-1 text-xs font-semibold text-white">LIVE</span>
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/65 text-white">
                    <div className="flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-2 text-sm">
                      <LoaderCircle size={16} className="animate-spin" />
                      Running detection...
                    </div>
                  </div>
                ) : null}
                {result?.is_illegal_dumping ? <span className="absolute bottom-3 left-3 animate-blink rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white">🚨 ILLEGAL DUMPING DETECTED</span> : null}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{cameraId}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{location}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">Active</span>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Last event: {new Date().toLocaleString("en-IN")}</p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {selectedFile ? `Loaded: ${selectedFile.name}` : "No photo selected. You can use a real waste image or the built-in demo frame."}
              </p>
              <input
                ref={(element) => {
                  fileInputsRef.current[cameraId] = element;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setSelectedFiles((prev) => ({ ...prev, [cameraId]: file }));
                }}
              />
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fileInputsRef.current[cameraId]?.click()}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold dark:border-slate-700"
                >
                  <Upload className="mr-2 inline" size={16} />
                  Upload Photo
                </button>
                <button
                  type="button"
                  onClick={() => simulate(cameraId, location)}
                  className="rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white"
                >
                  {selectedFile ? "Analyze Photo" : "Simulate Detection"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-panel dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-xl font-semibold">Alerts Log</h3>
        {alerts.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-500 dark:text-slate-400">
                <tr>
                  {["Timestamp", "Camera", "Location", "Detected", "Confidence", "Status", "TX Hash"].map((head) => (
                    <th key={head} className="px-3 py-3">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert, index) => (
                  <tr key={`${alert.tx_hash}-${index}`} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-3 py-3">{new Date(alert.timestamp).toLocaleString("en-IN")}</td>
                    <td className="px-3 py-3">{alert.cameraId}</td>
                    <td className="px-3 py-3">{alert.location}</td>
                    <td className="px-3 py-3">{alert.detected}</td>
                    <td className="px-3 py-3">{alert.confidence}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button type="button" className="rounded-lg bg-blue-100 px-3 py-1 text-xs text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">Acknowledge</button>
                        <button type="button" className="rounded-lg bg-emerald-100 px-3 py-1 text-xs text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">Resolve</button>
                      </div>
                    </td>
                    <td className="px-3 py-3">{alert.tx_hash?.slice(0, 12)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No alerts in last 24 hours ✓
          </div>
        )}
      </div>
    </div>
  );
}
