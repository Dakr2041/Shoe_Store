import Toast from 'react-native-toast-message';

const showToast = (message, type) => {
    Toast.show({
        type: type,
        text1: message,
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30, // Điều chỉnh vị trí hiển thị
        style: {
            backgroundColor: type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#ff9800', // Thiết lập màu sắc tùy thuộc vào loại
            borderWidth: 1,
            borderColor: '#fff',
        },
        textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
        },
    });
};

const ToastApp = {
    success: message => showToast(message, 'success'),
    error: message => showToast(message, 'error'),
    warning: message => showToast(message, 'warning'),
};

export default ToastApp;
