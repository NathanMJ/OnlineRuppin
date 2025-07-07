import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { Button, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

import React, { useRef } from 'react';
import { Animated, Dimensions, TextInput } from 'react-native';
import { useEffect } from "react";
import FCInput from '../FuncComps/FCInput';

export default function login() {
    const { width: widthScreen } = useWindowDimensions();

    const [inputs, setInputs] = useState({})

    const msg = (text) => {
        console.log(text);
        
    }

    const login = () => {
        if(!inputs.id1 || !inputs.id2){
            msg('An input is missing')
            return
        }
        if(inputs.id1 != inputs.id2){
            msg('Ids are not same')
            return
        }
        //TODO: try to log with id1
    }

    return (
        <ImageBackground source={{
            uri: "https://i.ytimg.com/vi/DyJTVkRP1vY/maxresdefault.jpg"
        }}
            style={styles.backgroundImage}
            blurRadius={3}>

            <Text style={styles.title}>Login</Text>
            <FCInput
                title={'Tehoudat zehout'} type={'numeric'}
                placeholder={'Your tehoudat zehout'}
                setVariable={(id) => setInputs({ ...inputs, id1: id })}></FCInput>
            <FCInput
                title={'Confirm your id :'} type={'numeric'}
                placeholder={'Your tehoudat zehout'}
                setVariable={(id) => setInputs({ ...inputs, id2: id })}></FCInput>
            <TouchableOpacity onPress={login}
                style={{
                    width: widthScreen * 0.8,
                    padding: '20 40',
                    backgroundColor: 'rgb(59, 146, 116)',
                    borderRadius: 20,
                    borderColor: 'rgb(0,0,0)',
                    borderWidth: 2,
                    margin: 'auto'
                }}>
                < Text style={{
                    fontSize: 50,
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 800
                }}>Login</Text>
            </TouchableOpacity >
        </ImageBackground >
    )
}

const styles = StyleSheet.create({

    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 40
    },
    title: {
        fontSize: 50,
        color: 'white',
        fontWeight: 700,
        paddingTop: 100
    }
});
