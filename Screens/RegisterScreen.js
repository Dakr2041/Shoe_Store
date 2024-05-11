import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, Image, ActivityIndicator, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import IconPassWord from 'react-native-vector-icons/FontAwesome5';
import { API_URL } from './Api';

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
    // setName("abc");

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
      <IconPassWord name='eye' color={'black'} size={20}></IconPassWord>
    ) : (
      <IconPassWord name='eye-slash' color={'black'} size={20}></IconPassWord>
    );
  };

  // const logo = require('../assets/logo.png');
  const logo = require('../assets/logo_shoe_store.png');


  const handleRegister = async () => {

    setIsLoading(true);

    const emailRegex = /^\w+@[a-zA-Z_\.]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (email.length <= 0) {
      setIsLoading(false);
      return alert('Bạn hãy nhập Email.');
    }

    if (!emailRegex.test(email)) {
      setIsLoading(false);
      alert('Sai định dạng Email.');
      return;
    }

    if (name.length <= 0) {
      setIsLoading(false);
      return alert('Bạn hãy nhập họ và tên.');
    }

    if (password.length <= 0) {
      setIsLoading(false);
      return alert('Bạn hãy nhập mật khẩu.');
    }
    if (!password || !passwordRegex.test(password)) {
      setIsLoading(false);
      alert('Mật khẩu cần phải có 6 ký tự, bao gồm số, chữ viết hoa và chữ viết thường.');
      return;
    }

    if (!passwordRegex.test(password)) {
      setIsLoading(false);
      alert('Mật khẩu cần phải có 6 ký tự, bao gồm số, chữ viết hoa và chữ viết thường.');
      return;
    }

    if (confirmPassword.length <= 0) {
      setIsLoading(false);
      return alert('Bạn hãy nhập mật khẩu xác nhận');
    }

    if (password !== confirmPassword) {
      setIsLoading(false);
      alert('2 mật khẩu đang không khớp với nhau.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();


      if (data.status === 200 || data.status === 201) {
        alert(data.message);
        setIsLoading(false);
        navigation.navigate('Login');

      } else {

        alert(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }
  const handleLoginPress = () => {
    navigation.navigate('Login');

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
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
        <Image source={logo} style={{ width: 200, height: 200, alignSelf: 'center' }}></Image>
        <Text style={styles.title}>Đăng ký</Text>
        <Text style={styles.messenger}>Hãy nhập đầy đủ thông tin</Text>
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
          placeholder="Họ và tên"
          value={name}
          onChangeText={handleNameChange}
          autoCapitalize="words"
          ref={nameInputRef}
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
          <TouchableOpacity style={styles.showPasswordButton} onPress={() => togglePasswordVisibility('password')}>
            <EyeIcon visible={isPasswordVisible} />
          </TouchableOpacity>
        </View>

        <View>
          <TextInput
            style={styles.textInput}
            placeholder="Mật khẩu xác nhận"
            onChangeText={handleConfirmPasswordChange}
            value={confirmPassword}
            secureTextEntry={!isConfirmPasswordVisible}
            ref={confirmPasswordInputRef}
          />
          <TouchableOpacity style={styles.showPasswordButton} onPress={() => togglePasswordVisibility('confirmPassword')}>
            <EyeIcon visible={isConfirmPasswordVisible} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleRegister} style={styles.buttonGR}>
          <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button}>
            <Text style={styles.buttonText}>Đăng ký</Text>
          </LinearGradient>
        </TouchableOpacity>



        <TouchableOpacity onPress={handleLoginPress}>
          <Text style={styles.higlightText}>Quay lại đăng nhập</Text>
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
  higlightText: {
    color: '#fea239',
    margin: 9,
    textAlign: 'center',
    marginTop: 100
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
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: 'center'
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  showPasswordButton: {
    position: 'absolute',
    right: 15,
    top: 30

  },
  loadingContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
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

export default RegisterScreen;
