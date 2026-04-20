const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const isGtagEnabled = Boolean(GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== "");

const isLocalAnalyticsDebug = () => {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

const logAnalyticsDebug = (message: string, payload?: Record<string, unknown>) => {
  if (!isLocalAnalyticsDebug() || typeof console === 'undefined') return;
  if (payload) {
    console.debug('[analytics]', message, payload);
    return;
  }
  console.debug('[analytics]', message);
};

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
  script.addEventListener('load', () => {
    logAnalyticsDebug('gtag.js loaded');
  });
  script.addEventListener('error', () => {
    logAnalyticsDebug('gtag.js failed to load');
  });
  document.head.appendChild(script);
};

export const loadGtag = () => {
  if (!isGtagEnabled || typeof window === 'undefined') return;
  if (window.gtag) {
    logAnalyticsDebug('gtag already initialized');
    return;
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer?.push(arguments);
  }
  window.gtag = gtag;

  createGtagScript(GA_MEASUREMENT_ID);
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
    debug_mode: isLocalAnalyticsDebug(),
  });
  logAnalyticsDebug('gtag configured', {
    measurementId: GA_MEASUREMENT_ID,
    debugMode: isLocalAnalyticsDebug(),
  });
};

export const trackPageView = (path: string) => {
  if (!isGtagEnabled || typeof window === 'undefined' || !window.gtag) {
    logAnalyticsDebug('page_view skipped', {
      enabled: isGtagEnabled,
      hasWindow: typeof window !== 'undefined',
      hasGtag: typeof window !== 'undefined' ? Boolean(window.gtag) : false,
    });
    return;
  }

  const payload = {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
    send_to: GA_MEASUREMENT_ID,
    debug_mode: isLocalAnalyticsDebug(),
  };

  logAnalyticsDebug('sending page_view', payload);
  window.gtag('event', 'page_view', payload);
};
