import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ProductDetailScreen = ({ route }) => {
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { product } = route.params; // Get product data from navigation params
    setProduct(product);
    setIsLoading(false);
  }, [route.params]);

  const renderContent = () => {
    if (isLoading) {
      return <Text>Loading...</Text>;
    } else if (!product.id) { 
      return <Text>Product details not found.</Text>;
    } else {
      return (
        <View style={styles.container}>
          <Image source={{ uri: product.imageProduct }} style={styles.productImage} />
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{formatVND(product.price)}</Text>
          <Text >Qty: {product.quantity} - pair</Text>
          <Text >Description:</Text>
          <Text >{product.description}</Text>
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
    padding: 20,
    
  },
  productImage: {
    width: '100%',
    height: 300, 
    overflow: 'hidden',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default ProductDetailScreen;
