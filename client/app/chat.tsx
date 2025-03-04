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

export default function ChatScreen() {
  const [chatMessage, setChatMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = io("http://192.168.1.19:4000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to server");
    });

    newSocket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]); // Append messages normally
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const submitChatMessage = async () => {
    if (!socket || chatMessage.trim() === "") return;
  
    try {
      // Retrieve the senderId from AsyncStorage (or wherever you store auth data)
      const senderId = await AsyncStorage.getItem("userId"); // Ensure this is set when user logs in
      const receiverId = "67b14d4255dbde56064ce4a5"; // Fixed receiverId
  
      if (!senderId) {
        console.error("User ID not found. Make sure the user is logged in.");
        return;
      }
  
      const response = await fetch("http://192.168.1.19:4000/api/v1/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId,
          receiverId,
          message: chatMessage,
        }),
      });
  
      const data = await response.json();
      console.log("Response from backend:", data);
  
      if (!response.ok) {
        console.error("Failed to send message to backend:", data);
        return;
      }
  
      socket.emit("message", data.message);
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
        {/* Messages List (Appears Just Above Input Box) */}
        <View className="flex-1 w-full">
          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View className="flex-row justify-end mb-2">
                <Text className="bg-yellow-200 py-3 rounded-2xl min-h-12 text-xl px-4 max-w-[75%] text-black">
                  {item}
                </Text>
              </View>
            )}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }} // Moves messages to the bottom
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
            onSubmitEditing={submitChatMessage} // ⬅️ Press Enter to send
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
