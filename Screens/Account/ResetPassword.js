import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { API_URL } from '../Api'; // Assuming API_URL is defined elsewhere
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import for navigation
import { MaterialCommunityIcons } from '@expo/vector-icons';
import IconPassWord from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';

const ResetPasswordScreen = () => {
    const navigation = useNavigation();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const passwordInputRef = useRef(null);
    const confirmPasswordInputRef = useRef(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('@userId');
                setUserId(storedUserId ? Number(storedUserId) : null);
            } catch (error) {
                console.error('Error fetching user ID from storage:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserId();
    }, []);

    const EyeIcon = ({ visible }) => {
        return visible ? (
            <IconPassWord name='eye' color={'black'} size={20}></IconPassWord>
        ) : (
            <IconPassWord name='eye-slash' color={'black'} size={20}></IconPassWord>
        );
    };

    useEffect(() => {
        const fetchTOKEN = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('authToken');
                setToken(storedToken ? String(storedToken) : null);
            } catch (error) {
                console.error('Error fetching Token from storage:', error);

            }
        };

        fetchTOKEN();
    }, []);

    const togglePasswordVisibility = (type) => {
        if (type === 'oldPassword') {
            setIsOldPasswordVisible(!isOldPasswordVisible);
        } else if (type === 'newPassword') {
            setIsNewPasswordVisible(!isNewPasswordVisible);
        } else if (type === 'confirmPassword') {
            setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;


        if (!oldPassword || !newPassword || !confirmPassword) {
            alert('Please enter all current, new password and confirm new password !!!');
            setIsLoading(false);
            return;
        }

        if (!oldPassword) {
            alert('Please enter current password !!!');
            setIsLoading(false);
            return;
        }

        if (!newPassword) {
            alert('Please enter new password !!!');
            setIsLoading(false);
            return;
        }
        if (!passwordRegex.test(newPassword)) {
            setIsLoading(false);
            alert('New password must be at least 6 characters and include a number, lowercase letter, and uppercase letter.');
            return;
        }

        if (!confirmPassword) {
            alert('Please confirm new password !!!');
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('The confirm password and new password is not the same !!!');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/changePassword/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ password: oldPassword, newPassword }),
            });

            const data = await response.json();

            if (response.status === 200) {
                setIsLoading(false);

                alert(data.message)
                if (data.status === 201) {
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmPassword('')
                }
            } else {
                setIsLoading(false);
                alert(response.message)
            }


        } catch (error) {
            console.error('Error resetting password:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={40} color="#333" />
                </TouchableOpacity>
                <View></View>
                <Text style={styles.headerText}>Reset Password</Text>
                <View></View>
                <View></View>
            </View>

            <View style={styles.passwordInputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Current Password"
                    onChangeText={setOldPassword}
                    value={oldPassword}
                    secureTextEntry={!isOldPasswordVisible}
                    ref={passwordInputRef}
                />
                <TouchableOpacity style={styles.showPasswordButton} onPress={() => togglePasswordVisibility('oldPassword')}>
                    <EyeIcon visible={isOldPasswordVisible} />
                </TouchableOpacity>
            </View>

            <View style={styles.passwordInputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="New Password"
                    onChangeText={setNewPassword}
                    value={newPassword}
                    secureTextEntry={!isNewPasswordVisible}
                    ref={passwordInputRef}
                />
                <TouchableOpacity style={styles.showPasswordButton} onPress={() => togglePasswordVisibility('newPassword')}>
                    <EyeIcon visible={isNewPasswordVisible} />
                </TouchableOpacity>
            </View>

            <View style={styles.passwordInputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Confirm Password"
                    onChangeText={setConfirmPassword}
                    value={confirmPassword}
                    secureTextEntry={!isConfirmPasswordVisible}
                    ref={confirmPasswordInputRef}
                />
                <TouchableOpacity style={styles.showPasswordButton} onPress={() => togglePasswordVisibility('confirmPassword')}>
                    <EyeIcon visible={isConfirmPasswordVisible} />
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <ActivityIndicator style={styles.loading} size="large" />
            ) : (
                <TouchableOpacity onPress={handleSubmit} >
                    <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button}>
                        <Text style={styles.buttonText}>Reset Password</Text>
                    </LinearGradient>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 50,
        marginTop: 10,
    },
    backButton: {
        marginRight: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        position: 'relative'
    },
    textInput: {
        width: "100%",
        height: 60,
        borderRadius: 9,
        padding: 9,
        marginTop: 9,
        backgroundColor: '#ebecf0'
    },
    showPasswordButton: {
        position: 'absolute',
        right: 15,
        top: 30
    },
    button: {
        padding: 15,
        borderRadius: 22,
        marginTop: 50
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: "bold",
        alignSelf: 'center'
    },
    loading: {
        marginVertical: 50,
    },
    error: {
        color: 'red',
    },
});

export default ResetPasswordScreen
