import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator ,TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import IconPassWord from 'react-native-vector-icons/FontAwesome5';
import { ScrollView } from 'react-native-gesture-handler';
import { API_URL } from './Api';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const logo = require('../assets/logo.png');
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
    // navigation.navigate('Home');
    setIsLoading(true);
    // Basic validation using regular expressions (can be customized)
    const emailRegex = /^\w+@[a-zA-Z_\.]+\.[a-zA-Z]{2,}$/; // Email format
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/; // Password complexity

    // Clear any previous error messages
    // emailInputRef.current.setNativeProps({ borderColor: '#ccc' });
    // passwordInputRef.current.setNativeProps({ borderColor: '#ccc' });

    console.log("validating");
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
      // emailInputRef.current.setNativeProps({ borderColor: 'red' }); // Highlight error
      return alert('Invalid email format.');
    }

    if (!passwordRegex.test(password)) {
      setIsLoading(false);
      // passwordInputRef.current.setNativeProps({ borderColor: 'red' }); // Highlight error
      return alert('Password must be at least 6 characters and include a number, lowercase letter, and uppercase letter.');
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data.message);
      alert(data.message);
      if (data.status === 200) {
        const authToken = data.data.token;
        const userID = data.data.id;

        console.log(userID);
        console.log(authToken);

        await AsyncStorage.setItem('authToken', authToken);
        await AsyncStorage.setItem('@userId', userID.toString());
        navigation.navigate('Home');
        setIsLoading(false);

        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error('Error during login:', error);
      setIsLoading(false);
      alert(error);
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

      <Image source={logo} style={{width:200,height:200,alignSelf :'center'}}></Image>

      <Text style={styles.title}>Login</Text>

      <Text style={styles.messenger}>Please sign to continue</Text>

      <TextInput
        style={styles.textInput}
        placeholder="Email"
        onChangeText={handleEmailChange}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        ref={emailInputRef} // Assign ref for styling and validation
      />

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          onChangeText={handlePasswordChange}
          value={password}
          secureTextEntry={!isPasswordVisible}
          ref={passwordInputRef} // Assign ref for styling and validation
          // Add padding-right to accommodate the icon
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
    borderRadius: 22
  },
  buttonGR: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    width: '100%',
    shadowColor :'red',
    marginTop : 20,
    textAlign :'center',
},
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight : "bold",
    alignSelf :'center'
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
    right: 15, // Adjust right padding and position as needed,
    top : 30
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

export default LoginScreen;
