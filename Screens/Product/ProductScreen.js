import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, ScrollView, TextInput, Image, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import ProductItem from './ProductItem';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SliderBox } from "react-native-image-slider-box";
// const logo = require('../Product/logo.png');
const logo = require('../../assets/logo_shoe_store.png');
import { API_URL } from '../Api';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductScreen = ({ navigation }) => {
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = Math.floor(screenWidth / 2);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  const [sliderProducts, setSliderProducts] = useState([]);


  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('@userId');
        setUserId(storedUserId ? Number(storedUserId) : null);
      } catch (error) {
        console.error('Error fetching user ID from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserId();

  }, [isFocused]);

  const [shouldRedirectToSetup, setShouldRedirectToSetup] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userId) {
        setIsLoading(true);
        try {
          const response = await fetch(`${API_URL}/api/getInfoUser/${userId}`);
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            if (data.status === 400) {
              setShouldRedirectToSetup(true);
            } else if (data.status === 200) {
              setShouldRedirectToSetup(false);
            }
          } else {
            console.error('Error fetching user info:', response.status);
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserInfo();
  }, [userId,isFocused]);


  useEffect(() => {
    console.log('shouldRedirectToSetup:', shouldRedirectToSetup);
    if (shouldRedirectToSetup) {
      navigation.navigate('Tabs', { screen: 'Account' }); // navigate to Account screen in Tabs
    }
  }, [shouldRedirectToSetup,isFocused]);


  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/getProductsUser`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.data);
          setSliderProducts(data.data.slice(0, 5));
        } else {
          console.error('Error fetching products:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isFocused) {
      fetchProducts();

    }
  }, [isFocused]);


  const navigateToProductDetail = (product) => {
    navigation.navigate('ProductDetail', { product });
    console.log(product);
  };

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
      return <View>
        <Text style={{ marginHorizontal: 9, fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 20 }}>Some best-selling products</Text>

        <View style={styles.slider}>
          <SliderBox
            images={sliderProducts.map(product => product.imageProduct)}
            autoplay
            circleLoop
            onCurrentImagePressed={index => navigateToProductDetail(sliderProducts[index])}
            style={styles.slider}
            sliderBoxHeight={350}
            parentWidth={350}
          />
        </View>

        <Text style={{ marginHorizontal: 9, marginTop: 20, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Some outstanding products</Text>

        {rows}

      </View>;
    }
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <LinearGradient style={{
        borderRadius: 15,
        elevation: 5, // Add shadow for Android
        shadowColor: '#000', // Add shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      }} colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>

        <View style={styles.headerItems}>

          <Image source={logo}
            style={{
              width: 100,
              height: 100,
              // alignSelf: 'center'
            }}></Image>

          <TouchableOpacity onPress={handleSearchPress}>
            <View style={styles.searchView}>
              <Icon name='search' size={20} ></Icon>
              <Text style={{ opacity: 0.5, marginStart: 15 }}>Search</Text>
            </View>
          </TouchableOpacity>

        </View>

      </LinearGradient>


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
  slider: {
    height: 300,
    width: '95%',
    marginBottom: 10,
    alignItems: 'center',
    borderRadius: 15,
    elevation: 5, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    backgroundColor: 'white',
    paddingVertical: 5,
    alignSelf: 'center',
  },

  headerItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 30,
    flex: 1,
  },

  searchView: {
    height: 50,
    width: 250,
    borderRadius: 22,
    backgroundColor: '#ebecf0',
    paddingVertical: 9,
    paddingEnd: 9,
    padding: 20,
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
    spaceBetween: 'center',
    elevation: 5, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});

export default ProductScreen;

