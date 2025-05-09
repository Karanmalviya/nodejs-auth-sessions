importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBTYInnIP3Ie5yzrU2mtjSL93Tv7_6BMCY",
  authDomain: "notifications-d426e.firebaseapp.com",
  projectId: "notifications-d426e",
  storageBucket: "notifications-d426e.firebasestorage.app",
  messagingSenderId: "917466620602",
  appId: "1:917466620602:web:f86dd2476ee556d6fad883",
  measurementId: "G-NRH506TWVY",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(async (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  const { title, body, image } = payload.notification;
  const topic = payload.data.topic;
  const notificationOptions = {
    body: body,
    icon: image || "/default-icon.png",
    data: {
      topic,
      article: title,
      url: payload.data?.url || "/",
    },
  };
  if (payload.notification) {
    self.registration.showNotification(title, notificationOptions);
  }

  self.addEventListener("notificationclick", async (e) => {
    e.notification.close();
    console.log("notification clicked", e);

    const url = e.notification.data?.url || e.notification.fcmOptions?.link;
    const { topic, article } = e.notification.data || {};

    e.waitUntil(clients.openWindow(url));
  });
});
