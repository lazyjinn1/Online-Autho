import { useState, useCallback } from 'react';
import { TouchableOpacity, Text, View, TextInput, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { signInWithEmailAndPassword } from 'firebase/auth';

import { getAuth } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const auth = getAuth();

    const handleLogin = useCallback(async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);

            const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const user = userCredential.user;
            if (user) {
                navigation.navigate('AuthoScreen', { uid: user.uid });
            } else {
                Alert.alert('Authentication Failed', 'An unexpected error occurred. Please try again.');
            }
        } catch (error) {
            Alert.alert('Authentication Failed', 'Please check your credentials and try again.');
        }
    }, [auth, email, password, navigation]);

    const handleRegister = useCallback(() => {
        navigation.navigate('RegisterScreen', {});
    }, [navigation]);
    return (
        <LinearGradient
            colors={['darkslategray', 'lightslategray', 'white']}
            style={styles.linearGradient}
        >
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder='Email'
                        onChangeText={setEmail}
                        style={styles.textInput}
                        keyboardType='email-address'
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

                    <TouchableOpacity
                        onPress={handleRegister}
                        style={styles.submitButton}
                    >
                        <Text>No account? Register here!</Text>
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
        backgroundColor: 'silver',
        borderRadius: 10,
        borderWidth: 1,
        color: 'white',
        padding: 10,
        marginTop: 10,
    },
});

export default LoginScreen;