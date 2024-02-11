// WelcomeScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, Image } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  //CURRENTLY ROUTED TO THE LOCALPLAYER
  const navigateToLocalPlayerScreen = () => {
    navigation.navigate('LocalPlayer');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://i.ibb.co/8XvtKYj/toney.png' }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Image
          source={{ uri: 'https://i.ibb.co/8XvtKYj/toney.png' }}
          style={styles.logo}
        />
        <Text style={styles.title}>Welcome to Toney!</Text>
        <Text style={styles.subtitle}>Your Music Companion</Text>
        <Button title="Get Started" onPress={navigateToLocalPlayerScreen} buttonStyle={styles.button} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75, 
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    color: '#fff',
  },
});

export default WelcomeScreen;
