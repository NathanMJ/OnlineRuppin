import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { Text } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {router} from 'expo-router';
import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';

const CustomDrawerContent = (props) => {

  const goToAdmingPage = () => {
    // TODO : check if the user is admin
    router.push('/DrawerDir/addAProduct');
  }
  

  return (

    <DrawerContentScrollView {...props}>
      <DrawerItem
        label={"The store"}
        onPress={()=> {router.push('/DrawerDir/theStore');}}      
          
      />      
      <DrawerItem
        label={"Your cart"}
        onPress={()=> {router.push('/DrawerDir/yourCart');}}
      />

      <Text>Admin :</Text>      
      <DrawerItem
        label={"Add a product"}
        onPress={()=> { goToAdmingPage();}}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={props => <CustomDrawerContent {...props} />} />
    </GestureHandlerRootView>    
  );
}
