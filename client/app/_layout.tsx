import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import "../global.css";

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="shipping" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="review" />
        <Stack.Screen name="success" />
        <Stack.Screen name="addresses" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}