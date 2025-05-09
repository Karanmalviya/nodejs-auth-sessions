import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBTYInnIP3Ie5yzrU2mtjSL93Tv7_6BMCY",
  authDomain: "notifications-d426e.firebaseapp.com",
  projectId: "notifications-d426e",
  storageBucket: "notifications-d426e.firebasestorage.app",
  messagingSenderId: "917466620602",
  appId: "1:917466620602:web:f86dd2476ee556d6fad883",
  measurementId: "G-NRH506TWVY",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const analytics = getAnalytics(app);
