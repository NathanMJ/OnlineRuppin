import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useFocusEffect } from 'expo-router';
import React, { useContext, useState } from "react";
import { Button, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getTableIdWithLinkId } from './database.js';
import { LinkAppContext } from './LinkAppContext.jsx';

export default function Index() {

  const { linkApp, setLinkApp } = useContext(LinkAppContext)

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

  const [scanning, setScanning] = useState(false)
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

  const close = () => {
    setScanning(false)
  }

  const confirmId = async (id) => {
    const res = await getTableIdWithLinkId(id)
    console.log(res);

    if (!res) {
      alert(`The id ${id} is incorrect`)
    }
    else {
      setLinkApp({ tableId: res })
      router.push({ pathname: "(tabs)/main" })
    }
  }



  if (scanning) {
    return (
      <View style={styles.container}>
        <CameraView style={styles.camera}
          facing={facing} ref={ref => setCamera(ref)}
          onBarcodeScanned={({ data }) => {
            console.log('data', data)
            close()
            confirmId(data)
          }}>
        </CameraView>
        <TouchableOpacity onPress={close}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'red',
            paddingInline: 40,
            paddingBlock: 20,
            borderRadius: 10,
            position: 'absolute',
            top: '80%',
            left: '50%',
            transform: 'translateX(-100%)'
          }}>
          <Text style={{
            textAlign: 'center',
            fontSize: 50,
            fontWeight: 600,
            color: 'white'
          }}>Close</Text>
        </TouchableOpacity>
      </View>
    );


  }



  const pressOnBtn = () => {
    //TO DO: set the scanning to true and open the camera and scan the qrcode for real

    setLinkApp({ tableId: 0 })
    router.push({ pathname: "(tabs)/main" })
    // setScanning(true)
  }

  const clickOnHelpMe = () => {
    router.push({ pathname: "helpToConnect" })
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
        <TouchableOpacity
          style={styles.button}
          onPress={pressOnBtn}>
          <Text style={styles.textBtn}>
            Scan the QR-link
          </Text>
        </TouchableOpacity>

      </View>

      <TouchableOpacity className='helpButton' onPress={clickOnHelpMe()}
        style={{ flexDirection: 'row', position: 'absolute', bottom: 30, right: 30, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ position: 'absolute', right: 0, backgroundColor: 'rgb(156, 162, 163)', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 30, fontWeight: 700, color: 'white', padding: 14 }}>Help me             </Text>
        </View>
        <View style={{
          elevation: 30,
          backgroundColor: 'rgb(156, 162, 163)',
          width: 100,
          borderRadius: 100,
          height: 100,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: 60, textAlign: 'center', borderRadius: 100, color: 'white' }}>?</Text>
        </View>
      </TouchableOpacity>
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
    fontSize: 35
  },
  container: {
    position: 'relative',
    flex: 1
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





