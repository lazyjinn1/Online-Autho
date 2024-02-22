import { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { collection, addDoc, query } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';

import { getAuth } from 'firebase/auth';

const Autho = ({ authNumber }) => {
  const [dateOfRepair, setDateOfRepair] = useState('');
  const [roNumber, setRoNumber] = useState('');
  const [lineNumber, setlineNumber] = useState('');
  const [percentParts, setPercentParts] = useState('');
  const [percentLabor, setPercentLabor] = useState('');
  const [mileage, setMileage] = useState('');
  const [vinNumber, setVinNumber] = useState('');
  const [furtherComments, setFurtherComments] = useState('');
  const [todaysDate, setTodaysDate] = useState('');
  const [todaysTime, setTodaysTime] = useState('');
  const [showModal, setShowModal] = useState(false);


  // getAuth is for our Anonymous authentication
  const auth = getAuth();

  const handleSubmitAutho = () => {
    Alert.alert('Successfully uploaded Autho');
  }

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', 'white']}
      style={styles.linearGradient}
    >
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Text>Welcome!</Text>

          <Text>Authorization Number: {authNumber}</Text>

          <TextInput
            style={styles.AuthoStyle}
            onChangeText={setDateOfRepair}
            placeholder={"Date of Repair"}
          />

          <TextInput
            style={styles.AuthoStyle}
            onChangeText={setRoNumber}
            placeholder={"RO Number"}
          />

          <TextInput
            style={styles.AuthoStyle}
            onChangeText={setlineNumber}
            placeholder={"Line Number"}
          />

          <TextInput
            style={styles.AuthoStyle}
            onChangeText={setPercentParts}
            placeholder={"% Parts"}
          />

          <TextInput
            style={styles.AuthoStyle}
            onChangeText={setPercentLabor}
            placeholder={"% Labor"}
          />

          <TextInput
            style={styles.AuthoStyle}
            onChangeText={setMileage}
            placeholder={"Mileage"}
          />

          <TextInput
            style={styles.AuthoStyle}
            onChangeText={setVinNumber}
            placeholder={"VIN Number"}
          />

          <TextInput
            style={styles.AuthoStyle}
            onChangeText={setFurtherComments}
            placeholder={"Further Comments"}
          />

          <TextInput
            style={styles.AuthoStyle}
            onChangeText={setTodaysDate}
            placeholder={"Today's Date"}
          />

          <TextInput
            style={styles.AuthoStyle}
            onChangeText={setTodaysTime}
            placeholder={"Today's Time"}
          />

          <TouchableOpacity
            onPress={handleSubmitAutho}
          >
            <Text>Submit Autho</Text>
          </TouchableOpacity>

          {/* this is for fixing a well-known issue with ios and the keyboard */}
          {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
        </View>
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
});

export default Autho;
