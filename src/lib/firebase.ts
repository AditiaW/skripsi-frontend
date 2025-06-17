import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDKT7gynC_JqjGpZjaFZkLhH5m2-yrNHjk",
  authDomain: "test-skripsi-3c259.firebaseapp.com",
  projectId: "test-skripsi-3c259",
  storageBucket: "test-skripsi-3c259.appspot.com",
  messagingSenderId: "568182643466",
  appId: "1:568182643466:web:67261c7b13de6ab0a2b8f3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
export const messaging = getMessaging(app);

// Request permission and get FCM token
export const requestForToken = async () => {
  try {
    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const currentToken = await getToken(messaging, {
        vapidKey: "BCJnZdoABpNp-jc2Kh-ocKjmvx3YiymWD68PcL8WFjgkhHztjrziZ1ViUvIUZ46puR6cr52umXBxmpYSaLTV2Hk",
      });
      if (currentToken) {
        console.log("FCM Token:", currentToken);
        return currentToken;
      } else {
        console.log("No registration token available.");
      }
    } else {
      console.log("Notification permission not granted.");
    }
  } catch (err) {
    console.error("Error getting FCM token:", err);
  }
};

// Listener for foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });