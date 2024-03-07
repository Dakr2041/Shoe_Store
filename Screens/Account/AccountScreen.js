import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
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
      }
    };

    fetchUserId();

  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userId) {
        setIsLoading(true);
        try {
          const response = await fetch(`http://192.168.1.77:3001/api/getInfoUser/${userId}`);
          if (response.ok) {
            const data = await response.json();
            // alert(data.data.message);

            console.log(data.data);
            setUserInfo(data.data);
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
          <View >
            {userInfo.avatar && <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />}
            {!userInfo.avatar && <ActivityIndicator size="small" />}
          </View>

          <View style={styles.userInfo}>
            <Text>Name: {userInfo.name}</Text>
            <Text>Phone: {userInfo.phone}</Text>
            <Text>Address: {userInfo.address}</Text>
            <Text>City: {userInfo.city}</Text>
          </View>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 50,
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
    height: 250,
    borderRadius: 125,
    marginBottom: 20,
    overflow: 'hidden',

  },
  userInfo: {
    
  },
});

export default AccountScreen;
