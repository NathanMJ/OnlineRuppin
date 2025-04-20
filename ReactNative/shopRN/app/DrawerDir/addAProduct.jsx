import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useRef, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { use } from 'react';
import { router } from 'expo-router';

export default function addAProduct() {

  const [name, setName] = useState('product name');
  const [price, setPrice] = useState('150');
  const [description, setDescription] = useState('nice product');
  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [isTakingAPicture, setIsTakingAPicture] = useState(false); // State to track if a picture is being taken


  const products = [
    {
      id: 0,
      name: 'Shoes',
      price: 50,
      description: 'This shoes are the best shoes ever',
      image: 'https://media.istockphoto.com/id/1350560575/photo/pair-of-blue-running-sneakers-on-white-background-isolated.jpg?s=612x612&w=0&k=20&c=A3w_a9q3Gz-tWkQL6K00xu7UHdN5LLZefzPDp-wNkSU=',
    },
    {
      id: 1,
      name: 'Bike',
      price: 250,
      description: 'This bike is the best bike ever',
      image: 'https://www.radioflyer.com/cdn/shop/files/flyer-24_-kids_-bike-profile-model-845BR_d1a02114-c9e5-4ef6-9302-57769bc310a6.jpg?v=1710802718&width=1214',
    },
    {
      id: 2,
      name: 'Car',
      price: 2500,
      description: 'This car is the best car ever',
      image: 'https://imgcdn.zigwheels.vn/medium/gallery/exterior/9/958/honda-hr-v-18808.jpg',
    },
    {
      id: 3,
      name: 'Boat',
      price: 5000,
      description: 'This boat is the best boat ever',
      image: 'https://www.huntsmarine.com.au/cdn/shop/articles/620_Fishfisher_24_2048x2048.jpg?v=1701991259',
    },
    {
      id: 4,
      name: 'Plane',
      price: 10000,
      description: 'This place is the best plane ever',
      image: 'https://static01.nyt.com/images/2021/02/26/travel/26United-plane-explainer1/26United-plane-explainer1-mediumSquareAt3X.jpg',
    },
  ]

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

  const addTheProduct = () => {
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
    products.push(newProduct); // Add the new product to the products array

    console.log('Product added:', newProduct);
    alert('Product added successfully!');
    //reset the form fields
    setName('');
    setPrice('');
    setDescription('');
    setImageUri(null); 


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