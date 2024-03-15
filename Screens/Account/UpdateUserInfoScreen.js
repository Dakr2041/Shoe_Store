import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // For image picker
import DateTimePicker from '@react-native-community/datetimepicker'; // For date picker
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; // For gender selection
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../Api';
import { ActivityIndicator } from 'react-native-paper';

const UpdateUserInfoScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [gender, setGender] = useState('');
    const [userId, setUserId] = useState(null);
    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(true);

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

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (userId) {
                setIsLoading(true);
                try {
                    const response = await fetch(`${API_URL}/getInfoUser/${userId}`);
                    if (response.ok) {
                        const data = await response.json();
                        // alert(data.data.message);

                        console.log(data.data);
                        setUserInfo(data.data);
                    } else {
                        console.error('Error fetching user info:', response.status);
                    }
                } catch (error) {
                    console.error('Error fetching user info:-', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchUserInfo();
    }, [userId]);


    const pickImage = async () => {
        // Request camera or library permission if needed
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to pick an image.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.uri);
        }
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(false);
        setDateOfBirth(currentDate);
    };

    const handleSave = () => {
        // Send updated user info to your backend
        navigation.goBack(); // Assuming navigation back after save
        alert('finnished ')
    };
    const handleGoBack = () => {
        navigation.goBack();
    };

    const dateObj = new Date(userInfo.dob);

    // Format the date object to dd/mm/yyyy format using toLocaleDateString()
    const formattedDate = dateObj.toLocaleDateString("en-GB");

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    } else {
        return (

            <View style={styles.container}>
                <View>
                    <TouchableOpacity onPress={handleGoBack}>
                        <MaterialCommunityIcons name="arrow-left" size={40} color="#333" />
                    </TouchableOpacity>

                </View>
                {/* Profile Picture */}
                <View style={styles.imageContainer}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.profileImage} />
                    ) : (
                        <TouchableOpacity onPress={pickImage} style={styles.imagePlaceholder}>
                            <Text style={styles.imagePlaceholderText}>Choose Profile Picture</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* User Information Inputs */}
                <TextInput
                    style={styles.textInput}
                    placeholder={userInfo.name}
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder={userInfo.phone}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder={userInfo.address}
                    value={address}
                    onChangeText={setAddress}
                />
                <TextInput style={styles.textInput} placeholder={userInfo.city} value={city} onChangeText={setCity} />

                {/* Date of Birth Picker */}
                <TouchableOpacity style={styles.dateInput}
                // onPress={() => setShowDatePicker(true)}//picker only work when setting up new account
                >
                    <Text style={styles.dateInputText}>
                        {/* {dateOfBirth.toLocaleDateString()} */}
                        {formattedDate}
                    </Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={dateOfBirth}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={onChangeDate}
                    />
                )}
                {/* Gender Selection */}
                {/* <Picker //picker only work when setting up new account
                    selectedValue={gender}
                    style={styles.picker}
                    onValueChange={setGender}>
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                </Picker> */}

                {/* Save Button */}
                <TouchableOpacity onPress={handleSave} style={styles.buttonBG} >
                    <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveButton} >
                        <Text style={styles.saveButtonText}>Save Updates</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 30,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    imagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
    },
    imagePlaceholderText: {
        color: '#aaa',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    dateInputText: {
        fontSize: 16,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    buttonBG: {

    },
    saveButton: {
        padding: 15,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',

    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UpdateUserInfoScreen;
