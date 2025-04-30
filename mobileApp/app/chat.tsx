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
  StyleSheet,
} from "react-native";
import io, { Socket } from "socket.io-client";
import { Header } from "../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { uploadImageToChat } from "@/services/helperFunctions";
import { launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";

const API_BASE_URL = `https://api.alitaptap.me`;
const SOCKET_URL = `https://api.alitaptap.me`;

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
        } else if (response.status === 404) {
          // This is normal for new users - no existing messages
          console.log("No previous messages found. Start a new conversation!");
          
          // Add welcome message immediately for new users
          setMessages([{
            senderId: receiverId,
            receiverId: storedSenderId,
            message: "Welcome to AliTapTap! How can we help you today?",
            fromAdmin: true
          }]);
        } else {
          console.error("Error fetching messages:", data.message);
        }
      } catch (error) {
        console.error("Network error fetching messages:", error);
      }
    };
  
    fetchMessages();
  
    // Set up interval to fetch messages but with a reasonable delay
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 5000); // Changed to 5 seconds to reduce API load
  
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
  
    newSocket.on("connect", () => {
      console.log("✅ Connected to server");
    });
  
    // Handle incoming socket messages
    newSocket.on("message", (msg) => {
      console.log("Received message:", msg);
      // Add new messages from socket to our messages array
      setMessages(prevMessages => [...prevMessages, msg]);
    });
  
    return () => {
      clearInterval(intervalId);
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
          const uploadedUrl = await uploadImageToChat(
            uri,
            senderId,
            receiverId
          );
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
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.chatContainer}>
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
                  style={[
                    styles.messageRow,
                    isLeftAligned ? styles.leftAligned : styles.rightAligned,
                  ]}
                >
                  {isImageMessage ? (
                    <View
                      style={[
                        styles.imageMessageContainer,
                        isLeftAligned
                          ? styles.leftMessage
                          : styles.rightMessage,
                      ]}
                    >
                      {item.message === "sending" ? (
                        <Text style={styles.sendingText}>Sending Image...</Text>
                      ) : (
                        <Image
                          source={{ uri: item.message }}
                          style={styles.chatImage}
                        />
                      )}
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.messageText,
                        isLeftAligned
                          ? styles.leftMessage
                          : styles.rightMessage,
                      ]}
                    >
                      {item.message}
                    </Text>
                  )}
                </View>
              );
            }}
            contentContainerStyle={styles.flatListContent}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => {
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }}
          />

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.attachButton}
              onPress={handleImagePicker}
            >
              <Image
                source={require("../assets/images/Vector1.png")} // Use an existing image
                style={{
                  width: 24,
                  height: 20,
                  resizeMode: "contain", // This preserves aspect ratio
                }}
              />
            </TouchableOpacity>

            <TextInput
              autoCorrect={false}
              value={chatMessage}
              onChangeText={setChatMessage}
              placeholder="Type a message..."
              style={styles.input}
              onSubmitEditing={submitChatMessage}
            />

            <TouchableOpacity
              onPress={submitChatMessage}
              style={styles.sendButton}
            >
              <Image
                source={require("../assets/images/Vector.png")}
                style={styles.sendIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    position: "relative",
  },
  headerContainer: {
    backgroundColor: "#231F20",
  },
  keyboardView: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    paddingBottom: 12,
    paddingTop: 0,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  leftAligned: {
    justifyContent: "flex-start",
  },
  rightAligned: {
    justifyContent: "flex-end",
  },
  imageMessageContainer: {
    padding: 8,
    borderRadius: 16,
    maxWidth: "75%",
  },
  leftMessage: {
    backgroundColor: "#E5E7EB",
  },
  rightMessage: {
    backgroundColor: "#FEF9C3",
  },
  sendingText: {
    color: "#6B7280",
    fontStyle: "italic",
  },
  chatImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    backgroundColor: "#f3f3f3",
    borderRadius: 12,
  },
  messageText: {
    padding: 12,
    borderRadius: 16,
    minHeight: 48,
    fontSize: 20,
    paddingHorizontal: 16,
    maxWidth: "75%",
    color: "black",
  },
  flatListContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 8,
    paddingBottom: 0,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  attachButton: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 8,
    borderRadius: 4,
    height: 48,
    color: "#4B5563",
  },
  sendButton: {
    marginLeft: 8,
  },
  sendIcon: {
    width: 24,
    height: 20,
  },
});
