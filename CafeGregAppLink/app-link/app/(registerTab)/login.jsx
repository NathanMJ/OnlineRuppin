import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import React, { useRef } from 'react';
import { Animated, Dimensions } from 'react-native';
import { useEffect } from "react";


export default function login() {


    const screenWidth = Dimensions.get('window').width;
    const panelWidth = screenWidth * 0.8;

    const slideAnim = useRef(new Animated.Value(-panelWidth)).current;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // This code runs only the first time the component mounts
        // Place your one-time logic here
        console.log("First time arriving at login screen");
    }, []);

    const togglePanel = () => {
        Animated.timing(slideAnim, {
            toValue: isVisible ? -panelWidth : 0,
            duration: 300,
            useNativeDriver: false, // ← ici !
        }).start(() => setIsVisible(!isVisible));
    };


    const [customers, setCustomers] = useState([
        { name: 'Nathan', id: '345538268' },
        { name: 'Nathan', id: '345538268' },
        { name: 'Nathan', id: '345538268' },
        { name: 'Nathan', id: '345538268' },
        { name: 'Nathan', id: '345538268' },
        { name: 'Nathan', id: '345538268' },
        { name: 'Nathan', id: '345538268' },
        { name: 'Nathan', id: '345538268' },
        { name: 'Nathan', id: '345538268' },
        { name: 'Nathan', id: '345538268' },
        { name: 'John', id: '345532268' }
    ])


    return (
        <ImageBackground source={{
            uri: "https://i.ytimg.com/vi/DyJTVkRP1vY/maxresdefault.jpg"
        }}
            style={styles.backgroundImage}
            blurRadius={3}>

            {/* <View style={{
                position: 'absolute',
                flexDirection: 'row',
                height: '100%', 
                width: '100%', 
            }}>

                <Animated.View style={[styles.panel, { transform: [{ translateX: slideAnim }] }]}>
                    <ScrollView style={{ height: '100%', overflow: 'scroll' }}>
                        <Text style={{ textAlign: 'center', fontSize: 33 }}>Logged customers :</Text>
                        {customers?.length > 0 ? customers.map((customer, index) => (
                            <View key={index}>
                                <Text style={{ textAlign: 'center', fontSize: 40 }}>{customer.name}</Text>
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
            </View> */}

        </ImageBackground>
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
