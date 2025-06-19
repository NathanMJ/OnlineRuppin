import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { ImageBackground, Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function login() {

    const [customers, setCustomers] = useState([
        { name: 'Nathan', id: '345538268' },
        { name: 'John', id: '345532268' }
    ])

    const [pannelIsOpen, setPannelIsOpen] = useState(true)

    return (
        <ImageBackground source={{
            uri: "https://i.ytimg.com/vi/DyJTVkRP1vY/maxresdefault.jpg"
        }}
            style={styles.backgroundImage}
            blurRadius={3}>
            <View className='container' style={{
                backgroundColor: 'white', position: 'absolute', height: '80%', width: `${pannelIsOpen ? '80%' : '0%'}`, borderTopRightRadius: 30, borderBottomRightRadius: 30,
                alignItems: 'center', left: 0,
            }}>
                <View style={{
                    position: 'absolute',
                    left: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 5
                }}>

                    <TouchableOpacity style={{
                        backgroundColor: 'white',
                        borderRadius: 30,
                        padding: 5,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} onPress={() => setPannelIsOpen(!pannelIsOpen)}>
                        <Ionicons name="person-circle-outline" size={50} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ marginBlock: 10 }}>
                    {customers?.length > 0 && customers.map((customer, index) => (
                        <View key={index}>
                            <Text style={{ textAlign: 'center', fontSize: 40 }}>{customer.name}</Text>
                            <Text style={{ textAlign: 'center', fontSize: 20 }}>(Tz : {customer.id})</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({

    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    }
})