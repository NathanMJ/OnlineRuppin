import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useEffect, useState } from "react";
import { Dimensions, ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import { getProductById, getSections, orderProductById } from '../database.js';
import { LinkAppContext } from '../LinkAppContext.jsx';

export default function Menu() {
  const [sections, setSections] = useState([]);
  const [sectionId, setSectionId] = useState(-1)
  const [products, setProducts] = useState([]);

  const [research, setResearch] = useState('')
  const [searchedProducts, setSearchedProducts] = useState([])
  const { linkApp, setLinkApp } = useContext(LinkAppContext);

  useEffect(() => {
    const fetchSections = async () => {
      const data = await getSections();
      setSections(data);
    };
    fetchSections();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setSectionId(-1);
    }, [])
  )

  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  const orderProduct = (productId) => {
    orderProductById(productId, linkApp.tableId)
    ToastAndroid.show('Ordered successfully !', ToastAndroid.SHORT);
  }

  useEffect(() => {
    const fetchProducts = async () => {
      if (sectionId !== -1 && sections[sectionId]) {
        const prods = await Promise.all(
          sections[sectionId].products.map((productId) => getProductById(productId))
        );
        setProducts(prods);
      } else {
        setProducts([]);
      }
    };
    fetchProducts();
  }, [sectionId, sections]);

  //research the product who contain the research every change
  useEffect(() => {
    console.log(research);
    //send to the database the research and it will do the research
  }, [research])


  const researchHeader = () => {
    return <View></View>
  }

  if (sectionId != -1) {
    return <ScrollView style={{ position: 'relative' }}>
      <TouchableOpacity onPress={() => setSectionId(-1)} style={{ position: 'relative', width: 50, height: 50, margin: 10 }}>
        <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/left.png' }}
          style={{ width: 50, height: 50 }} />
      </TouchableOpacity>
      {products.map((product, index) =>
        <TouchableOpacity key={index} style={{
          height: windowHeight / 5,
          backgroundColor: 'rgba(99, 98, 198, 0.75)',
          margin: 10,
          flexDirection: 'row',
          alignItems: "center",
          borderRadius: 30,
          overflow: 'hidden'
        }}
          onPress={() => orderProduct(product.id)}>
          <Image source={{ uri: product.img }} style={{ width: '33%', height: '100%' }} />
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{
              textAlign: 'center',
              fontSize: 24,
              color: 'white'
            }}>{product.name}</Text>
            <Text style={{ color: 'white', fontSize: 25 }}>{product.price} ₪</Text>
          </View>
        </TouchableOpacity>)}
    </ScrollView>
  }


  //basic page
  return (
    <View>
      <View
        style={{
          width: windowWidth, paddingBlock: 30, textAlign: 'center',
          backgroundColor: 'rgb(41, 29, 29)', flexDirection: 'row',
          gap: 20,
          paddingInline: 20
        }}>
        <View style={{
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 50
        }}>
          <Image
            source={{ uri: 'https://img.icons8.com/ios-filled/50/808080/search--v1.png' }}
            style={{
              width: 50,
              height: 50,
              zIndex: 2,
              tintColor: 'gray'
            }}
          />
        </View>
        <TextInput
          style={{
            flex: 1,
            backgroundColor: 'rgb(255, 255, 255)',
            fontSize: 30,
            borderRadius: 10,
            textAlign: 'center'
          }}
          keyboardType={'text'}
          placeholder={'Search a product...'}
          onChangeText={(input) => setResearch(input)} />
      </View>
      <ScrollView>
        {research.length > 0 ? searchedProducts.length > 0 ?
          <View></View>
          :
          <View><Text style={{fontSize:35, margin:'auto',marginBlock:40}}>No product found</Text></View>
          : sections.map((section, index) => (
            <TouchableOpacity key={index} style={{ position: 'relative' }}
              onPress={() => setSectionId(section.id)}>
              <Text style={{
                position: 'absolute',
                zIndex: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: "white",
                width: '100%',
                textAlign: 'center',
                fontSize: 30,
                top: '50%',
                transform: 'translateY(-50%)',
                padding: 10
              }}>{section.name}</Text>
              <Image source={{ uri: section.img }}
                style={{ width: '100%', height: windowHeight / 3 }}></Image>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
}
