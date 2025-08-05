import { Dimensions, Text, ToastAndroid, View } from 'react-native'
import { Image, TouchableOpacity } from 'react-native'
import { orderProductById } from '../database';
import { useContext } from 'react';
import { LinkAppContext } from '../LinkAppContext';
import { router } from 'expo-router';

export default function FCOrderProduct(props) {

    const { linkApp, setLinkApp } = useContext(LinkAppContext);

    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;

    const orderProduct = async (productId) => {        
        const res = await orderProductById(productId, linkApp.tableId)
        if(res){
            ToastAndroid.show('Ordered successfully !', ToastAndroid.SHORT);
            router.push({ pathname: "(tabs)/main" })
        }
    }

    


    return (
        <TouchableOpacity style={{
            height: windowHeight / 5,
            backgroundColor: 'rgba(99, 98, 198, 0.75)',
            margin: 10,
            flexDirection: 'row',
            alignItems: "center",
            borderRadius: 30,
            overflow: 'hidden'
        }}
            onPress={() => orderProduct(props.product.id)}>
            <Image source={{ uri: props.product.img }} style={{ width: '33%', height: '100%' }} />
            <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{
                    textAlign: 'center',
                    fontSize: 24,
                    color: 'white'
                }}>{props.product.name}</Text>
                <Text style={{ color: 'white', fontSize: 25 }}>{props.product.price} ₪</Text>
            </View>
        </TouchableOpacity>
    )
}
