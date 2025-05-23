import { router, useFocusEffect } from 'expo-router';
import React, { useState } from "react";
import { ImageBackground, LogBox, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getTableIdWithLinkId } from './database.js'

export default function Index() {

  const [id, setId] = useState('')
  const [show, setShow] = useState(false)






  //to test a page direcly without going through the pages

  const goDirectly = false
  if (goDirectly) {
    useFocusEffect(
      React.useCallback(() => {
        router.replace({
          pathname: "/(tabs)/main",
        });
      }, [])
    );

  }


  const pressOnBtn = () => {
    setShow(true)
  }

  const confirmId = async () => {


    const res = await getTableIdWithLinkId(id)
    
    if (!res) {
      alert(`The id ${id} is incorrect`)
    }
    else {
      router.push({pathname:"(tabs)/main"})
    }
  }

  const messageId = () => {
    if (show)
      return <View
        style={{
          backgroundColor: 'rgb(183, 221, 250)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          borderRadius: 10,
          width: '80%',
          zIndex: 2,
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-100%)'
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 35
          }}>Enter your link id :</Text>
        <View
          style={{
            backgroundColor: 'rgb(29, 45, 60)',
            width: 100,
            height: 2,
            margin: 10
          }}></View>
        <TextInput
          style={{
            textAlign: 'center',
            fontSize: 60,
            backgroundColor: 'white',
            borderRadius: 10,
            width: '100%',
          }}
          keyboardType="numeric"
          value={id}
          onChangeText={text => setId(text.replace(/[^0-9]/g, ""))}
          placeholder="ID"
          maxLength={4}
        />
        <TouchableOpacity
          style={{
            marginTop: 10,
            width: '80%',
            backgroundColor: 'rgb(45, 207, 45)',
            borderRadius: 10,
            borderColor: 'white',
            borderWidth: 2
          }}
          onPress={confirmId}>
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 30,
              fontWeight: 500
            }}>
            Validate
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          position: 'absolute',
          right: 0,
          top: 0,
          transform: 'translate(50%,-50%)'
        }}
          onPress={() => { setShow(false) }}>
          <ImageBackground
            source={require('../assets/images/Cross-red-circle.png')}
            style={{
              width: 50,
              height: 50,
            }} />
        </TouchableOpacity>
      </View>
  }

  return (
    <ImageBackground source={{
      uri: "https://i.ytimg.com/vi/DyJTVkRP1vY/maxresdefault.jpg"
    }}
      style={styles.backgroundImage}
      blurRadius={3}>
      <View
        style={{
          flex: 1,
          alignItems: "center"
        }}
      >
        <View style={styles.header}>
          <Text style={styles.textHeader}>Cafe Greg</Text>
          <Text style={styles.textHeader}>Link App</Text>
        </View>
        {messageId()}
        <TouchableOpacity
          style={styles.button}
          onPress={pressOnBtn}>
          <Text style={styles.textBtn}>
            Start
          </Text>
        </TouchableOpacity>

      </View>
    </ImageBackground >
  );
}

const styles = StyleSheet.create({
  textHeader: {
    color: 'white',
    fontSize: 60,
    textAlign: 'center',
    fontWeight: '700'
  },
  header: {
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 20,
    marginTop: '10%',
    width: '100%'
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: 'rgb(64, 97, 154)',
    paddingBlock: 30,
    paddingInline: 40,
    borderWidth: 10,
    borderColor: 'white',
    borderRadius: 50,
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  textBtn: {
    color: 'white',
    fontWeight: 600,
    fontSize: 40
  },
  messageId: {

  }
});





