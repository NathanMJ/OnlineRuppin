import { Link, useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 25
      }}
    >
      <Text style={{
        fontSize: 20
      }}>Welcome to THE shop !</Text>

      <Link href="(tabs)/register"
        style={{
          color: 'white',
          backgroundColor: 'orange',
          borderRadius: 10,
          fontWeight: 'bold',
          fontSize: 20,
          borderColor: 'rgb(122, 56, 12)', 
          borderWidth: 2, 
          padding: 5, 
          margin: 5,
        }}>Enter the shop</Link>

    </View >
  );
}
