importScripts("https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js");

// 🔥 Inisialisasi Firebase
const firebaseConfig = {
  apiKey: "__FIREBASE_API_KEY__",
  authDomain: "__FIREBASE_AUTH_DOMAIN__",
  projectId: "__FIREBASE_PROJECT_ID__",
  storageBucket: "__FIREBASE_STORAGE_BUCKET__",
  messagingSenderId: "__FIREBASE_MESSAGING_SENDER_ID__",
  appId: "__FIREBASE_APP_ID__",
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
    requireInteraction: true, 
      tag: "push-notification", 
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

