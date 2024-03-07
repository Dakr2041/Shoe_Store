import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const ProductScreen = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigateToProductDetail = (product) => {
    navigation.navigate('ProductDetail', { product }); // Specify stack name and pass data
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://192.168.1.77:3001/api/getProductsUser'); // Replace with your API endpoint
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
      <TouchableOpacity style={styles.productItem} onPress={() => navigateToProductDetail(item)}>
        <Image source={{ uri: item.imageProduct }} style={styles.productImage} />
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{formattedPrice}</Text>
        <Text style={styles.productPrice}>{item.introduce}</Text>
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
    <View style={styles.container}>
      {renderContent()}
    </View>
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
    minimumFractionDigits: 2, 
  });

  return formatter.format(numberAsFloat);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  productItem: {
    width: '50%', // Set width to 50% for two columns
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 150, 
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 12,
    marginBottom: 5,
  },
});

export default ProductScreen;
