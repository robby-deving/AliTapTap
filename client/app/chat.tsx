import { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import io, { Socket } from "socket.io-client";
import { Header } from "../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Vector1 from "../assets/images/Vector1.svg";
import axios from "axios";
import { uploadImageToChat } from "@/services/helperFunctions";
import { launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";

// Define constants for IP address and host
const SERVER_IP = "192.168.1.7"; // Change this when needed
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
  const flatListRef = useRef<FlatList<any>>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [sendingImage, setSendingImage] = useState(false);

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

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const submitImageMessage = async (imageUrl: string) => {
    if (!socket || !imageUrl || !senderId) return;

    setSendingImage(true); // ✅ Show "Sending Image..."

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId,
          receiverId,
          message: imageUrl,
          fromAdmin: false,
          isImage: true,
        }),
      });

      const data = await response.json();
      console.log("Response from backend:", data);

      if (!response.ok) {
        console.error("Failed to send image message:", data);
        return;
      }

      // Emit image message to socket
      socket.emit("message", {
        senderId,
        receiverId,
        message: imageUrl,
        fromAdmin: false,
        isImage: true,
      });

      setSendingImage(false); // ✅ Hide "Sending Image..."
    } catch (error) {
      console.error("Error sending image message:", error);
      setSendingImage(false); // ✅ Hide on error
    }
  };

  const handleImagePicker = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
  
      if (!result.canceled) {
        if (!senderId) {
          console.error("Sender ID is null. Make sure the user is logged in.");
          return;
        }
  
        const uri = result.assets[0].uri;
        console.log("Selected image URI:", uri);
  
        setSendingImage(true); // Show "Sending image..."
  
        try {
          console.log("Uploading image...");
          const uploadedUrl = await uploadImageToChat(uri, senderId, receiverId);
          console.log("Uploaded image URL:", uploadedUrl);
  
          if (!uploadedUrl) {
            console.error("Upload failed: No URL returned");
            setSendingImage(false);
            return;
          }
  
          setSendingImage(false); // Remove "Sending image..." indicator
          submitImageMessage(uploadedUrl);
        } catch (error) {
          console.error("Image upload failed:", error);
          setSendingImage(false); // Remove indicator on failure
        }
      } else {
        console.log("User cancelled image picker");
      }
    } catch (error) {
      console.error("ImagePicker Error: ", error);
    }
  };

  return (
    <View className="flex-1 relative bg-white">
      <View className="bg-[#231F20]">
        <Header />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-white p-5 pb-3 pt-0">
          {/* FlatList directly inside KeyboardAvoidingView */}
          <FlatList
            ref={flatListRef}
            data={[
              ...messages,
              ...(sendingImage ? [{ isImage: true, message: "sending" }] : []),
            ]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              const isLeftAligned = item.fromAdmin;
              const isImageMessage =
                item.isImage || item.message.startsWith("http");

              return (
                <View
                  className={`flex-row ${
                    isLeftAligned ? "justify-start" : "justify-end"
                  } mb-2`}
                >
                  {isImageMessage ? (
                    <View
                      className={`${
                        isLeftAligned ? "bg-gray-200" : "bg-yellow-200"
                      } py-2 rounded-2xl px-2 max-w-[75%]`}
                    >
                      {item.message === "sending" ? (
                        <Text className="text-gray-500 italic">
                          Sending Image...
                        </Text> // ✅ Show while uploading
                      ) : (
                        <Image
                          source={{ uri: item.message }}
                          className="rounded-xl"
                          style={{
                            width: 200,
                            height: 200,
                            resizeMode: "contain",
                            backgroundColor: "#f3f3f3",
                          }}
                        />
                      )}
                    </View>
                  ) : (
                    <Text
                      className={`${
                        isLeftAligned ? "bg-gray-200" : "bg-yellow-200"
                      } py-3 rounded-2xl min-h-12 text-xl px-4 max-w-[75%] text-black`}
                    >
                      {item.message}
                    </Text>
                  )}
                </View>
              );
            }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => {
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }}
          />

          {/* Message Input & Send Button */}
          <View className="flex-row items-center w-full p-2 pb-0 border-t border-gray-300">
            <TouchableOpacity className="mr-3" onPress={handleImagePicker}>
              <Vector1 width={24} height={20} fill="black" />
            </TouchableOpacity>

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
      </KeyboardAvoidingView>
    </View>
  );
}
