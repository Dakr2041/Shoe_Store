import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons
import { View, Text, StyleSheet } from 'react-native';
import ProductScreen from './Product/ProductScreen';
import AccountScreen from './Account/AccountScreen';
import ProductDetailScreen from './Product/ProductDetailScreen';
import { createStackNavigator } from '@react-navigation/stack';


function CartScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Cart Screen</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer independent={true} >

      {/* <Text style={styles.tittle}>Shoe Store</Text> */}
      <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }} style={styles.container}>
        <Stack.Screen name="Tabs" component={TabsScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      </Stack.Navigator>


    </NavigationContainer>
  );
}

const TabsScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Account') {
            iconName = 'person-outline';
          } else if (route.name === 'Cart') {
            iconName = 'cart-outline';
          } else if (route.name === 'Notifications') {
            iconName = 'notifications-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
        labelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        style: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: 'lightgray',
        },
      }}
    >
      <Tab.Screen name="Home" component={ProductScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tittle: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'start',
    marginTop: 30,
    padding: 20
  },
});
