import { useState } from 'react';
import { TouchableOpacity, Text, View, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Login = ( navigation ) => {
    const [authNumber, setAuthNumber] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Add an error check for if the password is wrong here
        // if () {
        //   return;
        // }
        navigation.navigate('Autho', { authNumber });
    };
    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', 'white']}
            style={styles.linearGradient}
        >
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder='Auth Number'
                        onChangeText={setAuthNumber}
                        style={styles.textInput}
                    />
                    <TextInput
                        placeholder='Password'
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        style={styles.textInput}
                    />
                    <TouchableOpacity
                        onPress={handleLogin}
                        style={styles.submitButton}
                    >
                        <Text>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient >

    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    subContainer: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        padding: 15
    },

    linearGradient: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    textInput: {
        padding: 25,
        borderRadius: 20,
        marginTop: 15,
        marginBottom: 15,
        fontSize: 16,
        fontWeight: '300',
        opacity: 100,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2,
        width: 300,
    },

    submitButton: {
        backgroundColor: 'black',
        borderRadius: 20,
        color: 'white',
        padding: 10,
        marginTop: 10,
    },
});

export default Login;