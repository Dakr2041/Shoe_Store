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
    const [StoredToken, setStoredToken] = useState(null);
    const [imageType, setImageType] = useState(null)

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
                    const response = await fetch(`${API_URL}/api/getInfoUser/${userId}`);
                    if (response.ok) {
                        const data = await response.json();
                        console.log(data.data);
                        setUserInfo(data.data);
                        setImage(data.data.avatar);
                        setGender(data.data.gender);
                        setAddress(data.data.address);
                        setCity(data.data.city);
                        setPhone(data.data.phone);
                        setName(data.data.name);
                        setDateOfBirth(new Date(data.data.dob));
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

    useEffect(() => {
        const fetchTOKEN = async () => {
            setIsLoading(true);
            try {
                const storedToken = await AsyncStorage.getItem('authToken');
                setStoredToken(storedToken ? String(storedToken) : null);
            } catch (error) {
                console.error('Error fetching Token from storage:', error);
                setHasError(true);

                setIsLoading(false);
            }
        };

        fetchTOKEN();
    }, []);
    console.log(StoredToken);

    function getFileTypeFromUri(uri) {
        const extensionIndex = uri.lastIndexOf('.'); // Find the last dot (.)
        if (extensionIndex !== -1) {
            return uri.substring(extensionIndex + 1); // Extract the extension after the dot
        } else {
            return ''; // No extension found
        }
    }

    const pickImage = async () => {
        // Request camera or library permission if needed
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to pick an image.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            const fileType = getFileTypeFromUri(result.assets[0].uri)
            setImageType(fileType);
            console.log("----------- image uri: " + image + " Type: " + imageType);
        }
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(false);
        setDateOfBirth(formattedDate);
    };

    const handleSave = async () => {
        const formData = new FormData();
        setIsLoading(true);

        if (image) {
            formData.append('avatar', {
                uri: image,
                type: `image/${imageType}`,
                name: `avatar.${imageType}`,
            });
        }

        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('city', city);
        let formattedDate = dateOfBirth.toISOString().split('T')[0];
        // console.log("-----------" + formattedDate);
        formData.append('dob', formattedDate); // Format the date in "yyyy-mm-dd" format
        formData.append('gender', gender);

        try {
            const response = await fetch(`${API_URL}/api/updateInfoUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${StoredToken}`,
                },
                body: formData,
            });

            const responseData = await response.json();

            if (responseData.status === 200) {
                console.log(responseData.message);
                alert(responseData.message);
                setIsLoading(false);

                // You can perform further actions here, like updating user info
            } else {
                console.error('Error Updated :', responseData.message);
                alert(responseData.message);
                setIsLoading(false);

            }
        } catch (error) {
            console.error('Error Updated request:', error);
            alert(error);

        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    // Format the date object to dd/mm/yyyy format using toLocaleDateString()
    const formattedDate = dateOfBirth.toLocaleDateString("en-GB");
    // console.log("-----------" + formattedDate);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    } else {
        return (

            <View style={styles.container}>
                {/* <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    
                </LinearGradient> */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={handleGoBack}>
                        <MaterialCommunityIcons name="arrow-left" size={40} color="#333" />
                    </TouchableOpacity>
                    <View></View>
                    <Text style={styles.screenNameText}>Update User Info</Text>
                    <View></View>
                    <View></View>
                </View>
                {/* Profile Picture */}
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={pickImage} >
                        <Image source={{ uri: image }} style={styles.profileImage} />
                    </TouchableOpacity>
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
                    onPress={() => setShowDatePicker(true)}//picker only work when setting up new account
                >
                    <Text style={styles.dateInputText}>
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
                <Picker //picker only work when setting up new account
                    selectedValue={gender}
                    style={styles.picker}
                    onValueChange={setGender}>
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                </Picker>

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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    screenNameText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
        // width: 300, 
        // height: 300, 
    },

    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 125,
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
