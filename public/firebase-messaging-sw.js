importScripts("https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js");

// 🔥 Inisialisasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDKT7gynC_JqjGpZjaFZkLhH5m2-yrNHjk",
  authDomain: "test-skripsi-3c259.firebaseapp.com",
  projectId: "test-skripsi-3c259",
  storageBucket: "test-skripsi-3c259.appspot.com",
  messagingSenderId: "568182643466",
  appId: "1:568182643466:web:67261c7b13de6ab0a2b8f3",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 🛠️ Tangani background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const notificationTitle = payload?.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload?.notification?.body || "You have a new message!",
    icon: "/shop.png",
    requireInteraction: true, // Notifikasi tetap tampil sampai ditutup
      tag: "push-notification", // Hindari duplikasi notifikasi
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 🔔 Tambahkan event `push` untuk memastikan notifikasi muncul di background
self.addEventListener("push", (event) => {
  console.log("Push event received at:", new Date().toLocaleTimeString());
  if (event.data) {
    const payload = event.data.json();
    self.registration.showNotification(payload.notification.title, {
      body: payload.notification.body,
      icon: "/shop.png",
    });
  }
});

