import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext(null);

const initialUser = {
  id: 1,
  name: "Rajveer Singh",
  email: "rajveer@demo.com",
  city: "Patiala, Punjab",
  memberSince: "2023-06-14",
  greenPoints: 340,
  itemsClassified: 68,
  itemsRecycled: 42,
  complaintsRaised: 15,
};

export function AppProvider({ children }) {
  const [mode, setMode] = useState("citizen");
  const [darkMode, setDarkMode] = useState(false);
  const [citizenPage, setCitizenPage] = useState("scan");
  const [municipalPage, setMunicipalPage] = useState("map");
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      darkMode,
      setDarkMode,
      citizenPage,
      setCitizenPage,
      municipalPage,
      setMunicipalPage,
      user,
      setUser,
      addPoints: (points) => setUser((prev) => ({ ...prev, greenPoints: prev.greenPoints + points })),
    }),
    [mode, darkMode, citizenPage, municipalPage, user],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);
