import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SearchProductItem = ({ product, itemWidth, onFavoriteChanged }) => {
  const navigation = useNavigation();
  const navigateToProductDetail = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => navigateToProductDetail(product)}>
      <Image source={{ uri: product.imageProduct }} style={{ width: 70, height: 70 }} />
      <Text style={{ marginStart: 20 }}>{product.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  
});

export default SearchProductItem;
