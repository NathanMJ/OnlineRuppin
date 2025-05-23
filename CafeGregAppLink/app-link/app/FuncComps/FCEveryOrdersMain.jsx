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
          <Image source={{ uri: orderTest.img }}
            style={{ width: '33%', height: '100%' }} />

          <Text style={{ textAlign: 'center', margin: 'auto', fontSize: 25, fontWeight: 500 }}>
            {order.toString()}
          </Text>
        </View>

        <View style={{
          backgroundColor: 'orange',
          width: "80%",
          margin: 'auto',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10
        }}>
          <Text style={{ textAlign: 'center', color: 'white', fontSize: 20, fontWeight: 600 }}>In preparation</Text>

        </View>

      </View>
    ))}
  </View>
}


