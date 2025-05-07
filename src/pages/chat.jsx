import { useAuth } from "@/hooks/useAuth";
import React, { useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, { withCredentials: true });

export default function Chat() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const { data } = useAuth();

  useEffect(() => {
    socket.emit("register", data?._id); // Replace with actual user ID
    socket.on("reply", (data) => {
      setReply(data);
    });
    return () => {
      socket.off("reply");
    };
  }, []);

  const sendMessage = () => {
    socket.emit("message", input);
    setInput("");
  };

  return (
    <div>
      Chat room {import.meta.env.VITE_API_URL}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
        className="border p-2"
      />
      <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 text-white">
        Send
      </button>
      {reply && <p className="mt-4 text-green-600">Server: {reply}</p>}
    </div>
  );
}
