import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { formatVND } from '../Functions/FormatVND';
import { API_URL } from '../Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const NOItem = ({ notification, onPress, onRemoveItem, showDot, fetchNotifications }) => {
    const [isRead, setIsRead] = useState(false);
    const [token, setToken] = useState('');

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

    const renderRightActions = (progress, dragX) => {
        return (
            <TouchableOpacity onPress={() => onRemoveItem(notification.id)} style={styles.rightAction}>
                <MaterialCommunityIcons name="delete" size={24} color="#fff" />
            </TouchableOpacity>
        );
    };

    const senNotification = async () => {
        try {

            const response = await fetch(`${API_URL}/notification/senNotification/${notification.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to mark notification as read');
            }


            setIsRead(true);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };


    return (
        <Swipeable renderRightActions={renderRightActions}>
            <TouchableOpacity style={styles.container} onPress={() => { onPress(notification); senNotification(); }}>
                {showDot && notification.status === 1 && !isRead && <View style={styles.redDot} />}
                <View style={styles.contentContainer}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.contentText}>{notification.title}</Text>
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
};

const NOList = ({ NotificationData, onRemoveItem, fetchNotifications, token }) => {
    const [selectedNotification, setSelectedNotification] = useState(null);

    const handleNotificationPress = (notification) => {
        setSelectedNotification(notification);
    };

    const handleCloseModal = () => {
        setSelectedNotification(null);
    };


    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchNotifications();
        }, 5000);


        return () => clearInterval(intervalId);
    }, [fetchNotifications]);

    if (!NotificationData || !NotificationData.data) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }

    const sortedNotifications = NotificationData.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return (
        <ScrollView>
            <FlatList
                data={sortedNotifications}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <NOItem
                        notification={item}
                        onPress={handleNotificationPress}
                        onRemoveItem={onRemoveItem}
                        showDot={true}
                        fetchNotifications={fetchNotifications}
                        token={token}
                    />
                )}
            />
            <Modal
                visible={selectedNotification !== null}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modal}>
                    <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                        <MaterialCommunityIcons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.modalText}>
                        {selectedNotification ? selectedNotification.title : ''}
                    </Text>
                    <Text style={styles.modalText}>
                        {selectedNotification ? selectedNotification.content : ''}
                    </Text>
                </View>
            </Modal>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f5f5f5',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    contentContainer: {
        flex: 1,
    },
    contentText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    modal: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 400,
        left: '50%',
        top: '50%',
        marginLeft: -150,  
        marginTop: -200,   
        backgroundColor:'#fff',
        borderWidth:3,
        borderColor:'#f7c458',
        borderRadius:10,
        
    },
    
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        padding:20,
        
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'red',
        borderRadius: 20,
        padding: 10,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    rightAction: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
        backgroundColor: 'red',
        borderRadius: 5,
        marginVertical: 10,
    },
    redDot: {
        position: 'absolute',
        top: 5,
        left: 5,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red',
    },
});

export default NOList;
