import { View, Text, Image } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native';


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


const products = [
  {
    id: 0,
    image: 'https://media.istockphoto.com/id/1350560575/photo/pair-of-blue-running-sneakers-on-white-background-isolated.jpg?s=612x612&w=0&k=20&c=A3w_a9q3Gz-tWkQL6K00xu7UHdN5LLZefzPDp-wNkSU=',
  },
  {
    id: 1,
    image: 'https://www.radioflyer.com/cdn/shop/files/flyer-24_-kids_-bike-profile-model-845BR_d1a02114-c9e5-4ef6-9302-57769bc310a6.jpg?v=1710802718&width=1214',
  },
  {
    id: 2,
    image: 'https://imgcdn.zigwheels.vn/medium/gallery/exterior/9/958/honda-hr-v-18808.jpg',
  },
  {
    id: 3,
    image: 'https://www.huntsmarine.com.au/cdn/shop/articles/620_Fishfisher_24_2048x2048.jpg?v=1701991259',
  },
  {
    id: 4,
    image: 'https://static01.nyt.com/images/2021/02/26/travel/26United-plane-explainer1/26United-plane-explainer1-mediumSquareAt3X.jpg',
  },
]

/*
    IMG   Quantity x Price = Total Price
    Name  Quantity x Price = Total Price

*/  
export default function yourCart() {

  // TEMP :
  const customerId = 0
  
  //TO DO : replace with a new cart
  const customer = {"cart": [{"id": 0, "name": "Shoes", "price": 50, "quantity": 2}, {"id": 2, "name": "Car", "price": 2500, "quantity": 1}, {"id": 3, "name": "Boat", "price": 5000, "quantity": 1}], "id": 1, "name": "John"}
  return (
    <View>
      <Text style={styles.title}>Your cart :</Text>

      {customer.cart.map((product) => {
        return (
          <View key={product.id} style={{ 
            display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
            backgroundColor: 'rgb(224, 236, 236)', borderRadius: 5, padding: 10, margin: 5}}>
            <View>
              <Image source={{ uri: products[product.id].image }} style={styles.imageProduct} />
              <Text>{product.name}</Text>
            </View>
            <Text>{product.quantity} x {product.price} = {product.quantity*product.price}</Text>
          </View>
        )
      })}


    </View>
  )
}