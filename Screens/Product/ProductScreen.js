import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, TextInput,Text } from 'react-native';
import ProductItem from './ProductItem'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import { SliderBox } from "react-native-image-slider-box";

const products = [
  { id: '1', name: 'Product 1', price: 19.99, img: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png' },
  { id: '2', name: 'Product 2', price: 29.99, img: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png' },
  { id: '3', name: 'Product 3', price: 39.99, img: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png' },
  { id: '4', name: 'Product 4', price: 49.99, img: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png' },
  { id: '5', name: 'Product 5', price: 59.99, img: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png' },
  { id: '5', name: 'Product 5', price: 59.99, img: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png' },
  { id: '5', name: 'Product 5', price: 59.99, img: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png' },
];

const img = [
  "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png",
  "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png",
  "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png",
  "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png",
  "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png",
  "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png",
]

const ProductScreen = ({ navigation }) => {
  const handleProductPress = (product) => {
    console.log("Product Press")
  };

  const screenWidth = Dimensions.get('window').width;
  const itemWidth = screenWidth / 2 

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={{margin : 10}}>
        <Text style={{marginTop : 40, fontSize: 30, fontWeight : 'bold'}}>Hello</Text>
        <Text style={{marginBottom : 20, fontSize: 20}}>lamnhph18826@fpt.edu.vn</Text>
      </View>

      <View style={{ flexDirection :'row' , marginHorizontal: 10}}>
        <TextInput placeholder='Search Sneaker' style={styles.searchView}></TextInput>
        <Icon name='search' size={20} style={{position :'absolute',start : 9, top : 20}}></Icon>
      </View>

      <Text style={{marginHorizontal: 9, fontSize : 20, fontWeight : 'bold'}}>Some best-selling products</Text>
    
      <SliderBox dotColor="tomato" autoPlay circleLoop autoplayInterval = {1000} images={img} resizeMethod={'resize'} resizeMode={'cover'}/>

      <Text style={{marginHorizontal : 9,marginTop : 50, fontSize : 20, fontWeight : 'bold'}}>Some outstanding products</Text>

      <View style={styles.row}>
        
        {products.map((product, index) => (
          <View key={product.id} style={[{ width: itemWidth }]}>
            
            <ProductItem product={product} onPress={() => handleProductPress(product)} />
          </View>
        ))}
        {products.length % 2 !== 0 && <View style={[styles, { width: itemWidth }]} />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  searchView: {
    width : '100%',
    height :60,
    borderRadius : 9,
    backgroundColor : '#ebecf0',
    paddingVertical : 9,
    paddingEnd : 9,
    paddingStart : 38,
    marginBottom : 20
  }
});

export default ProductScreen;
