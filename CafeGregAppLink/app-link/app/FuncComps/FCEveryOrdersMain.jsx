import { Image } from 'expo-image';
import { View, Text } from 'react-native'
import { Dimensions } from 'react-native';

export default function FCEveryOrdersMain(props) {

  const orders = props.orders

  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  const orderTest = {
    img: 'https://images.immediate.co.uk/production/volatile/sites/30/2013/05/Aubergine-and-sesame-noodles-6138de6.jpg?quality=90&resize=556,505',
    name: 'Spaghettis',
    status: "In preparation"
  }


  if (!orders || orders.length === 0) {
    return <View><Text>No orders</Text></View>;
  }
  return <View style={{
    gap: 10, marginBlock: 30,
    width: '80%', marginInline: 'auto', gap: 20
  }}>
    {orders.map((order, index) => (
      <View key={index}>
        <View style={{
          height: windowHeight / 9,
          flexDirection: 'row',
          backgroundColor: 'rgb(202, 238, 232)',
          alignItems: 'center',
          borderRadius: 20,
          overflow: 'hidden'
        }}>
          <Image source={{ uri: order.img}}
            style={{ width: '33%', height: '100%' }} />

          <Text style={{ flex: 1, textAlign: 'center', margin: 'auto', fontSize: 28, fontWeight: 500 }}>
            {order.name}
          </Text>
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


