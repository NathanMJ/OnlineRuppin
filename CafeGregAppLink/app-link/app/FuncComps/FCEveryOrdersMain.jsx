import { Image } from 'expo-image';
import { useContext } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { cancelOrder, sendOrder } from '../database.js';
import { LinkAppContext } from '../LinkAppContext.jsx';

export default function FCEveryOrdersMain(props) {

  const orders = props.orders

  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const { linkApp, setLinkApp } = useContext(LinkAppContext);

  console.log(orders);
  
  const cancelOrderById = async (orderId) => {
    console.log(orderId);
    
    const res = await cancelOrder(orderId)
    if (res)
      props.refreshOrders()
  }

  const validateOrderById = async (orderId) => {
    const res = await sendOrder(orderId)
    if (res) {
      props.refreshOrders()
    }
  }


  if (!orders || orders.length === 0) {
    return <View style={{ backgroundColor: 'white' }}><Text style={{
      textAlign: 'center', fontSize: 30,
      padding: 30, fontWeight: 600
    }}>No orders</Text></View>;
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
              {order.productName}
            </Text>
          </View>

          {order.statusName != "Pending" ? "" :
            <TouchableOpacity style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              transform: 'translate(50%,50%)'
            }}
              onPress={() => validateOrderById(order.orderId)}>
              <Image
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Sign-check-icon.png' }}
                style={{
                  width: 60,
                  height: 60,
                }} />
            </TouchableOpacity>
          }

          {order.statusName != "Pending" ? "" :
            <TouchableOpacity style={{
              position: 'absolute',
              right: 0,
              top: 0,
              transform: [{ translateX: 25 }, { translateY: -25 }]
            }}
              onPress={() => cancelOrderById(order.orderId)}>
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
          backgroundColor: order.backgroundColor,
          width: "80%",
          margin: 'auto',
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15
        }}>
          <Text style={{ textAlign: 'center', color: order.color, fontSize: 20, fontWeight: 600 }}>{order.statusName}</Text>

        </View>



      </View>
    ))}
  </View>
}


