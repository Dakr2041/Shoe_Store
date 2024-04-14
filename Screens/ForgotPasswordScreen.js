import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Image ,TextInput} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';


const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const emailInputRef = useRef(null);
    const logo = require('../assets/logo_shoe_store.png');
    const handleLoginPress = () => {
        navigation.navigate('Login');
        console.log('Already have an account!!!');
    };

    const handleSendEmail = async () => {
        const emailRegex = /^\w+@[a-zA-Z_\.]+\.[a-zA-Z]{2,}$/; // Email format

        emailInputRef.current.setNativeProps({ borderColor: '#ccc' });

        if (email.length <= 0) {
            return alert('Type in email.');
        }

        if (!emailRegex.test(email)) {
            emailInputRef.current.setNativeProps({ borderColor: 'red' });
            return alert('Invalid email format.');
        }

        try {
            const response = await fetch('http://192.168.1.77:3001/api/forgotPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            console.log(data.message);
            alert(data.message);
            if (data.status === 200) {
                alert(data.message);
                navigation.navigate('Login');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' , padding : 20 }}>
            <Image source={logo} style={{width:200,height:200,alignSelf :'center'}}></Image>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.messenger}>Enter your registered email address:</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                ref={emailInputRef}
            />

            <TouchableOpacity  onPress={handleSendEmail} style={styles.buttonGR}>
            <LinearGradient colors={['#f7c458', '#fea239']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.button}>
            <Text style={styles.buttonText}>Send Email</Text>
            </LinearGradient>  
            </TouchableOpacity>


            <TouchableOpacity onPress={handleLoginPress}>
                <Text style={styles.higlightText}>Go back to Login</Text>
            </TouchableOpacity>

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
        height: 50,
        width: '100%',
        shadowColor :'red',
        marginTop : 20
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight : "bold",
        alignSelf :'center'
    },
    higlightText: {
        color: '#fea239',
        fontSize: 12,
        margin: 9,
        textAlign : 'center',
        marginTop :100,
        fontWeight : 'bold'
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

export default ForgotPasswordScreen;
