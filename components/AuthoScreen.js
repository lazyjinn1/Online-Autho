// Import necessary modules from React, Firebase, and other libraries
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Alert, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { DatePickerInput } from 'react-native-paper-dates';
import { enGB, registerTranslation } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getAuth } from 'firebase/auth';

// Register English translations for DatePicker
registerTranslation('en', enGB);

// Functional component AuthoScreen with props route, db, and navigation
const AuthoScreen = ({ route, db, navigation }) => {
    // State variables for form inputs and modal visibility
    const [dateOfRepair, setDateOfRepair] = useState(new Date());
    const [roNumber, setRoNumber] = useState('');
    const [lineNumber, setLineNumber] = useState('');
    const [mileage, setMileage] = useState('');
    const [vinNumber, setVinNumber] = useState('');
    const [furtherComments, setFurtherComments] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [todaysDateAndTime, setTodaysDateAndTime] = useState(new Date());
    const [sequentialNumber, setSequentialNumber] = useState(1);
    const [authNumber, setAuthNumber] = useState(null);

    const [user, setUser] = useState(null); // State to store user data

    // Destructure uid and authNumber from route.params
    const { uid } = route.params;

    // Fetch user data when the component mounts
    useEffect(() => {
        const fetchUserAndMaxSequentialNumber = async () => {
            try {
                // Query to get user data based on uid
                const userQuery = query(collection(db, 'users'), where('uid', '==', uid));
                const userSnapshot = await getDocs(userQuery);
                // Extract user data from the snapshot
                const user = userSnapshot.docs[0]?.data();

                const userAuthNumber = user ? user['Auth #'] : null;
                setAuthNumber(userAuthNumber);

                // Set the user state with the fetched data
                setUser(user);

                // Check if user or user.uid is undefined
                if (!user || !user.uid) {
                    console.error('User is undefined or does not have a uid property.');
                    return;
                }
                // Fetch the maximum sequential number from the collection
                const maxSequentialNumberQuery = query(collection(db, 'Authorizations'), orderBy('Sequential #', 'desc'));
                const maxSequentialNumberSnapshot = await getDocs(maxSequentialNumberQuery);
                const maxSequentialNumberDoc = maxSequentialNumberSnapshot.docs[0];

                setSequentialNumber(maxSequentialNumberDoc ? maxSequentialNumberDoc.data()['Sequential #'] + 1 : 1);
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };
        // Call the fetchUserAndMaxSequentialNUmber function
        fetchUserAndMaxSequentialNumber();
    }, [uid, db, user]);

    // Firebase authentication object
    const auth = getAuth();

    // Handle opening the review modal
    const handleOpenReview = () => {
        setShowModal(true);
    };

    // Handle submitting Autho form
    const handleSubmitAutho = async () => {
        try {
            // Check if required fields are empty
            if (!dateOfRepair || !roNumber || !mileage || !vinNumber || !furtherComments) {
                Alert.alert('Required Fields left empty. Please fill in required fields.');
                setShowModal(false);
                return;
            }

            // Add Autho document to Firebase collection
            const authDocRef = await addDoc(collection(db, 'Authorizations'), {
                'Auth #': authNumber,
                'Date of Repair': dateOfRepair.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
                'RO #': roNumber,
                'Mileage': mileage,
                'VIN #': vinNumber,
                'Comments': furtherComments,
                'Line Number': lineNumber,
                "Today's Date and Time": todaysDateAndTime,
                'Sequential #': sequentialNumber
            });

            // Show success message and reset form fields
            Alert.alert('Successfully uploaded Autho');
            setRoNumber('');
            setLineNumber('');
            setMileage('');
            setVinNumber('');
            setFurtherComments('');
            setSequentialNumber(sequentialNumber + 1);
            setShowModal(false);
        } catch (error) {
            // Show error message if Autho upload fails
            Alert.alert('Error uploading Autho. Please try again.');
        }
    };

    // JSX structure with added comments
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

                    {/* SafeAreaProvider for DatePickerInput */}
                    <SafeAreaProvider>
                        <View>
                            {/* Date Picker Input */}
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

                    {/* TextInput for RO Number */}
                    <TextInput
                        style={styles.AuthoStyle}
                        onChangeText={setRoNumber}
                        placeholder={"RO Number"}
                        keyboardType='numeric'
                        maxLength={6}
                        value={roNumber}
                    />

                    {/* TextInput for Mileage */}
                    <TextInput
                        style={styles.AuthoStyle}
                        onChangeText={setMileage}
                        placeholder={"Mileage"}
                        keyboardType='numeric'
                        maxLength={6}
                        value={mileage}
                    />

                    {/* TextInput for VIN Number */}
                    <TextInput
                        style={styles.AuthoStyle}
                        onChangeText={setVinNumber}
                        placeholder={"VIN Number"}
                        value={vinNumber}
                    />

                    {/* TextInput for Further Comments */}
                    <TextInput
                        style={styles.AuthoStyle}
                        onChangeText={setFurtherComments}
                        placeholder={"Further Comments"}
                        value={furtherComments}
                    />

                    {/* TextInput for Line Number */}
                    <TextInput
                        style={styles.AuthoStyle}
                        onChangeText={setLineNumber}
                        placeholder={"Line Number"}
                        value={lineNumber}
                    />

                    {/* Submit Autho Button */}
                    <TouchableOpacity
                        onPress={handleOpenReview}
                        style={styles.submitButton}
                    >
                        <Text>Submit Autho</Text>
                    </TouchableOpacity>

                    {/* Review Modal */}
                    {showModal && (
                        <Modal
                            animationType='smooth'
                            visible={showModal}
                            onRequestClose={() => { setShowModal(false) }}
                        >
                            <View style={styles.container}>
                                <View style={[styles.modalView, { alignItems: 'left' }]}>
                                    {/* Review details */}
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Please Review:</Text>
                                    <Text>Auth #: {authNumber}</Text>
                                    <Text>Date of Repair: {dateOfRepair.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</Text>
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

                                    {/* Submit Autho Button inside the modal */}
                                    <TouchableOpacity
                                        onPress={handleSubmitAutho}
                                        style={styles.submitButton}
                                    >
                                        <Text>Submit Autho</Text>
                                    </TouchableOpacity>

                                    {/* Edit Autho Button inside the modal */}
                                    <TouchableOpacity
                                        style={styles.submitButton}
                                        onPress={() => setShowModal(false)}
                                    >
                                        <Text>Edit Autho</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    )}

                    {/* KeyboardAvoidingView for iOS */}
                    {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
                </ScrollView>
            </View>
        </LinearGradient>
    );
};

// Styles
const styles = StyleSheet.create({
    // Styles for Autho TextInput
    AuthoStyle: {
        borderColor: 'black',
        borderWidth: 2,
        padding: 10,
        width: 300,
        marginVertical: 10
    },

    // Styles for Date Picker Input
    DateStyle: {
        borderColor: 'black',
        borderWidth: 2,
        padding: 0,
        width: 300,
    },

    // Styles for container
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Styles for subContainer
    subContainer: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        padding: 15
    },

    // Styles for scrollView
    scrollView: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 15
    },

    // Styles for textInput
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

    // Styles for submitButton
    submitButton: {
        backgroundColor: 'silver',
        borderRadius: 10,
        borderWidth: 1,
        color: 'white',
        padding: 10,
        marginTop: 10,
    },

    // Styles for linearGradient
    linearGradient: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Styles for modalView
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

// Export the AuthoScreen component
export default AuthoScreen;
