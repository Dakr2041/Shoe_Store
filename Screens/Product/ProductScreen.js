import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, ScrollView, TextInput, Image, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import ProductItem from './ProductItem';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SliderBox } from "react-native-image-slider-box";
const logo = require('../Product/logo.png');
import { API_URL } from '../Api';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal } from 'react-native-paper';


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
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  const searchProducts = async (text) => {
    setIsSearchLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: text }),
      });
      if (response.status === 200) {
        const data = await response.json();
        setSearchResults(data.data);
        console.log(searchResults);
      } else {
        console.error('Error searching products:', response.statusText);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    searchProducts(text);
    setIsSearchModalVisible(true);
  };

  const handleSearchIconPress = () => {
    // navigation.navigate('SearchScreen', { searchResults });
  };

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
      return (
        <View style={styles.row}>
          {products.map((product, index) => (
            // <View key={product.id} style={[{ width: itemWidth }]}>
            <View key={product.id}>
              {console.log(product)}
              <ProductItem product={product} onPress={() => handleProductPress(product)} />
            </View>
          ))}
          {products.length % 2 !== 0 && <View style={[styles, { width: itemWidth }]} />}
        </View>
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <LinearGradient style={{ borderRadius: 22 }} colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <View style={{ marginTop: 20 }}>
          <Image source={logo} style={{ width: 120, height: 120, alignSelf: 'center' }}></Image>
        </View>

        <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
          <TextInput
            placeholder='Search'
            style={styles.searchView}
            onChangeText={handleSearchTextChange}
            value={searchText}
          ></TextInput>
          <Icon name='search' size={20} style={{ position: 'absolute', start: 9, top: 20 }}></Icon>
        </View>
      </LinearGradient>

      <Modal visible={isSearchModalVisible} onRequestClose={() => setIsSearchModalVisible(false)}>
        {isSearchLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            // renderItem={({ item }) => 
            // <ProductItem product={item} onPress={() => handleProductPress(item)} 
            // <Text>{item.name}</Text>
            // }
          />
        )}
      </Modal>

      <Text style={{ marginHorizontal: 9, fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 50 }}>Some best-selling products</Text>

      <SliderBox dotColor="tomato" autoPlay circleLoop autoplayInterval={1000} images={img} resizeMethod={'resize'} resizeMode={'cover'} />

      <Text style={{ marginHorizontal: 9, marginTop: 20, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Some outstanding products</Text>

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
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 9
  },
  searchView: {
    width: '100%',
    height: 60,
    borderRadius: 22,
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
    margin: 2.5,
    maxWidth: '48.5%'
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
