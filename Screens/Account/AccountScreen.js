import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { API_URL } from '../Api';
import { LinearGradient } from 'expo-linear-gradient';


const AccountScreen = () => {
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirectToSetup, setShouldRedirectToSetup] = useState(false);

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
            if(data.status === 400) {
              setShouldRedirectToSetup(true);
            } else if (data.status === 200) {
              setUserInfo(data.data);
            }
          } else {
            console.error('Error fetching user info:', response.status);
          }
        } catch (error) {
          console.error('Error fetching user info:-', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserInfo();
  }, [userId]);

  const navigation = useNavigation();
  const handleLogoutPress = () => {
    navigation.navigate('Login');
    console.log('Logout!!!');
  };
  const handleSettingsPress = () => {
    navigation.navigate('Settings')
  };
  const handleOrdersPress = () => {
    navigation.navigate('Orders')
  };
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    } else if (shouldRedirectToSetup) {
      return (
        <View style={styles.setupContainer}>
          <Text>Please complete your setup information first.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SetupUserInfo')}>
            <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.setupButton} >
              <Text style={styles.setupButtonText}>Go to Setup</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <View>
              {userInfo.avatar && <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />}
              {!userInfo.avatar && <ActivityIndicator size="small" />}
            </View>
          </LinearGradient>

          <View style={styles.userInfo}>
            <Text style={{ alignSelf: 'center', fontSize: 30 }}>{userInfo.name}</Text>
            <Text>Phone: {userInfo.phone}</Text>
            <Text>Address: {userInfo.address} - {userInfo.city}</Text>
          </View>
          <TouchableOpacity onPress={handleOrdersPress}>
            <Text style={{ alignSelf: 'center', marginTop: 20 }}>ORDERS</Text>
            <View style={{ height: 2, backgroundColor: '#ccc', marginTop: 10 }} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ alignSelf: 'center', marginTop: 20 }}>FAVORITES</Text>
            <View style={{ height: 2, backgroundColor: '#ccc', marginTop: 10 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSettingsPress}>
            <Text style={{ alignSelf: 'center', marginTop: 20 }}>SETTING</Text>
            <View style={{ height: 2, backgroundColor: '#ccc', marginTop: 10 }} />
          </TouchableOpacity>
          <TouchableOpacity
            // onPress={handleLogoutPress}
          >
            <Text style={{ alignSelf: 'center', marginTop: 20 }}>LOGOUT</Text>
            <View style={{ height: 2, backgroundColor: '#ccc', marginTop: 10 }} />
          </TouchableOpacity>

        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: 200,
    borderRadius: 125,
    marginBottom: 20,
    overflow: 'hidden',
    aspectRatio: 1,
    alignSelf: 'center',
    alignContent: 'center',
    marginTop: 60,

  },
  userInfo: {
    alignSelf: 'center'
  },
  setupContainer:{
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
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AccountScreen;
