import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Linking, Button } from 'react-native';
import WebView from 'react-native-webview';
import { API_URL } from '../Api';

const OnlinePaymentScreen = ({ route }) => {
    const { url } = route.params;
    console.log("url: " + url);
    const navigation = useNavigation();
    const [lastUrl, setLastUrl] = useState('');

    const webViewRef = React.useRef(null);
    useEffect(() => {
        const checkUrl = async () => {
            try {
                const supported = await Linking.canOpenURL(url);

                if (!supported) {
                    throw new Error(`Don't know how to open this URL: ${url}`);
                }
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'An error occurred while opening the link.');
            }
        };

        checkUrl();
    }, [url]);

    const handleError = (syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.error('WebView error: ', nativeEvent.url);
    };

    const checkResponseCode = (url) => {
        const urlParams = new URLSearchParams(new URL(url).search);
        const responseCode = urlParams.get('vnp_ResponseCode');
        return responseCode;
    }

    const handlePaymentSuccess = async (url) => {

        const cleanedUrl = url.replace('http://localhost:3001/thanks', '');
        console.log('Cleaned URL: ' + cleanedUrl);
        try {
            const response = await fetch(`${API_URL}/pay/configPayment/${cleanedUrl}`);

            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }

            const data = await response.json();
            console.log('Response from API:', data);
            if (data.status === 200) {
                console.log('Payment success: ' + data);
            } else {
                console.error('Payment failed: ' + data);
            }
        } catch (error) {
            console.error('Error sending last URL to API:', error);
        }
    }

    return (
        <WebView
            ref={webViewRef}
            source={{ uri: url }}
            style={{ marginTop: 30, flex: 1 }}
            // onError={handleError}
            // renderError={() => {<View><Text>Loading failed! But we're not showing this to the user.</Text></View>}}
            onNavigationStateChange={(navState) => {
                setLastUrl(navState.url);
                if (navState.url.includes("http://localhost:3001/thanks")) {
                    console.log('Last URL before navigating back: ' + lastUrl);
                    navigation.navigate('OrderSuccess');
                    const responseCode = checkResponseCode(navState.url);
                    if (responseCode === '00') {
                        console.log('Payment success');
                        handlePaymentSuccess(navState.url);

                    } else {
                        console.error('Payment failed');
                    }

                }
            }}
        />
    );
};
export default OnlinePaymentScreen;