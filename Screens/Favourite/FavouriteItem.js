import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { formatVND } from '../Functions/FormatVND';
import { API_URL } from '../Api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const addtocarticon = require('../Product/addtocart.png');

const FAItem = ({ favourite }) => {

    const handleAddToCart = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('authToken');
            if (!storedToken) {
                console.log('No token available. User needs to log in.');
                alert("Failed to add item to cart");
                return;
            }
            const response = await fetch(`${API_URL}/cart/addCart/${favourite.id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: favourite.id }),
            });

            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Item added to cart:', data);
            alert(data.message);
        } catch (error) {
            console.error('Error adding item to cart:', error);
            alert(error);
        }
    };

    return (
        <View style={styles.itemContainer}>
            {favourite.imageProduct && <Image source={{ uri: favourite.imageProduct }} style={{ width: 100, height: 100 }} />}

            <View style={styles.textContainer}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Name: {favourite.name}</Text>
                <Text style={{ fontSize: 12 }}>Price: {formatVND(favourite.price - favourite.priceSale)}</Text>
            </View>

            <TouchableOpacity onPress={handleAddToCart} style={styles.iconaddContainer}>
                <Image source={addtocarticon} style={styles.iconaddtocart} />
            </TouchableOpacity>
        </View>
    );
};

const FAList = ({ favouriteData }) => {
    if (!favouriteData || !favouriteData.data) {
        return <Text>Đang tải dữ liệu</Text>;
    }

    return (
        <FlatList
            data={favouriteData.data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <FAItem favourite={item} />}
        />
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    textContainer: {
        flex: 1,
    },
    iconaddContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconaddtocart: {
        width: 30,
        height: 30,
    }
});

export default FAList;
