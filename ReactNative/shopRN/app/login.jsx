import { View, Text, TextInput,Button} from 'react-native'

export default function Login() {
    return (
        <View>
            <Text>Login</Text>
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
            <Button title='Login'></Button>
        </View>
    )
}