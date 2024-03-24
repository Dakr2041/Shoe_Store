import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { API_URL } from '../Api';
import { formatVND } from '../Functions/FormatVND';
import { ActivityIndicator } from 'react-native-paper';

const CheckoutItem = ({ item }) => {
  const defaultImage = 'https://via.placeholder.com/250'; // Placeholder image URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/api/getProduct/${item.id}`);
        const productData = await response.json();
        setProduct(productData.data);
        console.log(product);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [item]);

  const getImageSource = () => {
    if (product && product.imageProduct && product.imageProduct.length > 0) {
      return { uri: product.imageProduct };
    } else {
      return { uri: defaultImage };
    }
  };

  if (!product) {
    return  <ActivityIndicator size="small" style={{ marginTop: 80 }} />
  }

  return (
    <View style={styles.cartItem}>
      <Image
        source={getImageSource()}
        style={styles.cartImage}
        onError={(error) => console.warn('Error loading image:', error)}
      />
      <View style={styles.cartDetails}>
        <Text style={styles.cartTitle}>{product.name}</Text>
        <Text style={styles.cartPrice}>{formatVND(product.price)}</Text>
        <Text >Qty: {item.quantity}</Text>
        <Text >Total: {formatVND(product.price * item.quantity)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cartImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginLeft: 10,
  },
  cartDetails: {
    flex: 1,
  },
  cartTitle: {
    fontSize: 16,
  },
  cartPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CheckoutItem;