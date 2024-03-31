import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { formatVND } from '../Functions/FormatVND';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../Api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FAItem = ({ favourite }) => {

    return (
        <View style={styles.itemContainer}>
            {favourite.imageProduct && <Image source={{ uri: favourite.imageProduct }} style={{ width: 100, height: 100 }} />}

            <View style={styles.textContainer}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Name: {favourite.name}</Text>
                <Text style={{ fontSize: 12 }}>Price: {formatVND(favourite.price - favourite.priceSale)}</Text>
                <Text style={{ fontSize: 12 }}>Quantity: {favourite.quantity}</Text>
            </View>
        </View>
    );
};

const FAList = ({ favouriteData }) => {
    const handleFavoriteChanged = (productId, newStatus) => {
        const updatedData = favouriteData.data.map(item => {
            if (item.id === productId) {
                return { ...item, isFavourite: newStatus };
            }
            return item;
        });
        // Update the favoriteData state with the new data
        // Assuming favouriteData is a state managed elsewhere
        setFavouriteData(updatedData);
    };

    if (!favouriteData || !favouriteData.data) {
        return <Text>Đang tải dữ liệu</Text>;
    }

    return (
        <FlatList
            data={favouriteData.data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <FAItem favourite={item} onFavoriteChanged={handleFavoriteChanged} />}
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
