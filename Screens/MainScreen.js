import * as React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons
import { View, Text, StyleSheet } from 'react-native';
import ProductScreen from './Product/ProductScreen';
import AccountScreen from './Account/AccountScreen';
import ProductDetailScreen from './Product/ProductDetailScreen';
import { createStackNavigator } from '@react-navigation/stack';
import CartScreen from './Cart/CartScreen';
import SettingsScreen from './Account/SettingScreen';
import UpdateUserInfoScreen from './Account/UpdateUserInfoScreen';
import SetupUserInfoScreen from './Account/SetupUserInfoScreen';
import CheckoutScreen from './Cart/CheckoutScreen';
import ResetPasswordScreen from './Account/ResetPassword';
import OrdersScreen from './Account/OrdersScreen';
import SearchScreen from './Product/Search/SearchScreen';
import SearchResultScreen from './Product/Search/SearchResultScreen';
import OnlinePaymentScreen from './Cart/OnlinePaymentScreen';
import DiscountScreen from './Discounts/DiscountScreen';
import SupportScreen from './Support/SupportScreen';
import Notification from './Notification/NotificationScreen';
import Favourite from './Favourite/FavouriteScreen'
import OrderSuccessScreen from './Cart/OrderSuccessScreen';
import OrderDetailScreen from './Account/OrderDetailScreen';
import OrderFailScreen from './Cart/OrderFailedScreen';


const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer independent={true} >

      {/* <Text style={styles.tittle}>Shoe Store</Text> */}
      <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }} style={styles.container}>
        <Stack.Screen name="Tabs" component={TabsScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="UpdateUserInfo" component={UpdateUserInfoScreen} />
        <Stack.Screen name="SetupUserInfo" component={SetupUserInfoScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OnlinePayment" component={OnlinePaymentScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="SearchResult" component={SearchResultScreen} />
        <Stack.Screen name="Discounts" component={DiscountScreen} />
        <Stack.Screen name="Supports" component={SupportScreen} />
        <Stack.Screen name="Favourites" component={Favourite} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        <Stack.Screen name="OrderFailed" component={OrderFailScreen} />
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

          if (route.name === 'Trang chủ') {
            iconName = 'home-outline';
          } else if (route.name === 'Người dùng') {
            iconName = 'person-outline';
          } else if (route.name === 'Giỏ hàng') {
            iconName = 'cart-outline';
          } else if (route.name === 'Thông báo') {
            iconName = 'notifications-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#f5ca0c',
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
      <Tab.Screen name="Trang chủ" component={ProductScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Giỏ hàng" component={CartScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Thông báo" component={Notification} options={{ headerShown: false }} />
      <Tab.Screen name="Người dùng" component={AccountScreen} options={{ headerShown: false }} />

    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
