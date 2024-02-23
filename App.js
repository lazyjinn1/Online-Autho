import { StyleSheet, LogBox, Alert } from 'react-native';
import LoginScreen from './components/LoginScreen';
import AuthoScreen from './components/AuthoScreen';
import RegisterScreen from './components/RegisterScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect } from "react";
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import app from './firebase.config'

//for navigation
const Stack = createNativeStackNavigator();

//lets us ignore some errors
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const App = () => {

  const connectionStatus = useNetInfo();

  useEffect(() => {
    initializeFirebaseServices();
  }, []);

  const auth = getAuth(app);

  const initializeFirebaseServices = () => {
    // Initialize Cloud Firestore
    const db = getFirestore(app);

    // Initialize storage for images
    const storage = getStorage(app);

    // Handle network connection based on the status
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection lost');
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  };

  const RegisterScreenWrapper = (props) => {
    return <RegisterScreen db={getFirestore(app)} auth={getAuth(app)} {...props} />;
  };

  const AuthoScreenWrapper = (props) => {
    return (
      <AuthoScreen
        isConnected={connectionStatus.isConnected}
        db={getFirestore(app)}
        storage={getStorage(app)}
        {...props}
      />
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreenWrapper} />
        <Stack.Screen name="AuthoScreen" component={AuthoScreenWrapper} />
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
