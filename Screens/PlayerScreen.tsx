// PlayerScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import TrackPlayer, { usePlaybackState } from 'react-native-track-player';

const PlayerScreen = ({ navigation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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

  const togglePlayback = async () => {
    try {
      const currentTrack = await TrackPlayer.getCurrentTrack();

      if (currentTrack) {
        // Player is already playing, pause the track
        await TrackPlayer.pause();
      } else {
        // Player is not playing, start playing the track
        await TrackPlayer.play();

        // If it was paused, resume from the current position
        const position = await TrackPlayer.getPosition();
        if (position > 0) {
          await TrackPlayer.seekTo(position);
        }
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
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
        {isPlaying ? (
          <Button
            style={styles.button}
            title="Pause"
            onPress={togglePlayback}
          />
        ) : (
          <Button
            style={styles.button}
            title="Play"
            onPress={togglePlayback}
          />
        )}
        {isPaused && (
          <Button
            style={styles.button}
            title="Resume"
            onPress={togglePlayback}
          />
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
