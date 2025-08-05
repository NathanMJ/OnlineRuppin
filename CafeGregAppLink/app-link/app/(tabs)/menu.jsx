import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useEffect, useState } from "react";
import { Dimensions, ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import { getProductById, getProductByName, getSections, orderProductById } from '../database.js';
import { LinkAppContext } from '../LinkAppContext.jsx';
import FCOrderProduct from '../FuncComps/FCOrderProduct.jsx';

export default function Menu() {
  const [sections, setSections] = useState([]);
  const [sectionId, setSectionId] = useState(-1)
  const [products, setProducts] = useState([]);

  const [research, setResearch] = useState('')
  const [searchedProducts, setSearchedProducts] = useState([])
  const { linkApp, setLinkApp } = useContext(LinkAppContext);

  //when he arrived here he get the section
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

  useEffect(() => {
    const fetchProducts = async () => {
      if (sectionId !== -1 && sections[sectionId]) {
        console.log(sectionId);        
        let sectionIndex = sections.findIndex(section => section.id == sectionId)
        setProducts(sections[sectionIndex].products);
      } else {
        setProducts([]);
      }
    };
    fetchProducts();
  }, [sectionId, sections]);


  //research the product who contain the research every change
  useEffect(() => {
    const fetchResearch = async () => {
      const tempProducts = await getProductByName(research)
        setSearchedProducts(tempProducts)
    }
    if (research != '')
      fetchResearch()
    //TODO: send to the database the research and it will do the research
  }, [research])



  //if we clicked on a section

  if (sectionId != -1) {
    return <ScrollView style={{ position: 'relative' }}>
      <TouchableOpacity onPress={() => setSectionId(-1)} style={{ position: 'relative', width: 50, height: 50, margin: 10 }}>
        <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/left.png' }}
          style={{ width: 50, height: 50 }} />
      </TouchableOpacity>
      {products.map((product, index) =>
        <FCOrderProduct product={product} key={index}></FCOrderProduct>)}
    </ScrollView>
  }



  //basic page

  /* if we are researching something
      if we found
      if we does not have found
    if not we are just scrolling      
  */

  return (
    <View style={{ flex: 1 }}>
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
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgb(255, 255, 255)',
            borderRadius: 10,
            textAlign: 'center',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          <TextInput
            style={{
              fontSize: 25, 
              flex:1,
              textAlign:'center',
                borderRightWidth :1
            }}
              value={research} 
            keyboardType={'text'}
            placeholder={'Search a product...'}
            onChangeText={(input) => setResearch(input)} />
          <TouchableOpacity onPress={() => {setResearch('')}}>
            <Text
              style={{
                fontSize: 30,
                padding:10
              }}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }}>
        {research.length > 0 ? searchedProducts.length > 0 ?
          <View>
            {searchedProducts.map((product, index) => (
              <FCOrderProduct product={product} key={index}></FCOrderProduct>)
            )}
          </View>
          :
          <View>
            <Text style={{ fontSize: 35, alignSelf: 'center', marginBlock: 40 }}>No product found</Text></View>
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
