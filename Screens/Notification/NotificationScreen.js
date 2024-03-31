import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../Api';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Notification from '../Notification/NotificationItem'


const NotificationSceen = () => {
    const [notification, setNotification] = useState([]);
    const navigation = useNavigation();
    const [token, setToken] = useState('');

    useEffect(() => {
        const fetchTOKEN = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('authToken');
                setToken(storedToken ? String(storedToken) : null);
                console.log(storedToken);
            } catch (error) {
                console.error('Error fetching Token from storage:', error);

            }
        };

        fetchTOKEN();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await fetch(`${API_URL}/notification/getNotificationUser`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();

                setNotification(data);
            } else {
                console.error('Error fetching orders');
            }
        };

        if (token) {
            fetchOrders();
        }
    }, [token]);

    // const onRemoveItem = async (notificationId) => {
    //     try {
    //         if (!StoredToken) {
    //             console.warn('No token available. User needs to log in.');

    //             return;
    //         }

    //         await removeItemFromAPI(notificationId, StoredToken);
    //         console.log('Item deleted from cart');
    //     } catch (error) {
    //         console.error('Error deleting item:', error);

    //     }
    // };

    // const removeItemFromAPI = async (notificationId, token) => {
    //     try {
    //         const response = await fetch(`${API_URL}/notification/deleteNotification${notificationId}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         if (!response.ok) {
    //             throw new Error(`API error: ${response.statusText}`);
    //         }
    //         fetchData();
    //         return response.json();

    //     } catch (error) {
    //         throw new Error(`Failed to delete item: ${error.message}`);
    //     }
    // };

    // const handleRefresh = async () => {
    //     setItemsId([]);
    //     await fetchData();
    // };

    // const handleDeleteConfirmation = (itemId) => {
    //     Alert.alert(
    //         'Confirm Delete',
    //         `Are you sure you want to delete item from your cart?`,
    //         [
    //             { text: 'Cancel', onPress: () => console.log('Cancel deletion') },
    //             { text: 'Delete', onPress: () => onRemoveItem(itemId), style: 'destructive' },
    //         ],
    //         { cancelable: false },
    //     );
    // };


    console.log(notification);


    return (
        <View style={styles.container}>
            <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
                <Text style={styles.headerText}>Thông báo</Text>
            </LinearGradient>
            <Notification NotificationData={notification} />
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
        paddingVertical: 20,
        marginTop: 20,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default NotificationSceen;
