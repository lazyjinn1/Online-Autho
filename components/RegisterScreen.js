import { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

const RegisterScreen = ({auth, navigation, db}) => {
    const [email, setEmail] = useState('')
    const [authNumber, setAuthNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState('');

    const handleRegister = useCallback(async() => {
        if (!email || !authNumber || !password || !confirmedPassword) {
            Alert.alert('Required fields are missing, please fill in all fields.')
            return;
        }

        if (password !== confirmedPassword) {
            Alert.alert('Passwords do not match, please try again.')
            return;
        }

        try {
            
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            navigation.navigate('LoginScreen', { authNumber });
            const user = userCredential.user;
            Alert.alert('New user created, redirecting to Login.');
            const newUser = { email, authNumber };
            const docRef = await addDoc(collection(db, 'users'), newUser);
            
        } catch (error) {
            Alert.alert('Error creating user: ' + error.message);
        }
    }, [auth, authNumber, email, password, confirmedPassword, navigation]);

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', 'white']}
            style={styles.linearGradient}
        >
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder='Write your Email here'
                        onChangeText={setEmail}
                        style={styles.textInput}
                        keyboardType='email-address'
                    />
                    <TextInput
                        placeholder='Auth Number'
                        onChangeText={setAuthNumber}
                        style={styles.textInput}
                        keyboardType='numeric'
                        maxLength={4}
                    />
                    <TextInput
                        placeholder='Password'
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        style={styles.textInput}
                    />

                    <TextInput
                        placeholder='Confirm Password'
                        onChangeText={setConfirmedPassword}
                        secureTextEntry={true}
                        style={styles.textInput}
                    />

                    <TouchableOpacity
                        onPress={handleRegister}
                        style={styles.submitButton}
                    >
                        <Text>Finalize Registration</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
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
        padding: 10,
        marginTop: 10,
    },
});

export default RegisterScreen;