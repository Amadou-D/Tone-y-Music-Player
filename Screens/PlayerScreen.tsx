import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import TrackPlayer, { usePlaybackState, STATE_NONE } from 'react-native-track-player';
import { Bordertop } from '../components/Bordertop';
import logoImage from '../src/tonylogo.png';

const PlayerScreen = ({ navigation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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


  useEffect(() => {
    setIsPlaying(playbackState === TrackPlayer.STATE_PLAYING);
    setIsPaused(playbackState === TrackPlayer.STATE_PAUSED);
  }, [playbackState]);


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

  const pauseTrack = async () => {
    try {
      await TrackPlayer.pause();
    } catch (error) {
      console.error('Error pausing track:', error);
    }
  };

  const playTrack = async () => {
    try {
      await TrackPlayer.play();
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Bordertop />
      <Text style={styles.title}>Tone-y Music Player</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Online Audio URL"
        onChangeText={(text) => setOnlineUrl(text)}
        value={onlineUrl}
      />
      <TouchableOpacity style={styles.button} onPress={playOnlineTrack}>
        <Text style={styles.buttonText}> Load Online Track</Text>
      </TouchableOpacity>
      <View style={styles.logoContainer}>
      <Image source={logoImage} style={styles.logo} />
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.playButton} onPress={playTrack}>
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pauseButton} onPress={pauseTrack}>
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>
      </View>
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
    width: '70%', // Adjusted width
    padding: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: 'black',
    width: '45%', // Adjusted width
    padding: 10,
    marginVertical: 5,
    marginRight: '5%', // Added marginRight
  },
  pauseButton: {
    backgroundColor: 'black',
    width: '45%', // Adjusted width
    padding: 10,
    marginVertical: 5,
    marginLeft: '5%', // Added marginLeft
  },
  controls: {
    flexDirection: 'row', // Changed to row layout
    justifyContent: 'center', // Centered items horizontally
    width: '70%'
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
