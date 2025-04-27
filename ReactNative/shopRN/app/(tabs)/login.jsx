import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native'
import { userExist } from '../Databases/dbUsers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function login() {

  const router = useRouter();

  const [tempUser, setTempUser] = useState({
    email: 'nathanmimoun2001@gmail.com',
    password: '12345'
  });

  const login = async () => {
    // TODO : check if the user exists in the dbUsers
    
    const result = await userExist(tempUser.email.trim(), tempUser.password);
    
    // TODO : check if the password is correct
    if (!result) {
      Alert.alert('Error', 'The email or the password is incorrect');
      return
    }
    // TODO : redirect to the store page with email of the user

    await AsyncStorage.setItem('email', tempUser.email.trim());    
    router.push("/DrawerDir/theStore");

  }

  return (
    <View style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Text style={{ fontSize: 30, margin: 20 }}>Login</Text>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ flex: 1, marginLeft: 5, textAlign: 'right' }}>Your email :</Text>
        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
          <TextInput
            style={{
              height: 40, borderColor: 'gray', width: '80%', borderWidth: 1, marginBottom: 10,
              justifyContent: 'center', alignItems: 'center'
            }}
            placeholder="Enter your email"
            onChange={(e => setTempUser({ ...tempUser, email: e.nativeEvent.text }))}
          />
        </View>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ flex: 1, marginLeft: 5, textAlign: 'right' }}>Your password :</Text>
        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
          <TextInput 
            style={{
              height: 40, borderColor: 'gray', width: '80%', borderWidth: 1, marginBottom: 10,
              justifyContent: 'center', alignItems: 'center'
            }}
            placeholder="Enter your password"
            onChange={(e => setTempUser({ ...tempUser, password: e.nativeEvent.text }))}
          />
        </View>
      </View>

      <Button title='Login'
        onPress={() => login()} >
      </Button>
    </View>
  )
}