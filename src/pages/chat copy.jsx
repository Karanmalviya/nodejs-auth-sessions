import { getMessages } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import React, { useRef, useState, useCallback } from "react";
import { useEffect } from "react";
import { useParams } from "react-router";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, { withCredentials: true });

export default function Chat() {
  const { id } = useParams();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const prevScrollHeight = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const timeout = setTimeout(() => scrollToBottom(), 100);
    return () => clearTimeout(timeout);
  }, [messages]);

  // Fetch older messages when scrolling up
  const fetchOlderMessages = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      // Store current scroll height before adding new items
      if (chatContainerRef.current) {
        prevScrollHeight.current = chatContainerRef.current.scrollHeight;
      }

      const res = await getMessages({
        from: user?._id,
        to: id,
        page: page + 1, // Load next page
        pageSize: 10,
      });

      if (res?.data?.length === 0) {
        setHasMore(false);
      } else {
        setMessages((prev) => [...res.data, ...prev]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error fetching older messages:", err);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, id, user?._id]);

  // Adjust scroll position after new items are loaded
  useEffect(() => {
    if (chatContainerRef.current && prevScrollHeight.current > 0) {
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight - prevScrollHeight.current;
    }
  }, [messages]);

  // Handle scroll events for infinite scroll
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop } = container;
      const threshold = 100; // pixels from top to trigger load

      if (scrollTop < threshold && !loading && hasMore) {
        fetchOlderMessages();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [fetchOlderMessages, loading, hasMore]);

  // Initial messages load
  useEffect(() => {
    if (user?._id && id) {
      const fetchMessages = async () => {
        try {
          const res = await getMessages({
            from: user?._id,
            to: id,
            page: 1,
            pageSize: 10,
          });
          setMessages(res?.data || []);
          scrollToBottom();
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      };
      fetchMessages();
    }
  }, [id, user?._id]);

  // Socket.io message handling
  useEffect(() => {
    if (user?._id) {
      socket.emit("register", user?._id);
    }
    socket.on("message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          from: data.from,
          to: data.to,
          message: data.message,
          createdAt: data.createdAt,
        },
      ]);
    });

    return () => {
      socket.off("message");
    };
  }, [user?._id]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (user?._id && id) {
      socket.emit("message", {
        from: user?._id,
        to: id,
        message: input,
      });
      setInput("");
    }
  };

  return (
    <div className="flex flex-col flex-auto h-full p-6">
      <div
        className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4"
        style={{
          backgroundImage:
            'url("https://camo.githubusercontent.com/ebf18cd85f7aa9dc79fb74c58dc94febf3a6441d8d689cd5a400b2707e19ec0e/68747470733a2f2f7765622e77686174736170702e636f6d2f696d672f62672d636861742d74696c652d6461726b5f61346265353132653731393562366237333364393131306234303866303735642e706e67")',
        }}
      >
        <div
          className="flex flex-col h-full overflow-x-auto mb-4 overflow-y-auto"
          ref={chatContainerRef}
        >
          <div className="flex flex-col h-full">
            {loading && (
              <div className="flex justify-center py-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
              </div>
            )}
            <div className="grid grid-cols-12 gap-y-2">
              {messages?.length > 0 &&
                messages.map((message, index) => {
                  return user?._id === message?.from ? (
                    <div
                      className="col-start-6 col-end-13 p-3 rounded-lg"
                      key={`${message._id || index}`}
                    >
                      <div className="flex items-center justify-start flex-row-reverse">
                        <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                          <div>{message?.message}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="col-start-1 col-end-8 p-3 rounded-lg"
                      key={`${message._id || index}`}
                    >
                      <div className="flex flex-row items-center">
                        <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                          <div>{message?.message}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
        <form
          onSubmit={sendMessage}
          className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
        >
          <div>
            <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>
          </div>
          <div className="flex-grow ml-4">
            <div className="relative w-full">
              <input
                type="text"
                className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                autoFocus
                placeholder="Type a message"
              />
              <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="ml-4">
            <button
              type="submit"
              className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
            >
              <span>Send</span>
              <span className="ml-2">
                <svg
                  className="w-4 h-4 transform rotate-45 -mt-px"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
