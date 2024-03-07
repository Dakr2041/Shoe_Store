import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, Image, ActivityIndicator,TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconPassWord from 'react-native-vector-icons/FontAwesome5';

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
      <IconPassWord name='eye' color={'black'} size={15}></IconPassWord>
    ) : (
      <IconPassWord name='eye-slash' color={'black'} size={15}></IconPassWord>
    );
  };

  const logo = require('../assets/logo.png');

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
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' , padding : 20 }}>
      <Image source={logo} style={{width:200,height:200,alignSelf :'center'}}></Image>
      <Text style={styles.title}>Register</Text>
      <Text style={styles.messenger}>Please enter complete information</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Email"
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        ref={emailInputRef}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Name"
        value={name}
        onChangeText={handleNameChange}
        autoCapitalize="words"
        ref={nameInputRef}
      />

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.textInput}
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

      <View>
        <TextInput
          style={styles.textInput}
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

      <TouchableOpacity  onPress={handleRegister} style={styles.buttonGR}>
          <LinearGradient colors={['#f7c458', '#fea239']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </LinearGradient>  
      </TouchableOpacity>



      <TouchableOpacity onPress={handleLoginPress}>
        <Text style={styles.higlightText}>Already have an account</Text>
      </TouchableOpacity>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 30,
    fontWeight : "bold",
    marginBottom: 10
  },
  messenger: {
    fontSize: 15,
    marginBottom: 20,
    color : "#4f4f4d"
  },
  higlightText: {
    color: '#007bff',
    margin: 9,
    textAlign : 'center',
    marginTop : 100
  },
  button: {
    padding: 15,
    borderRadius: 22,
    alignItems :'center'

  },
  buttonGR: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    height: 50,
    width: '100%',
    shadowColor :'red',
    marginTop : 20,
},
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  showPasswordButton: {
    position: 'absolute', // Make it absolute within the input
    right: 15, // Adjust right padding and position as needed
    top : 30
  
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
  textInput: {
    width : "100%",
    height : 60,
    borderRadius : 9,
    padding : 9,
    marginTop : 9,
    backgroundColor : '#ebecf0'
  }
});

export default RegisterScreen;
