import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconPassWord from 'react-native-vector-icons/FontAwesome5';
import { ScrollView } from 'react-native-gesture-handler';
import InteractiveTextInput from "react-native-text-input-interactive";


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to control loading animation

  const EyeIcon = ({ visible }) => {
    return visible ? (
      <IconPassWord name='eye' color={'black'} size={15}></IconPassWord>
    ) : (
      <IconPassWord name='eye-slash' color={'black'} size={15}></IconPassWord>
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
      const response = await fetch('http://192.168.0.104:3001/api/login', {
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
    <View style={styles.container} >
      
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' , padding : 20 }}>
      <Text style={styles.title}  >Login</Text>

      <Text style={styles.messenger}>Please sign to continue</Text>

      <InteractiveTextInput
        placeholder="Email"
        onChangeText={handleEmailChange}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        ref={emailInputRef} // Assign ref for styling and validation
      />

      <View style={styles.passwordInputContainer}>
        <InteractiveTextInput
          placeholder="Password"
          onChangeText={handlePasswordChange}
          value={password}
          secureTextEntry={!isPasswordVisible}
          ref={passwordInputRef} // Assign ref for styling and validation
          // Add padding-right to accommodate the icon
          paddingRight={30}
          style={{marginTop :9}}
        />
        <TouchableOpacity style={styles.showPasswordButton} onPress={togglePasswordVisibility}>
          <EyeIcon visible={isPasswordVisible} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleForgotPasswordPress}>
        <Text style={styles.higlightText}>Forgot Password?</Text>
      </TouchableOpacity>

      
      <TouchableOpacity  onPress={handleLogin} style={styles.buttonGR}>
          <LinearGradient colors={['#f7c458', '#fea239']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
            <Icon name="angle-right" size={20} color={'white'}></Icon>
          </LinearGradient>  
      </TouchableOpacity>




      <TouchableOpacity onPress={handleRegisterPress} style={{ flexDirection: 'row',alignSelf :'center' , marginTop : 100}}>
        <Text >Don't have an account? </Text>
        <Text style={{fontWeight :'bold', color :'#fea239'}}>Sign up</Text>
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
  button: {
    padding: 15,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonGR: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    height: 50,
    width: '40%',
    shadowColor :'red',
    alignSelf: 'flex-end',
    marginEnd : 2
},
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight : "bold"
  },
  higlightText: {
    color: '#007bff',
    fontSize: 12,
     marginTop : 9
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  showPasswordButton: {
    position: 'absolute', // Make it absolute within the input
    right: 15, // Adjust right padding and position as needed
    top: 25, // Adjust top position as needed
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
