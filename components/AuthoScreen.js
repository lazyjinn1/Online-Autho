import { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { collection, addDoc, query } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { DatePickerInput } from 'react-native-paper-dates';
import { enGB, registerTranslation } from 'react-native-paper-dates'

import { SafeAreaProvider } from "react-native-safe-area-context";

import { getAuth } from 'firebase/auth';

registerTranslation('en', enGB)

const AuthoScreen = ({ route, db }) => {
    const [dateOfRepair, setDateOfRepair] = useState(new Date());
    const [roNumber, setRoNumber] = useState('');
    const [lineNumber, setLineNumber] = useState('');
    const [mileage, setMileage] = useState('');
    const [vinNumber, setVinNumber] = useState('');
    const [furtherComments, setFurtherComments] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [todaysDateAndTime, setTodaysDateAndTime] = useState(new Date());

    const fixedDateOfRepair = dateOfRepair.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })

    const [sequentialNumber, setSequentialNumber] = useState(1);

    const { authNumber } = route.params;

    const auth = getAuth();

    const handleOpenReview = () => {
        setShowModal(true);
    }

    const handleSubmitAutho = async () => {
        try {
            if (!dateOfRepair || !roNumber || !mileage || !vinNumber || !furtherComments) {
                Alert.alert('Required Fields left empty. Please fill in required fields.');
                setShowModal(false);
                return
            }

            const authDocRef = await addDoc(collection(db, 'Authorizations'), {
                'Auth #': authNumber,
                'Date of Repair': fixedDateOfRepair,
                'RO #': roNumber,
                'Mileage': mileage,
                'VIN #': vinNumber,
                'Comments': furtherComments,
                'Line Number': lineNumber,
                "Today's Date and Time": todaysDateAndTime,
                'Sequential #': sequentialNumber
            });

            Alert.alert('Successfully uploaded Autho');
            setRoNumber('');
            setLineNumber('');
            setMileage('');
            setVinNumber('');
            setFurtherComments('');
            setSequentialNumber(sequentialNumber + 1)
            setShowModal(false);

        } catch (error) {
            Alert.alert('Error uploading Autho. Please try again.');
        }
    }

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', 'white']}
            style={styles.linearGradient}
        >
            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <Text>Welcome!</Text>

                    <Text>Authorization Number: {authNumber}</Text>

                    <Text>Sequential Number: {sequentialNumber}</Text>

                    <SafeAreaProvider>
                        <View >
                            <DatePickerInput
                                locale="en"
                                label="DateOfRepair"
                                value={dateOfRepair}
                                onChange={(date) => setDateOfRepair(date)}
                                mode="outlined"
                                style={styles.DateStyle}
                                presentationStyle='pageSheet'
                            />
                        </View>
                    </SafeAreaProvider>

                    <TextInput
                        style={styles.AuthoStyle}
                        onChangeText={setRoNumber}
                        placeholder={"RO Number"}
                        keyboardType='numeric'
                        maxLength={6}
                        value={roNumber}
                    />

                    <TextInput
                        style={styles.AuthoStyle}
                        onChangeText={setMileage}
                        placeholder={"Mileage"}
                        keyboardType='numeric'
                        maxLength={6}
                        value={mileage}
                    />

                    <TextInput
                        style={styles.AuthoStyle}
                        onChangeText={setVinNumber}
                        placeholder={"VIN Number"}
                        value={vinNumber}
                    />

                    <TextInput
                        style={styles.AuthoStyle}
                        onChangeText={setFurtherComments}
                        placeholder={"Further Comments"}
                        value={furtherComments}
                    />

                    <TextInput
                        style={styles.AuthoStyle}
                        onChangeText={setLineNumber}
                        placeholder={"Line Number"}
                        value={lineNumber}
                    />


                    <TouchableOpacity
                        onPress={handleOpenReview}
                        style={styles.submitButton}
                    >
                        <Text>Submit Autho</Text>
                    </TouchableOpacity>

                    {showModal &&
                        <Modal
                            animationType='smooth'
                            visible={showModal}
                            onRequestClose={() => { setShowModal(false) }}
                        >
                            <View style={styles.container}>
                                <View style={[styles.modalView, { alignItems: 'left' }]}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Please Review:</Text>
                                    <Text>Auth #: {authNumber}</Text>
                                    <Text>Date of Repair: {fixedDateOfRepair}</Text>
                                    <Text>RO #: {roNumber}</Text>
                                    <Text>Mileage: {mileage}</Text>
                                    <Text>VIN #: {vinNumber}</Text>
                                    <Text>Line Number: {lineNumber}</Text>
                                    <Text style={[{ padding: 5, height: 50, width: 300, borderRadius: 10, borderWidth: 2, borderColor: 'black' }]}>Comments: {furtherComments}</Text>
                                    <View
                                        style={[{ marginTop: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }]}
                                    >
                                        <Text style={[{ fontWeight: 'bold' }]}>Today's Date and Time: </Text>
                                        <Text>{todaysDateAndTime.toLocaleString()}</Text>
                                    </View>

                                    <TouchableOpacity
                                        onPress={handleSubmitAutho}
                                        style={styles.submitButton}

                                    >
                                        <Text>Submit Autho</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.submitButton}
                                        onPress={() => setShowModal(false)}
                                    >
                                        <Text>Edit Autho</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>

                        </Modal>
                    }

                    {/* this is for fixing a well-known issue with ios and the keyboard */}
                    {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
                </ScrollView>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    AuthoStyle: {
        borderColor: 'black',
        borderWidth: 2,
        padding: 10,
        width: 300,
        marginVertical: 10
    },

    DateStyle: {
        borderColor: 'black',
        borderWidth: 2,
        padding: 0,
        width: 300,
    },

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

    scrollView: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 15
    },

    textInput: {
        width: '100%',
        padding: 25,
        borderWidth: 1,
        borderRadius: 20,
        marginTop: 15,
        marginBottom: 15,
        fontSize: 16,
        fontWeight: '300',
        opacity: 100,
        backgroundColor: 'white'
    },

    submitButton: {
        backgroundColor: 'white',
        borderRadius: 20,
        color: 'black',
        padding: 10,
        marginTop: 10,
    },

    linearGradient: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default AuthoScreen;
