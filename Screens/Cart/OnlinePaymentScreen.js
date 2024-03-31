import React, { useEffect } from 'react';
import { View, Text, Linking } from 'react-native';
import WebView from 'react-native-webview';

const OnlinePaymentScreen = ({ route }) => {
    const { url } = route.params;
    console.log("url" + url);

    useEffect(() => {
        const openLink = async () => {
            const supported = await Linking.canOpenURL(url);

            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert(`Don't know how to open this URL: ${url}`);
            }
        };

        openLink();
    }, [url]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Opening link...</Text>
        </View>
    );

    //cách 2 dùng webview
    // const webViewRef = React.useRef(null);
    // useEffect(() => {
    //     const checkUrl = async () => {
    //         try {
    //             const supported = await Linking.canOpenURL(url);

    //             if (!supported) {
    //                 throw new Error(`Don't know how to open this URL: ${url}`);
    //             }
    //         } catch (error) {
    //             console.error(error);
    //             Alert.alert('Error', 'An error occurred while opening the link.');
    //         }
    //     };

    //     checkUrl();
    // }, [url]);

    // const handleError = (syntheticEvent) => {
    //     const { nativeEvent } = syntheticEvent;
    //     console.error('WebView error: ', nativeEvent);
    // };

    // return (
    //     <WebView
    //         ref={webViewRef}
    //         source={{ uri: url }}
    //         style={{ marginTop: 30, flex: 1}}
    //         onError={handleError}
    //     />
    // );
};
export default OnlinePaymentScreen;