import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { formatVND } from '../Functions/FormatVND';
import { API_URL } from '../Api';
import CheckoutItem from './CheckoutItem';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CheckoutScreen = ({ route }) => {
  const { cartItems, totalPrice } = route.params;
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [discount, setDiscount] = useState('');
  const [StoredToken, setStoredToken] = useState(null);
  const [orderItems, setOrderItems] = useState([]);


  const navigation = useNavigation();

  useEffect(() => {
    const fetchTOKEN = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        setStoredToken(storedToken ? String(storedToken) : null);
        // console.log(storedToken);
      } catch (error) {
        console.error('Error fetching Token from storage:', error);

      }
    };

    fetchTOKEN();
  }, []);

  
  

  const handleOrder = () => {
    if (paymentMethod === 'COD') {
      if (cartItems !== null) {
        console.log("items --" , cartItems);

        let orderItems = cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        }));
        console.log("orderItems --" , orderItems);
        order(orderItems);

        console.log("Order pressed");

      }
    } else {
      // Implement online payment
      alert('Online payment is not available yet!')
    }
  }

  const order = async (orderItems) => {
    const response = await fetch(`${API_URL}/order/createOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${StoredToken}`,
      },
      body: JSON.stringify({
        discount,
        total: totalPrice,
        product: orderItems,
      }),
    });
    const data = await response.json();
    console.log(data.message);
    alert(data.message);
    navigation.navigate('Tabs')
    if (data.status == 200) {
      ;
      
      console.log(data.message);

    } else {
      // Handle error
      console.error(data.message);


    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={40} color="#333" />
        </TouchableOpacity>
        <View></View>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Checkout</Text>
        <View></View>
        <View></View>
        <View></View>

      </View>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <CheckoutItem
            item={item}
          />
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginVertical: 10, opacity: 0.25 }} />

      <View>
        <TextInput
          value={discount}
          onChangeText={setDiscount}
          placeholder="Enter discount code"
          style={styles.discountInput}
        />
        <View style={styles.PickerMethod}>
          <Text>Select a payment method:</Text>
          <Picker
            selectedValue={paymentMethod}
            onValueChange={(itemValue) => setPaymentMethod(itemValue)}
          >
            <Picker.Item label="COD" value="COD" />
            <Picker.Item label="Online Payment" value="Online Payment" />
          </Picker>
        </View>
        <View style={styles.checkoutContainer}>
          <Text style={styles.cartTotal}>Total: {formatVND(totalPrice)}</Text>
          <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.buttonText} onPress={handleOrder}> Order</Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40
  },
  backButton: {
    marginLeft: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  discountInput: {
    marginBottom: 10,
    borderColor: '#333',
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  PickerMethod: {
    padding: 10,
    marginBottom: 10,
  },
  checkoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: 0,
    width: '100%',
  },
  cartTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingStart: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

export default CheckoutScreen;
