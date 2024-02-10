// PlayerScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import TrackPlayer, { usePlaybackState } from 'react-native-track-player';

const PlayerScreen = ({ navigation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [onlineUrl, setOnlineUrl] = useState('');
  const playbackState = usePlaybackState();

  useEffect(() => {
    const setupTrackPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer();
        console.log('TrackPlayer setup successfully.');
      } catch (error) {
        console.error('Error setting up TrackPlayer:', error);
      }
    };

    setupTrackPlayer();
  }, []);

  useEffect(() => {
    console.log('Playback State:', playbackState);
    setIsPlaying(playbackState === TrackPlayer.STATE_PLAYING);
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

      setIsPlaying(true);
    } catch (err) {
      console.error('Error playing online audio:', err);
    }
  };

  const togglePlayback = async () => {
    try {
      if (isPlaying) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const pausePlayback = async () => {
    try {
      await TrackPlayer.pause();
      setIsPlaying(false);
    } catch (error) {
      console.error('Error pausing playback:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Music Player App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Online Audio URL"
        onChangeText={(text) => setOnlineUrl(text)}
        value={onlineUrl}
      />
      <Button style={styles.button} title="Play Online Track" onPress={playOnlineTrack} />
      <View style={styles.controls}>
        <Button
          style={styles.button}
          title={isPlaying ? 'Pause' : 'Play'}
          onPress={togglePlayback}
        />
        {isPlaying && (
          <Button style={styles.button} title="Pause" onPress={pausePlayback} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    padding: 5,
    width: '100%',
  },
  button: {
    marginVertical: 10,
    width: '100%',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default PlayerScreen;
