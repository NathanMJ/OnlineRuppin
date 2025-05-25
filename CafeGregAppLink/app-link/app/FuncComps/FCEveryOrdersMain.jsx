import { Image } from 'expo-image';
import { View, Text, TouchableOpacity } from 'react-native'
import { Dimensions } from 'react-native';
import { cancelOrder, changeOrderStatus, getOrdersWithTableId } from '../database.js'
import { useContext } from 'react';
import { LinkAppContext } from '../LinkAppContext.jsx';

export default function FCEveryOrdersMain(props) {

  const orders = props.orders

  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const { linkApp, setLinkApp } = useContext(LinkAppContext);

  const cancelOrderById = async (orderId) => {
    await cancelOrder(orderId, linkApp.tableId)
    props.refreshOrders()
  }

  const validateOrderById = async (orderId) => {
    const res = await changeOrderStatus(orderId, 1)
    if (res == 1) {
      props.refreshOrders()
    }

  }

  if (!orders || orders.length === 0) {
    return <View><Text>No orders</Text></View>;
  }
  return <View style={{
    gap: 10, marginBlock: 30,
    width: '80%', marginInline: 'auto', gap: 40
  }}>
    {orders.map((order, index) => (
      <View key={index}>
        <View className='orderContainer'
          style={{
            height: windowHeight / 9,
            position: 'relative',
            backgroundColor: 'rgb(0, 0, 0, 0.5)'
          }}>

          <View style={{
            flex: 1,
            flexDirection: 'row',
            backgroundColor: 'rgb(202, 238, 232)',
            alignItems: 'center',
            borderRadius: 20,
            overflow: 'hidden'
          }}>
            <Image source={{ uri: order.img }}
              style={{ width: '33%', height: '100%' }} />

            <Text style={{ flex: 1, textAlign: 'center', margin: 'auto', fontSize: 28, fontWeight: 500 }}>
              {order.name}
            </Text>
          </View>

          {order.status.id != 0 ? "" :
            <TouchableOpacity style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              transform: 'translate(50%,50%)'
            }}
              onPress={() => validateOrderById(order.id)}>
              <Image
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Sign-check-icon.png' }}
                style={{
                  width: 60,
                  height: 60,
                }} />
            </TouchableOpacity>
          }

          {order.status.id != 0 ? "" :
            <TouchableOpacity style={{
              position: 'absolute',
              right: 0,
              top: 0,
              transform: [{ translateX: 25 }, { translateY: -25 }]
            }}
              onPress={() => cancelOrderById(order.id)}>
              <Image
                source={require('../../assets/images/Cross-red-circle.png')}
                style={{
                  width: 50,
                  height: 50,
                }} />
            </TouchableOpacity>
          }

        </View>

        <View style={{
          backgroundColor: order.status.backgroundColor,
          width: "80%",
          margin: 'auto',
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15
        }}>
          <Text style={{ textAlign: 'center', color: order.status.color, fontSize: 20, fontWeight: 600 }}>{order.status.status}</Text>

        </View>



      </View>
    ))}
  </View>
}


