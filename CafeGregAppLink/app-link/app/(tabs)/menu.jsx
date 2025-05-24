import { Image } from 'expo-image';
import { useCallback, useContext, useEffect, useState } from "react";
import { Dimensions, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { getProductById, getSections, orderProductById} from '../database.js';
import { useFocusEffect } from 'expo-router';
import { ToastAndroid } from 'react-native';
import { LinkAppContext } from '../LinkAppContext.jsx';

export default function Menu() {
  const [sections, setSections] = useState([]);
  const [sectionId, setSectionId] = useState(-1)
  const [products, setProducts] = useState([]);
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

  return (
    <ScrollView>
      {sections.map((section, index) => (
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
  );
}
