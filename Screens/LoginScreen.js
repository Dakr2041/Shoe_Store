import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to control loading animation

  const EyeIcon = ({ visible }) => {
    return visible ? (
      <Image source={require('../assets/show-icon.png')} style={styles.eyeIcon} />
    ) : (
      <Image source={require('../assets/hide-icon.png')} style={styles.eyeIcon} />
    );
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    // Basic validation using regular expressions (can be customized)
    const emailRegex = /^\w+@[a-zA-Z_\.]+\.[a-zA-Z]{2,}$/; // Email format
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/; // Password complexity

    // Clear any previous error messages
    emailInputRef.current.setNativeProps({ borderColor: '#ccc' });
    passwordInputRef.current.setNativeProps({ borderColor: '#ccc' });

    if (email.length <= 0) {
      setIsLoading(false);
      return alert('Type in email.');
    }

    if (password.length <= 0) {
      setIsLoading(false);
      return alert('Type in password.');
    }

    if (!emailRegex.test(email)) {
      setIsLoading(false);
      emailInputRef.current.setNativeProps({ borderColor: 'red' }); // Highlight error
      return alert('Invalid email format.');
    }

    if (!passwordRegex.test(password)) {
      setIsLoading(false);
      passwordInputRef.current.setNativeProps({ borderColor: 'red' }); // Highlight error
      return alert('Password must be at least 6 characters and include a number, lowercase letter, and uppercase letter.');
    }

    try {
      const response = await fetch('http://192.168.1.30:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data.message);
      alert(data.message);
      setIsLoading(false);
      if (data.status === 200) {
        const authToken = data.data.token;
        const userID = data.data.id;

        console.log(userID);

        await AsyncStorage.setItem('authToken', authToken);
        await AsyncStorage.setItem('@userId', userID.toString());
        navigation.navigate('Home');

        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const navigation = useNavigation();

  const handleRegisterPress = () => {
    navigation.navigate('Register');
    console.log('Create new account!!!');
  };

  const handleForgotPasswordPress = () => {
    navigation.navigate('ForgotPassword');
    console.log('Reset Password!!!');
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
        ref={emailInputRef} // Assign ref for styling and validation
      />

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          onChangeText={handlePasswordChange}
          value={password}
          secureTextEntry={!isPasswordVisible}
          ref={passwordInputRef} // Assign ref for styling and validation
          // Add padding-right to accommodate the icon
          paddingRight={30}
        />
        <TouchableOpacity style={styles.showPasswordButton} onPress={togglePasswordVisibility}>
          <EyeIcon visible={isPasswordVisible} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPasswordPress}>
        <Text style={styles.higlightText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRegisterPress}>
        <Text style={styles.higlightText}>Don't have an account?</Text>
      </TouchableOpacity>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
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
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  showPasswordButton: {
    position: 'absolute', // Make it absolute within the input
    right: 15, // Adjust right padding and position as needed
    top: 18, // Adjust top position as needed
  },
  eyeIcon: {
    width: 25,
    height: 25,
  },
  loadingContainer: {
    position: 'absolute', // Ensure animation sits on top of other elements
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent background
  },
});

export default LoginScreen;
