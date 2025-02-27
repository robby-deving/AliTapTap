import { useEffect, useState } from "react";
import { View, TextInput, Text, FlatList, Image, TouchableOpacity } from "react-native";
import io, { Socket } from "socket.io-client";
import { Header } from "../components/Header";

export default function ChatScreen() {
  const [chatMessage, setChatMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = io("http://192.168.1.8:4000");
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

  const submitChatMessage = () => {
    if (socket && chatMessage.trim() !== "") {
      socket.emit("message", chatMessage);
      setChatMessage("");
    }
  };

  return (
    <View className="flex-1 relative bg-white">
      <Header />

      <View className="flex-1 bg-white p-5">
        {/* Messages List (Appears Just Above Input Box) */}
        <View className="flex-1 w-full">
          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text className="bg-gray-100 py-3 rounded mb-2 min-h-12 text-xl px-4">{item}</Text>
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
            onSubmitEditing={submitChatMessage}
          />
          <TouchableOpacity onPress={submitChatMessage} className="ml-2">
            <Image source={require("../assets/images/Vector.png")} style={{ width: 24, height: 20 }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
