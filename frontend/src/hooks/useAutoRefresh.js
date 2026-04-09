import { useEffect } from "react";

export default function useAutoRefresh(callback, interval = 30000) {
  useEffect(() => {
    callback();
    const timer = setInterval(callback, interval);
    return () => clearInterval(timer);
  }, [callback, interval]);
}
