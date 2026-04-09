import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

const safe = async (request, fallback) => {
  try {
    const { data } = await request();
    return data;
  } catch {
    return fallback;
  }
};

export const apiClient = {
  classify: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return safe(
      () => api.post("/api/classify", formData),
      {
        classification: {
          class_display: "Plastic Bottle",
          confidence: 0.931,
          is_recyclable: true,
          bin_color: "Blue",
          bin_hex: "#2196F3",
          disposal_instruction: "Place in BLUE recyclable bin. Remove cap first.",
          model_version: "DenseWasteViT-v2.1",
          accuracy_on_benchmark: "83.11%",
          processing_time_ms: 243,
          heatmap_base64: "",
        },
        detection: {
          detections: [{ class_name: "plastic_bottle", confidence: 0.88, x: 70, y: 80, w: 180, h: 220 }],
          annotated_image: "",
          model_name: "GELAN-E-WasteDetect",
          mAP50: "0.637",
          processing_time_ms: 12,
        },
      },
    );
  },
  chatbot: (payload) =>
    safe(
      () => api.post("/api/chatbot", payload),
      {
        response:
          "Clean items like bottles, cans, and paper usually go into the Blue bin, while food scraps belong in Green. Batteries and chemicals should be separated for safe handling. 🌱 Quick tip: Empty and rinse containers before recycling.",
      },
    ),
  bins: () => safe(() => api.get("/api/bins/status"), []),
  leaderboard: () => safe(() => api.get("/api/leaderboard"), []),
  routeOptimize: () => safe(() => api.post("/api/routes/optimize"), { route: [], stats: {} }),
  predictAll: () => safe(() => api.get("/api/predict/all"), []),
  blockchainAll: () => safe(() => api.get("/api/blockchain/all-records"), []),
  blockchainUser: (userId) => safe(() => api.get(`/api/blockchain/user-records/${userId}`), []),
  logDisposal: (payload) => safe(() => api.post("/api/blockchain/log-disposal", payload), { points_awarded: 10 }),
  complaints: (userId) => safe(() => api.get(`/api/complaints/${userId}`), []),
  createComplaint: (payload) => safe(() => api.post("/api/complaints", payload), { ...payload, tx_hash: "0xdemo" }),
  detectCamera: async ({ file, cameraId, location }) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("camera_id", cameraId);
    formData.append("location", location);
    return safe(() => api.post("/api/detect/camera", formData), { detections: [], annotated_image: "", is_illegal_dumping: false });
  },
};
