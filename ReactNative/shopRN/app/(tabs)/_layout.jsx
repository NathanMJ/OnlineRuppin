import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen 
          name="register"
          options={{
            title: "Register",
          }}></Tabs.Screen>
          <Tabs.Screen
            name="login"
            options={{
              title: "Login",
            }}></Tabs.Screen>
    </Tabs>
  )
}