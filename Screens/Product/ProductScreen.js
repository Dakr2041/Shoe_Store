import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, ScrollView, TextInput, Image, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import ProductItem from './ProductItem';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SliderBox } from "react-native-image-slider-box";
const logo = require('../Product/logo.png');
import { API_URL } from '../Api';


const img = [
  "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png",
  "https://contents.mediadecathlon.com/p2606919/k$a531927e5c71c12f4d3edac227199f78/jogflow-5001-men-s-running-shoes-white-blue-red.jpg?format=auto&quality=40&f=452x452",
  "https://contents.mediadecathlon.com/p2153179/e958b22d2eccd9c7db0fea1da358fd8f/p2153179.jpg?format=auto&quality=70&f=650x0",
  "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png",
  "https://kizik.com/cdn/shop/files/kizik-social-image.png?v=1693341281",
  "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png",
]

const ProductScreen = ({ navigation }) => {
  // const handleProductPress = (product) => {
  //   console.log("Product Press")
  // };

  const screenWidth = Dimensions.get('window').width;
  const itemWidth = screenWidth / 2 

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigateToProductDetail = (product) => {
    navigation.navigate('ProductDetail', { product }); // Specify stack name and pass data
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/getProductsUser`);
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



  const renderItem = ({ item }) => {
    const formattedPrice = formatVND(item.price);
    return (
      <TouchableOpacity style={[styles.itemContainer, { width: itemWidth }]} onPress={() => navigateToProductDetail(item)} >
        <Image source={{ uri: item.imageProduct }} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
          <Text style={styles.price} numberOfLines={1} ellipsizeMode="tail">{formattedPrice}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    } else if (!products.length) {
      return <Text>No products found.</Text>;
    } else {
      return (
        <View style={styles.container}>
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={item => item.id} // Replace with unique identifier for each product
            numColumns={2}
          />
        </View>
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={{ marginTop: 20}}>
        {/* <Text style={{ marginTop: 40, fontSize: 30, fontWeight: 'bold' }}>Hello</Text> */}
        {/* <Text style={{marginBottom : 20, fontSize: 20}}>lamnhph18826@fpt.edu.vn</Text> */}

        <Image source={logo} style={{width:120,height:120,alignSelf :'center'}}></Image>
      </View>

      <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
        <TextInput placeholder='Search Sneaker' style={styles.searchView}></TextInput>
        <Icon name='search' size={20} style={{ position: 'absolute', start: 9, top: 20 }}></Icon>
      </View>

      <Text style={{ marginHorizontal: 9, fontSize: 18, fontWeight: 'bold', marginBottom:10 }}>Some best-selling products</Text>

      <SliderBox dotColor="tomato" autoPlay circleLoop autoplayInterval={1000} images={img} resizeMethod={'resize'} resizeMode={'cover'} />

      <Text style={{ marginHorizontal: 9, marginTop: 50, fontSize: 18, fontWeight: 'bold', marginBottom:10}}>Some outstanding products</Text>

      <View style={styles.container}>
        {renderContent()}
      </View>

    </ScrollView>
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
    backgroundColor: '#f5f5f5',
    padding: 3
  },
  searchView: {
    width: '100%',
    height: 60,
    borderRadius: 9,
    backgroundColor: '#ebecf0',
    paddingVertical: 9,
    paddingEnd: 9,
    paddingStart: 38,
    marginBottom: 20
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    margin : 2.5,
    maxWidth:'48.5%'
  },
  image: {
    width: '100%',
    aspectRatio: 1, 
    borderRadius: 10,
  },
  detailsContainer: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    overflow: 'hidden',
  },
  price: {
    fontSize: 14,
    color: 'green',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
});

export default ProductScreen;
