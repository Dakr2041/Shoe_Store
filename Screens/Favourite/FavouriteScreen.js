import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../Api';
import { GestureHandlerRootView, Swipeable, TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import FavoritesList from './FavouriteItem';

const FavouriteScreen = () => {
    const [favourites, setFavourites] = useState([]);
    const navigation = useNavigation();
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const fetchTOKEN = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('authToken');
                setToken(storedToken ? String(storedToken) : null);

            } catch (error) {
                console.error('Error fetching Token from storage:', error);

            }
        };

        fetchTOKEN();
    }, []);

    const fetchOrders = async () => {
        const response = await fetch(`${API_URL}/api/getFavorite`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();

            setFavourites(data);
            console.log("fav:",data);
            setIsLoading(false);
        } else {
            console.error('Error fetching orders');
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);



    const handleRefresh = async () => {
        setIsLoading(true);
        setFavourites([]);
        await fetchOrders();
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack}>
                    <MaterialCommunityIcons name="arrow-left" size={40} color="#333" />
                </TouchableOpacity>
                <View></View>
                <View></View>
                <Text style={styles.headerText}>Yêu thích</Text>
                <View></View>
                <View></View>
                <View></View>
                <View></View>
            </View>

            <Swipeable onSwipeableOpenStartDrag={handleRefresh} style={{ height: '100%' }}>
                {isLoading ? (
                    <ActivityIndicator size="large" style={{ alignContent: 'center' }} />
                ) : favourites.status === 400 ? (
                    <Text style={{
                        textAlign: 'center',
                        padding: 50,
                        fontSize: 18,
                        opacity: 0.25,
                        fontWeight: 'bold'
                    }}>Bạn chưa có sản phẩm yêu thích !!!</Text>
                ) : (
                    <FavoritesList
                        style={{ height: '88%' }}
                        favouriteData={favourites}
                    />

                )}

            </Swipeable>

        </GestureHandlerRootView>
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
    },
});

export default FavouriteScreen;