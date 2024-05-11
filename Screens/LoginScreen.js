import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import IconPassWord from 'react-native-vector-icons/FontAwesome5';
import { ScrollView } from 'react-native-gesture-handler';
import { API_URL } from './Api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import messaging from '@react-native-firebase/messaging';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const logo = require('../assets/logo.png');
  const logo = require('../assets/logo_shoe_store.png');
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to control loading animation
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [fcmToken, setFcmToken] = useState('');

  const EyeIcon = ({ visible }) => {
    return visible ? (
      <IconPassWord name='eye' color={'black'} size={20}></IconPassWord>
    ) : (
      <IconPassWord name='eye-slash' color={'black'} size={20}></IconPassWord>
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

  useEffect(() => {
    const fetchLoginInfo = async () => {
      const storedEmail = await AsyncStorage.getItem('@userEmail');
      const storedPassword = await AsyncStorage.getItem('@userPassword');
      if (storedEmail && storedPassword) {
        setEmail(storedEmail);
        setPassword(storedPassword);
        setIsRememberMe(true);
      }
    };
    fetchLoginInfo();
  }, []);



  // const getTokenA = async () => {
  //   console.log("Vào getToken")
  //   try {
  //     const token = await messaging().getToken();
  //     setFcmToken(token);
  //     console.log('Token FCM:', token);
  //   } catch (error) {
  //     console.log('Lỗi khi lấy token FCM:', error);
  //   }
  // };

  // // console.log('aaaaaaaaaaaaaaaaaaaaaa', fcmToken);

  // useEffect(() => {
  //   getTokenA();
  // }, []);
  // getTokenA();

  const handleLogin = async () => {
    setIsLoading(true);
    const emailRegex = /^\w+@[a-zA-Z_\.]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;



    if (email.length <= 0) {
      setIsLoading(false);
      return alert('Bạn hãy nhập địa chỉ email.');
    }

    if (password.length <= 0) {
      setIsLoading(false);
      return alert('Bạn hãy nhập mật khẩu.');
    }

    if (!emailRegex.test(email)) {
      setIsLoading(false);
      return alert('Định dạng email không chính xác, xin hãy nhập lại.');
    }

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fcmToken }),
      });
      const data = await response.json();
      console.log(data);

      if (data.status === 200) {
        const authToken = data.data.token;
        const userID = data.data.id;




        await AsyncStorage.setItem('authToken', authToken);
        await AsyncStorage.setItem('@userId', userID.toString());
        if (isRememberMe) {
          await AsyncStorage.setItem('@userEmail', email);
          await AsyncStorage.setItem('@userPassword', password);
        }
        console.log(email);
        navigation.navigate('Home');
        setIsLoading(false);

        return { success: true };
      } else if (data.status === 401) {
        Alert.alert(
          "Thông báo",
          "Sai thông tin đăng nhập, hãy kiểm tra lại.",
          [
            {
              text: "Ok",
              onPress: () => setIsLoading(false),
              style: "cancel"
            }
          ]

        )
      }
      else {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error('Error during login:', error);
      setIsLoading(false);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const navigation = useNavigation();

  const handleRegisterPress = () => {
    navigation.navigate('Register');

  };

  const handleForgotPasswordPress = () => {
    navigation.navigate('ForgotPassword');

  };

  const handlePressRemmember = () => {
    setIsRememberMe(!isRememberMe);
  };
  return (
    <View style={styles.container} >

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>

        <Image source={logo} style={{ width: 200, height: 200, alignSelf: 'center' }}></Image>

        <Text style={styles.title}>Đăng nhập</Text>

        <Text style={styles.messenger}>Hãy đăng nhập để tiếp tục</Text>

        <TextInput
          style={styles.textInput}
          placeholder="Email"
          onChangeText={handleEmailChange}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          ref={emailInputRef}
        />

        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Mật khẩu"
            onChangeText={handlePasswordChange}
            value={password}
            secureTextEntry={!isPasswordVisible}
            ref={passwordInputRef}
          />
          <TouchableOpacity style={styles.showPasswordButton} onPress={togglePasswordVisibility}>
            <EyeIcon visible={isPasswordVisible} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            {/* <Checkbox value={isRememberMe} onValueChange={(newValue) => setIsRememberMe(newValue)} /> */}
            <MaterialCommunityIcons
              name={isRememberMe ? 'checkbox-outline' : 'checkbox-blank-outline'}
              size={30}
              color={isRememberMe ? '#f5ca0c' : '#ccc'}
              onPress={handlePressRemmember}
            />
            <Text style={{ fontSize: 14 }}>Ghi nhớ tài khoản</Text>
          </View>

          <TouchableOpacity onPress={handleForgotPasswordPress}>
            <Text style={styles.higlightText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity onPress={handleLogin} style={styles.buttonGR}>
          <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </LinearGradient>
        </TouchableOpacity>


        <TouchableOpacity onPress={handleRegisterPress} style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 100 }}>
          <Text >Chưa có tài khoản ? hãy bấm vào </Text>
          <Text style={{ fontWeight: 'bold', color: '#fea239' }}>Đăng ký</Text>
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
    fontWeight: "bold",
    marginBottom: 10
  },
  messenger: {
    fontSize: 15,
    marginBottom: 20,
    color: "#4f4f4d"
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
    shadowColor: 'red',
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: 'center'
  },
  higlightText: {
    color: '#fea239',
    fontSize: 14,
    marginTop: 9
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  showPasswordButton: {
    position: 'absolute', // Make it absolute within the input
    right: 15, // Adjust right padding and position as needed,
    top: 30
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
    width: "100%",
    height: 60,
    borderRadius: 9,
    padding: 9,
    marginTop: 9,
    backgroundColor: '#ebecf0'
  }
});

export default LoginScreen;
