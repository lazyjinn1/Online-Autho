import { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';

const RegisterScreen = ({ auth, navigation, db }) => {
    const [email, setEmail] = useState('');
    const [authNumber, setAuthNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');

    const handleRegister = useCallback(async () => {
        if (!email || !password || !confirmedPassword || !authNumber) {
            Alert.alert('Required fields are missing, please fill in all fields.');
            return;
        }

        if (password !== confirmedPassword) {
            Alert.alert('Passwords do not match, please try again.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const uid = user.uid;
            Alert.alert('New user created, redirecting to Login.');

            const usersCollection = collection(db, 'users');
            const userDocRef = doc(usersCollection, uid);

            const newUser = { 'Email': email, uid: user.uid, 'Auth #': authNumber };

            await setDoc(userDocRef, newUser);

            Alert.alert('New user created, redirecting to Autho Screen.');
            navigation.navigate('AuthoScreen' ,{ uid: user.uid });
        } catch (error) {
            Alert.alert('Error creating user: ' + error.message);
            console.log(error.message);
        }
    }, [auth, email, password, confirmedPassword, authNumber, navigation, db]);

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
                        placeholder='Write your Auth # here'
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
        borderWidth: 1,
        color: 'white',
        padding: 10,
        marginTop: 10,
    },
});

export default RegisterScreen;
