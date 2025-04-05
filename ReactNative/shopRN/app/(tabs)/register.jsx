import { View, Text, TextInput,Button} from 'react-native'

export default function register() {
    return (
        <View>
            <Text>Register</Text>
            <View style={{display: 'flex', flexDirection: 'row',justifyContent: 'center', alignItems: 'center'}}>
                <Text>Your email :</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                    placeholder="Enter your email"
                />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text>Password :</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                    placeholder="Enter your password"
                    secureTextEntry={true}
                />
            </View>
            
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text>Confirm password :</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                    placeholder="Confirm password"
                    secureTextEntry={true}
                />
            </View>
            <Button title='Register'></Button>
        </View>
    )
}