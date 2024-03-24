import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { API_URL } from '../Api'; // Assuming API_URL is defined elsewhere
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import for navigation
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ResetPasswordScreen = () => {
    const navigation = useNavigation();
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [userId, setUserId] = useState(null);

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
    console.log("get id :", userId);

    const handleSubmit = async () => {
        if (!password || !newPassword) {
            Alert.alert('Please enter both current and new password');
            return;
        }

        setIsLoading(true);
        setHasError(false); // Reset error state

        try {
            const response = await fetch(`${API_URL}/api/changePassword/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password, newPassword }),
            });

            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Password reset successful:', data); // Handle success message

            // Clear input fields and navigate back
            setPassword('');
            setNewPassword('');
            navigation.goBack();
        } catch (error) {
            console.error('Error resetting password:', error);
            setHasError(true);
            Alert.alert('Error resetting password', 'An error occurred. Please try again.');
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

            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Current Password"
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New Password"
                secureTextEntry
            />
            {isLoading ? (
                <ActivityIndicator style={styles.loading} />
            ) : (
                <Button title="Reset Password" style={styles.button} onPress={handleSubmit} />
            )}
            {hasError && <Text style={styles.error}>Error resetting password. Please try again.</Text>}
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
    },
    backButton: {
        marginRight: 10,
    },
    headerText: {
        fontSize: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        padding: 10,
        fontSize: 16,
        borderRadius:5
    },
    button: {
        padding: 10,
    },
    loading: {
        marginVertical: 10,
    },
    error: {
        color: 'red',
    },
});

export default ResetPasswordScreen
