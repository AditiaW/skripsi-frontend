importScripts(
  "https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js"
);

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

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
