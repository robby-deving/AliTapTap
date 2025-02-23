import { useEffect } from "react";
import { View, Text } from "react-native";
import io from "socket.io-client";

export default function ChatScreen() {
  useEffect(() => {
    const socket = io("http://192.168.1.7:3000");

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold">Chat Screen</Text>
    </View>
  );
}
