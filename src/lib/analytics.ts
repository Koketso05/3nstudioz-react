const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const isGtagEnabled = Boolean(GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== "");

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const createGtagScript = (id: string) => {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
};

export const loadGtag = () => {
  if (!isGtagEnabled || typeof window === 'undefined') return;
  if (window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  }
  window.gtag = gtag;

  createGtagScript(GA_MEASUREMENT_ID);
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
};

export const trackPageView = (path: string) => {
  if (!isGtagEnabled || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  });
};
