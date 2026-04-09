import { Moon, Sun } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export default function DarkModeToggle() {
  const { darkMode, setDarkMode } = useAppContext();
  return (
    <button
      type="button"
      onClick={() => setDarkMode((prev) => !prev)}
      className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
