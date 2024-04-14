import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Screens/LoginScreen.js';
import RegisterScreen from './Screens/RegisterScreen.js';
import MainScreen from './Screens/MainScreen.js';
import ProductDetailScreen from './Screens/Product/ProductDetailScreen.js';
import ForgotPasswordScreen from './Screens/ForgotPasswordScreen.js';
import { useEffect, useRef } from 'react';
import messaging from '@react-native-firebase/messaging';
import NavigationContext from './Screens/Functions/NavigationContext.js';

const Stack = createStackNavigator();
export default function App() {

  // const requestUserPermission = async () => {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   }
  // }

  // useEffect(() => {
  //   if (requestUserPermission()) {
  //     messaging().getToken().then(token => {
  //       console.log('Token: ', token);
  //     });
  //   } else {
  //     console.log('Error getting token', authStatus);
  //   }
  // }, []);

  const navigationRef = useRef();


  return (
    <NavigationContext.Provider value={navigationRef}>
      <NavigationContainer style={styles.container} ref={navigationRef}>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="Home" component={MainScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </NavigationContext.Provider>
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
