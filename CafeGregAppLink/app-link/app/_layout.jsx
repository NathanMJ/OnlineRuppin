import { Stack } from "expo-router";
import LinkAppProvider from './LinkAppContext'
export default function RootLayout() {
  return <>
    <LinkAppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index"></Stack.Screen>
        <Stack.Screen name="(tabs)"></Stack.Screen>
      </Stack>
    </LinkAppProvider>
  </>;
}


/*
        <Stack.Screen name="login" options={{ title: "Login" }}></Stack.Screen>
        <Stack.Screen name="register" options={{ title: "Register" }}></Stack.Screen>
        <Stack.Screen name="(tabs)" options={{ title: "Tabs" }}></Stack.Screen>
 */