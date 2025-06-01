/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Workbox } from "workbox-window";

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
    const wb = new Workbox("/sw.js");

    wb.addEventListener("installed", (event) => {
      if (event.isUpdate) {
        console.log("App updated");
      } else {
        console.log("App successfully installed as PWA");
      }
    });

    wb.addEventListener("waiting", () => {
      if (confirm("A new version is available! Refresh to update?")) {
        wb.messageSkipWaiting();
        window.location.reload();
      }
    });

    wb.addEventListener("activated", (event) => {
      if (event.isUpdate) {
        console.log("New content activated");
      }
    });

    await wb.register();

    const firebaseRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    console.log("Firebase Service Worker registered:", firebaseRegistration);

    const firebaseWorker = firebaseRegistration.active || firebaseRegistration.installing;
    if (firebaseWorker) {
      firebaseWorker.postMessage({
        type: "INIT_ENV",
        env: {
          VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
          VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
          VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
        },
      });
    }
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
    (deferredPrompt as any).userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted install");
      } else {
        console.log("User declined install");
      }
      deferredPrompt = null;
    });
  }
};

registerServiceWorkers();
