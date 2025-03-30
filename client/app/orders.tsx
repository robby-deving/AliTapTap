import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Header } from "../components/Header";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { base_url } from "@env";


interface FormattedOrder {
  id: string;
  title: string;
  material: string;
  quantity: number;
  price: number;
  orderNumber: string;
  design_id: string;
  status: string;
  front_image: string;
  back_image: string;
}

export default function Orders() {
  const router = useRouter();
  const [user, setUser] = useState<{_id: string} | null>(null);
  const [orders, setOrders] = useState<FormattedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'To Received' | 'Completed'>('To Received');
  const Base_Url = `http://${base_url}:4000`;

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          
          setUser(parsedUserData);
        }
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Failed to load user data');
      }
    };

    initializeUser();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;

      try {
        const response = await axios.get(`${Base_Url}/api/v1/orders/get-orders/customer/${user._id}`);

        if (!response.data || !response.data.data || response.data.data.length === 0) {
          setOrders([]);
          setError('No orders found');
          return;
        }

        const formattedOrders = response.data.data.map(order => ({
          id: order._id,
          title: order.design_id.name,
          material: order.details.material,
          quantity: order.quantity,
          design_id: order.design_id._id,
          price: order.total_price,
          orderNumber: order._id.substring(0, 8),
          status: order.order_status,
          front_image: order.front_image,
          back_image: order.back_image
        }));

        setOrders(formattedOrders);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError('No orders found yet');
        } else {
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
          setError(errorMessage);
        }
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchOrders();
    }
  }, [user]);

  const handleOrderPreview = (order: FormattedOrder) => {
    router.push({
      pathname: '/order-preview',
      params: {
        id: order.id, // Add this to pass the order ID
        title: order.title,
        material: order.material,
        quantity: order.quantity.toString(),
        price: order.price.toString(),
        orderNumber: order.orderNumber,
        design_id: order.design_id, // Now this is already the ID string
        status: order.status,
        front_image: order.front_image,
        back_image: order.back_image
      }
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-white">
        <Header />
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-xl text-center mb-4">
            {error === 'No orders found' || error === 'No orders found yet' 
              ? "You haven't placed any orders yet"
              : `Error: ${error}`
            }
          </Text>
          <TouchableOpacity 
            onPress={() => router.push('/productcatalogue')}
            className="bg-[#FFE300] px-6 py-3 rounded-full"
          >
            <Text className="font-semibold">Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header (Fixed) */}
      <Header />

      {/* Fixed Title and Tabs */}
      <View className="px-8 py-5 w-full items-center">
        <Text className="font-semibold text-3xl border-b-4 pb-2 border-[#FFE300] mt-5 mb-4">
          My Orders
        </Text>
        <View className="w-full">
          {/* Order Status Tabs (Fixed) */}
          <View className="flex-row justify-evenly mb-1 mt-3">
            <Text className={`text-black-500 font-bold ${activeTab === 'To Received' ? 'text-black' : 'text-gray-500'}`} onPress={() => setActiveTab('To Received')}>
              To Receive
            </Text>
            <Text className={`text-black-500 font-bold ${activeTab === 'Completed' ? 'text-black' : 'text-gray-500'}`} onPress={() => setActiveTab('Completed')}>
              Completed
            </Text>
          </View>
        </View>
      </View>

      {/* Scrollable Orders Section */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-8 w-full">
          {/* Order List */}
          {orders
            .filter(order => activeTab === 'To Received' 
              ? order.status !== 'Delivered' 
              : order.status === 'Delivered'
            )
            .map((order) => (
            <TouchableOpacity
              key={order.id}
              onPress={() => handleOrderPreview(order)}
              className="border border-gray-200 p-5 rounded-lg bg-white mb-4"
            >
              <View>
                {/* Status Badge at the Top */}
                <View className="flex-row justify-between mb-2">
                <View>
                      <Text className="text-black text-sm">
                        Order Number: {order.orderNumber}
                      </Text>
                    </View>
                  <View className="border bg-[#FFFDEB] border-[#FFE300] p-1.5 rounded w-24 items-center">
                    <Text className="text-[#FDDF05] text-center text-xs font-bold">
                      {order.status}
                    </Text>
                  </View>
                </View>

                {/* Order Details */}
                <View className="flex-row">
                  <Image
                    source={{ uri: order.front_image }}
                    style={{ width: 150, height: 100, borderRadius: 10 }}
                    className="self-center"
                  />
                  <View className="flex-1 ml-4">
                    <Text className="text-black font-semibold text-xl mb-2">
                      {order.title}
                    </Text>
                    <View className="mb-1">
                      <Text className="text-black text-sm">
                        Material: {order.material}
                      </Text>
                    </View>
                    <View className="mb-1">
                      <Text className="text-black text-sm">
                        Quantity: {order.quantity}
                      </Text>
                    </View>
                    <View className="mb-1">
                      <Text className="text-black text-sm">
                        Price: P{order.price.toFixed(2)}
                      </Text>
                    </View>

                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}