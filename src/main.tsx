import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

const registerServiceWorkers = async () => {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service workers are not supported in this browser");
    return;
  }

  try {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("Firebase Service Worker registered with scope:", registration.scope);
      })
      .catch((err) => {
        console.error("Firebase Service Worker registration failed:", err);
      });
  } catch (error) {
    console.error("Service Worker registration failed:", error);
  }
};

let deferredPrompt: Event | null = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log("PWA install prompt available");
});

(window as any).installPWA = () => {
  if (deferredPrompt) {
    (deferredPrompt as any).prompt();
    (deferredPrompt as any).userChoice.then(
      (choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted install");
        } else {
          console.log("User declined install");
        }
        deferredPrompt = null;
      }
    );
  }
};

registerServiceWorkers();
