import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountScreen = () => {
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('@userId');
        setUserId(storedUserId ? Number(storedUserId) : null);
      } catch (error) {
        console.error('Error fetching user ID from storage:', error);
      } finally {
        setIsLoading(false);

        console.log(userId);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userId) {
        setIsLoading(true);
        try {
          const response = await fetch(`http://192.168.0.104:3001/api/getInfoUser/${userId}`); // Replace with your API endpoint
          if (response.ok) {
            const data = await response.json();
            alert(data.message);
            setUserInfo(data);
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    // } else if (userInfo === null) {
    //   <View>
    //     <Text style={styles.title}>Account Details</Text>

    //   </View>
    } else { 
      return (
        <View>
          <Text style={styles.title}>Account Details</Text>
          <Text>Name: {userInfo.name}</Text>
          <Text>Email: {userInfo.email}</Text>
          {/* Add other user info fields as needed */}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
});

export default AccountScreen;
