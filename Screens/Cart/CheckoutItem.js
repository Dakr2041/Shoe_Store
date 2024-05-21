import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { API_URL } from '../Api';
import { formatVND } from '../Functions/FormatVND';
import { ActivityIndicator } from 'react-native-paper';
import ProductItem from '../Product/ProductItem';
import moment from 'moment';
import 'moment/locale/vi';

const CheckoutItem = ({ item }) => {
  const defaultImage = 'https://via.placeholder.com/250';
  const [product, setProduct] = useState(null);
  const [productPrice, setProductPrice] = useState(0)
  useEffect(() => {
    const fetchProduct = async () => {
      console.log('sp----------0-',item);
      try {
        const response = await fetch(`${API_URL}/api/getProduct/${item.id}`);
        const productData = await response.json();

        console.log('sp----------1-', productData.data);
        if (productData.status === 200) {
          setProduct(productData.data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [item]);

  useEffect(() => {
    const isSaleActive = () => {
      if (product) {
        const saleStartDate = moment(product.timeSaleStart);
        const saleEndDate = moment(product.timeSaleEnd);
        const today = moment();
        return saleStartDate.isSameOrBefore(today) && saleEndDate.isSameOrAfter(today);
      }
    };

    if (isSaleActive() && product) {
      const newPrice = product.price - product.priceSale;
      setProductPrice(newPrice);
    } else if (product) {
      setProductPrice(product.price);
    }
  }, [product]);

  const getImageSource = () => {
    if (product && product.imageProduct && product.imageProduct.length > 0) {
      return { uri: product.imageProduct };
    } else {
      return { uri: defaultImage };
    }
  };

  if (!product) {
    return <ActivityIndicator size="small" style={{ marginTop: 80 }} />
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
        <Text>Kích cỡ: {item.size}</Text>
        <Text >Số lượng: {item.quantity}</Text>
        <Text >Giá: {formatVND(item.itemPrice * item.quantity)}</Text>

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
    fontSize: 18,
    fontWeight:'bold'
  },
  cartPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CheckoutItem;
