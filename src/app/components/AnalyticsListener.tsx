import { useEffect } from "react";
import { useLocation } from "react-router";
import { isGtagEnabled, loadGtag, trackPageView } from "../../lib/analytics";

export function AnalyticsListener() {
  const location = useLocation();

  useEffect(() => {
    if (!isGtagEnabled) return;
    loadGtag();
  }, []);

  useEffect(() => {
    if (!isGtagEnabled) return;
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}
