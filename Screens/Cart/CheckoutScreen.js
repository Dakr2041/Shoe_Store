import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
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
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [displayPrice, setDisplayPrice] = useState('');
  const [total, setTotal] = useState(0);

  const navigation = useNavigation();

  const fetchTOKEN = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      setStoredToken(storedToken ? String(storedToken) : null);
      // console.log(storedToken);
    } catch (error) {
      console.error('Error fetching Token from storage:', error);
    }
  };
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

  useEffect(() => {
    fetchTOKEN();
    if (StoredToken) {
      fetchUserId();

    }
    setTotal(totalPrice);
    setDisplayPrice(formatVND(totalPrice));
  }, [StoredToken]);

  const applyDiscount = async () => {
    if (discount !== '') {
      try {
        const response = await fetch(`${API_URL}/discount/useDiscount/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            total: totalPrice,
            name: discount,
          }),
        });
        const data = await response.json();

        if (data.status === 400) {

          alert(data.message);

          setTotal(data.data);
          setDisplayPrice(formatVND(data.data));
        } else {
          // setAppliedDiscount(true);
          alert(data.message);


        }
      } catch (error) {
        console.error('Error applying discount:', error);
      }
    } else {
      alert('Please enter a discount code');
    }
  };


  const handleOrder = () => {
    setIsLoading(true);
    if (paymentMethod === 'COD') {
      if (cartItems !== null) {


        let orderItems = cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        }));


        order(orderItems);



      }
    } else if (paymentMethod === 'Online Payment') {
      if (cartItems !== null) {


        let orderItems = cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        }));

        onlineOrder(orderItems);



      }
    }
  }

  const onlinePayment = async (totalPrice, orderId) => {
    const bankCode = "";
    const response = await fetch(`${API_URL}/pay/createPayment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bankCode,
        amount: totalPrice,
        orderId
      }),
    });
    const data = await response.json();

    if (data.status == 200) {
      setIsLoading(false);

      navigation.navigate('OnlinePayment', { url: data.data });

    } else {
      console.error(data);
      setIsLoading(false);

    }
  }

  const onlineOrder = async (orderItems) => { // thanh toan online
    const response = await fetch(`${API_URL}/pay/createOrderPayment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${StoredToken}`,
      },
      body: JSON.stringify({
        discount,
        total: total,
        product: orderItems,
      }),
    });
    const data = await response.json();

    if (data.message == "Thành công") {
      setIsLoading(false);
      // alert(data.message);


      onlinePayment(data.data.total, data.data.id);
      await removeItemsFromCart(orderItems);

    } else {
      // Handle error
      setIsLoading(false);
      alert(data.message);
      console.error(data.message);

    }
  };

  const removeItemFromAPI = async (productId, token) => {
    try {
      const response = await fetch(`${API_URL}/cart/deleteItemCart/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      fetchData();
      return response.json();

    } catch (error) {
      throw new Error(`Failed to delete item: ${error.message}`);
    }
  };

  const removeItemsFromCart = async (orderItems) => {
    const promises = orderItems.map(async item => {
      await removeItemFromAPI(item.productId, StoredToken);
    });

    await Promise.all(promises);
  };


  const order = async (orderItems) => { // thanh toan offline
    const response = await fetch(`${API_URL}/order/createOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${StoredToken}`,
      },
      body: JSON.stringify({
        discount,
        total: total,
        product: orderItems,
      }),
    });
    const data = await response.json();

    alert(data.message);

    if (data.message === "Thành công") {
      setIsLoading(false);
      navigation.navigate('OrderSuccess');

      await removeItemsFromCart(orderItems);

    } else {
      console.error(data.message);
      setIsLoading(false);

    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ alignSelf: 'center', height: '100%' }} />;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={40} color="#333" />
          </TouchableOpacity>
          <View></View>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Đặt hàng</Text>
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
            placeholder="Nhập mã giảm giá (nếu có)"
            style={styles.discountInput}
          />
          <TouchableOpacity
            onPress={applyDiscount}
          >
            <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.applyButton} >
              <Text style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold',
                alignSelf: 'center',
                padding: 5
              }}
              >Sử dụng</Text>

            </LinearGradient>
          </TouchableOpacity>


          <View style={styles.PickerMethod}>
            <Text>Hãy lựa chọn phương thức thanh toán:</Text>
            <Picker
              selectedValue={paymentMethod}
              onValueChange={(itemValue) => setPaymentMethod(itemValue)}
            >
              <Picker.Item label="Thanh toán khi nhận hàng (COD)" value="COD" />
              <Picker.Item label="Thanh toán qua VNPay" value="Online Payment" />
            </Picker>
          </View>
          <View style={styles.checkoutContainer}>
            <Text style={styles.cartTotal}>Total: {displayPrice}</Text>
            <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.buttonText} onPress={handleOrder}>Đặt hàng</Text>
            </LinearGradient>
          </View>
        </View>
      </View>
    );
  }

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
  applyButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
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
