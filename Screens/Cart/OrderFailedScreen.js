import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

const OrderFailScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>You have cancel order !!!</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Tabs')} >
        <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button}>
          <Text style={styles.buttonText}> Continue shopping</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OrderFailScreen;