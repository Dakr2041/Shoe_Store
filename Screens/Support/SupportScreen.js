import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Communications from 'react-native-communications';

const SupportScreen = () => {
    const supportPhoneNumber = '01234567';
    const supportMail = 'cuongtlph27535@fpt.edu.vn';
    const navigation = useNavigation();

    const handleCallSupport = () => {
        Communications.phonecall(supportPhoneNumber, true);
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleComposeMail = () => {
        Linking.openURL(`mailto:${supportMail}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Liên hệ hỗ trợ</Text>
            <View style={styles.supportInfo}>
                <Text style={styles.infoText}>Nếu bạn cần hỗ trợ, vui lòng liên hệ:</Text>
                <Text style={styles.infoText}>Số điện thoại: {supportPhoneNumber}</Text>
                <TouchableOpacity onPress={handleComposeMail}>
                    <Text style={styles.mailText}>Gửi về mail: </Text>
                    <Text style={[styles.mailText, styles.redMail]}>{supportMail}</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.callButton} onPress={handleCallSupport}>
                <Text style={styles.callButtonText}>Gọi hỗ trợ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <Text style={styles.backButtonText}>Quay lại</Text>
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
        fontWeight: 'bold',
        marginBottom: 20,
    },
    supportInfo: {
        marginBottom: 30,
        alignItems: 'center',
    },
    infoText: {
        fontSize: 18,
        marginBottom: 10,
    },
    mailText: {
        fontSize: 18,
    },
    redMail: {
        color: 'red',
    },
    callButton: {
        backgroundColor: 'blue',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 10,
    },
    callButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        backgroundColor: 'gray',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    backButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SupportScreen;
