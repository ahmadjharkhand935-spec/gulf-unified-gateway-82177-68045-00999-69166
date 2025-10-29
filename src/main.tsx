import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}

// If Netlify Function redirected us to /index.html with an encoded intended path,
// restore it into the address bar before the SPA router mounts.
(() => {
  try {
    const url = new URL(window.location.href);
    const encodedPath = url.searchParams.get("__path");
    if (encodedPath) {
      url.searchParams.delete("__path");
      const target = decodeURIComponent(encodedPath);
      const [pathname, query = ""] = target.split("?");
      const nextQuery = new URLSearchParams(query);
      // Merge any remaining search params that are not __path
      url.searchParams.forEach((value, key) => nextQuery.set(key, value));
      const nextUrl = pathname + (nextQuery.toString() ? `?${nextQuery.toString()}` : "") + url.hash;
      window.history.replaceState({}, "", nextUrl);
    }
  } catch (err) {
    // Non-fatal
    console.warn("Failed to restore SPA path from __path:", err);
  }
})();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </HelmetProvider>
);
