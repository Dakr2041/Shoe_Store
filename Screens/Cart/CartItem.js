import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatVND } from '../Functions/FormatVND';
import QuantityPicker from '../Functions/QuantityPicker';
import { Checkbox } from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/vi';
import { Picker } from '@react-native-picker/picker';

const CartItem = ({ item, onRemoveItem, onQuantityChange, onItemChecked, resetCheckboxes, onSizeChange }) => {
  const defaultImage = 'https://via.placeholder.com/250';
  const [isChecked, setIsChecked] = useState(false);
  const [selectedSize, setSelectedSize] = useState(item.sizes[0]);

  useEffect(() => {
    if (resetCheckboxes) {
      setIsChecked(false);
    }
  }, [resetCheckboxes]);

  const getImageSource = () => {
    if (item.productImage && item.productImage.length > 0) {
      return { uri: item.productImage };
    } else {
      return { uri: defaultImage };
    }
  };

  const today = moment();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [itemPrice, setItemPrice] = useState(item.productPrice);



  const handleQuantityChange = (newQuantity) => {
    setSelectedQuantity(newQuantity);
    onQuantityChange(selectedQuantity, newQuantity, item.productPrice, isChecked, item,selectedSize);
  };

  const handleSizeChange = (newSize) => {
    setSelectedSize(newSize);
    onSizeChange(isChecked, item,newSize);
  };

  const handlePress = () => {
    setIsChecked(!isChecked);
  };

  const isSaleActive = () => {
    const saleStartDate = moment(item.timeSaleStart);
    const saleEndDate = moment(item.timeSaleEnd);
    const today = moment();
    return saleStartDate.isSameOrBefore(today) && saleEndDate.isSameOrAfter(today);
  };

  useEffect(() => {
    if (isSaleActive()) {
      const newPrice = item.productPrice - item.priceSale;
      setItemPrice(newPrice);
    } else {
      setItemPrice(item.productPrice);
    }
  }, [isSaleActive]);

  useEffect(() => {
    onItemChecked(isChecked, itemPrice, selectedQuantity, item,selectedSize);
  }, [isChecked]);

  return (
    <View style={styles.cartItem}>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.checkboxContainer}>
          <MaterialCommunityIcons
            name={isChecked ? 'checkbox-outline' : 'checkbox-blank-outline'}
            size={30}
            color={isChecked ? '#f5ca0c' : '#ccc'}
            onPress={handlePress}
          />
        </View>
      </TouchableOpacity>
      <Image
        source={getImageSource()}
        style={styles.cartImage}
        onError={(error) => console.warn('Error loading image:', error)}
      />
      <View style={styles.cartDetails}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cartTitle}>{item.productName}</Text>

        <QuantityPicker
          initialQuantity={selectedQuantity}
          onQuantityChange={handleQuantityChange}
          minValue={1}
          maxValue={item.quantity}
        />
        <Text style={{fontSize:14}}>Giá: {formatVND(itemPrice)}</Text>

        <View>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Kích cỡ:</Text>
            <Picker
              selectedValue={selectedSize}
              onValueChange={
                (newSize) => handleSizeChange(newSize)
                // (newSize) => setSelectedSize(newSize)
              }
              style={styles.picker}
            >
              {item.sizes.map((size) => (
                <Picker.Item label={size.toString()} value={size} key={size} />
              ))}
            </Picker>
          </View>
        </View>
        
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
    width: 120,
    height: 120,
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
  pickerContainer: {
    flexDirection:"row",
    marginBottom: 10,
    alignItems:'center'
  },
  pickerLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  picker: {
    width: 100,
    fontSize:16,
    borderWidth:1
  },
});

export default CartItem;
