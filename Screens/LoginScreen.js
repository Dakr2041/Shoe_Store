import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Login from './API/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleLogin = async () => {
    console.log('Email:', email);
    console.log('Password:', password);
    try {
      const response = await fetch('http://192.168.1.178:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.status === 200) {
        navigation.navigate('Home');
        const data = await response.json();
        const authToken = data.token; 
        await AsyncStorage.setItem('authToken', authToken); 
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'An error occurred during login' };
    }

    if (result.success) {
      navigation.navigate('Home');

      Alert.alert('Success', 'Login successful');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const navigation = useNavigation();

  const handleRegisterPress = () => {
    navigation.navigate('Register');
    console.log('Create new account!!!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Your Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={handleEmailChange}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={handlePasswordChange}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePasswordChange}>
        <Text style={styles.higlightText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRegisterPress}>
        <Text style={styles.higlightText}>Don't have an account?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    width: '100%',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  higlightText: {
    color: '#007bff',
    fontSize: 12,
    margin: 10,
  },
});

export default LoginScreen;
