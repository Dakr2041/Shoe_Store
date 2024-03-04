import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProductDetailScreen = ({ route }) => {
//   const { productId } = route.params; 

  return (
    <View style={styles.container}>
      <Text>Product Detail Screen</Text>
      <Text>Product ID: {"productId"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductDetailScreen;
