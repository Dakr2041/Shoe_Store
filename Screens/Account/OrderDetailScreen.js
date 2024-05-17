import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { API_URL } from '../Api';
import { formatVND } from '../Functions/FormatVND';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

const OrderDetailScreen = ({ route, navigation }) => {
    const { order } = route.params; // get the order id from the navigation parameters
    const [orderDetails, setOrderDetails] = useState(null);
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);


    const handleBuyAgain = async (pro) => {

    }

    const handleConfirmOrder = async (orderId) => {
        Alert.alert(
            "Xác nhận đơn hàng",
            "Bạn chắc chắn đã nhận được hàng?",
            [
                {
                    text: "Hủy",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Đã nhận được hàng",
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
            "Xác nhận hủy đơn hàng",
            "Bạn có chắc chắn muốn hủy đơn hàng?",
            [
                {
                    text: "Hủy",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Có",
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

    const formatStatus = (status) => {
        switch (status) {
            case 'paidDelivering':
                return 'Đang giao hàng';
            case 'delivering':
                return 'Đang giao hàng';
            case 'PaidCreateOrder':
                return 'Đang giao hàng';
            case 'createOrder':
                return 'Đợi xác nhận';
            case 'configOrder':
                return 'Hoàn thành';
            case 'PaidCancelOrder':
                return 'Đơn hàng đã được hủy';
            case 'cancelOrder':
                return 'Đơn hàng đã được hủy';
            case 'payment':
                return 'Đơn hàng đã được hủy';
            case 'PaymentAndCancel':
                return 'Đơn hàng đã được hủy';
            default:
                return 'Lỗi';
        }
    };

    const showConfirmButton = order.status === 'paidDelivering' || order.status === 'delivering';
    const showCancelButton = order.status === 'PaidCreateOrder' || order.status === 'createOrder';
    const showBuyAgainButton = order.status === 'configOrder';

    const date = new Date(order.createdAt);

    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const formattedIfdate = `${date.getHours()}:${date.getMinutes() + 1}:${date.getSeconds()}`;

    useEffect(() => {
        setOrderDetails(order);

        const fetchTOKEN = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('authToken');
                setToken(storedToken ? String(storedToken) : null);
                // console.log(storedToken);
            } catch (error) {
                console.error('Error fetching Token from storage:', error);

            }
        };

        const fetchProduct = async () => {
            try {
                setLoading(true);
                // const productsData = [];
                // for (let op of order.OrdersProducts) {
                //     const response = await fetch(`${API_URL}/api/getProduct/${op.productId}`);
                //     const productData = await response.json();
                //     productsData.push({ data: productData.data, quantity: op.quantity });
                // }
                // console.log(123123123,order.OrdersProducts);
                setProducts(order.OrdersProducts);

                setLoading(false);

            } catch (error) {
                console.error('Error fetching product:', error);
                // setLoading(false);
            }
        };
        const fetchData = async () => {
            console.log('Order detail screen: ', order);

            await fetchTOKEN();
            await fetchProduct();
        };

        fetchData();
    }, [order]);

    if (loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }
    return (
        <View style={styles.container}>

            <LinearGradient
                colors={['#f7c458', '#fea239']}
                style={styles.menuItemGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View style={styles.header}>

                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <MaterialCommunityIcons name="arrow-left" size={40} color="#333" />
                    </TouchableOpacity>
                    <View></View>
                    <View></View>
                    <Text style={styles.headerText}>Chi tiết đơn hàng</Text>
                    <View></View>
                    <View></View>
                    <View></View>
                    <View></View>

                </View>
            </LinearGradient>

            <View style={{ flex: 1 }}>

                <ScrollView>
                    <View style={styles.orderDetails}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Thông tin giao hàng</Text>
                        <View style={{ paddingStart: 20 }}>
                            <Text>- {order.phone}</Text>

                            <Text>- {order.address}</Text>
                        </View>
                    </View>




                    <View style={styles.orderItems}>
                        <FlatList
                            data={products}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.productItem}>
                                    {item.image && <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />}
                                    <View style={styles.infoContainer}>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.nameProduct}</Text>
                                        <Text style={{ fontSize: 12 }}>Kích cỡ: {item.size}</Text>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: "space-between",
                                        }}>
                                            <Text style={{ fontSize: 12 }}>Giá: {formatVND(item.price)}</Text>
                                            <Text style={{ fontSize: 12 }}>x {item.quantity}</Text>
                                        </View>

                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: 'bold',
                                            alignSelf: 'flex-end'
                                        }}>Thành tiền: {formatVND(item.quantity * item.price )}</Text>
                                    </View>
                                </View>
                            )}
                        />
                        <Text style={{ fontSize: 16, fontWeight: 'bold', alignSelf: 'flex-end' }}>Tổng tiền: {formatVND(order.total)}</Text>
                    </View>

                    <View style={{
                        backgroundColor: '#fff',
                        paddingBottom: 20,
                        marginTop: 10,
                        marginHorizontal: 10,
                        borderRadius: 5,
                    }}>
                        <View style={styles.textRow}>
                            <Text >Thời gian đặt hàng: </Text>
                            <Text >{formattedIfdate} - {formattedDate}</Text>
                        </View>
                        <View style={styles.textRow}>
                            <Text>Trạng thái đơn hàng:</Text>
                            <Text>{formatStatus(order.status)}</Text>
                        </View>
                    </View>
                </ScrollView>

                {showCancelButton && (
                    <View style={styles.buttonConfigoder}>
                        <TouchableOpacity onPress={() => handleCancelOrder(order.id)} style={[styles.button, { backgroundColor: 'white' }]}>
                            <Text style={[styles.buttonText, { color: 'red' }]}>Hủy đơn hàng</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {showConfirmButton && (
                    <View style={styles.buttonConfigoder}>
                        <TouchableOpacity onPress={() => handleConfirmOrder(order.id)} style={[styles.button, { backgroundColor: 'white' }]}>
                            <Text style={styles.buttonText}>Xác nhận đơn hàng</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {/* {showBuyAgainButton && (
                    <View style={styles.buttonConfigoder}>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Repurchase Order</Text>
                        </TouchableOpacity>
                    </View>
                )} */}


            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
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
    productItem: {
        marginBottom: 10,
        flexDirection: 'row',
        paddingEnd: 10,
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
    },
    buttonConfigoder: {
        margin: 10,
        // position: 'absolute',
        // bottom: 0,
    },
    orderDetails: {
        padding: 20,
        backgroundColor: '#fff',
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 5,
    },
    orderItems: {
        // borderWidth: 1,
        // borderColor: '#ccc',
        padding: 10,
        backgroundColor: '#fff',
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 5,

    },
    textRow: {
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 10,
        marginHorizontal: 10,

    }
});

export default OrderDetailScreen;