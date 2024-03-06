import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ToastAndroid, Image, ActivityIndicator } from 'react-native';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const emailInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  const handleEmailChange = (text) => {
    setEmail(text);
  }
  const handleNameChange = (text) => {
    setName(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
  };

  const EyeIcon = ({ visible }) => {
    return visible ? (
      <Image source={require('../assets/show-icon.png')} style={styles.eyeIcon} />
    ) : (
      <Image source={require('../assets/hide-icon.png')} style={styles.eyeIcon} />
    );
  };

  const handleRegister = async () => {
    setIsLoading(true);

    const emailRegex = /^\w+@[a-zA-Z_\.]+\.[a-zA-Z]{2,}$/; // Email format
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/; // Password complexity


    // Clear any previous error messages
    emailInputRef.current.setNativeProps({ borderColor: '#ccc' });
    nameInputRef.current.setNativeProps({ borderColor: '#ccc' });
    passwordInputRef.current.setNativeProps({ borderColor: '#ccc' });
    confirmPasswordInputRef.current.setNativeProps({ borderColor: '#ccc' });

    if (email.length <= 0) {
      setIsLoading(false);
      emailInputRef.current.setNativeProps({ borderColor: 'red' });
      return alert('Type in email.');
    }

    if (!emailRegex.test(email)) {
      setIsLoading(false);
      emailInputRef.current.setNativeProps({ borderColor: 'red' }); // Highlight error
      alert('Invalid email format.');
      return;
    }

    if (name.length <= 0) {
      setIsLoading(false);
      nameInputRef.current.setNativeProps({ borderColor: 'red' });
      return alert('Type in name.');
    }

    if (password.length <= 0) {
      setIsLoading(false);
      passwordInputRef.current.setNativeProps({ borderColor: 'red' });
      return alert('Type in password.');
    }
    if (!password || !passwordRegex.test(password)) {
      setIsLoading(false);
      passwordInputRef.current.setNativeProps({ borderColor: 'red' }); // Highlight error
      alert('Password must be at least 6 characters and include a number, lowercase letter, and uppercase letter.');
      return;
    }

    if (!passwordRegex.test(password)) {
      setIsLoading(false);
      passwordInputRef.current.setNativeProps({ borderColor: 'red' }); // Highlight error
      alert('Password must be at least 6 characters and include a number, lowercase letter, and uppercase letter.');
      return;
    }

    if (confirmPassword.length <= 0) {
      setIsLoading(false);
      confirmPasswordInputRef.current.setNativeProps({ borderColor: 'red' });
      return alert('Type in confirm password.');
    }

    if (password !== confirmPassword) {
      setIsLoading(false);
      confirmPasswordInputRef.current.setNativeProps({ borderColor: 'red' }); // Highlight error
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.30:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      console.log(data.message);
      alert(data.message);
      setIsLoading(false);
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

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);


  const togglePasswordVisibility = (type) => {
    if (type === 'password') {
      setIsPasswordVisible(!isPasswordVisible);
    } else if (type === 'confirmPassword') {
      setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        ref={emailInputRef}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={handleNameChange}
        autoCapitalize="words"
        ref={nameInputRef}
      />

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          onChangeText={handlePasswordChange}
          value={password}
          secureTextEntry={!isPasswordVisible}
          ref={passwordInputRef}
        />
        <TouchableOpacity style={styles.showPasswordButton} onPress={() => togglePasswordVisibility('password')}>
          <EyeIcon visible={isPasswordVisible} />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          onChangeText={handleConfirmPasswordChange}
          value={confirmPassword}
          secureTextEntry={!isConfirmPasswordVisible}
          ref={confirmPasswordInputRef}
        />
        <TouchableOpacity style={styles.showPasswordButton} onPress={() => togglePasswordVisibility('confirmPassword')}>
          <EyeIcon visible={isConfirmPasswordVisible} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLoginPress}>
        <Text style={styles.higlightText}>Already have an account</Text>
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
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
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

export default RegisterScreen;
