import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getIndexUserByEmail, getUsers, getUsersByEmail } from '../dbUsers.jsx';
import { useFocusEffect } from 'expo-router';

const styles = StyleSheet.create({
  imageProduct: {
    width: 80,
    height: 80,
  },
  containerProduct: {
    backgroundColor: 'rgb(194, 241, 230)',
    margin: 25,
    flexDirection: 'row',
    borderRadius: 15,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: 'rgb(87, 212, 250)',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    flex: 1,
  },
  buttonTxt: {
    fontSize: 35,
    color: 'white',
    fontWeight: 'bold',
  },
  cartCountContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    flexDirection: 'row',
    height: '100%'
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    margin: 20,
    fontWeight: 'bold',
  },
});

// This is the store page, where you can see all the products available in the store

// You can add products to your cart from this page

// Create an object that contains all the products available in the store for use the "map" method



export default function theStore() {

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

  const [tempCart, setTempCart] = useState([]);
  const [email, setEmail] = useState('');
  
  useFocusEffect(
    useCallback(() => {
    const fetchCart = async () => {
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedEmail) {
        setEmail(storedEmail);
        const user = await getUsersByEmail(storedEmail);
        if (user) {
          setTempCart(user.cart);
          console.log('tempCart', tempCart);
        }
      }
    };
    fetchCart();
  }, []));

  //when he got the cart he will fill the data to know how many products he has in the cart

  const writePriceCorrectly = (price) => {
    //set space every 3 digits
    let priceString = price.toString();
    let priceArray = priceString.split('');
    let priceArrayReversed = priceArray.reverse();
    let priceArrayWithSpaces = [];
    for (let i = 0; i < priceArrayReversed.length; i++) {
      if (i % 3 === 0 && i !== 0) {
        priceArrayWithSpaces.push(' ');
      }
      priceArrayWithSpaces.push(priceArrayReversed[i]);
    }
    let priceStringWithSpaces = priceArrayWithSpaces.reverse().join('');
    return priceStringWithSpaces;
  }

  const addProduct = async (productId) => {    
    const customerIndex = await getIndexUserByEmail(email);    
    if (tempCart.find((item) => item.id === productId)) {      
      console.log('exist');   
      //if the product is already in the cart, increase the quantity by 1
      let newCustomers = await getUsers();
      //find the index of the product in the cart
      let index = newCustomers[customerIndex].cart.findIndex((item) => item.id === productId);
      //add 1 to the quantity of the product in the cart
      newCustomers[customerIndex].cart[index].quantity += 1;
      //Save to the localStorage
      await AsyncStorage.setItem('users', JSON.stringify(newCustomers));
      //update the state
      setTempCart(newCustomers[customerIndex].cart);
    }
    else {
      console.log('not exist');      
      //if the product is not in the cart, add it to the cart with quantity 1
      let newCustomers = await getUsers();
      newCustomers[customerIndex].cart.push({
        id: productId,
        quantity: 1,
        // image: products[productId].image,
        name: products[productId].name,
        price: products[productId].price
      });      
      await AsyncStorage.setItem('users', JSON.stringify(newCustomers));
      setTempCart(newCustomers[customerIndex].cart);
    }
  }

//remove
  const removeProduct = async (productId) => {    
    const customerIndex = await getIndexUserByEmail(email); 
    //if 0 doesn't do anything    
    if (tempCart.find((item) => item.id === productId) === undefined) {
      console.log('not exist');       
      return;
    }
    const customers = await getUsers();    
    let productInCart = customers[customerIndex].cart.find((item) => item.id === productId);
    console.log('productInCart', productInCart);

    //if 1 remove from cart
    if (productInCart && productInCart.quantity === 1) {
      let newCustomers = [...customers];
      let productIndex = newCustomers[customerIndex].cart.findIndex((item) => item.id === productId);
      newCustomers[customerIndex].cart.splice(productIndex, 1);      
      setTempCart(newCustomers[customerIndex].cart);
      await AsyncStorage.setItem('users', JSON.stringify(newCustomers));
    }
    else {
      console.log('exist more than one time');      
      //if more than 1, decrease the quantity by 1
      let newCustomers = [...customers];
      let productIndex = newCustomers[customerIndex].cart.findIndex((item) => item.id === productId);
      newCustomers[customerIndex].cart[productIndex].quantity -= 1;
      setTempCart(newCustomers[customerIndex].cart);
      await AsyncStorage.setItem('users', JSON.stringify(newCustomers));
    }
    console.log(customers)
  }


  /*  
    Image       Name of the product  Price of the product  -  Number in the cart  +
    Image             Description of the product           -  Number in the cart  +
  */



  return (
    <View>
      <Text style={styles.title}>The store</Text>
      <Text style={{textAlign:'center'}}>Welcome {email.split('@')[0]}</Text>
      {products.map((product) => (
        <View key={product.id} style={[styles.containerProduct, { overflow: 'hidden' }]}>
          <Image source={{ uri: product.image }} style={styles.imageProduct} />

          <View style={{ flex: 3 }}>
            <View flexDirection='row' style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <Text style={{ fontSize: 20, flex: 2, textAlign: 'center' }} >{product.name}</Text>
              <Text style={{ fontSize: 20, flex: 2, textAlign: 'center' }}>{writePriceCorrectly(product.price)} ₪</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ textAlign: 'center' }}>{product.description}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', flex: 2, justifyContent: 'center', alignItems: 'center' }}>

            <TouchableOpacity style={styles.button} onPress={() => addProduct(product.id)}>
              <Text style={styles.buttonTxt} >+</Text>
            </TouchableOpacity>

            <View style={styles.cartCountContainer}>
              <Text style={{ fontSize: 20 }}>
                {tempCart.find((item) => item.id === product.id)
                  ? tempCart.find((item) => item.id === product.id).quantity : 0}
              </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => removeProduct(product.id)}>
              <Text style={styles.buttonTxt}>-</Text>
            </TouchableOpacity>

          </View>
        </View>
      ))}
    </View>
  )
}

