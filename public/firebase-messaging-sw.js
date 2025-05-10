importScripts(
  "https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js"
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.env) {
    self.env = event.data.env;
  }
});

const firebaseConfig = {
  apiKey: self.env?.VITE_FIREBASE_API_KEY || '',
  authDomain: self.env?.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: self.env?.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: self.env?.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: self.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: self.env?.VITE_FIREBASE_APP_ID || '',
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
