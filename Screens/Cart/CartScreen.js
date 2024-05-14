import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator, Alert, LogBox } from 'react-native';
import CartItem from './CartItem';
import { LinearGradient } from 'expo-linear-gradient';
import { API_URL } from '../Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { formatVND } from '../Functions/FormatVND';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/vi';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [StoredToken, setStoredToken] = useState(null);
  const [itemsId, setItemsId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);

  const isFocused = useIsFocused();
  const today = moment();

  useEffect(() => {
    const fetchTOKEN = async () => {
      setIsLoading(true);
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        setStoredToken(storedToken ? String(storedToken) : null);
      } catch (error) {
        console.error('Error fetching Token from storage:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    fetchTOKEN();

  }, [isFocused]);

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
  }, [userId, isFocused]);


  useEffect(() => {
    if (shouldRedirectToSetup) {
      navigation.navigate('Tabs', { screen: 'Account' }); // navigate to Account screen in Tabs
    }
  }, [shouldRedirectToSetup, isFocused]);

  const fetchData = async () => {
    if (!StoredToken) {

      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/cart/getCart`, {
        headers: {
          Authorization: `Bearer ${StoredToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();

      setItemsId(data.data);
      console.log(data.data);
      setTotalPrice(0)
      setSelectedItems([]);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [StoredToken, isFocused]);

  const onRemoveItem = async (productId) => {
    try {
      if (!StoredToken) {
        return;
      }

      await removeItemFromAPI(productId, StoredToken);

    } catch (error) {
      console.error('Error deleting item:', error);

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

  const handleRefresh = async () => {
    setItemsId([]);
    await fetchData();
  };

  const handleDeleteConfirmation = (itemId) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bán có chắc chắn muốn xóa sản phẩm khỏi giỏ hàng?`,
      [
        { text: 'Hủy', onPress: () => console.log('Cancel deletion') },
        { text: 'Xác nhận xóa', onPress: () => onRemoveItem(itemId), style: 'destructive' },
      ],
      { cancelable: false },
    );
  };

  const renderEmptyView = () => (
    <View style={styles.emptyCart}>
      <Text style={{ fontSize: 20, textAlign: 'center', }} >Giỏ hàng của bạn đang trống !!!</Text>
    </View>
  );



  const handleItemChecked = (isChecked, itemPrice, quantity, item,       size) => {

    if (typeof itemPrice !== 'number' || typeof quantity !== 'number') {
      console.error('Invalid input: Please provide a valid number.');
      return;
    }
    setTotalPrice(prevTotal => {
      let newTotal = 0;
      if (isChecked) {
        newTotal = prevTotal + itemPrice * quantity;
      } else {
        if (totalPrice > 0) {
          newTotal = prevTotal - itemPrice * quantity;
        }
      }
      //test
      setSelectedItems(prevItems => {
        if (isChecked) {
          return [...prevItems, { id: item.id, quantity ,size}];//thêm size ở đây
        } else {
          return prevItems.filter(i => i.id !== item.id);
        }
      });
      return newTotal < 0 ? 0 : newTotal;
    });
  };

  const onQuantityChange = (oldQuantity, newQuantity, itemPrice, isChecked, item,       size) => {

    if (isChecked) {
      setTotalPrice(prevTotal => {
        let quantityDifference = newQuantity - oldQuantity;
        let newTotal = prevTotal + itemPrice * quantityDifference;
        return newTotal < 0 ? 0 : newTotal;
      });
      setSelectedItems(prevItems =>
        prevItems.map(i => (i.id === item.id ? { ...i, quantity: newQuantity , size} : i))//thêm size ở đây
      );
    }
    return;
  };

  const navigation = useNavigation();
  const navigateToCheckout = () => {
    if (selectedItems.length === 0 || totalPrice === 0) {
      Alert.alert('Không có sản phẩm nào đang được chọn', 'Hãy chọn ít nhất 1 sản phẩm để tiếp tục mua hàng!.');
    } else {

      navigation.navigate('Checkout', { cartItems: selectedItems, totalPrice });
      setTotalPrice(0);
      setSelectedItems([]);
    }
  };


  return (
    <GestureHandlerRootView style={styles.container}>
      <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
        <Text style={styles.headerText}>Giỏ hàng</Text>
      </LinearGradient>

      <Swipeable onSwipeableOpenStartDrag={handleRefresh} >
        {isLoading ? (
          <ActivityIndicator size="large" style={{ marginTop: 80 }} />
        ) : itemsId.length > 0 ? (
          <FlatList
            style={{ height: '88%' }}
            data={itemsId}
            renderItem={({ item }) => (
              <CartItem item={item}
                onRemoveItem={handleDeleteConfirmation}
                onQuantityChange={onQuantityChange}
                onItemChecked={handleItemChecked}
              />
            )}
            keyExtractor={item => item.id}
            onRefresh={handleRefresh}
            refreshing={isLoading}
          />
        ) : (
          renderEmptyView()
        )}
      </Swipeable>

      <View style={styles.checkoutContainer}>
        <Text style={styles.cartTotal}>Tổng tiền: {formatVND(totalPrice)}</Text>
        <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Text style={styles.buttonText}
            onPress={navigateToCheckout}
          > Đặt hàng</Text>
        </LinearGradient>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyCart: {
    alignContent: 'center',
    opacity: 0.35,
    height: '100%',
    padding: 50
  },
  checkoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
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
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 10,
  },
});

export default CartScreen;

