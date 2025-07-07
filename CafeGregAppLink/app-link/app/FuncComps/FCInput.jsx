import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { useWindowDimensions } from 'react-native';

export default function FCInput(props) {
    const { width: widthScreen } = useWindowDimensions();

    const setVariable = (value) => {
        props.setVariable(value)        
    }



    return (
        <View>
            <Text style={styles.title}>{props.title}</Text>
            <TextInput
                style={[styles.input, { width: widthScreen * 0.9 }]}
                keyboardType={props.type}
                placeholder={props.placeholder}
                onChangeText={setVariable}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        color: 'white',
        fontWeight: 700
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        marginTop: 8,
        fontSize: 30,
        width: '100%'
    }
});
