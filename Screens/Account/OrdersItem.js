import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { formatVND } from '../Functions/FormatVND';
import { API_URL } from '../Api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const OrdersItem = ({ order }) => {

    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState('');

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
    const date = new Date(order.createdAt);
    // const formattedDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const formattedDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }
    return (
        <View style={styles.itemContainer}>
            <View style={styles.topContainer}>
                <Text style={{fontSize:14}}>Orderdate: {formattedDate}</Text>
            </View>
            <FlatList
                data={products}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.productItem}>
                        {item.data.imageProduct && <Image source={{ uri: item.data.imageProduct }} style={{ width: 100, height: 100 }} />}

                        <View style={styles}>
                            <Text style={{fontSize:14, fontWeight:'bold'}}>Name: {item.data.name}</Text>
                            <Text style={{fontSize:12}}>Price: {formatVND(item.data.price)}</Text>
                            <Text style={{fontSize:12}}>Qty: {item.quantity}</Text>
                            <Text style={{fontSize:14, fontWeight:'bold'}}>Total: {formatVND(item.quantity * item.data.price)}</Text>
                        </View>

                    </View>
                )}
            />
            <View style={styles.bottomContainer}>
                <Text style={{fontSize:14, fontWeight:'bold'}}>Sub total: {formatVND(order.total)}</Text>

                <TouchableOpacity style={{ alignSelf: 'center' }} >
                    {/* <MaterialCommunityIcons name="delete" size={25} color="#f00" /> */}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const OrdersList = ({ ordersData }) => {
    return (
        <FlatList
            data={ordersData.data}
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
});


export default OrdersList;