import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { formatVND } from '../Functions/FormatVND';
import { API_URL } from '../Api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const NOItem = ({ notification, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(notification)}>
            <View style={styles.contentContainer}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.contentText}>{notification.content}</Text>
            </View>
        </TouchableOpacity>
    );
};

const NOList = ({ NotificationData }) => {
    const [selectedNotification, setSelectedNotification] = useState(null);

    const handleNotificationPress = (notification) => {
        setSelectedNotification(notification);
    };

    const handleCloseModal = () => {
        setSelectedNotification(null);
    };

    if (!NotificationData || !NotificationData.data) {
        return <Text>Đang tải dữ liệu....</Text>;
    }

    const sortedNotifications = NotificationData.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return (
        <View>
            <FlatList
                data={sortedNotifications}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <NOItem notification={item} onPress={handleNotificationPress} />
                )}
            />
            {selectedNotification && (
                <View style={styles.modal}>
                    <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                        <Text style={styles.closeButtonText}>Đóng</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalText}>{selectedNotification.content}</Text>
                    <Text style={styles.modalText}>{selectedNotification.title}</Text>
                </View>
            )}
        </View>
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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default NOList;
