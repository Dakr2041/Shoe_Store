import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Profile</Text>
      <View style={styles.avatar}>
        <Image
          source={{uri:"https://www.w3schools.com/howto/img_nature_wide.jpg"}}
          style={styles.avatarImage}
        />
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.info}>JohnDoe</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.info}>johndoe@example.com</Text>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatar: {
    marginBottom: 20,
  },
  avatarImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  profileInfo: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  info: {
    marginTop: 5,
  },
});

export default ProfileScreen;
