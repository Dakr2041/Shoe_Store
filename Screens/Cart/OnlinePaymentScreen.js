import React, { useEffect } from 'react';
import { View, Text, Linking } from 'react-native';
import WebView from 'react-native-webview';

const OnlinePaymentScreen = ({ route }) => {
    const { url } = route.params;
    console.log("url" + url);


    return (
        <WebView source={{ uri: url }} />

    );
};
export default OnlinePaymentScreen;