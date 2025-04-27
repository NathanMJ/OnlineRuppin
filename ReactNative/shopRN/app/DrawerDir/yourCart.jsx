import { View, Text, Image, Button} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUsersByEmail } from '../Databases/dbUsers.jsx';
import { useFocusEffect } from 'expo-router';
import { emptyCart } from '../Databases/dbUsers.jsx';
import { getProducts } from '../Databases/dbProducts.jsx';


const styles = StyleSheet.create({
  imageProduct: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    margin: 20,
    fontWeight: 'bold',
  },
});


/*
    IMG   Quantity x Price = Total Price
    Name  Quantity x Price = Total Price

*/
export default function yourCart() {

  const [cart, setCart ] = useState([])
  const [products, setProducts] = useState([]);
      
  //set cart
  useFocusEffect(
  useCallback(() => {
    const fetchCart = async () => {
      const storedEmail = await AsyncStorage.getItem('email');        
      if (storedEmail) {
        const user = await getUsersByEmail(storedEmail);
        if (user && user.cart) {
          setCart(user.cart);
        }
      }
    };
    fetchCart();
  }, [])
);


  //set products
  useFocusEffect(
    useCallback(() => {
    const fetchProducts = async () => {
      setProducts(await getProducts());
    };
    fetchProducts();
  }, []));


const orderEverything = async () => {
  if(cart.length === 0) {
    alert('Your cart is empty !')
    return
  }
  const storedEmail = await AsyncStorage.getItem('email');
  emptyCart(storedEmail);
  setCart([]);
  alert('Everythings has been ordered !')
}


    return (
    <View>
      <Text style={styles.title}>Your cart :</Text>

      {cart.map((product) => {
        return (
          <View key={product.id} style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
            backgroundColor: 'rgb(224, 236, 236)', borderRadius: 5, padding: 10, margin: 5
          }}>
            <View>
              <Image source={{ uri: products[product.id].image }} style={styles.imageProduct} />
              <Text>{product.name}</Text>
            </View>
            <Text>{product.quantity} x {product.price} = {product.quantity * product.price}</Text>
          </View>
        )
      })}

        <Button title='Order everything' onPress={orderEverything}></Button>
    </View>
  )
}