import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const CustomAlert = ({ message, onClose }) => {
    const [translateX] = useState(new Animated.Value(400));

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();

        const timeout = setTimeout(() => {
            hideAlert();
        }, 3000);

        return () => clearTimeout(timeout);
    }, [translateX]);

    const hideAlert = () => {
        Animated.timing(translateX, {
            toValue: 400,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            onClose();
        });
    };

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={true}
            onRequestClose={hideAlert}
        >
            <View style={styles.centeredView}>
                <Animated.View style={[styles.modalView, { transform: [{ translateX }] }]}>
                    <Text style={styles.modalText}>{message}</Text>
                    <TouchableOpacity onPress={hideAlert}>

                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',

    },
    modalView: {
        backgroundColor: 'pink',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    closeButton: {
        color: 'blue',
    },
});

export default CustomAlert;
