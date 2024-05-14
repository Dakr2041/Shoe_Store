import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../Api';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DiscountList from './Discount_Item';

const DiscountScreen = () => {
    const [orders, setOrders] = useState([]);
    const navigation = useNavigation();
    const [token, setToken] = useState('');

    useEffect(() => {
        const fetchTOKEN = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('authToken');
                setToken(storedToken ? String(storedToken) : null);

            } catch (error) {
                console.error('Error fetching Token from storage:', error);

            }
        };

        fetchTOKEN();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await fetch(`${API_URL}/discount/useDiscount`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                console.error('Error fetching orders');
            }
        };

        if (token) {
            fetchOrders();
        }
    }, [token]);


    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack}>
                    <MaterialCommunityIcons name="arrow-left" size={40} color="#333" />
                </TouchableOpacity>
                <View></View>
                <View></View>
                <Text style={styles.headerText}>Discount</Text>
                <View></View>
                <View></View>
                <View></View>
                <View></View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        marginTop: 20,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default DiscountScreen;