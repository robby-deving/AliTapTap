import { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import io, { Socket } from "socket.io-client";
import { Header } from "../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define constants for IP address and host
const SERVER_IP = "192.168.1.4"; // Change this when needed
const SERVER_PORT = "4000";
const API_BASE_URL = `http://${SERVER_IP}:${SERVER_PORT}`;
const SOCKET_URL = `http://${SERVER_IP}:${SERVER_PORT}`;

export default function ChatScreen() {
  const [chatMessage, setChatMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<
    {
      senderId: string;
      receiverId: string;
      message: string;
      fromAdmin?: boolean;
    }[]
  >([]);
  const [senderId, setSenderId] = useState<string | null>(null);
  const receiverId = "67c00e4097fb8a5aeb426db5"; // Fixed receiverId

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const storedSenderId = await AsyncStorage.getItem("userId");
        if (!storedSenderId) {
          console.error("User ID not found. Make sure the user is logged in.");
          return;
        }
        setSenderId(storedSenderId);

        const response = await fetch(
          `${API_BASE_URL}/api/v1/chat/messages/${storedSenderId}/${receiverId}`
        );
        const data = await response.json();
        if (response.ok) {
          setMessages(data.messages);
        } else {
          console.error("Failed to fetch messages:", data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to server");
    });

    newSocket.on("message", (msg) => {
      console.log("Received message:", msg);

      // Ensure the message is not already in the state
      setMessages((prevMessages) => {
        if (!prevMessages.some((m) => m.message === msg.message)) {
          return [...prevMessages, msg];
        }
        return prevMessages;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const submitChatMessage = async () => {
    if (!socket || chatMessage.trim() === "" || !senderId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId,
          receiverId,
          message: chatMessage,
          fromAdmin: false, // Hardcoded to false
        }),
      });

      const data = await response.json();
      console.log("Response from backend:", data);

      if (!response.ok) {
        console.error("Failed to send message:", data);
        return;
      }

      // Emit message to socket
      socket.emit("message", {
        senderId,
        receiverId,
        message: chatMessage,
        fromAdmin: false, // Ensuring consistency in socket message
      });

      setChatMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <View className="flex-1 relative bg-white">
      <View className="bg-[#231F20]">
        <Header />
      </View>

      <View className="flex-1 bg-white p-5">
        {/* Messages List */}
        <View className="flex-1 w-full">
          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              const isLeftAligned = item.fromAdmin;

              return (
                <View
                  className={`flex-row ${
                    isLeftAligned ? "justify-start" : "justify-end"
                  } mb-2`}
                >
                  <Text
                    className={`${
                      isLeftAligned ? "bg-gray-200" : "bg-yellow-200"
                    } py-3 rounded-2xl min-h-12 text-xl px-4 max-w-[75%] text-black`}
                  >
                    {item.message}
                  </Text>
                </View>
              );
            }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
            keyboardShouldPersistTaps="handled"
          />
        </View>

        {/* Message Input & Send Button */}
        <View className="flex-row items-center w-full p-2">
          <TextInput
            autoCorrect={false}
            value={chatMessage}
            onChangeText={setChatMessage}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 p-2 rounded h-12 text-gray-700"
            onSubmitEditing={submitChatMessage}
          />
          <TouchableOpacity onPress={submitChatMessage} className="ml-2">
            <Image
              source={require("../assets/images/Vector.png")}
              style={{ width: 24, height: 20 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}