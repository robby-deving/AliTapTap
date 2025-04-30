import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { uploadImageToChat } from "../hooks/cloudinary.ts";
import { useAuth } from "@/context/AuthContext";


//const socket = io("https://api.alitaptap.me/api/v1"); // Backend URL

export default function Chats() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    {
      senderId: string;
      message: string;
      imageUrl?: string;
      fromAdmin?: boolean;
    }[]
  >([]);
  const [senders, setSenders] = useState<
    {
      _id: string;
      first_name: string;
      last_name: string;
      email: string;
      latestMessage: string;
      timestamp: string;
      latestMessageTimeFormatted?: string;
    }[]
  >([]);
  const [selectedSender, setSelectedSender] = useState<{
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    name: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  const [socket, setSocket] = useState<any>(null);

  const userId = user?._id // Logged-in user's ID
  console.log("userId:", userId); // Debugging
  
  // Scroll function
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // Keep the same URL
    const newSocket = io("https://api.alitaptap.me/api/v1", {
      transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });
    
    // Add event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });
    
    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      // You could set a state here to show a connection error UI
    });
    
    // Store socket in state
    setSocket(newSocket);
    
    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Run effect when messages update
  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [messages]);

  useEffect(() => {
    if (!userId) {
      console.error("No userId found in localStorage");
      return;
    }

    // Fetch senders who messaged the current user
    const fetchSenders = async () => {
      try {
        const response = await fetch(
          `https://api.alitaptap.me/api/v1/chat/senders/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch senders");

        const data = await response.json();
        console.log("Fetched senders:", data);

        // Format the time in AM/PM format
        const formatTime = (dateString: string): string => {
          if (!dateString) {
            console.error("Invalid date string:", dateString);
            return "Invalid Time"; // Return a fallback value in case of invalid date
          }

          const date = new Date(dateString.replace(" ", "T")); // Convert to ISO format

          if (isNaN(date.getTime())) {
            console.error("Invalid date string:", dateString);
            return "Invalid Time"; // Return a fallback value in case of invalid date
          }

          let hours = date.getHours();
          let minutes = date.getMinutes();
          const ampm = hours >= 12 ? "PM" : "AM";

          // Convert 24-hour time to 12-hour time
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'

          // Ensure minutes are always displayed as two digits
          const formattedMinutes =
            minutes < 10 ? "0" + minutes : String(minutes); // Ensure it's a string

          const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;
          return formattedTime;
        };

        // For each sender, fetch the latest message and format the timestamp time
        const sendersWithMessages = await Promise.all(
          data.senders.map(async (sender: any) => {
            console.log("Sender data:", sender); // Debug the sender data to check the timestamp field
            const latestMessageResponse = await fetch(
              `https://api.alitaptap.me/api/v1/chat/latest/${sender._id}/${userId}`
            );
            const latestMessageData = await latestMessageResponse.json();

            console.log("Latest message data:", latestMessageData); // Log this to inspect the API response

            const latestMessage =
              latestMessageData.message || "No messages yet";
            const latestMessageTime = latestMessageData.timestamp || ""; // Check if timestamp is returned properly

            // If the timestamp is missing, log an error and skip processing this sender
            if (!latestMessageTime) {
              console.error("No timestamp found for sender:", sender._id);
            }

            return {
              ...sender,
              latestMessage,
              timestamp: latestMessageTime, // Adding timestamp here
              latestMessageTimeFormatted: formatTime(latestMessageTime), // Format time here
            };
          })
        );

        setSenders(sendersWithMessages);
      } catch (error) {
        console.error("Error fetching senders:", error);
      }
    };

    fetchSenders();
  }, [userId]);

  // Fetch chat messages when a sender is selected
  useEffect(() => {
    if (!selectedSender || !userId) return;
  
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `https://api.alitaptap.me/api/v1/chat/messages/${selectedSender._id}/${userId}`
        );
  
        if (!response.ok) throw new Error("Failed to fetch messages");
  
        const data = await response.json();
        setMessages(data.messages || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
  
    fetchMessages(); // initial fetch
    const interval = setInterval(fetchMessages, 1000); // fetch every second
  
    return () => clearInterval(interval); // cleanup
  }, [selectedSender, userId]);

  // Function to handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter senders based on the search query
  const filteredSenders = senders.filter((sender) =>
    `${sender.first_name} ${sender.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      console.log("Selected file:", selectedFile);

      // Add temporary message to show sending status
      const tempMessageId = Date.now().toString(); // Unique ID for temporary message
      setMessages(prev => [...prev, {
        senderId: userId || '',
        message: 'Sending image...',
        fromAdmin: true,
        tempId: tempMessageId // Add temporary ID to identify this message
      }]);

      try {
        console.log("Uploading image...");
        const imageUrl = await uploadImageToChat(selectedFile);
        console.log("Uploaded image URL:", imageUrl);

        if (!imageUrl) {
          console.error("Upload failed: No URL returned");
          // Remove temporary message on failure
          setMessages(prev => prev.filter(msg => !('tempId' in msg) || msg.tempId !== tempMessageId));
          return;
        }

        // Remove temporary message only
        setMessages(prev => prev.filter(msg => !('tempId' in msg) || msg.tempId !== tempMessageId));
        
        // Send the message with image URL through socket only
        sendMessage(imageUrl);
      } catch (error) {
        console.error("Image upload failed:", error);
        // Remove temporary message on failure
        setMessages(prev => prev.filter(msg => !('tempId' in msg) || msg.tempId !== tempMessageId));
      }
    }
  };

    const sendMessage = async (uploadedImageUrl: string = "") => {
    console.log("Sending message with image URL:", uploadedImageUrl);
  
    const trimmedMessage = message.trim();
    const finalMessage = trimmedMessage || uploadedImageUrl; // Use image URL if no text
  
    if (!finalMessage) return; // Prevent sending empty messages
  
    if (!selectedSender?._id || !userId) {
      console.error("Missing sender or receiver ID");
      return;
    }
  
    // Keep these IDs as they are - this is correct based on your explanation
    const chatMessage = {
      senderId: selectedSender._id, // Mobile user is sender
      receiverId: userId,          // Admin is receiver
      message: finalMessage,        
      fromAdmin: true,             // This flag indicates message is from admin
      timestamp: new Date().toISOString() // Add timestamp for ordering
    };
  
    // 👇 THIS IS THE CRITICAL FIX - OPTIMISTIC UI UPDATE
    // Add message to UI immediately, so you see it right away
    setMessages(prevMessages => [
      ...prevMessages, 
      {
        ...chatMessage,
        // Invert the "fromAdmin" flag for display purposes
        // Since the API uses "fromAdmin: true" to indicate message is FROM admin
        // But in your UI, we need to know if it's TO BE DISPLAYED as an admin message
        fromAdmin: true  
      }
    ]);
    
    // Clear input immediately for better UX
    setMessage("");
  
    try {
      const response = await fetch("https://api.alitaptap.me/api/v1/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chatMessage),
      });
  
      if (!response.ok) throw new Error("Failed to send message");
  
      // Still emit to socket if available, but UI is already updated
      if (socket) {
        socket.emit("message", chatMessage);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally: Add error handling like showing a failed indicator on the message
    }
  };

  useEffect(() => {
    if (!socket) return;
    
    const handleMessage = (msg: any) => {
      console.log("New message received via socket:", msg);
      if (!msg || typeof msg !== "object" || (!msg.message && !msg.imageUrl)) return;
      setMessages((prevMessages) => [...prevMessages, msg]);
    };
    
    socket.on("message", handleMessage);
    
    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket]);

  //   const testUpload = async () => {
  //   const input = document.createElement("input");
  //   input.type = "file";
  //   input.accept = "image/*";

  //   input.onchange = async (e: Event) => {
  //     const target = e.target as HTMLInputElement;
  //     if (target.files && target.files[0]) {
  //       const testFile = target.files[0]; // Get a real image file
  //       console.log("Testing upload with file:", testFile);

  //       const result = await uploadImageToChat(testFile);
  //       console.log("Test upload result:", result);
  //     }
  //   };

  //   input.click(); // Open file picker
  // };

  // testUpload();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold m-5">Chats</h1>
      <div className="flex gap-4 ml-5 h-screen">
        {/* Chat Sidebar */}
        <div className="w-1/3 h-3/4 rounded-2xl border-2 border-gray-200 flex flex-col">
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
              value={searchQuery} // Bind the input to searchQuery
              onChange={handleSearchChange} // Update the search query on change
            />
          </div>

          {/* Messages List */}
          <div className="flex-1 flex flex-col pt-0 p-1 overflow-auto">
            {/* Render filtered senders */}
            {filteredSenders.map((sender) => (
              <div
                key={sender._id} // ✅ Use `_id`
                className={`flex items-center gap-2 border-b-2 border-gray-200 p-3 w-full cursor-pointer ${
                  selectedSender?._id === sender._id ? "bg-gray-100" : ""
                }`}
                onClick={() =>
                  setSelectedSender({
                    _id: sender._id,
                    first_name: sender.first_name,
                    last_name: sender.last_name,
                    email: sender.email,
                    name: `${sender.first_name} ${sender.last_name}`, // Add name
                  })
                }
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

                {/* Sender First & Last Name and Latest Message */}
                <div className="ml-2 flex-1 flex flex-col">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-800">
                      {sender.first_name && sender.last_name
                        ? `${sender.first_name} ${sender.last_name}`
                        : "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500 ml-auto">
                      {sender.latestMessageTimeFormatted}
                    </p>
                  </div>

                  {/* Latest message below the name */}
                  <p className="text-sm text-gray-500 mt-1">
                    {sender.latestMessage
                      ? sender.latestMessage.length > 30
                        ? `${sender.latestMessage.slice(0, 30)}...`
                        : sender.latestMessage
                      : "No message yet"}
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
        <div className="w-3/5 h-3/4 rounded-2xl border-2 border-gray-200 flex flex-col">
          {/* Chat Info Section */}
          {selectedSender && (
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
                <p className="text-lg font-semibold">
                  {selectedSender
                    ? `${selectedSender.first_name} ${selectedSender.last_name}`
                    : "Unknown"}
                </p>
                <p className="text-sm text-gray-500">Active Now</p>
              </div>
            </div>
          )}

          {/* Chat Content */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto max-h-[70vh]"
          >
            {!selectedSender ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-center text-gray-500">Select a chat</p>
              </div>
            ) : (
              <>
                

                {messages.map((msg, index) => {
                  const isAdmin = msg.fromAdmin;
                  const isImage = msg.message.startsWith("http");

                  return (
                    <div
                      key={index}
                      className={`flex ${
                        isAdmin ? "justify-end" : "justify-start"
                      } mb-2`}
                    >
                      {isImage ? (
                        <img
                          src={msg.message}
                          alt="Sent Image"
                          className="max-w-xs rounded-lg"
                          onLoad={scrollToBottom}
                        />
                      ) : (
                        <p
                          className={`${
                            isAdmin
                              ? "bg-yellow-100 text-black"
                              : "bg-gray-100 text-black"
                          } py-2 px-4 rounded-lg max-w-[75%] whitespace-pre-wrap`}
                        >
                          {msg.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Message Input Section */}
          {selectedSender && (
            <div className="flex items-center gap-3 p-4 border-t border-gray-300 px-7">
              <div className="mb-1 mr-2">
                <label htmlFor="upload-input" className="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                  >
                    <path
                      d="M0 0H22V22H0V0ZM2.2 19.8H17.1446L7.7 10.3554L2.2 15.8554V19.8ZM19.8 19.3446V2.2H2.2V12.7446L7.7 7.2446L19.8 19.3446ZM14.9017 5.5C14.61 5.5 14.3302 5.61589 14.1239 5.82218C13.9176 6.02847 13.8017 6.30826 13.8017 6.6C13.8017 6.89174 13.9176 7.17153 14.1239 7.37782C14.3302 7.58411 14.61 7.7 14.9017 7.7C15.1934 7.7 15.4732 7.58411 15.6795 7.37782C15.8858 7.17153 16.0017 6.89174 16.0017 6.6C16.0017 6.30826 15.8858 6.02847 15.6795 5.82218C15.4732 5.61589 15.1934 5.5 14.9017 5.5ZM11.6017 6.6C11.6017 5.72479 11.9494 4.88542 12.5682 4.26655C13.1871 3.64768 14.0265 3.3 14.9017 3.3C15.7769 3.3 16.6163 3.64768 17.2352 4.26655C17.854 4.88542 18.2017 5.72479 18.2017 6.6C18.2017 7.47521 17.854 8.31458 17.2352 8.93345C16.6163 9.55232 15.7769 9.9 14.9017 9.9C14.0265 9.9 13.1871 9.55232 12.5682 8.93345C11.9494 8.31458 11.6017 7.47521 11.6017 6.6Z"
                      fill="#BEBEBE"
                    />
                  </svg>
                </label>
                <input
                  id="upload-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <textarea
                placeholder="Type a message..."
                className="flex-1 h-11 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Prevents default Enter behavior
                    sendMessage(message); // Send message as-is (with new lines)
                    setMessage(""); // Clear input after sending
                  }
                }}
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                className="p-2"
              >
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
                      fill="#FDDF05"
                    />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
