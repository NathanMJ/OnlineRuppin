import { Image } from 'expo-image';
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, Text, TouchableOpacity } from "react-native";
import { getProductById, getSections } from '../database.js';

export default function Menu() {
  const [sections, setSections] = useState([]);
  const [sectionId, setSectionId] = useState(-1)

  useEffect(() => {
    const fetchSections = async () => {
      const data = await getSections();
      setSections(data);
    };
    fetchSections();
  }, []);


  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  const [products, setProducts] = useState([]);

  const orderProduct = (productId) => {
    
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
          alignItems: "center"
        }}
        onPress={() => orderProduct(product.id)}>
          <Image source={{ uri: product.img }} style={{ width: '33%', height: '100%' }} />
          <Text style={{
            textAlign: 'center',
            fontSize: 24
          }}>{product.name} / {product.price} ₪</Text>
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
