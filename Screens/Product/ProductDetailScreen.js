import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'react-native-paper';

const ProductDetailScreen = ({ route }) => {
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

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

                <TouchableOpacity style={styles.buttonGR}>
                  <Button style={styles.button}>
                    <Text style={styles.buttonText}>Add to cart</Text>
                  </Button>
                </TouchableOpacity>
                <Text >Description:</Text>
                <Text >{product.description}</Text>
                {/* <Text >Comments:</Text> */}
              </View>
            </View>


          </ScrollView>

          {/* <TouchableOpacity style={styles.buttonGR}> */}
          {/* <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button}>
              <Text style={styles.buttonText}>Add to cart</Text>
            </LinearGradient> */}

          {/* <Text style={styles.buttonText}>Add to cart</Text> */}

          {/* </TouchableOpacity> */}
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
    minimumFractionDigits: 0,
  });

  return formatter.format(numberAsFloat);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
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
    margin:10,

  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    marginBottom: 20,
    alignSelf:'flex-end',
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
});

export default ProductDetailScreen;
