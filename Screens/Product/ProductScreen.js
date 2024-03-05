import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import ProductItem from './ProductItem'; 

const products = [
  { id: '1', name: 'Product 1', price: 19.99, img: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png' },
  { id: '2', name: 'Product 2', price: 29.99, img: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png' },
  { id: '3', name: 'Product 3', price: 39.99, img: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png' },
  { id: '4', name: 'Product 4', price: 49.99, img: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png' },
  { id: '5', name: 'Product 5', price: 59.99, img: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png' },
  { id: '5', name: 'Product 5', price: 59.99, img: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png' },
  { id: '5', name: 'Product 5', price: 59.99, img: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png' },
  { id: '5', name: 'Product 5', price: 59.99, img: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png' },
];

const ProductScreen = ({ navigation }) => {
  const handleProductPress = (product) => {
    console.log("Product Press")
  };

  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 20) / 2 - 10; 

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        {products.map((product, index) => (
          <View key={product.id} style={[styles.itemContainer, { width: itemWidth }]}>
            <ProductItem product={product} onPress={() => handleProductPress(product)} />
          </View>
        ))}
        {products.length % 2 !== 0 && <View style={[styles.itemContainer, { width: itemWidth }]} />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemContainer: {
    marginBottom: 10,
  },
});

export default ProductScreen;
