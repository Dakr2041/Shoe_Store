import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const NotificationPage = () => {

    const [notifications, setNotifications] = useState([
        { id: 1, message: "Notification 1" },
        { id: 2, message: "Notification 2" },
        { id: 3, message: "Notification 3" }
    ]);


    const handleNotificationClick = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Thông Báo</Text>
            <View style={styles.notificationList}>
                {notifications.map(notification => (
                    <TouchableOpacity key={notification.id} style={styles.notification} onPress={() => handleNotificationClick(notification.id)}>
                        <Text>{notification.message}</Text>
                        <TouchableOpacity onPress={() => handleNotificationClick(notification.id)}>
                            <Text style={styles.deleteButton}>Xóa</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    notificationList: {
        width: '80%',
    },
    notification: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    deleteButton: {
        color: 'red',
    },
});

export default NotificationPage;
