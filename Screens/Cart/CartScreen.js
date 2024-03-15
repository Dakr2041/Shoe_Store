import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import CartItem from './CartItem'; // Import your CartItem component
import { LinearGradient } from 'expo-linear-gradient';

const FAKE_CART_ITEMS = [
  { id: 1, name: 'Running Shoes', price: 99.000, imageUrl: 'https://kizik.com/cdn/shop/files/kizik-social-image.png?v=1693341281', quantity: 1 },
  { id: 2, name: 'Walking Shoes', price: 179.000, imageUrl: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5acc983c-9da0-499c-8d80-09e59b909fdf/air-jordan-1-elevate-low-shoes-XlkVrM.png', quantity: 3 },
];

const CartScreen = () => {
  const [cartItems, setCartItems] = useState(FAKE_CART_ITEMS);

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach(item => total += item.price * item.quantity);
    return total.toFixed(2);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
          <Text style={styles.headerText}>Cart</Text>
        </LinearGradient>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCart}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cartItems}
          renderItem={({ item }) => (
            <CartItem item={item} onRemoveItem={handleRemoveItem} />
          )}
          keyExtractor={item => item.id}
        />
      )}
      {cartItems.length > 0 && (
        <View style={styles.checkoutContainer}>
          {/* <Text style={styles.cartTotal}>Total: ${calculateTotal()}</Text> */}
          <Text style={styles.cartTotal}>Total: </Text>
          <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.buttonText}> Check out</Text>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyCart: {
    fontSize: 18,
    textAlign: 'center',
  },
  checkoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,

  },
  cartTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingStart: 10,

  },
  header: {
    padding: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 25,
    color: '#fff',

  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: 'center',
    padding: 10,
  },
});

export default CartScreen;
