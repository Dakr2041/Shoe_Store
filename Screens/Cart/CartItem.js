import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CartItem = ({ item, onRemoveItem, onQuantityChange, isSelected, onSelectChange }) => {
  const defaultImage = 'https://via.placeholder.com/150'; // Placeholder image URL

  const getImageSource = () => {
    if (item.imageUrl && item.imageUrl.length > 0) {
      return { uri: item.imageUrl };
    } else {
      return { uri: defaultImage };
    }
  };

  const handleQuantityChange = (delta) => {
    if (onQuantityChange) {
      onQuantityChange(item.id, Math.max(item.quantity + delta, 1)); // Ensure quantity stays positive
    }
  };

  const handleSelectChange = () => {
    if (onSelectChange) {
      onSelectChange(item.id, !isSelected); // Toggle selection state
    }
  }

  return (
    <View style={styles.cartItem}>
      {/* Image with error handling */}
      <TouchableOpacity onPress={handleSelectChange}>
        <MaterialCommunityIcons name={isSelected ? 'check-box-outline' : 'checkbox-blank-outline'} size={24} color="#ccc" />
      </TouchableOpacity>
      <Image
        source={getImageSource()}
        style={styles.cartImage}
        onError={(error) => console.warn('Error loading image:', error)} // Handle image loading errors
      />
      <View style={styles.cartDetails}>
        <Text style={styles.cartTitle}>{item.name}</Text>
        <Text style={styles.cartPrice}>{item.price.toFixed(2)}</Text>
        <View style={styles.quantityControl}>
          {/* Quantity controls with disabled states */}
          <TouchableOpacity onPress={() => handleQuantityChange(-1)} disabled={item.quantity <= 1}>
            <MaterialCommunityIcons name="minus" size={20} color={item.quantity <= 1 ? '#ccc' : '#000'} />
          </TouchableOpacity>
          <Text style={styles.cartQuantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => handleQuantityChange(1)}>
            <MaterialCommunityIcons name="plus" size={20} color="#000" />
          </TouchableOpacity>
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
    width: 80,
    height: 80,
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
