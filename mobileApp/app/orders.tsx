import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { useRouter } from "expo-router";
import { Header } from "../components/Header";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const Base_Url = `https://api.alitaptap.me`;

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
        id: order.id,
        title: order.title,
        material: order.material,
        quantity: order.quantity.toString(),
        price: order.price.toString(),
        orderNumber: order.orderNumber,
        design_id: order.design_id,
        status: order.status,
        front_image: order.front_image,
        back_image: order.back_image
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error === 'No orders found' || error === 'No orders found yet' 
              ? "You haven't placed any orders yet"
              : `Error: ${error}`
            }
          </Text>
          <TouchableOpacity 
            onPress={() => router.push('/productcatalogue')}
            style={styles.startShoppingButton}
          >
            <Text style={styles.startShoppingText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.headerContainer}>
        <Text style={styles.title}>
          My Orders
        </Text>
        <View style={styles.tabContainer}>
          <View style={styles.tabsWrapper}>
            <Text 
              style={[
                styles.tabText,
                activeTab === 'To Received' && styles.activeTabText
              ]}
              onPress={() => setActiveTab('To Received')}
            >
              To Receive
            </Text>
            <Text 
              style={[
                styles.tabText,
                activeTab === 'Completed' && styles.activeTabText
              ]}
              onPress={() => setActiveTab('Completed')}
            >
              Completed
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.orderListContainer}>
          {orders
            .filter(order => activeTab === 'To Received' 
              ? order.status !== 'Delivered' 
              : order.status === 'Delivered'
            )
            .map((order) => (
              <TouchableOpacity
                key={order.id}
                onPress={() => handleOrderPreview(order)}
                style={styles.orderCard}
              >
                <View>
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={styles.orderNumber}>
                        Order Number: {order.orderNumber}
                      </Text>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>
                        {order.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.orderDetails}>
                    <Image
                      source={{ uri: order.front_image }}
                      style={styles.orderImage}
                    />
                    <View style={styles.detailsContainer}>
                      <Text style={styles.productTitle}>
                        {order.title}
                      </Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailText}>
                          Material: {order.material}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailText}>
                          Quantity: {order.quantity}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailText}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  errorText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 16
  },
  startShoppingButton: {
    backgroundColor: '#FFE300',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999
  },
  startShoppingText: {
    fontWeight: '600'
  },
  headerContainer: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    width: '100%',
    alignItems: 'center'
  },
  title: {
    fontWeight: '600',
    fontSize: 30,
    borderBottomWidth: 4,
    borderBottomColor: '#FFE300',
    paddingBottom: 8,
    marginTop: 20,
    marginBottom: 16
  },
  tabContainer: {
    width: '100%'
  },
  tabsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 4,
    marginTop: 12
  },
  tabText: {
    color: '#6B7280',
    fontWeight: '700'
  },
  activeTabText: {
    color: 'black'
  },
  scrollView: {
    flex: 1
  },
  orderListContainer: {
    paddingHorizontal: 32,
    width: '100%'
  },
  orderCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 16
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  orderNumber: {
    color: 'black',
    fontSize: 14
  },
  statusBadge: {
    borderWidth: 1,
    backgroundColor: '#FFFDEB',
    borderColor: '#FFE300',
    padding: 6,
    borderRadius: 4,
    width: 96,
    alignItems: 'center'
  },
  statusText: {
    color: '#FDDF05',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700'
  },
  orderDetails: {
    flexDirection: 'row'
  },
  orderImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
    alignSelf: 'center'
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 16
  },
  productTitle: {
    color: 'black',
    fontWeight: '600',
    fontSize: 20,
    marginBottom: 8
  },
  detailRow: {
    marginBottom: 4
  },
  detailText: {
    color: 'black',
    fontSize: 14
  }
});