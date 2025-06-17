import { ImageBackground } from "expo-image";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FCEveryOrdersMain from "../FuncComps/FCEveryOrdersMain.jsx";
import { Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { LinkAppContext } from "../LinkAppContext.jsx";
import { useCallback, useContext, useEffect, useState } from "react";
import { getOrdersWithTableId } from '../database.js'

export default function main() {
  //TODO: get id of the table according to the link id
  //TODO: get orders of the table according to the id table

  const { linkApp, setLinkApp } = useContext(LinkAppContext);

  const [orders, setOrders] = useState([{ "id": 0, "img": "https://www.simplyorganic.com/media/recipe/resized/520x520/wysiwyg/tmp/simply-oragnic-Roasted-Tomato-Bruschetta-1080x1080-thumbnail.jpg", "name": "Bruschetta", "price": 7.5, "status": { "backgroundColor": "green", "color": "white", "id": 1, "status": "Ordered" } }, { "id": 1, "img": "https://img.taste.com.au/5qlr1PkR/taste/2016/11/spaghetti-bolognese-106560-1.jpeg", "name": "Spaghetti Bolognese", "price": 12.5, "status": { "backgroundColor": "red", "color": "white", "id": 0, "status": "Pending" } }])

  //TODO : get for real the order from the database

  const fetchOrders = async () => {
    //TODO: the orders are not fetched for real here
    return
    try {
      if (linkApp.tableId) {
        const tempOrders = await getOrdersWithTableId(linkApp.tableId);
        console.log(tempOrders); 

        if (tempOrders) {
          setOrders(tempOrders);
        }
      }
    } catch (error) {
      console.error('Error in fetchOrders :', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [linkApp.tableId])
  );


  const disconnect = () => {
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
      uri: "https://media.istockphoto.com/id/1182393436/vector/fast-food-seamless-pattern-with-vector-line-icons-of-hamburger-pizza-hot-dog-beverage.jpg?s=612x612&w=0&k=20&c=jlj-n_CNsrd13tkHwC7MVo0cGUyyc8YP6wJQdCvMUGw="
    }}
      style={styles.backgroundImage}
      blurRadius={0.75}>

      <View style={{
        backgroundColor: 'rgba(0,0,0,0.4)',
        marginTop: 50
      }}>
        <Text style={{
          fontSize: 70,
          fontWeight: 700,
          color: 'rgb(237, 253, 238)',
          textAlign: 'center'
        }}>My orders</Text>
      </View>
      <ScrollView>
        <FCEveryOrdersMain orders={orders}
          refreshOrders={fetchOrders} />
      </ScrollView>
      <TouchableOpacity onPress={disconnect} style={{
        backgroundColor: 'rgb(207, 57, 57)',
        width: '80%',
        margin: 'auto',
        borderRadius: 10,
        marginBlock: 10
      }}>
        <Text style={{
          color: 'white',
          fontSize: 30,
          textAlign: 'center'
        }}>
          Disconnect
        </Text>
      </TouchableOpacity>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  textHeader: {
    color: 'white',
    fontSize: 60,
    textAlign: 'center',
    fontWeight: '700'
  },
  header: {
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 20,
    marginTop: '10%',
    width: '100%'
  },
  backgroundImage: {
    flex: 1,
    height: '100%'
  }
});

