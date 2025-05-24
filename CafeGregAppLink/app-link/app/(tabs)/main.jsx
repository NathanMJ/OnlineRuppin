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


  const [orders, setOrders] = useState([])
  useFocusEffect(
    useCallback(() => {
      const fetchOrders = async () => {
        try {
          if (linkApp.tableId) {
            const tempOrders = await getOrdersWithTableId(linkApp.tableId);
            if (tempOrders) {
              setOrders(tempOrders);
            }
          }
        } catch (error) {
          console.error('Erreur dans fetchOrders :', error);
        }
      };

      fetchOrders();
    }, [linkApp.tableId])
  );



  const orderTest = {
    img: 'https://images.immediate.co.uk/production/volatile/sites/30/2013/05/Aubergine-and-sesame-noodles-6138de6.jpg?quality=90&resize=556,505',
    name: 'Spaghettis',
    status: "In preparation"
  }


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
        <FCEveryOrdersMain orders={orders} />
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

