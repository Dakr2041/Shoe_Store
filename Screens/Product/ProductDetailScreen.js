import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-paper';
// import QuantityPicker from '../Cart/QuantityPicker';
import { API_URL } from '../Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatVND } from '../Functions/FormatVND';

const ProductDetailScreen = ({ route }) => {
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const [StoredToken, setStoredToken] = useState(null);

  useEffect(() => {
    const { product } = route.params; // Get product data from navigation params
    setProduct(product);
    setIsLoading(false);
  }, [route.params]);

  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const handleQuantityChange = (newQuantity) => {
    setSelectedQuantity(newQuantity);
  };

  useEffect(() => {
    const fetchTOKEN = async () => {
      setIsLoading(true);
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        setStoredToken(storedToken ? String(storedToken) : null);
      } catch (error) {
        console.error('Error fetching Token from storage:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTOKEN();
  }, []);

  async function addToCart(productId, token) {
    console.log(StoredToken);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/cart/addCart/${productId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Item added to cart:', data);
      alert(data.message);
      setIsLoading(false);

    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert(error);
      setIsLoading(false);

    }
  }

  const handleAddToCart = async () => {
    if (!StoredToken) {
      console.log('No token available. User needs to log in.');
      alert("Failed to add item to cart");
      return;
    }

    await addToCart(product.id, StoredToken);
  };


  const renderContent = () => {
    if (!product.id) {
      return <Text>Product details not found.</Text>;
    } else {
      return (
        <View style={styles.container}>
          <Modal visible={isLoading} animationType="none" transparent={true}>
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" style={styles.loadingIndicator} />
            </View>
          </Modal>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={40} color="#333" />
            </TouchableOpacity>
          </View>
          <Image source={{ uri: product.imageProduct }} style={styles.productImage} />
          <ScrollView style={{ backgroundColor: '#fff' }}>
            <View style={styles.infoContainer}>

              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>{formatVND(product.price)}</Text>
                <Text >Qty: {product.quantity} </Text>

                {/* <TouchableOpacity style={styles.buttonGR}>
                  <Button style={styles.button}>
                    <Text style={styles.buttonText}>Add to cart</Text>
                  </Button>
                </TouchableOpacity> */}
                <Text >Description:</Text>
                <Text >{product.description}</Text>
                {/* <Text >Comments:</Text> */}
              </View>
            </View>


          </ScrollView>

          {/* //////////////////////////////////////////////////// */}
          {/* <QuantityPicker
            initialQuantity={selectedQuantity}
            onQuantityChange={handleQuantityChange}
            minValue={1}
            maxValue={product.quantity}
          /> */}
          {/* //////////////////////////////////////////////////// */}

          <TouchableOpacity
            onPress={handleAddToCart}
          >
            <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add to cart</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 10,
  },

  loadingIndicator: {
    // Optional styles for the ActivityIndicator itself
  },
  infoContainer: {
    padding: 20,

  },
  productImage: {
    width: '100%',
    maxHeight: 300,
    overflow: 'hidden',
    marginBottom: 10,
    aspectRatio: 1,
    alignSelf: 'center',
  },
  productInfo: {
    margin: 10,

  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    marginBottom: 20,
    alignSelf: 'flex-end',
    color: 'green',

  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 15,
    // backgroundColor: '#fff'
  },
  backButton: {
    padding: 5,

  },
  title: {
    color: '#fff',
    fontSize: 18,
  },
  iconButton: {
    padding: 5,
  },
  buttonGR: {
    margin: 20,
    borderWidth: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ddd',

  },
  button: {
    borderRadius: 22,
    alignItems: 'center',
    // backgroundColor: ['#f7c458', '#fea239'],
    padding: 10,
    borderWidth: 1
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: 'center',
    color: 'black',
  },
  addButton: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',

  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;
