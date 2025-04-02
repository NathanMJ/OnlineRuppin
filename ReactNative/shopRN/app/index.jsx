import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Welcome to THE shop !</Text>

      <Button title="login" onPress={() => router.navigate('./login')}></Button>
      <Button title="register" onPress={() => router.navigate('./register')}></Button>



    </View>
  );
}
