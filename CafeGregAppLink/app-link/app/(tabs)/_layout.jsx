import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="main" options={{
                title: "My orders",
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="table-bar" size={size} color={color} />
                ),
            }}></Tabs.Screen>
            <Tabs.Screen name="menu" options={{ title: "Menu",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="fast-food" size={size} color={color} />
                )}}></Tabs.Screen>
        </Tabs>
    )
}