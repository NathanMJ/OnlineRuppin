import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Tabs, router } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useContext, useState } from "react";
import { ScrollView, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';
import { LinkAppContext } from '../LinkAppContext.jsx';
import { disconnectCustomer, getCustomersByTableId } from '../database.js'

export default function TabLayout() {

    const screenWidth = Dimensions.get('window').width;
    const panelWidth = screenWidth * 0.8;

    const slideAnim = useRef(new Animated.Value(-panelWidth)).current;
    const [isVisible, setIsVisible] = useState(false);

    const { linkApp, setLinkApp } = useContext(LinkAppContext)


    const togglePanel = () => {
        if (!isVisible)
            fetchCustomers()
        Animated.timing(slideAnim, {
            toValue: isVisible ? -panelWidth : 0,
            duration: 300,
            useNativeDriver: false, // ← ici !
        }).start(() => setIsVisible(!isVisible));
    };

    const returnToMenu = () => {
        router.push({ pathname: "(tabs)/main" })
    }

    const [customers, setCustomers] = useState([])

    const fetchCustomers = async () => {
        const tempCustomers = await getCustomersByTableId(linkApp.tableId)
        setCustomers(tempCustomers)
    }

    const disconnect = (customerId) => {
        Alert.alert(
            'Disconnect',
            'Do you want to disconnect?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK', onPress: async () => {
                        await disconnectCustomer(customerId)
                        fetchCustomers()
                    }
                }
            ]
        );

    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                zIndex: 1,
                pointerEvents: 'box-none'
            }}>
                <TouchableOpacity style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    backgroundColor: 'rgb(255, 0, 0)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingInline: 20,
                    paddingBlock: 10,
                    borderRadius: 10
                }}
                    onPress={returnToMenu}>
                    <Text style={{ color: 'white', fontSize: 30 }}>Return</Text>
                </TouchableOpacity>

            </View>
            <View style={{
                position: 'absolute',
                flexDirection: 'row',
                height: '90%',
                width: '100%',
                zIndex: 2,
                pointerEvents: 'box-none'
            }}>

                <Animated.View style={[styles.panel, { transform: [{ translateX: slideAnim }] }]}>
                    <ScrollView style={{ height: '100%', overflow: 'scroll' }}>
                        <Text style={{ textAlign: 'center', fontSize: 33 }}>Logged customers :</Text>
                        {customers?.length > 0 ? customers.map((customer, index) => (
                            <View key={index}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ textAlign: 'center', fontSize: 40, flex: 1 }}>{customer.firstName}</Text>
                                    <TouchableOpacity onPress={() => disconnect(customer.id)}>
                                        <Text style={{
                                            textAlign: 'center', fontSize: 30, color: 'red'
                                        }}>X</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ textAlign: 'center', fontSize: 20 }}>(Tz : {customer.id})</Text>
                            </View>
                        )) :
                            <Text>No logged one</Text>}
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.toggleButtonFloating}
                        onPress={togglePanel}
                    >
                        <Ionicons name="person-circle-outline" size={50} color="black" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
            <Tabs screenOptions={{ headerShown: false }}>
                <Tabs.Screen name="login" options={{
                    title: "Login",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    )
                }} />
                <Tabs.Screen
                    name="register"
                    options={{
                        title: "Register",
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="person" size={size} color={color} />
                        )
                    }}
                />
            </Tabs>
        </View >

    )
}

const styles = StyleSheet.create({

    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleButton: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    toggleText: {
        color: '#fff',
        fontSize: 18,
    },
    panel: {
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 2, height: 2 },
        borderBottomRightRadius: 30,

    },
    toggleButtonFloating: {
        position: 'absolute',
        right: -70,
        top: '10%',
        transform: [{ translateY: -25 }],
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    }

});
