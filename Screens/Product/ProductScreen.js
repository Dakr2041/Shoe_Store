import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, ScrollView, TextInput, Image, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import ProductItem from './ProductItem';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SliderBox } from "react-native-image-slider-box";
const logo = require('../Product/logo.png');
import { API_URL } from '../Api';
import { LinearGradient } from 'expo-linear-gradient';


const img = [
  "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png",
  "https://contents.mediadecathlon.com/p2606919/k$a531927e5c71c12f4d3edac227199f78/jogflow-5001-men-s-running-shoes-white-blue-red.jpg?format=auto&quality=40&f=452x452",
  "https://contents.mediadecathlon.com/p2153179/e958b22d2eccd9c7db0fea1da358fd8f/p2153179.jpg?format=auto&quality=70&f=650x0",
  "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png",
  "https://kizik.com/cdn/shop/files/kizik-social-image.png?v=1693341281",
  "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png",
]

const ProductScreen = ({ navigation }) => {
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = Math.floor(screenWidth / 2);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/getProductsUser`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.data);
        } else {
          console.error('Error fetching products:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);


  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    } else if (!products.length) {
      return <Text>No products found.</Text>;
    } else {
      const rows = [];
      for (let i = 0; i < products.length; i += 2) {
        const rowProducts = [];
        for (let j = i; j < i + 2 && j < products.length; j++) {
          rowProducts.push(
            <View key={products[j].id} >
              <ProductItem product={products[j]} onPress={() => handleProductPress(products[j])} />
            </View>
          );
        }
        rows.push(
          <View key={i} style={styles.row}>
            {rowProducts}
          </View>
        );
      }
      return <View>{rows}</View>;
    }
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <LinearGradient style={{ borderRadius: 15 }} colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <View style={{ marginTop: 20 }}>
          <Image source={logo} style={{ width: 120, height: 120, alignSelf: 'center' }}></Image>
        </View>

        <TouchableOpacity onPress={handleSearchPress}>
          <View style={styles.searchView}>
            <Icon name='search' size={20} ></Icon>
            <Text style={{ opacity: 0.5, marginStart:15 }}>Search</Text>
          </View>
        </TouchableOpacity>

      </LinearGradient>



      <Text style={{ marginHorizontal: 9, fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 50 }}>Some best-selling products</Text>

      <SliderBox dotColor="tomato" autoPlay circleLoop autoplayInterval={1000} images={img} resizeMethod={'resize'} resizeMode={'cover'} />

      <Text style={{ marginHorizontal: 9, marginTop: 20, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Some outstanding products</Text>

      <View style={styles.container}>
        {renderContent()}
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',

  },
  row: {
    flexDirection: 'row',

    padding: 10,

  },
  searchView: {
    height: 50,
    borderRadius: 22,
    backgroundColor: '#ebecf0',
    paddingVertical: 9,
    paddingEnd: 9,
    padding: 20,
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
    spaceBetween: 'center',
  },
});

export default ProductScreen;

