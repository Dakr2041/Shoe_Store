import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { formatVND } from '../Functions/FormatVND';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../Api';

const iconFavourite = require('../Product/favourite_icon.png');
const addtocarticon = require('../Product/addtocart.png');

const FAItem = ({ favourite, onFavoriteChanged }) => {
    const [isFavourite, setIsFavourite] = useState(false);

    useEffect(() => {
        loadFavoriteStatus();
    }, []);
    const loadFavoriteStatus = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            if (storedFavorites) {
                const favorites = JSON.parse(storedFavorites);
                setIsFavourite(favorites.includes(favourite.id));
            }
        } catch (error) {
            console.error('Error loading favorite status:', error);
        }
    };
    const handleFavouritePress = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('authToken');
            if (!storedToken) {
                console.log('No token available. User needs to log in.');
                alert("Failed to add item to favorites");
                return;
            }
            const response = await fetch(`${API_URL}/api/favorite/${favourite.id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Item added to favorites:', data);

            setIsFavourite(!isFavourite);
            const newFavoriteStatus = !isFavourite;

            if (onFavoriteChanged) {
                onFavoriteChanged(favourite.id, newFavoriteStatus);
            }

            alert(data.message);
        } catch (error) {
            console.error('Error adding item to favorites:', error);
            alert(error);
        }
    };

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

            <View style={styles}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Name: {favourite.name}</Text>
                <Text style={{ fontSize: 12 }}>Price: {formatVND(favourite.price - favourite.priceSale)}</Text>

            </View>
            <TouchableOpacity onPress={handleFavouritePress} style={styles.iconContainer}>
                <Image source={isFavourite ? require('../Product/icon_favouritered.png') : iconFavourite} style={styles.iconfavourite} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAddToCart} style={styles.iconaddContainer}>
                <Image source={addtocarticon} style={styles.iconaddtocart} />
            </TouchableOpacity>

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
    iconContainer: {
        marginLeft: 10,
    },
    iconfavourite: {
        width: 22,
        height: 22,
    },
    iconaddtocart: {
        width: 30,
        height: 30,
    },
});

export default FAList;
