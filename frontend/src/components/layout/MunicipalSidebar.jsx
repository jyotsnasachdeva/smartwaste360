import { BarChart3, Camera, Map, Route, ScrollText } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const items = [
  { key: "map", label: "City Map & Bins", icon: Map },
  { key: "cameras", label: "Live Cameras", icon: Camera },
  { key: "routes", label: "Route Optimizer", icon: Route },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "ledger", label: "Blockchain Ledger", icon: ScrollText },
];

export default function MunicipalSidebar() {
  const { municipalPage, setMunicipalPage } = useAppContext();
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-950 lg:block">
      <nav className="space-y-2">
        {items.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setMunicipalPage(key)}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
              municipalPage === key
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
