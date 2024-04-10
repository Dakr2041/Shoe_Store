import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { formatVND } from '../Functions/FormatVND';
import { API_URL } from '../Api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrdersItem = ({ order }) => {

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



    const handleConfirmOrder = async (orderId) => {
        try {
            console.log(orderId);
            console.log(token);
            const response = await fetch(`${API_URL}/order/configOrder/${orderId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const responseData = await response.json();
            console.log(responseData);
            alert(responseData.message);

        } catch (error) {
            console.error('Error confirming order:', error);
            alert(responseData.message);
        }
    };
    const handleCancelOrder = async (orderId) => {
        try {
            console.log(orderId);
            console.log(token);
            const response = await fetch(`${API_URL}/order/cancelOrder/${orderId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const responseData = await response.json();
            console.log(responseData);
            alert(responseData.message);

        } catch (error) {
            console.error('Error canceling order:', error);
            alert(responseData.message);
        }
    };


    const date = new Date(order.createdAt);

    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const formattedIfdate = `${date.getHours()}:${date.getMinutes() + 1}:${date.getSeconds()}`;
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    const showConfirmButton = order.status === 'paidDelivering' || order.status === 'delivering';
    const showCancelButton = order.status === 'PaidCreateOrder' || order.status === 'createOrder' || order.status === 'paidDelivering' || order.status === 'delivering';



    return (
        <View style={styles.itemContainer}>
            <View style={styles.topContainer}>
                <Text style={{ fontSize: 14 }}>Orderdate: {formattedDate}</Text>
                <Text style={{ fontSize: 12 }}>of: {formattedIfdate}</Text>
            </View>
            <FlatList
                data={products}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.productItem}>
                        {item.data.imageProduct && <Image source={{ uri: item.data.imageProduct }} style={{ width: 100, height: 100 }} />}
                        <View style={styles}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Name: {item.data.name}</Text>
                            <Text style={{ fontSize: 12 }}>Price: {formatVND(item.data.price - item.data.priceSale)}</Text>
                            <Text style={{ fontSize: 12 }}>Quantity: {item.quantity}</Text>
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Total: {formatVND(item.quantity * (item.data.price - item.data.priceSale))}</Text>
                        </View>
                    </View>
                )}
            />
            <View style={styles.bottomContainer}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Sub total: {formatVND(order.total)}</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Status: {order.status}</Text>

            </View>
            <View style={styles.buttoncancleoder}>
                {showCancelButton && (
                    <TouchableOpacity onPress={() => handleCancelOrder(order.id)} style={[styles.button, { backgroundColor: '#EEEEEE' }]}>
                        <Text style={[styles.buttonText, { color: 'red' }]}>Hủy đơn hàng</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.buttonConfigoder}>
                {showConfirmButton && (
                    <TouchableOpacity onPress={() => handleConfirmOrder(order.id)} style={styles.button}>
                        <Text style={styles.buttonText}>Xác nhận đơn hàng</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const OrdersList = ({ ordersData }) => {

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

    return (
        <FlatList
            data={sortedOrders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <OrdersItem order={item} />}
        />
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    productItem: {
        margin: 10,
        padding: 10,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default OrdersList;
