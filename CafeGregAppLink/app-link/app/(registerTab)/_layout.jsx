import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="login" options={{
                title: "Login",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person" size={size} color={color} />
                )
            }}></Tabs.Screen>
            <Tabs.Screen name="register" options={{
                title: "Register",
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="person" size={size} color={color} />
                ),
            }}></Tabs.Screen>
        </Tabs>
    )
}