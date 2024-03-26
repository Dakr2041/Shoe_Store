import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const iconFavourite = require('../Product/favourite_icon.png');
const addtocarticon = require('../Product/addtocart.png');

const ProductItem = ({ product, itemWidth }) => {
  const navigation = useNavigation();
  const navigateToProductDetail = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const formattedPrice = formatVND(product.price);
  const [isFavourite, setIsFavourite] = useState(false);

  const handleFavouritePress = () => {
    setIsFavourite(!isFavourite);
  };

  const handleAddToCart = async () => {
    if (!StoredToken) {
      console.log('No token available. User needs to log in.');
      alert("Failed to add item to cart");
      return;
    }

    await addToCart(product.id, StoredToken);
  };

  return (
    <TouchableOpacity style={[styles.container]} onPress={() => navigateToProductDetail(product)} >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.imageProduct }} style={styles.image} />
        {product.priceSale > 0 && (
          <View style={styles.priceSaleContainer}>
            <Text style={styles.priceSaleText}>-{product.priceSale}%</Text>
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
    fontSize: 18,
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
