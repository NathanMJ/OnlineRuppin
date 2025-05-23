import { Stack } from "expo-router";

export default function RootLayout() {
  return <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index"></Stack.Screen>
        <Stack.Screen name="(tabs)"></Stack.Screen>
      </Stack>
    </>;
}


/*
        <Stack.Screen name="login" options={{ title: "Login" }}></Stack.Screen>
        <Stack.Screen name="register" options={{ title: "Register" }}></Stack.Screen>
        <Stack.Screen name="(tabs)" options={{ title: "Tabs" }}></Stack.Screen>
 */