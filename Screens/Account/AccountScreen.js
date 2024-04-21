import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation, useIsFocused } from '@react-navigation/core';
import { API_URL } from '../Api';
import { LinearGradient } from 'expo-linear-gradient';
import NavigationContext from '../Functions/NavigationContext';

const AccountScreen = () => {
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirectToSetup, setShouldRedirectToSetup] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('@userId');
        setUserId(storedUserId ? Number(storedUserId) : null);
      } catch (error) {
        console.error('Error fetching user ID from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserId();

  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userId) {
        setIsLoading(true);
        try {
          const response = await fetch(`${API_URL}/api/getInfoUser/${userId}`);
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            if (data.status === 400) {
              setShouldRedirectToSetup(true);
            } else if (data.status === 200) {
              setShouldRedirectToSetup(false);
              setUserInfo(data.data);
            }
          } else {
            console.error('Error fetching user info:', response.status);
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserInfo();
  }, [userId, isFocused]);

  const navigation = useNavigation();

  const navigationRef = useContext(NavigationContext);
  const handleLogoutPress = () => {
    Alert.alert(
      "Logout", // title
      "Are you sure you want to logout?", // message
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout Cancelled"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            await AsyncStorage.removeItem('@userEmail');
            await AsyncStorage.removeItem('@userPassword');
            console.log('Logout!!!');
            const rootNavigator = navigationRef.current;
            rootNavigator.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ],
      { cancelable: false }
    );
  };
  const handleSettingsPress = () => {
    navigation.navigate('Settings')
  };
  const handleOrdersPress = () => {
    navigation.navigate('Orders')
  };
  const handleDiscountScreen = () => {
    navigation.navigate('Discounts')
  };
  const handleSupport = () => {
    navigation.navigate('Supports')
  };
  const handleFavourite = () => {
    navigation.navigate('Favourites')
  };


  const menuItems = [
    { title: 'Orders', onPress: handleOrdersPress, icon: require('../../assets/order_icon.png') },
    // { title: 'Oder Status', onPress: () => { }, icon: require('../../assets/order status.png') },
    { title: 'Favorites', onPress: handleFavourite, icon: require('../Product/favourite_icon.png') },
    // { title: 'Discount', onPress: handleDiscountScreen, icon: require('../../assets/discount_icon.png') },
    { title: 'Support', onPress: handleSupport, icon: require('../../assets/support_icon.png') },
    { title: 'Setting', onPress: handleSettingsPress, icon: require('../../assets/setting_icon.png') },

    { title: 'Logout', onPress: handleLogoutPress, icon: require('../../assets/logout_icon.png') }
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={item.onPress} style={styles.menuItem}>
      <LinearGradient
        colors={['#ff5400', '#f09819']}
        style={styles.menuItemGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Image source={item.icon} style={styles.menuItemIcon} />
        <Text style={styles.menuItemText}>{item.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : shouldRedirectToSetup ? (
        <View style={styles.setupContainer}>
          <Text style={{
            fontSize:20, 
            fontWeight:'bold',
            marginBottom:20, 
            maxWidth:'70%',
            }}>Please complete your setup information first.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SetupUserInfo')}>
            <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.setupButton} >
              <Text style={styles.setupButtonText}>Go to Setup</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.containeravatar}>
            <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.linearGradient}>
              <View style={styles.header}>
                {userInfo.avatar && <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />}
                {!userInfo.avatar && <ActivityIndicator size="small" />}
                <View style={styles.userInfo}>
                  <Text style={{
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 30,
                  }}>{userInfo.name}</Text>
                  <Text style={styles.infoText}>Phone: {userInfo.phone}</Text>
                  <Text style={styles.infoText}>Address: {userInfo.address} - {userInfo.city}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} onPress={item.onPress} style={styles.menuItem}>
                <LinearGradient
                  colors={['#f7c458', '#fea239']}
                  style={styles.menuItemGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Image source={item.icon} style={styles.menuItemIcon} />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containeravatar: {
    width: '100%',
    height: '30%',
    borderRadius: 15,
    elevation: 5, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  linearGradient: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 70,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 100,
  },
  userInfo: {
    marginLeft: 20,
    flex: 1,
  },
  infoText: {
    fontWeight: 'bold',
    color: 'white',
  },
  setupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setupButton: {
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
  },
  setupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: 15,

  },
  menuItem: {
    width: 95,
    height: 100,
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 11,
    borderRadius: 15,
    elevation: 5, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,

  },
  menuItemGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',

  },
  menuItemIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default AccountScreen;
