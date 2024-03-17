import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { formatVND } from '../Functions/FormatVND';

const CheckoutScreen = ({ route }) => {
  const { cartItems, totalPrice } = route.params;
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleCheckout = () => {
    // Implement logic to process checkout with user details and cart items
    console.log('Checkout details:', { name, address, phoneNumber, cartItems, totalPrice });
    // Send data to server or payment gateway (replace with your implementation)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text>{item.name}</Text>
            <Text>{`Quantity: ${item.quantity}`}</Text>
            {/* <Text>{`Price: ${formatVND(parseInt(item.price * item.quantity))}`}</Text> */}
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      {/* <Text style={styles.totalPrice}>Total: {formatVND(totalPrice)}</Text> */}
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <Button title="Checkout" onPress={handleCheckout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartItem: {
    marginBottom: 10,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default CheckoutScreen;
