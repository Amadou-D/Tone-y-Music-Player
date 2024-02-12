import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Modal, TextInput } from 'react-native';
import { Logo } from '../components/Logo'; 
import { Bordertop } from '../components/Bordertop'; 


const WelcomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [inputName, setInputName] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(false);

  const navigateToLocalPlayerScreen = () => {
    navigation.navigate('LocalPlayer');
  };

  const navigateToPlayerScreen = () => {
    navigation.navigate('Player');
  };

  const handleSignIn = () => {
    setIsInputVisible(true);
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setUserName(null);
  };

  // for log-in
  const handleInputChange = (text) => {
    if (text.length <= 8) {
      setInputName(text);
    }
  };
  
  const handleSubmit = () => {
    if (inputName.trim() !== '') {
      setUserName(inputName);
      setIsSignedIn(true);
      setIsInputVisible(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://i.ibb.co/8XvtKYj/toney.png' }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Bordertop/>
        <Logo /> 
        <Text style={styles.subtitle}>Your Music Companion</Text>
        <TouchableOpacity onPress={navigateToLocalPlayerScreen} style={styles.button}>
          <Text style={styles.buttonText}>LOCAL PLAYER</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToPlayerScreen} style={styles.button}>
          <Text style={styles.buttonText}> LINK PLAYER </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={isSignedIn ? handleSignOut : handleSignIn} style={styles.signInButton}>
          <Text style={styles.signInButtonText}>{isSignedIn ? 'Sign Out' : 'Sign In'}</Text>
        </TouchableOpacity>

        <Text style={styles.userName}>
          {userName ? userName : 'Guest'}
        </Text>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isInputVisible}
          onRequestClose={() => setIsInputVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                placeholder="Enter your user profile"
                style={styles.input}
                onChangeText={handleInputChange}
                value={inputName}
                maxLength={8}
              />

              <TouchableOpacity onPress={handleSubmit} disabled={inputName.trim() === ''} style={[styles.submitButton, inputName.trim() === '' && { backgroundColor: '#ccc' }]}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'flex-start', 
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#000000', 
    marginBottom: 20,
  },
  button: {
    marginTop: 25,
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 40,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  signInButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  userName: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    color: '#000',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: 200,
  },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default WelcomeScreen;
