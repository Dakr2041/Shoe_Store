import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const emailInputRef = useRef(null);

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
            const response = await fetch('http://192.168.1.30:3001/api/forgotPassword', {
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
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.instruction}>Enter your registered email address:</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                ref={emailInputRef}
            />
            <TouchableOpacity style={styles.button} onPress={handleSendEmail}>
                <Text style={styles.buttonText}>Send Email</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLoginPress}>
                <Text style={styles.higlightText}>Go back to Login</Text>
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
    instruction: {
        marginBottom: 10,
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
        marginTop: 10,
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

export default ForgotPasswordScreen;
