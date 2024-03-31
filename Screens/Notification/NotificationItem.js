import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { formatVND } from '../Functions/FormatVND';
import { API_URL } from '../Api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const NOItem = ({ notification, onPress, onRemoveItem }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(notification)}>
            <View style={styles.contentContainer}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.contentText}>{notification.content}</Text>
            </View>
            {/* <TouchableOpacity style={styles.removeButton} onPress={() => onRemoveItem(notification.id)}>
                <MaterialCommunityIcons name="delete" size={24} color="#f00" />
            </TouchableOpacity> */}
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
            <Modal
                visible={selectedNotification !== null}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modal}>
                    <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                        <Text style={styles.closeButtonText}>Đóng</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalText}>{selectedNotification ? selectedNotification.content : ''}</Text>
                    <Text style={styles.modalText}>{selectedNotification ? selectedNotification.title : ''}</Text>
                </View>
            </Modal>
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
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
});

export default NOList;
