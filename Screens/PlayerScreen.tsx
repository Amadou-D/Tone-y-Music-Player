import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import TrackPlayer, { usePlaybackState, STATE_NONE } from 'react-native-track-player';
import { Bordertop } from '../components/Bordertop';
import PlayerControls from '../components/PlayerControls'; // Import PlayerControls component
import logoImage from '../src/tonylogo.png';

const PlayerScreen = ({ navigation }) => {
  const [onlineUrl, setOnlineUrl] = useState('');
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playbackState = usePlaybackState();

  useEffect(() => {
    const checkPlayerReady = async () => {
      const state = await TrackPlayer.getState();
      if (state === STATE_NONE) {
        await TrackPlayer.setupPlayer();
        setIsPlayerReady(true);
      } else {
        setIsPlayerReady(true);
      }
    };

    checkPlayerReady();
  }, []);

  const playOnlineTrack = async () => {
    if (!onlineUrl) {
      console.warn('Invalid online audio URL');
      return;
    }

    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: 'track1',
        url: onlineUrl,
        title: 'Online Track',
        artist: 'Artist Name',
      });

      await TrackPlayer.play();
    } catch (err) {
      console.error('Error playing online audio:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Bordertop />
      <Text style={styles.title}>Tone-y Music Player</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Online Audio URL(.ogg format)"
        onChangeText={(text) => setOnlineUrl(text)}
        value={onlineUrl}
      />
      <TouchableOpacity style={styles.button} onPress={playOnlineTrack}>
        <Text style={styles.buttonText}> Load Online Track</Text>
      </TouchableOpacity>
      <View style={styles.trackInfoContainer}>
        <Text style={styles.trackInfoText}>URL: {onlineUrl}</Text>
      </View>
      <View style={styles.logoContainer}>
        <Image source={logoImage} style={styles.logo} />
      </View>
      {/* Render PlayerControls component */}
      {isPlayerReady && <PlayerControls />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  input: {
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    padding: 5,
    width: '70%',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'black',
    width: '70%',
    padding: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  trackInfoContainer: {
    marginVertical: 10,
  },
  trackInfoText: {
    fontSize: 16,
    color: 'black',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 10,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default PlayerScreen;
