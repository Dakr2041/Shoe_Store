import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const OrderSuccessScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Thank you for ordering !!!</Text>
      <Button title="Go to Tabs" onPress={() => navigation.navigate('Tabs')} />
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
});

export default OrderSuccessScreen;