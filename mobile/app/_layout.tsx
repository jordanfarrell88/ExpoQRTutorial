import { Stack } from "expo-router";

export default function Layout() {
  return (
  <Stack 
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="(auth)" />
    <Stack.Screen name="index" />
    <Stack.Screen name="product-scanned" />
  </Stack>
  )
}
