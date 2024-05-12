import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../Api';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import NotificationList from './NotificationItem';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();
  const [token, setToken] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        setToken(storedToken ? storedToken : null);
      } catch (error) {
        console.error('Error fetching Token from storage:', error);
      }
    };

    fetchToken();
  }, []);

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('@userId');
        setUserId(storedUserId ? Number(storedUserId) : null);
      } catch (error) {
        console.error('Error fetching user ID from storage:', error);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchUserId();

  }, [isFocused]);

  const [shouldRedirectToSetup, setShouldRedirectToSetup] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userId) {
        // setIsLoading(true);
        try {
          const response = await fetch(`${API_URL}/api/getInfoUser/${userId}`);
          if (response.ok) {
            const data = await response.json();

            if (data.status === 400) {
              setShouldRedirectToSetup(true);
            } else if (data.status === 200) {
              setShouldRedirectToSetup(false);
            }
          } else {
            console.error('Error fetching user info:', response.status);
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        } finally {
          //   setIsLoading(false);
        }
      }
    };

    fetchUserInfo();
  }, [userId, isFocused]);


  useEffect(() => {


    if (shouldRedirectToSetup) {
      navigation.navigate('Tabs', { screen: 'Account' }); // navigate to Account screen in Tabs
    }
  }, [shouldRedirectToSetup, isFocused]);



  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/notification/getNotificationUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        console.error('Error fetching notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token, isFocused]);

  const onRemoveItem = async (notificationId) => {
    try {
      if (!token) {
        console.warn('No token available. User needs to log in.');
        return;
      }

      const response = await fetch(`${API_URL}/notification/deleteNotification/${notificationId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete notification: ${response.statusText}`);
      }



      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleDeleteConfirmation = (notificationId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel deletion') },
        { text: 'Delete', onPress: () => onRemoveItem(notificationId), style: 'destructive' },
      ],
      { cancelable: false }
    );
  };



  return (
    <View style={styles.container}>
      <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
        <Text style={styles.headerText}>Thông báo</Text>
      </LinearGradient>
      <NotificationList NotificationData={notifications} onRemoveItem={handleDeleteConfirmation} fetchNotifications={fetchNotifications} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 25,
    color: '#fff',
  },
});

export default NotificationScreen;
