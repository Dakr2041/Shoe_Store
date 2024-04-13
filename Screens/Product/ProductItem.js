import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../Api';
import Alertcustom from '../Alert/Alertcustom'

const iconFavourite = require('../Product/favourite_icon.png');
const addtocarticon = require('../Product/addtocart.png');
const windowWidth = Dimensions.get('window').width;

const ProductItem = ({ product, onFavoriteChanged }) => {
  const navigation = useNavigation();
  const navigateToProductDetail = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const formattedPrice = formatVND(product.price);
  const [isFavourite, setIsFavourite] = useState(false);
  const [favouriteItems, setFavouriteItems] = useState([]);
  const [token, setToken] = useState('');

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

  }, [token,favouriteItems]);

  const fetchFavouriteItems = async () => {
    const response = await fetch(`${API_URL}/api/getFavorite`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
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

        setIsFavourite(favoriteIds.includes(product.id));
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
      const response = await fetch(`${API_URL}/api/favorite/${product.id}`, {
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

      let favorites = favouriteItems ? JSON.parse(favouriteItems) : [];
      if (!isFavourite) {

        favorites.push(product.id);
      } else {

        favorites = favorites.filter(id => id !== product.id);
      }

      if (onFavoriteChanged) {
        onFavoriteChanged(product.id, !isFavourite);
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
      const response = await fetch(`${API_URL}/cart/addCart/${product.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product.id }),
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
    <TouchableOpacity style={[styles.container, { width: windowWidth / 2 - 15 }]} onPress={() => navigateToProductDetail(product)}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.imageProduct }} style={styles.image} />
        {product.priceSale > 0 && (
          <View style={styles.priceSaleContainer}>
            <Text style={styles.priceSaleText}>-{product.priceSale}đ</Text>
          </View>
        )}
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.rowicon}>
          <View style={styles.contentContainer}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.productName}>{product.name}</Text>
          </View>
          <TouchableOpacity onPress={handleFavouritePress} style={styles.iconContainer}>
            <Image source={isFavourite ? require('../Product/icon_favouritered.png') : iconFavourite} style={styles.iconfavourite} />
          </TouchableOpacity>
        </View>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.introduce}>{product.introduce}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.price}>{formattedPrice}</Text>
      </View>
      <TouchableOpacity onPress={handleAddToCart} style={styles.iconaddContainer}>
        <Image source={addtocarticon} style={styles.iconaddtocart} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

function formatVND(number) {
  if (isNaN(number)) {
    throw new Error('Invalid input: Please provide a valid number.');
  }
  const numberAsFloat = parseFloat(number);

  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  });

  return formatter.format(numberAsFloat);
}

const styles = StyleSheet.create({
  container: {
    width: 178,
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 5,
    overflow: 'hidden',
    flexDirection: 'column',
    marginRight: 10,
    padding: 10,
    //
    elevation: 5, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'space-between',
    padding: 10,
  },
  rowicon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  contentContainer: {
    flex: 1,
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
  productName: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  priceSaleContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  introduce: {
    fontSize: 12,
    fontStyle: 'italic'
  },
  priceSaleText: {
    color: 'white',
    fontSize: 12,
  },
  iconaddContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

export default ProductItem;
