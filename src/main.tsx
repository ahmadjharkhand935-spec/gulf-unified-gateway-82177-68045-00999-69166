import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
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

// Improved error handling for React root mounting
try {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    throw new Error('Root element not found. Unable to mount React application.');
  }

  createRoot(rootElement).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
} catch (error) {
  console.error('Failed to mount React application:', error);
  
  // Display user-friendly error message
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 20px;
        text-align: center;
        background: #1a1a1a;
        color: #fff;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">⚠️ خطأ في تحميل التطبيق</h1>
        <p style="font-size: 1.2rem; margin-bottom: 2rem; max-width: 600px;">
          عذراً، حدث خطأ أثناء تحميل التطبيق. يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني.
        </p>
        <button 
          onclick="location.reload()" 
          style="
            padding: 12px 24px;
            font-size: 1rem;
            background: #0EA5E9;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          "
        >
          إعادة تحميل الصفحة
        </button>
        <details style="margin-top: 2rem; max-width: 800px; text-align: left;">
          <summary style="cursor: pointer; margin-bottom: 1rem;">تفاصيل الخطأ (للمطورين)</summary>
          <pre style="
            background: #000;
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
            font-size: 0.875rem;
          ">${error instanceof Error ? error.message + '\n' + error.stack : String(error)}</pre>
        </details>
      </div>
    `;
  }
}
