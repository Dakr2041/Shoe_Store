import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { formatVND } from '../Functions/FormatVND';
import { API_URL } from '../Api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const addtocarticon = require('../Product/addtocart.png');
const iconFavourite = require('../Product/favourite_icon.png');

const FAItem = ({ favourite }) => {
    const [isFavourite, setIsFavourite] = useState(false);
    const [favouriteItems, setFavouriteItems] = useState([]);
    const [token, setToken] = useState('');

    const navigation = useNavigation();
    const navigateToProductDetail = (product) => {
        navigation.navigate('ProductDetail', { product });
    };
    const fetchTOKEN = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('authToken');
            setToken(storedToken ? String(storedToken) : null);
        } catch (error) {
            console.error('Error fetching Token from storage:', error);

        }
    };
    useEffect(() => {
        fetchTOKEN();
        if (token) {
            fetchFavouriteItems();
            if (favouriteItems) {
                loadFavoriteStatus();
            }
        }

    }, [token, favouriteItems]);

    const fetchFavouriteItems = async () => {
        const response = await fetch(`${API_URL}/api/getFavorite`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            setFavouriteItems(data.data);
        } else {
            console.error('Error fetching orders');
        }
    };

    const loadFavoriteStatus = async () => {
        try {
            if (favouriteItems) {
                const favoriteIds = favouriteItems.map(item => item.id);
                // console.log("favoriteIds: ", favoriteIds);

                setIsFavourite(favoriteIds.includes(favourite.id));
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

            fetchFavouriteItems();
            // setIsFavourite(!isFavourite);
            // let favorites = favouriteItems ? JSON.parse(favouriteItems) : [];
            // if (!isFavourite) {

            //     favorites.push(product.id);
            // } else {

            //     favorites = favorites.filter(id => id !== product.id);
            // }

            // if (onFavoriteChanged) {
            //     onFavoriteChanged(product.id, !isFavourite);
            // }

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
        <TouchableOpacity style={styles.itemContainer} onPress={() => navigateToProductDetail(favourite)}>
            {favourite.imageProduct && <Image source={{ uri: favourite.imageProduct }} style={{ width: 100, height: 100 }} />}

            <View style={styles.textContainer}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Name: {favourite.name}</Text>
                <Text style={{ fontSize: 12 }}>Price: {formatVND(favourite.price - favourite.priceSale)}</Text>
            </View>

            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={handleFavouritePress} >
                    <Image source={isFavourite ? require('../Product/icon_favouritered.png') : iconFavourite} style={styles.iconfavourite} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddToCart}>
                    <Image source={addtocarticon} style={styles.iconaddtocart} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const FAList = ({ favouriteData }) => {
    if (!favouriteData || !favouriteData.data) {
        return <View style={{height:'100%'}}>
            <ActivityIndicator size="large" style={{ alignContent:'center' }} />
        </View>
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
        flex: 1,

    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    iconContainer: {
        alignItems: 'center',
        margin: 10
    },
    iconaddtocart: {
        width: 30,
        height: 30,
    },
    iconfavourite: {
        width: 30,
        height: 30,
        marginBottom: 10,
    },
});

export default FAList;
