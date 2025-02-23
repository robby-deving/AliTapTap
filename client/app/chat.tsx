import { useEffect, useState } from "react";
import { View, TextInput, Button, Text, ScrollView } from "react-native";
import io, { Socket } from "socket.io-client";

export default function ChatScreen() {
  const [chatMessage, setChatMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = io("http://192.168.1.7:3000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to server");
    });

    newSocket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
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
    <View className="flex-1 justify-center items-center bg-white p-5">
      <ScrollView className="w-full p-2">
        {messages.map((msg, index) => (
          <Text key={index} className="bg-gray-200 p-2 rounded mb-2">
            {msg}
          </Text>
        ))}
      </ScrollView>
      <TextInput
        autoCorrect={false}
        value={chatMessage}
        onChangeText={setChatMessage}
        placeholder="Type a message..."
        className="border border-gray-300 p-2 rounded w-full"
        onSubmitEditing={submitChatMessage}
      />
      <Button title="Send" onPress={submitChatMessage} />
    </View>
  );
}
