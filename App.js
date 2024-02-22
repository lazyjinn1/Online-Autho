import { StyleSheet, LogBox, Alert } from 'react-native';
import Login from './components/Login';
import Autho from './components/Autho';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from 'firebase/app';
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect } from "react";
import { getStorage } from 'firebase/storage';

//for navigation
const Stack = createNativeStackNavigator();

//lets us ignore some errors
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const App = () => {

  const connectionStatus = useNetInfo();
  // Taken from our firebase database
  const firebaseConfig = {
    apiKey: "AIzaSyCWkvtD5GMNNGu0iCYmt-M7T4u64paI2J4",
    authDomain: "online-autho.firebaseapp.com",
    projectId: "online-autho",
    storageBucket: "online-autho.appspot.com",
    messagingSenderId: "185448563832",
    appId: "1:185448563832:web:90bd2f65a0807c04c3998d",
    measurementId: "G-Z3HL2ZMYTS"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  // initializing our storage for images
  const storage = getStorage(app);

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection lost');
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    //this shows all the possible places you can go
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
      >
        <Stack.Screen
          name="Login"
          component={Login}
        />
        <Stack.Screen
          name="Autho"
        >
          {props =>
            <Autho
              isConnected={connectionStatus.isConnected}
              db={db}
              storage={storage}
              {...props}
            />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
