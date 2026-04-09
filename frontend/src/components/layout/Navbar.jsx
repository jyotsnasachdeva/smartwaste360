import { Leaf, Settings } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import DarkModeToggle from "../shared/DarkModeToggle";

export default function Navbar() {
  const { mode, setMode, user } = useAppContext();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/10 p-2 text-brand-600 dark:text-brand-400">
            <Leaf size={22} />
          </div>
          <div>
            <h1 className="text-lg font-semibold">SmartWaste360</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Smart City Waste Intelligence Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setMode("citizen")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${mode === "citizen" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500"}`}
          >
            Citizen
          </button>
          <button
            type="button"
            onClick={() => setMode("municipal")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${mode === "municipal" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500"}`}
          >
            Municipal
          </button>
        </div>

        <div className="flex items-center gap-3">
          {mode === "citizen" ? (
            <>
              <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                {user.greenPoints} Green Points
              </div>
              <div className="hidden items-center gap-3 rounded-full border border-slate-200 px-3 py-2 dark:border-slate-700 md:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-semibold text-white">
                  RS
                </div>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.city}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                Admin Panel
              </span>
              <button type="button" className="rounded-full border border-slate-200 p-2 dark:border-slate-700">
                <Settings size={18} />
              </button>
            </>
          )}
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
