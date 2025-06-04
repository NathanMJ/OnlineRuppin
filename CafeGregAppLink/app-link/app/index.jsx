import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useFocusEffect } from 'expo-router';
import React, { useContext, useState } from "react";
import { Button, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getTableIdWithLinkId } from './database.js';
import { LinkAppContext } from './LinkAppContext.jsx';

export default function Index() {

  const { linkApp, setLinkApp } = useContext(LinkAppContext)
  const [id, setId] = useState('')
  const [show, setShow] = useState(false)


  //to test a page direcly without going through the pages

  const goDirectly = false
  if (goDirectly) {
    useFocusEffect(
      React.useCallback(() => {
        setLinkApp({ tableId: 3 })
        router.push({ pathname: "(tabs)/main" })
      }, [])
    );
  }

  // QR code scan test

  const [scanning, setScanning] = useState(true)
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [camera, setCamera] = useState(null);
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  const btnSnap = async () => {
    const photo = await camera.takePictureAsync({
      quality: 0.5, // Adjust this value (0.0 - 1.0) for picture quality
      skipProcessing: true, // Set to true to skip processing
    });
    console.log(photo.uri);
  }
  if (scanning) {

    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} ref={ref => setCamera(ref)}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
        <View style={{ margin: 20, alignItems: 'center', borderRadius: 5, borderWidth: 2, borderColor: 'blue', padding: 10 }}>
          <Button title="snap" onPress={btnSnap} />
        </View>
      </View>
    );


  }





  const pressOnBtn = () => {
    setShow(true)
  }

  const cancel = () => {
    setShow(false)
    setId('')
  }

  const confirmId = async () => {
    const res = await getTableIdWithLinkId(id)
    console.log(res);

    if (!res) {
      alert(`The id ${id} is incorrect`)
      setId('')
    }
    else {
      setLinkApp({ tableId: res })
      router.push({ pathname: "(tabs)/main" })
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
            value: { id },
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
          onPress={cancel}>
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
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 15,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  snapContainer: {
    margin: 20,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'blue',
    padding: 10,
  }
});





