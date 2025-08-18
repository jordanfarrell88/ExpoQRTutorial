import { Stack } from "expo-router";
import { DeliveryProvider } from "./context/DeliveryContext";

export default function Layout() {
  return (

  <DeliveryProvider>
      <Stack 
      screenOptions={{
        headerShown: false,
        
      }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="index" />
        <Stack.Screen name="deliveries/product-scanned" />
        <Stack.Screen name="deliveries/recent-deliveries" />
        <Stack.Screen name="storage/unstored" />
      </Stack>
  </DeliveryProvider>
  
  )
}
