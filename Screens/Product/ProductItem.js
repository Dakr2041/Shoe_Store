import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProductItem = ({ product, itemWidth }) => {
  const navigation = useNavigation();
  const navigateToProductDetail = (product) => {
    navigation.navigate('ProductDetail', { product }); // Specify stack name and pass data
  };
  return (
    <TouchableOpacity style={[styles.container, { width: itemWidth }]} onPress={() => navigateToProductDetail(product)} >
      <Image source={{ uri: product.imageProduct }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    margin : 4.5,
    overflow: 'hidden', // Ensure image does not overflow container
  },
  image: {
    width: '100%',
    aspectRatio: 1, // Maintain aspect ratio
  },
  detailsContainer: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  price: {
    fontSize: 14,
    color: 'green',
    marginTop: 5,
  },
});

export default ProductItem;
