import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const QuantityPicker = ({ initialQuantity, onQuantityChange, minValue = 1, maxValue = Infinity }) => {
  const [quantity, setQuantity] = useState(initialQuantity || 0);

  const handleDecrement = () => {
    if (quantity > minValue) {
      setQuantity(quantity - 1);
      onQuantityChange?.(quantity - 1); // Optional callback for quantity change
    }
  };

  const handleIncrement = () => {
    if (quantity < maxValue) {
      setQuantity(quantity + 1);
      onQuantityChange?.(quantity + 1); // Optional callback for quantity change
    }
  };

  const getMaxButtonOpacity = (value) => {
    return value === maxValue ? 0.25 : 1; 
  };

  const getMinButtonOpacity = (value) => {
    return value === minValue ? 0.25 : 1; 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleDecrement} disabled={quantity === minValue}>
        {/* <Text style={[styles.buttonText, { opacity: getMinButtonOpacity(quantity) }]}>-</Text> */}
        <MaterialCommunityIcons name="minus" size={14} color="#333" style={{ opacity: getMinButtonOpacity(quantity) }} />

      </TouchableOpacity>
      <Text style={styles.quantityText}>{quantity}</Text>
      <TouchableOpacity style={styles.button} onPress={handleIncrement} disabled={quantity === maxValue}>
        <MaterialCommunityIcons name="plus" size={14} color="#333" style={{ opacity: getMaxButtonOpacity(quantity) }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 5,
    maxWidth: '50%',
    marginBottom:10,
    marginTop:10
  },
  button: {
    padding: 5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 12,
  },
});

export default QuantityPicker;
