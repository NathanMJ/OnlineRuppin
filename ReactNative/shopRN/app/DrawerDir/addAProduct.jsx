import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { useRef, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { use } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { addProduct, getProducts } from '../Databases/dbProducts';

export default function addAProduct() {

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [isTakingAPicture, setIsTakingAPicture] = useState(false); // State to track if a picture is being taken
  const [products, setProducts] = useState([]); // State to store the products array


  useEffect(() => {
    console.log('newProduct', {name, price, description, imageUri});
  }
    , [name, price, description, imageUri]);


  //set products
  useFocusEffect(
    useCallback(() => {
      const fetchProducts = async () => {
        setProducts(await getProducts());
      };
      fetchProducts();
    }, []));


  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View >
        <Text >We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const btnSnap = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync({
        quality: 0.5,
        skipProcessing: true,
      });
      console.log(photo.uri);
      setImageUri(photo.uri); // Update the state with the captured image URI
      setIsTakingAPicture(false); // Set isTakingAPicture to false after taking the picture
    }
  };

  const addTheProduct = async () => {
    if (!imageUri) {
      alert('Please take a picture of the product.');
      return;
    }
    else if (!name || !price || !description) {
      alert('Please fill in all the fields.');
      return;
    }
    const newProduct = {
      id: products.length,
      name: name,
      price: price,
      description: description,
      image: imageUri,
    };
    // Add the new product to the products array
    await addProduct(newProduct);

    console.log('Product added:', newProduct);
    alert('Product added successfully!');

    // go to the store page
    router.push('/DrawerDir/theStore');


  }

  return (
    <View>
      {isTakingAPicture ?
        (
          <View>
            <View >
              <CameraView facing={facing} ref={ref => setCamera(ref)} style={{ width: 300, height: 400, margin: 'auto' }}>
                <View >
                  <TouchableOpacity onPress={toggleCameraFacing}>
                    <Text>Flip Camera</Text>
                  </TouchableOpacity>
                </View>
              </CameraView>
              <View style={{ margin: 20, alignItems: 'center', borderRadius: 5, borderWidth: 2, borderColor: 'blue', padding: 10 }}>
                <Button title="snap" onPress={btnSnap} />
              </View>
            </View>
          </View>
        )

        :

        (
          <View>
            <View>
              <Text>Name :</Text>
              <TextInput
                placeholder="Enter the name of the product"
                style={{
                  borderWidth: 1,
                  borderColor: 'black',
                  padding: 10,
                  margin: 10,
                  borderRadius: 5,
                }}
                onChange={(e) => setName(e.nativeEvent.text)}
              />
            </View>

            <View>
              <Text>Price :</Text>
              <TextInput
                placeholder="Enter the price of the product"
                style={{
                  borderWidth: 1,
                  borderColor: 'black',
                  padding: 10,
                  margin: 10,
                  borderRadius: 5,
                }}
                onChange={(e) => setPrice(e.nativeEvent.text)}
              />
            </View>

            <View>
              <Text>Description :</Text>
              <TextInput
                placeholder="Enter the description of the product"
                style={{
                  borderWidth: 1,
                  borderColor: 'black',
                  padding: 10,
                  margin: 10,
                  borderRadius: 5,
                }}
                onChange={(e) => setDescription(e.nativeEvent.text)}
              />
            </View>

            <View>
              <Text>Image :</Text>
              <Button title='Take a picture of the product' onPress={() => setIsTakingAPicture(!isTakingAPicture)}></Button>



              <View style={{ margin: 20, alignItems: 'center' }}>
                <Text>Image preview</Text>
                <View style={{ width: 100, height: 100, backgroundColor: 'gray' }}>
                  {imageUri && (
                    <Image
                      source={{ uri: imageUri }}
                      style={{ width: '100%', height: '100%' }}
                    />
                  )}
                </View>
              </View>

              <Button title='Add the product' onPress={addTheProduct}></Button>



            </View>
          </View>)}

    </View>
  )
}