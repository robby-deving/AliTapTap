import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // Backend URL

export default function Chats() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { senderId: string; message: string }[]
  >([]);
  const [senders, setSenders] = useState<
    { id: string; name: string; email: string }[]
  >([]);
  const [selectedSender, setSelectedSender] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const userId = localStorage.getItem("userId"); // Logged-in user's ID

  useEffect(() => {
    if (!userId) {
      console.error("No userId found in localStorage");
      return;
    }

    // Fetch senders who messaged the current user
    const fetchSenders = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/v1/chat/senders/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch senders");

        const data = await response.json();
        console.log("Fetched senders:", data);

        setSenders(data.senders || []);
      } catch (error) {
        console.error("Error fetching senders:", error);
      }
    };

    fetchSenders();
  }, [userId]);

  // Fetch chat messages when a sender is selected
  useEffect(() => {
    if (!selectedSender) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/v1/chat/messages/${userId}/${selectedSender.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch messages");

        const data = await response.json();
        console.log("Fetched messages:", data);

        setMessages(data.messages || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedSender, userId]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const testMessage = {
        senderId: "67caa10d3e7138c6cf4d6101",
        receiverId: "67c00e4097fb8a5aeb426db5",
        message: message,
      };
  
      console.log("Sending test message:", testMessage);
  
      socket.emit("message", testMessage); // ✅ Send message
      setMessage(""); // ✅ Clear input
    }
  };
  
  // ✅ Only update messages inside the socket listener
  useEffect(() => {
    socket.on("message", (msg) => {
      console.log("Received message:", msg);
  
      if (!msg || typeof msg !== "object" || !msg.message) {
        console.error("Invalid message received:", msg);
        return;
      }
  
      setMessages((prevMessages) => [...prevMessages, msg]); // ✅ Append only once
    });
  
    return () => {
      socket.off("message"); // Cleanup on unmount
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold m-5">Chats</h1>
      <div className="flex gap-4 ml-5">
        {/* Chat Sidebar */}
        <div className="w-1/3 h-full rounded-2xl border-2 border-gray-200 flex flex-col">
          {/* Search Box */}
          <div className="flex items-center gap-2 border-b-2 border-gray-200 px-3 py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.146 12.3707 1.888 11.112C0.63 9.85333 0.000667196 8.316 5.29101e-07 6.5C-0.000666138 4.684 0.628667 3.14667 1.888 1.888C3.14733 0.629333 4.68467 0 6.5 0C8.31533 0 9.853 0.629333 11.113 1.888C12.373 3.14667 13.002 4.684 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.81267 10.5627 9.688 9.688C10.5633 8.81333 11.0007 7.75067 11 6.5C10.9993 5.24933 10.562 4.187 9.688 3.313C8.814 2.439 7.75133 2.00133 6.5 2C5.24867 1.99867 4.18633 2.43633 3.313 3.313C2.43967 4.18967 2.002 5.252 2 6.5C1.998 7.748 2.43567 8.81067 3.313 9.688C4.19033 10.5653 5.25267 11.0027 6.5 11Z"
                fill="#696969"
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="outline-none w-full text-gray-600 bg-transparent"
            />
          </div>

          {/* Messages List */}
          <div className="flex-1 flex flex-col gap-2 p-3 overflow-auto">
            {senders.map((sender) => (
              <div
                key={sender.id} // Ensure correct ID key
                className={`flex items-center gap-2 border-b-2 border-gray-200 p-3 w-full cursor-pointer ${
                  selectedSender?.id === sender.id ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedSender(sender)}
              >
                {/* Profile Icon (Replace with sender.image if available) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M16 1C7.7155 1 1 7.7155 1 16C1 24.2845 7.7155 31 16 31C24.2845 31 31 24.2845 31 16C31 7.7155 24.2845 1 16 1Z"
                    stroke="#232323"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.40625 25.5191C4.40625 25.5191 7.74975 21.2501 15.9998 21.2501C24.2498 21.2501 27.5947 25.5191 27.5947 25.5191M15.9998 16.0001C17.1932 16.0001 18.3378 15.526 19.1817 14.6821C20.0256 13.8382 20.4998 12.6936 20.4998 11.5001C20.4998 10.3066 20.0256 9.16202 19.1817 8.31811C18.3378 7.4742 17.1932 7.00009 15.9998 7.00009C14.8063 7.00009 13.6617 7.4742 12.8178 8.31811C11.9739 9.16202 11.4998 10.3066 11.4998 11.5001C11.4998 12.6936 11.9739 13.8382 12.8178 14.6821C13.6617 15.526 14.8063 16.0001 15.9998 16.0001Z"
                    stroke="#232323"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Sender Name & Email */}
                <div className="ml-2 flex-1">
                  <p className="font-medium text-gray-800">
                    {sender.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {sender.email || "No Email"}
                  </p>
                </div>
              </div>
            ))}

            {/* Message 2
            <div className="flex items-center gap-2 px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  d="M16 1C7.7155 1 1 7.7155 1 16C1 24.2845 7.7155 31 16 31C24.2845 31 31 24.2845 31 16C31 7.7155 24.2845 1 16 1Z"
                  stroke="#232323"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.40625 25.5191C4.40625 25.5191 7.74975 21.2501 15.9998 21.2501C24.2498 21.2501 27.5947 25.5191 27.5947 25.5191M15.9998 16.0001C17.1932 16.0001 18.3378 15.526 19.1817 14.6821C20.0256 13.8382 20.4998 12.6936 20.4998 11.5001C20.4998 10.3066 20.0256 9.16202 19.1817 8.31811C18.3378 7.4742 17.1932 7.00009 15.9998 7.00009C14.8063 7.00009 13.6617 7.4742 12.8178 8.31811C11.9739 9.16202 11.4998 10.3066 11.4998 11.5001C11.4998 12.6936 11.9739 13.8382 12.8178 14.6821C13.6617 15.526 14.8063 16.0001 15.9998 16.0001Z"
                  stroke="#232323"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="ml-2">
                <p className="font-medium text-gray-800">Jane Doe</p>
                <p className="text-sm text-gray-500">See you later!</p>
              </div>
            </div> */}
          </div>
        </div>

        {/* Chat Window */}
        <div className="w-3/5 h-full rounded-2xl border-2 border-gray-200 flex flex-col">
          {/* Chat Info Section */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-300 px-7">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
            >
              <path
                d="M22 2C10.954 2 2 10.954 2 22C2 33.046 10.954 42 22 42C33.046 42 42 33.046 42 22C42 10.954 33.046 2 22 2Z"
                stroke="#232323"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.54199 34.6921C6.54199 34.6921 11 29.0001 22 29.0001C33 29.0001 37.46 34.6921 37.46 34.6921M22 22.0001C23.5913 22.0001 25.1174 21.368 26.2426 20.2428C27.3679 19.1175 28 17.5914 28 16.0001C28 14.4088 27.3679 12.8827 26.2426 11.7575C25.1174 10.6323 23.5913 10.0001 22 10.0001C20.4087 10.0001 18.8826 10.6323 17.7574 11.7575C16.6321 12.8827 16 14.4088 16 16.0001C16 17.5914 16.6321 19.1175 17.7574 20.2428C18.8826 21.368 20.4087 22.0001 22 22.0001Z"
                stroke="#232323"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div className="leading-tight ml-1.5">
              <p className="text-lg font-semibold">Shakira Regalado</p>
              <p className="text-sm text-gray-500">Active Now</p>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <p key={index} className="text-gray-700 mb-2">
                <span className="font-bold">{msg.senderId}: </span>{" "}
                {msg.message}
              </p>
            ))}
          </div>

          {/* Message Input Section */}
          <div className="flex items-center gap-3 p-4 border-t border-gray-300 px-7">
          <input
  type="text"
  placeholder="Type a message..."
  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
  value={message}
  onChange={(e) => {
    console.log("Message input:", e.target.value);
    setMessage(e.target.value);
  }}
/>
            <button type="button" onClick={sendMessage} className="p-2">
              <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="20"
                viewBox="0 0 24 20"
                fill="none"
              >
                <path
                  d="M0 20V0L24 10L0 20ZM2.52632 16.25L17.4947 10L2.52632 3.75V8.125L10.1053 10L2.52632 11.875V16.25Z"
                  fill="black"
                />
              </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
