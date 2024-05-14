import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNavigate = (screenName) => {
    navigation.navigate(screenName);

  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <MaterialCommunityIcons name="arrow-left" size={40} color="#333" />
        </TouchableOpacity>
        <View></View>
        <View></View>
        <Text style={styles.headerText}>Cài đặt</Text>
        <View></View>
        <View></View>
        <View></View>
        <View></View>
      </View>
      {/* Settings list */}
      <TouchableOpacity style={styles.settingItem} onPress={() => handleNavigate('UpdateUserInfo')}>
        <Text style={styles.settingText}>Cập nhật thông tin người dùng</Text>
        <Feather name="chevron-right" size={24} color="#ccc" style={styles.icon} />
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.settingItem} onPress={() => handleNavigate('SetupUserInfo')}>
        <Text style={styles.settingText}>Setup User Info</Text>
        <Feather name="chevron-right" size={24} color="#ccc" style={styles.icon} />
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.settingItem} onPress={() => handleNavigate('ResetPassword')}>
        <Text style={styles.settingText}>Đặt lại mật khẩu</Text>
        <Feather name="chevron-right" size={24} color="#ccc" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  backButton: {
    position: 'absolute', // Position absolutely within the header
    left: 0,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  settingText: {
    fontSize: 16,
  },
  icon: {
  },
});

export default SettingsScreen;
