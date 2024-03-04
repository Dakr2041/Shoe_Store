import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import Register from './API/Register';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log(name)
    try {
      const response = await fetch('http://localhost:3001/api/register',
       {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });
  console.log("vào 2")
      const data = await response.json
      console.log(data);
  
      if (data.status === 200) {
        console.log(data);
      }
      // if (response.ok) {
      //   return { success: true };
      // } else {
      //   const errorData = await response.json();
      //   return { success: false, error: errorData.message };
      // }
    } catch (error) {
      console.error('Error during registration:', error);
      return { success: false, error: 'An error occurred during registration' };
    }
    if (result.success) {
      Alert.alert('Success', 'Registration successful');
      navigation.navigate('Login');

    } else {
      Alert.alert('Error', result.error);
    }
  };
  const handle = async () => {
    try {
      const response = await fetch('http://192.168.1.178:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });
  
      const data = await response.json();
  
      if (data.status === 200) {
        // Registration successful, handle the response accordingly
        navigation.navigate('Login');
        ToastAndroid.BOTTOM.show('Confirm in Email');
        console.log(data);
      } else {
        // Registration failed, handle the error
        console.log(data.error);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      // Handle the error
    }
  }
  const handleLoginPress = () => {
    navigation.navigate('Login');
    console.log('Already have an account!!!');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handle}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLoginPress}>
        <Text style={styles.higlightText}>Already have an account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  higlightText: {
    color: '#007bff',
    fontSize: 12,
    margin: 10,
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
});

export default RegisterScreen;
