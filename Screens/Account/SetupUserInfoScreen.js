import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // For image picker
import DateTimePicker from '@react-native-community/datetimepicker'; // For date picker
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; // For gender selection
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../Api';
import { ActivityIndicator } from 'react-native-paper';
import axios from 'axios';

const SetupUserInfoScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [gender, setGender] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState('');
    const [displayDate, setDisplayDate] = useState('Select date of birth');
    const [imageType, setImageType] = useState(null)



    const pickImage = async () => {
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

    function getFileTypeFromUri(uri) {
        const extensionIndex = uri.lastIndexOf('.');
        if (extensionIndex !== -1) {
            return uri.substring(extensionIndex + 1);
        } else {
            return '';
        }
    }

    useEffect(() => {
        const fetchTOKEN = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('authToken');
                setToken(storedToken ? String(storedToken) : null);
                console.log(storedToken);
            } catch (error) {
                console.error('Error fetching Token from storage:', error);

            }
        };

        fetchTOKEN();
    }, []);
    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(false);
        setDateOfBirth(currentDate);
        setDisplayDate(currentDate ? currentDate.toISOString().slice(0, 10) : 'Select a date');
        console.log(dateOfBirth);
    };

    const handleSave = async () => {
        setIsLoading(true);
        if (!image) {
            alert('Please choose a profile picture.');
            setIsLoading(false);
            return;
        }
        if (!name.trim()) {
            alert('Please enter your name.');
            setIsLoading(false);
            return;
        }

        if (!phone.trim()) {
            alert('Please enter your phone number.');
            setIsLoading(false);
            return;
        }

        if (!address.trim()) {
            alert('Please enter your address.');
            setIsLoading(false);
            return;
        }

        if (!city.trim()) {
            alert('Please enter your city.');
            setIsLoading(false);
            return;
        }
        if (displayDate === 'Select date of birth') {
            alert('Please select your date of birth.');
            setIsLoading(false);
            return;
        }

        if (!gender) {
            alert('Please select your gender.');
            setIsLoading(false);
            return;
        }
        if (image) {
            try {
                const formData = new FormData();

                formData.append('avatar', {
                    uri: image,
                    type: `image/${imageType}`,
                    name: `avatar.${imageType}`,
                });
                formData.append('name', name.toString());
                formData.append('phone', phone.toString());
                formData.append('address', address.toString());
                formData.append('city', city.toString());
                formData.append('dob', dateOfBirth.toISOString().slice(0, 10));
                formData.append('gender', gender.toString());


                const response = await axios({
                    method: 'post',
                    url: `${API_URL}/api/infoUser`,
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    console.log(response.data.message);
                    // alert(response.data.message);
                    setIsLoading(false);
                    navigation.navigate('Home');
                } else {
                    console.error('Error Updated :', response.data.message);
                    // alert(response.data.message);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error Updated request:', error);
                setIsLoading(false);
            }

        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };



    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    return (
        <View>
            <View style={styles.headerContainer}>
                {/* <TouchableOpacity onPress={handleGoBack}>
                    <MaterialCommunityIcons name="arrow-left" size={40} color="#333" />
                </TouchableOpacity> */}
                {/* <View></View> */}
                <Text style={styles.screenNameText}>Setup User Info</Text>
                {/* <View></View> */}
                {/* <View></View> */}
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
            

            {/* Profile Picture */}
            <View style={styles.imageContainer}>
                {image ? (
                    <TouchableOpacity onPress={pickImage}>
                        <Image source={{ uri: image }} style={styles.profileImage} />
                    </TouchableOpacity>

                ) : (
                    <TouchableOpacity onPress={pickImage} style={styles.imagePlaceholder}>
                        <Text style={styles.imagePlaceholderText}>Choose Profile Picture</Text>
                    </TouchableOpacity>
                )}
            </View>

            <TextInput
                style={styles.textInput}
                value={name}
                placeholder='Name'
                onChangeText={setName}
            />
            <TextInput
                style={styles.textInput}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                placeholder='Phone Number'

            />
            <TextInput
                style={styles.textInput}
                value={address}
                onChangeText={setAddress}
                placeholder='Address'
            />
            <TextInput style={styles.textInput}
                value={city}
                onChangeText={setCity}
                placeholder='City' />

            <TouchableOpacity style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={styles.dateInputText}>
                    {displayDate}
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

            <Picker
                selectedValue={gender}
                style={styles.picker}
                onValueChange={setGender}>
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
            </Picker>

            <TouchableOpacity onPress={handleSave} style={styles.buttonBG} >
                <LinearGradient colors={['#f7c458', '#fea239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveButton} >
                    <Text style={styles.saveButtonText}>Save Updates</Text>
                </LinearGradient>
            </TouchableOpacity>
        </ScrollView>
        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 30,
    },
    headerContainer: {
        // flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 50,
        marginStart: 20,
    },
    screenNameText: {
        fontSize: 20,
        fontWeight: 'bold',
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
        width: 200,
        height: 200,
        borderRadius: 125,
    },
    imagePlaceholder: {
        width: 200,
        height: 200,
        borderRadius: 125,
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

export default SetupUserInfoScreen;
