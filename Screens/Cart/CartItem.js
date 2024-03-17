import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatVND } from '../Functions/FormatVND';
import QuantityPicker from '../Functions/QuantityPicker';

const CartItem = ({ item, onRemoveItem, onQuantityChange, isSelected, onSelectChange }) => {
  const defaultImage = 'https://via.placeholder.com/250'; // Placeholder image URL
  const [isChecked, setIsChecked] = useState(false);
  const getImageSource = () => {
    if (item.imageProduct && item.imageProduct.length > 0) {
      return { uri: item.imageProduct };
    } else {
      return { uri: defaultImage };
    }
  };

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [itemPrice, setItemPrice] = useState(item.price);

  const handleQuantityChange = (newQuantity) => {
    setSelectedQuantity(newQuantity);
    const itemPrice = item.price * newQuantity;
    setItemPrice(itemPrice)
    // console.log(itemPrice);
    onQuantityChange(newQuantity, item.price, itemPrice); // Pass calculated price
  };
  const handleSelectChange = (itemPrice,quantity,isSelected) => {
    // onSelectChange(item.id, !isSelected); // Toggle selection state
    

  };
  const handlePress = () => {
    setIsChecked(!isChecked);
  };
  
  return (
    <View style={styles.cartItem}>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.checkboxContainer}>
          <MaterialCommunityIcons
            name={isChecked ? 'checkbox-outline' : 'checkbox-blank-outline'}
            size={30}
            color={isChecked ? '#f5ca0c' : '#ccc'}
            onSelectChange={handleSelectChange(item,item.price,selectedQuantity,isChecked)}
            // onPress={() => onSelectChange(item, !isSelected)}
          />
        </View>
      </TouchableOpacity>
      <Image
        source={getImageSource()}
        style={styles.cartImage}
        onError={(error) => console.warn('Error loading image:', error)} // Handle image loading errors
      />
      <View style={styles.cartDetails}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cartTitle}>{item.name}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cartPrice}>{formatVND(item.price)}</Text>
        {/* <View style={styles.quantityControl}>
          <TouchableOpacity onPress={() => handleQuantityChange(-1)} disabled={item.quantity <= 1}>
            <MaterialCommunityIcons name="minus" size={20} color={item.quantity <= 1 ? '#ccc' : '#000'} />
          </TouchableOpacity>
          <Text style={styles.cartQuantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => handleQuantityChange(1)}>
            <MaterialCommunityIcons name="plus" size={20} color="#000" />
          </TouchableOpacity>
        </View> */}

        <QuantityPicker
          initialQuantity={selectedQuantity}
          onQuantityChange={handleQuantityChange}
          minValue={1}
          maxValue={item.quantity}
          
        />
        <Text>Price: {formatVND(itemPrice)}</Text>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => onRemoveItem(item.id)}>
        <MaterialCommunityIcons name="delete" size={24} color="#f00" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cartImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginLeft: 10,
  },
  cartDetails: {
    flex: 1,
  },
  cartTitle: {
    fontSize: 16,
  },
  cartPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartQuantity: {
    marginHorizontal: 10,
  },
  removeButton: {
    padding: 5,
  },
});

export default CartItem;
