import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getIndexUserByEmail, getUsers, getUsersByEmail } from '../Databases/dbUsers.jsx';
import { useFocusEffect } from 'expo-router';
import { getProducts } from '../Databases/dbProducts.jsx';

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

  const [products, setProducts] = useState([]);
  const [tempCart, setTempCart] = useState([]);
  const [email, setEmail] = useState('');


  //set the cart

  useFocusEffect(
    useCallback(() => {
      const fetchCart = async () => {
        const storedEmail = await AsyncStorage.getItem('email');
        if (storedEmail) {
          setEmail(storedEmail);
          const user = await getUsersByEmail(storedEmail);
          if (user) {
            setTempCart(user.cart);
          }
        }
      };
      fetchCart();
    }, []));

  //set products
  useFocusEffect(
    useCallback(() => {
      const fetchProducts = async () => {
        setProducts(await getProducts());
      };
      fetchProducts();
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
      //if the product is not in the cart, add it to the cart with quantity 1
      let newCustomers = await getUsers();
      newCustomers[customerIndex].cart.push({
        id: productId,
        quantity: 1,
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
      return;
    }

    const customers = await getUsers();
    let productInCart = customers[customerIndex].cart.find((item) => item.id === productId);

    //if 1 remove from cart
    if (productInCart && productInCart.quantity === 1) {
      let newCustomers = [...customers];
      let productIndex = newCustomers[customerIndex].cart.findIndex((item) => item.id === productId);
      newCustomers[customerIndex].cart.splice(productIndex, 1);
      setTempCart(newCustomers[customerIndex].cart);
      await AsyncStorage.setItem('users', JSON.stringify(newCustomers));
    }
    else {
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
      <ScrollView>
        <Text style={styles.title}>The store</Text>
        <Text style={{ textAlign: 'center' }}>Welcome {email.split('@')[0]}</Text>
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
      </ScrollView>
    </View>
  )
}

