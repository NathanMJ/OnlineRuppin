import { ImageBackground } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FCEveryOrdersMain from "../FuncComps/FCEveryOrdersMain.jsx";
import { LinkAppContext } from "../LinkAppContext.jsx";

export default function main() {
  //TODO: get id of the table according to the link id
  //TODO: get orders of the table according to the id table

  const { linkApp, setLinkApp } = useContext(LinkAppContext);

  const [orders, setOrders] = useState([{ "id": 0, "img": "https://www.simplyorganic.com/media/recipe/resized/520x520/wysiwyg/tmp/simply-oragnic-Roasted-Tomato-Bruschetta-1080x1080-thumbnail.jpg", "name": "Bruschetta", "price": 7.5, "status": { "backgroundColor": "green", "color": "white", "id": 1, "status": "Ordered" } }, { "id": 1, "img": "https://img.taste.com.au/5qlr1PkR/taste/2016/11/spaghetti-bolognese-106560-1.jpeg", "name": "Spaghetti Bolognese", "price": 12.5, "status": { "backgroundColor": "red", "color": "white", "id": 0, "status": "Pending" } }])

  const clickOnRegister = () => {
    router.push({ pathname: "(registerTab)/login" })
  }



  const fetchOrders = async () => {
    //TODO: the orders are not fetched for real here
    return
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

