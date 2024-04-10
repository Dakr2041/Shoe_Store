import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../Api';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import OrdersList from './OrdersItem';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const OrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const navigation = useNavigation();
    const [token, setToken] = useState('');

    useEffect(() => {
        const fetchTOKEN = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('authToken');
                setToken(storedToken ? String(storedToken) : null);
                // console.log(storedToken);
            } catch (error) {
                console.error('Error fetching Token from storage:', error);

            }
        };

        fetchTOKEN();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await fetch(`${API_URL}/order/getOrderUser`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data.data);
            } else {
                console.error('Error fetching orders');
            }
        };

        if (token) {
            fetchOrders();
        }
    }, [token]);

    const Tab = createMaterialTopTabNavigator();

    orders.map(order => {
        console.log(`Order ID: ${order.id}, Status: ${order.status}`);
    });

    const sortOrdersByStatus = (orders) => {
        const sortedOrders = {};

        orders.forEach(order => {
            if (!sortedOrders[order.status]) {
                sortedOrders[order.status] = [];
            }

            sortedOrders[order.status].push(order);
        });

        return sortedOrders;
    };

    // Usage:
    const sortedOrders = sortOrdersByStatus(orders);
    // console.log(sortedOrders);
    const unConfirmOrders = sortedOrders['createOrder'] || [];
    const confirmOrders = sortedOrders['PaidCreateOrder'] || [];
    const deliveringOrders = sortedOrders['paidDelivering'] || [];
    const successOrders = sortedOrders['configOrder'] || [];

    console.log('-1-Unconfirm Orders:', unConfirmOrders);
    console.log('--2-Confirm Orders:', confirmOrders);
    console.log('---3-Delivering Orders:', deliveringOrders);
    console.log('----4-Success Orders:', successOrders);

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
                <Text style={styles.headerText}>Orders</Text>
                <View></View>
                <View></View>
                <View></View>
                <View></View>
            </View>
            {/* <OrdersList ordersData={orders} /> */}
            <Tab.Navigator tabBarOptions={{ scrollEnabled: true }}>
                <Tab.Screen name="Unconfirmed">
                    {() => <OrdersList ordersData={unConfirmOrders} />}
                </Tab.Screen>
                <Tab.Screen name="Confirmed">
                    {() => <OrdersList ordersData={confirmOrders} />}
                </Tab.Screen>
                <Tab.Screen name="Delivering">
                    {() => <OrdersList ordersData={deliveringOrders} />}
                </Tab.Screen>
                <Tab.Screen name="Success">
                    {() => <OrdersList ordersData={successOrders} />}
                </Tab.Screen>
            </Tab.Navigator>
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

export default OrdersScreen;