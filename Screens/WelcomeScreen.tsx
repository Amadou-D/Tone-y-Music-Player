import React, { useState } from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet, ImageBackground, Modal, TextInput } from 'react-native';
import { Logo } from '../components/Logo'; 
import { Bordertop } from '../components/Bordertop'; 
import PlayerControls from '../components/PlayerControls';
import logoImage from '../src/tonylogo.png';

const WelcomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [inputName, setInputName] = useState('');
  const [password, setPassword] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [error, setError] = useState(null);

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

  //Make a post request on the mockapi to create a new user on signup 
  const handleSignUpSubmit = async () => {
    try {
      const response = await fetch('https://65f4e64bf54db27bc02273c7.mockapi.io/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: inputName, password: password }),
      });
      const data = await response.json();
      
      console.log('Signup successful:', data);
      setUserName(inputName);
      setIsSignedIn(true);
      setIsInputVisible(false);
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Error signing up. Please try again.');
    }
  };
  const handleLogin = async () => {
    try {
      // Make a GET request to check if a user exists with the provided username and password
      const response = await fetch(`https://65f4e64bf54db27bc02273c7.mockapi.io/users?username=${inputName}&password=${password}`);
      const data = await response.json();
  
      if (data.length > 0) {
        setUserName(inputName);
        setIsSignedIn(true);
        setIsInputVisible(false);
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Error logging in. Please try again.');
    }
  };
  
  
  
  return (
    <ImageBackground
      source={{ uri: 'https://i.ibb.co/8XvtKYj/toney.png' }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Bordertop/>
        <View style={styles.container}>
      <Image source={logoImage} style={styles.logo} />
    </View>
        <Logo /> 
        <Text style={styles.subtitle}>Your Music Companion</Text>
        <TouchableOpacity onPress={navigateToLocalPlayerScreen} style={styles.button}>
          <Text style={styles.buttonText}>LOCAL PLAYER</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToPlayerScreen} style={styles.button}>
          <Text style={styles.buttonText}> LINK PLAYER </Text>
        </TouchableOpacity>
        {<PlayerControls onSeek={(value) => console.log('Seek to:', value)} />}
        
        <TouchableOpacity onPress={isSignedIn ? handleSignOut : handleSignIn} style={styles.signInButton}>
          <Text style={styles.signInButtonText}>{isSignedIn ? 'Sign Out' : 'Sign Up / Login'}</Text>
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
                placeholder="Enter your username"
                style={styles.input}
                onChangeText={setInputName}
                value={inputName}
                maxLength={8}
              />
              <TextInput
                placeholder="Enter your password"
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
              />

              <TouchableOpacity onPress={handleSignUpSubmit} disabled={inputName.trim() === '' || password.trim() === ''} style={[styles.submitButton, (inputName.trim() === '' || password.trim() === '') && { backgroundColor: '#ccc' }]}>
                <Text style={styles.submitButtonText}>Sign Up</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleLogin} disabled={inputName.trim() === '' || password.trim() === ''} style={[styles.submitButton, (inputName.trim() === '' || password.trim() === '') && { backgroundColor: '#ccc' }]}>
                <Text style={styles.submitButtonText}>Login</Text>
              </TouchableOpacity>
              
              {error && <Text style={styles.errorText}>{error}</Text>}
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
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  container: {
    alignItems: 'center',
  },
  logo: {
    width: 300, 
    height: 160, 
    resizeMode: 'contain'
  }
});

export default WelcomeScreen;
