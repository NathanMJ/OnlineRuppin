import { Stack } from "expo-router";
import LinkAppProvider from './LinkAppContext'
export default function RootLayout() {
  return <>
    <LinkAppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index"></Stack.Screen>
        <Stack.Screen name="helpToConnect"></Stack.Screen>
        <Stack.Screen name="(tabs)"></Stack.Screen>
      </Stack>
    </LinkAppProvider>
  </>;
}

