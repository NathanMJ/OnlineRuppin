import { ImageBackground } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FCEveryOrdersMain from "../FuncComps/FCEveryOrdersMain.jsx";
import { LinkAppContext } from "../LinkAppContext.jsx";
import { getOrdersByTableId } from "../database.js";

export default function main() {
  //TODO: get id of the table according to the link id
  //TODO: get orders of the table according to the id table

  const { linkApp, setLinkApp } = useContext(LinkAppContext);

  const [orders, setOrders] = useState([])

  const clickOnRegister = () => {
    router.push({ pathname: "(registerTab)/login" })
  }

  const fetchOrders = async () => {
    const tempOrders = await getOrdersByTableId(linkApp.tableId)
    setOrders(tempOrders)
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [linkApp.tableId])
  );


  const clickOnExit = () => {
    Alert.alert(
      'Disconnect',
      'Do you want to disconnect?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK', onPress: () => {
            router.push('/')
          }
        }
      ]
    );
  }

  return (
    <ImageBackground source={{
      uri: 'https://png.pngtree.com/background/20210709/original/pngtree-food-western-food-steak-tomato-picture-image_941801.jpg'
    }}
      style={styles.backgroundImage}
      blurRadius={0}>

      <View style={{ flexDirection: "row", paddingInline: 10, paddingBlock: 30, gap: 10 }}>
        <TouchableOpacity style={{ padding: 10, backgroundColor: 'rgb(86, 158, 104)', borderRadius: 10, flex: 1, }} onPress={clickOnRegister}>
          <Text style={{ fontSize: 30, textAlign: 'center', color: 'white' }}>Register/Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 10, backgroundColor: 'rgb(196, 40, 19)', borderRadius: 10, paddingInline: 10 }} onPress={clickOnExit}>
          <Text style={{ fontSize: 30, textAlign: 'center', color: 'white' }}>Exit</Text>
        </TouchableOpacity>
      </View>
      <View style={{
        backgroundColor: 'rgba(0,0,0,0.4)'
      }}>
        <Text style={{
          fontSize: 70,
          fontWeight: 700,
          color: 'rgb(255, 255, 255)',
          textAlign: 'center'
        }}>Your orders</Text>
      </View>
      <ScrollView>
        <FCEveryOrdersMain orders={orders}
          refreshOrders={fetchOrders} />
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    height: '100%'
  }
});

