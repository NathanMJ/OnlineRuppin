import { Link, useFocusEffect,  useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Button, Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUsers, setInitialUsers, addUser} from './dbUsers';

export default function Index() {

  const router = useRouter();

  //to test a page direcly without going through the pages
  useFocusEffect(
    React.useCallback(() => {
      router.replace({
        pathname: "/(tabs)/login",
      });
    }, [])
  );

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
