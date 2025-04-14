import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Home" }}></Stack.Screen>
        <Stack.Screen name="login" options={{ title: "Login" }}></Stack.Screen>
        <Stack.Screen name="register" options={{ title: "Register" }}></Stack.Screen>
        <Stack.Screen name="(tabs)" options={{ title: "Tabs" }}></Stack.Screen>
      </Stack>
    </>
  );
}
