import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { formatVND } from '../Functions/FormatVND';
import { API_URL } from '../Api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FAItem = ({ favourite }) => {

    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const productsData = [];
                for (let op of favourite.OrdersProducts) {
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
    }, [favourite]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }
    return (
        <View style={styles.itemContainer}>

            <FlatList
                data={products}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.productItem}>
                        {item.data.imageProduct && <Image source={{ uri: item.data.imageProduct }} style={{ width: 100, height: 100 }} />}

                        <View style={styles}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Name: {item.name}</Text>
                            <Text style={{ fontSize: 12 }}>Price: {formatVND(item.data.price - item.data.priceSale)}</Text>
                            <Text style={{ fontSize: 12 }}>Quantity: {item.quantity}</Text>
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Total: {formatVND(item.quantity * (item.data.price - item.data.priceSale))}</Text>
                        </View>

                    </View>
                )}
            />

        </View>
    );
};

const FAList = ({ favouriteData }) => {

    if (!favouriteData || !favouriteData.data) {
        return <Text>Đang tải dữ liệu</Text>;
    }

    return (
        <FlatList
            data={favouriteData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <Text>{item.data.name}</Text>}
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


export default FAList;