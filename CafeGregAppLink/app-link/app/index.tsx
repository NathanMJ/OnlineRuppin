import { useState } from "react";
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Index() {

  const [id, setId] = useState('')

  const pressOnBtn = () => {
    alert("Welcome to Cafe Greg!");
  }

  const messageId = () => {
    return <View
      style={{
        backgroundColor: 'rgb(183, 221, 250)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 10
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 35
        }}>Enter your link id :</Text>
      <View 
      style={{backgroundColor:'rgb(29, 45, 60)',
        width:100,
        height:2,
        margin:10
      }}></View>
      <TextInput
        style={{
          textAlign: 'center',
          fontSize: 60,
          backgroundColor: 'white',
          borderRadius: 10,
          width: '100%'
        }}
        keyboardType="numeric"
        value={id}
        onChangeText={text => setId(text.replace(/[^0-9]/g, ""))}
        placeholder="ID"
      />
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





