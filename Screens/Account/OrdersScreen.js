import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../Api';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import OrdersList from './OrdersItem';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { LinearGradient } from 'expo-linear-gradient';

const OrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const navigation = useNavigation();
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

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

    const fetchOrders = useCallback(async () => {
        setLoading(true);
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
        setLoading(false);
    }, [token]);

    useFocusEffect(
        useCallback(() => {
            if (token) {
                fetchOrders();
            }
        }, [token, fetchOrders])
    );

    const Tab = createMaterialTopTabNavigator();

    // orders.map(order => {
    //     console.log(`Order ID: ${order.id}, Status: ${order.status}`);
    // });

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

    const sortedOrders = sortOrdersByStatus(orders);

    const unConfirmOrders = sortedOrders['cancelOrder'] || sortedOrders['PaidCancelOrder'] || sortedOrders['PaymentAndCancel'] || sortedOrders['payment'] || [];


    const confirmOrders = sortedOrders['createOrder'] || sortedOrders['PaidCreateOrder'] || [];

    const deliveringOrders = sortedOrders['delivering'] || sortedOrders['paidDelivering'] || [];
    const successOrders = sortedOrders['configOrder'] || [];

    // console.log('-1-Unconfirm Orders:', unConfirmOrders);
    // console.log('--2-Confirm Orders:', confirmOrders);
    // console.log('---3-Delivering Orders:', deliveringOrders);
    // console.log('----4-Success Orders:', successOrders);

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <>
                    <LinearGradient
                        colors={['#f7c458', '#fea239']}
                        style={styles.menuItemGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
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
                    </LinearGradient>

                    <Tab.Navigator tabBarOptions={{ scrollEnabled: true }}>
                        <Tab.Screen name="Unconfirm">
                            {() => <OrdersList ordersData={unConfirmOrders} fetchOrders={fetchOrders} />}
                        </Tab.Screen>
                        <Tab.Screen name="Confirmed">
                            {() => <OrdersList ordersData={confirmOrders} fetchOrders={fetchOrders} />}
                        </Tab.Screen>
                        <Tab.Screen name="Delivering">
                            {() => <OrdersList ordersData={deliveringOrders} fetchOrders={fetchOrders} />}
                        </Tab.Screen>
                        <Tab.Screen name="Successed">
                            {() => <OrdersList ordersData={successOrders} fetchOrders={fetchOrders} />}
                        </Tab.Screen>
                    </Tab.Navigator>
                </>
            )}
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
        color: 'white',
    },
});

export default OrdersScreen;