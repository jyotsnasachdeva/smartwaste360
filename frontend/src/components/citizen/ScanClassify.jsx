import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ImageUp, LoaderCircle } from "lucide-react";
import { apiClient } from "../../api";
import { useAppContext } from "../../context/AppContext";
import { formatConfidence, toTitleCase } from "../../utils/formatters";
import WasteBot from "./WasteBot";

export default function ScanClassify() {
  const fileRef = useRef(null);
  const { addPoints } = useAppContext();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [stage, setStage] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const sizeText = useMemo(() => (file ? `${(file.size / 1024).toFixed(1)} KB` : ""), [file]);

  const handleFile = (selected) => {
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const analyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setStage("Running AI classification...");
    setTimeout(() => setStage("Detecting objects..."), 900);
    setTimeout(() => setStage("Generating heatmap..."), 1800);
    const response = await new Promise((resolve) => setTimeout(async () => resolve(await apiClient.classify(file)), 2500));
    setResult(response);
    const award = await apiClient.logDisposal({
      user_id: 1,
      waste_type: response.classification.class,
      is_recyclable: response.classification.is_recyclable,
    });
    addPoints(award.points_awarded);
    toast.success(`+${award.points_awarded} Green Points earned! 🌱`);
    setAnalyzing(false);
    setStage("");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold">Analyze Your Waste</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Upload a photo to simulate classification, detection, and explainability in one flow.</p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-5 flex h-[220px] w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-300 bg-emerald-50/60 px-6 text-center text-slate-600 transition hover:border-emerald-500 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-slate-300"
          >
            {preview ? (
              <img src={preview} alt="Waste preview" className="h-full max-h-[180px] rounded-2xl object-cover" />
            ) : (
              <>
                <ImageUp className="mb-3" size={40} />
                <p className="font-medium">Drop waste image here or click to browse</p>
              </>
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} className="hidden" />
          {file ? <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{file.name} • {sizeText}</p> : null}
          {file ? (
            <button
              type="button"
              onClick={analyze}
              className="mt-5 w-full rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Analyze Waste
            </button>
          ) : null}
          {analyzing ? (
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-950">
              <LoaderCircle className="animate-spin text-emerald-600" size={18} />
              {stage}
            </div>
          ) : null}
        </div>

        {result ? (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Detected class</p>
                  <h3 className="text-3xl font-semibold">{result.classification.class_display}</h3>
                </div>
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  {formatConfidence(result.classification.confidence)}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className={`rounded-full px-4 py-2 text-sm font-medium ${result.classification.is_recyclable ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"}`}>
                  {result.classification.is_recyclable ? "✓ Recyclable" : "✗ Non-Recyclable"}
                </span>
                <span className="rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700">
                  Bin: {result.classification.bin_color}
                </span>
              </div>
              <p className="mt-4 text-slate-600 dark:text-slate-300">{result.classification.disposal_instruction}</p>
              <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                {result.classification.model_version} | Benchmark: {result.classification.accuracy_on_benchmark} on WaRP-28
              </div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Analyzed in {result.classification.processing_time_ms}ms</div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xl font-semibold">Object Detection</h3>
              {result.detection.annotated_image ? <img src={result.detection.annotated_image} alt="Detection" className="mt-4 rounded-2xl" /> : null}
              <div className="mt-4 space-y-3">
                {result.detection.detections.map((item, index) => (
                  <div key={`${item.class_name}-${index}`}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{toTitleCase(item.class_name)}</span>
                      <span>{Math.round(item.confidence * 100)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                      <div className="h-2 rounded-full bg-sky-500" style={{ width: `${item.confidence * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                GELAN-E | mAP50: {result.detection.mAP50} | {result.detection.processing_time_ms}ms inference
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xl font-semibold">Explainability (Score-CAM)</h3>
              {result.classification.heatmap_base64 ? <img src={result.classification.heatmap_base64} alt="Heatmap" className="mt-4 rounded-2xl" /> : null}
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Attention map shows model focused on texture and shape regions.</p>
            </div>
          </div>
        ) : null}
      </section>

      <WasteBot />
    </div>
  );
}
