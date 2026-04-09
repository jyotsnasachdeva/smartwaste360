import { Toaster } from "react-hot-toast";
import { AppProvider, useAppContext } from "./context/AppContext";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import MunicipalSidebar from "./components/layout/MunicipalSidebar";
import ScanClassify from "./components/citizen/ScanClassify";
import Profile from "./components/citizen/Profile";
import Complaints from "./components/citizen/Complaints";
import Leaderboard from "./components/citizen/Leaderboard";
import CityMap from "./components/municipal/CityMap";
import LiveCameras from "./components/municipal/LiveCameras";
import RouteOptimizer from "./components/municipal/RouteOptimizer";
import Analytics from "./components/municipal/Analytics";
import BlockchainLedger from "./components/municipal/BlockchainLedger";

function Shell() {
  const { mode, citizenPage, municipalPage } = useAppContext();

  const citizenViews = {
    scan: <ScanClassify />,
    profile: <Profile />,
    complaints: <Complaints />,
    leaderboard: <Leaderboard />,
  };

  const municipalViews = {
    map: <CityMap />,
    cameras: <LiveCameras />,
    routes: <RouteOptimizer />,
    analytics: <Analytics />,
    ledger: <BlockchainLedger />,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="mx-auto flex max-w-[1600px]">
        {mode === "citizen" ? <Sidebar /> : <MunicipalSidebar />}
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-6">
          {mode === "citizen" ? citizenViews[citizenPage] : municipalViews[municipalPage]}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
