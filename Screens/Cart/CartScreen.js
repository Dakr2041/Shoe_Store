import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import CartItem from './CartItem'; // Import your CartItem component
import { LinearGradient } from 'expo-linear-gradient';
import { API_URL } from '../Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { formatVND } from '../Functions/FormatVND';
import { useNavigation } from '@react-navigation/native';


const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [StoredToken, setStoredToken] = useState(null);
  const [itemsId, setItemsId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);



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
  }, []);

  const fetchData = async () => {
    if (!StoredToken) {
      console.log('Waiting for token...');
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
      setItemsId(data.productId);
      console.log(itemsId.disscount);
      console.log("Cart done loading");
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
  }, [StoredToken]);

  const onRemoveItem = async (productId) => {
    try {
      if (!StoredToken) {
        console.warn('No token available. User needs to log in.');
        // Handle unauthorized case (e.g., display login prompt)
        return;
      }

      await removeItemFromAPI(productId, StoredToken);
      console.log('Item deleted from cart');
    } catch (error) {
      console.error('Error deleting item:', error);
      // Handle errors (e.g., display error message to user)
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
    setItemsId([]); // Clear existing data before refetching
    await fetchData();
  };

  const handleDeleteConfirmation = (itemId) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete item from your cart?`,
      [
        { text: 'Cancel', onPress: () => console.log('Cancel deletion') },
        { text: 'Delete', onPress: () => onRemoveItem(itemId), style: 'destructive' },
      ],
      { cancelable: false }, // Disable background dismissal
    );
  };

  const renderEmptyView = () => (
    <View style={styles.emptyCart}>
      <Text style={{ fontSize: 20, textAlign: 'center', }} >Your list is empty !</Text>
      <Text style={{ fontSize: 12, textAlign: 'center', }} >Swipe to reload</Text>
    </View>
  );

  const handleItemChecked = (isChecked, itemPrice, quantity, item) => {
    if (typeof itemPrice !== 'number' || typeof quantity !== 'number') {
      console.error('Invalid input: Please provide a valid number.');
      return;
    }

    setTotalPrice(prevTotal => {
      let newTotal = 0;
      if (isChecked) {
        newTotal = prevTotal + (itemPrice - item.priceSale) * quantity;
        // console.log("Checked new total: " + newTotal + " = prevTotal(" + prevTotal + ")  + itemPrice(" + itemPrice + ") * quantity(" + quantity + ")");

      } else {
        if (totalPrice > 0) {
          newTotal = prevTotal - (itemPrice - item.priceSale) * quantity;
          // console.log("Unchecked new total: " + newTotal + " = prevTotal(" + prevTotal + ")  - itemPrice(" + itemPrice + ") * quantity(" + quantity + ")");

        }
      }
      setSelectedItems(prevItems => {
        if (isChecked) {
          return [...prevItems, { id: item.id, quantity }];
        } else {
          return prevItems.filter(i => i.id !== item.id);
        }
      });
      return newTotal < 0 ? 0 : newTotal;
    });
  };

  const onQuantityChange = (oldQuantity, newQuantity, itemPrice, isChecked, item) => {
    console.log("-------------------");
    if (isChecked) {
      setTotalPrice(prevTotal => {
        let quantityDifference = newQuantity - oldQuantity;
        let newTotal = prevTotal + itemPrice * quantityDifference;
        // console.log("Quantity change new total: " + newTotal + " = prevTotal(" + prevTotal + ") + itemPrice(" + itemPrice + ") * quantityDifference(" + quantityDifference + ")");
        return newTotal < 0 ? 0 : newTotal;
      });
      setSelectedItems(prevItems =>
        prevItems.map(i => (i.id === item.id ? { ...i, quantity: newQuantity } : i))
      );
    }
    return;
  };

  const navigation = useNavigation();
  const navigateToCheckout = () => {
    if (selectedItems.length === 0 || totalPrice === 0) {
      Alert.alert('No items selected', 'Please select at least one item before checking out.');
    } else {
      console.log('Selected items:', selectedItems, 'Total price:', totalPrice);
      navigation.navigate('Checkout', { cartItems: selectedItems, totalPrice });
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
        <Text style={styles.headerText}>Cart</Text>
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
        <Text style={styles.cartTotal}>Total: {formatVND(totalPrice)}</Text>
        <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Text style={styles.buttonText}
            onPress={navigateToCheckout}
          > Check out</Text>
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
