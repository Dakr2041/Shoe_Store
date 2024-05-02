import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { formatVND } from '../Functions/FormatVND';
import { API_URL } from '../Api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrdersScreen from './OrdersScreen';
import { useNavigation } from '@react-navigation/native';

const OrdersItem = ({ order, fetchOrders }) => {

    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState('');
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
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const productsData = [];
                for (let op of order.OrdersProducts) {
                    const response = await fetch(`${API_URL}/api/getProduct/${op.productId}`);
                    const productData = await response.json();
                    productsData.push({ data: productData.data, quantity: op.quantity });
                }
                setProducts(productsData);
                setLoading(false);

            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [order]);

    const handleRepurchase = async (pro) => {

    }

    const handleConfirmOrder = async (orderId) => {
        Alert.alert(
            "Confirm Order",
            "Are you sure you want to confirm this order?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {

                            const response = await fetch(`${API_URL}/order/configOrder/${orderId}`, {
                                method: 'GET',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                },
                            });
                            const responseData = await response.json();

                            alert(responseData.message);
                            fetchProduct();

                        } catch (error) {
                            console.error('Error confirming order:', error);
                            alert(responseData.message);
                        }
                    }
                }
            ]
        );
    };
    const handleCancelOrder = async (orderId) => {
        Alert.alert(
            "Cancel Order",
            "Are you sure you want to cancel this order?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {

                            const response = await fetch(`${API_URL}/order/cancelOrder/${orderId}`, {
                                method: 'GET',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                },
                            });
                            const responseData = await response.json();

                            if (responseData.status === 200) {
                                navigation.navigate('Orders');
                                alert(responseData.message);
                                fetchOrders();

                            } else {
                                alert(responseData.message);
                            }

                        } catch (error) {
                            console.error('Error canceling order:', error);
                            alert(responseData.message);
                        }
                    }
                }
            ]
        );
    };


    const date = new Date(order.createdAt);

    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const formattedIfdate = `${date.getHours()}:${date.getMinutes() + 1}:${date.getSeconds()}`;
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    const showConfirmButton = order.status === 'paidDelivering' || order.status === 'delivering';
    const showCancelButton = order.status === 'PaidCreateOrder' || order.status === 'createOrder';
    const showBuyAgainButton = order.status === 'configOrder';

    const navigation = useNavigation();
    const goToOrderDetail = (order) => {
        console.log("order detail: ", order);
        navigation.navigate('OrderDetail', { order });
        // try {
        //     navigation.navigate('OrderDetail', { order });
        // } catch (error) {
        //     console.error('Error navigating to OrderDetail:', error);
        // }
    };

    return (
        <View style={styles.itemContainer}>
            <FlatList
                data={products}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.productItem}>
                        {item.data.imageProduct && <Image source={{ uri: item.data.imageProduct }} style={{ width: 100, height: 100 }} />}
                        <View style={styles.infoContainer}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.data.name}</Text>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: "space-between",
                            }}>
                                <Text style={{ fontSize: 12 }}>Price: {formatVND(item.data.price - item.data.priceSale)}</Text>
                                <Text style={{ fontSize: 12 }}>X{item.quantity}</Text>
                            </View>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', alignSelf: 'flex-end' }}>Total: {formatVND(item.quantity * (item.data.price - item.data.priceSale))}</Text>
                        </View>
                    </View>
                )}
            />
            <View style={styles.bottomContainer}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', alignSelf: 'flex-end', marginTop: 10 }}>Sub total: {formatVND(order.total)}</Text>
                {/* <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Status: {order.status}</Text> */}

            </View>
            <TouchableOpacity onPress={() => goToOrderDetail(order)} style={[styles.button, { backgroundColor: 'white' }]}>
                <Text style={[styles.buttonText, { color: 'black' }]}>Detail</Text>
            </TouchableOpacity>
            <View style={styles.buttoncancleoder}>
                {showCancelButton && (
                    <TouchableOpacity onPress={() => handleCancelOrder(order.id)} style={[styles.button, { backgroundColor: 'white' }]}>
                        <Text style={[styles.buttonText, { color: 'red' }]}>Cancel Order</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.buttonConfigoder}>
                {showConfirmButton && (
                    <TouchableOpacity onPress={() => handleConfirmOrder(order.id)} style={styles.button}>
                        <Text style={styles.buttonText}>Confirm Order</Text>
                    </TouchableOpacity>
                )}
            </View>
            {/* <View style={styles.buttonConfigoder}>
                {showBuyAgainButton && (
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Repurchase Order</Text>
                    </TouchableOpacity>
                )}
            </View> */}
        </View>
    );
};

const OrdersList = ({ ordersData, fetchOrders }) => {

    if (ordersData.length === 0) {
        return <View style={styles.emptyList}>
            <Text>Empty List</Text>
        </View>
    }


    const sortedOrders = ordersData.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
    });

    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true); 

        await fetchOrders(); 

        setRefreshing(false); 
    };

    return (
        <FlatList
            data={sortedOrders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <OrdersItem order={item} fetchOrders={fetchOrders} />}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }
        />
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        margin: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    productItem: {
        marginTop: 10,
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 0.8,
        borderColor: '#ccc',
    },
    bottomContainer: {
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#FF9900',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 10,
        borderWidth: 0.8,
        borderRadius: 3,
        borderColor: '#ccc',
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        alignSelf: 'center',
        marginLeft: 10,
        flex: 1,
        paddingEnd: 10,
    },
});

export default OrdersList;
