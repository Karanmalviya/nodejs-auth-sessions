import React, { useEffect } from "react";
import { logout, updatetUser } from "../api";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getToken } from "firebase/messaging";
import { messaging } from "@/firebase";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) navigate("/login");
  };

  useEffect(() => {
    const requestPermission = async () => {
      // if (Notification.permission === "granted") {
      //   const tk = await getToken(messaging, {
      //     vapidKey:
      //       "BFEDM8VwElTPXwAa3XAvXbwXr1svZ9ADHjN2f14HGU57Uapb1PmPMngZ143LLWL1_KQYoORt4TNyDZ826p6ZeJ0",
      //   });
      //   setToken(tk);
      //   console.log("Notification permission already granted.");
      //   return;
      // }
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const tk = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_VAPID_KEY,
        });
        toast.promise(updatetUser({ fcmToken: tk }), {
          loading: "Token Saving...",
          success: <b>Toked saved!</b>,
          error: <b>Token Already Exisit.</b>,
        });
      } else if (permission === "denied") {
        alert("You denied for the notification");
      }
    };
    requestPermission();
  }, []);
  return (
    <div>
      {/* Home
      <button
        onClick={handleLogout}
        className="w-25 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Logout
      </button> */}
      {/* component */}

      <div className="flex flex-col flex-auto h-full p-6">
        <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
          Start Chating
        </div>
      </div>
    </div>
  );
}
