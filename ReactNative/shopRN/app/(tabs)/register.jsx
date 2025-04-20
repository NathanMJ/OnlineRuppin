import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, Touchable, TouchableOpacity } from 'react-native'
import { addUser, getUsers } from '../Databases/dbUsers.jsx';

export default function register() {
    const router = useRouter();

    const [tempUser, setTempUser] = useState({
        email: '',
        password: '',
        verifyPassword: '',
        isAdmin: false,
    });

    const handleSeeUsers = async () => {
        const users = await getUsers();
        console.log('users', users);
    }

    useEffect(() => {
        handleSeeUsers();
    }, []);

    useEffect(() => {
        console.log('tempUser', tempUser);
    }, [tempUser]);

    const register = async () => {

        // TODO : check if the password is the same as the verify password
        if (tempUser.password !== tempUser.verifyPassword) {
            Alert.alert('Error', 'The password and the verify password are not the same');
            return;
        }

        //if the one of the field is empty
        if (tempUser.email === '' || tempUser.password === '' || tempUser.verifyPassword === '') {
            Alert.alert('Error', 'Please fill all the fields');
            return
        }

        const result = await addUser({
            email: tempUser.email.trim(),
            password: tempUser.password,
            cart: [],
            isAdmin: tempUser.isAdmin,
        });
        // TODO : check if the user already exists in the dbUsers
        if (result.error) {
            Alert.alert('Error', result.error);
            return
        }

        Alert.alert('Success', `You are registered !`);
        // TODO : redirect to the store page with email of the user

        await AsyncStorage.setItem('email', tempUser.email.trim());
        router.push("/DrawerDir/theStore");
    }

    return (
        <View style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Text style={{ fontSize: 30, margin: 20 }}>Register</Text>
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
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ flex: 1, marginLeft: 5, textAlign: 'right' }}>Check your password :</Text>
                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                    <TextInput
                        style={{
                            height: 40, borderColor: 'gray', width: '80%', borderWidth: 1, marginBottom: 10,
                            justifyContent: 'center', alignItems: 'center'
                        }}
                        placeholder="Verify your password"
                        onChange={(e => setTempUser({ ...tempUser, verifyPassword: e.nativeEvent.text }))}
                    />
                </View>
            </View>

            <TouchableOpacity style={{
                flexDirection: 'row', alignItems: 'center', marginBottom: 10,
                backgroundColor: tempUser.isAdmin ? 'green' : 'red', padding: 10, borderRadius: 5
            }}
                onPress={() => setTempUser({ ...tempUser, isAdmin: !tempUser.isAdmin })}>
                <Text style={{ color: 'white', fontSize: 15 }}>I {tempUser.isAdmin ? '' : "don't "}want to be an admin</Text>
            </TouchableOpacity>

            <Button title='Register'
                onPress={() => register()} >
            </Button>
        </View>
    )
}