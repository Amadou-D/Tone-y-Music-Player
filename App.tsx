import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import TrackPlayer from 'react-native-track-player';

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setupTrackPlayer();
  }, []);

  const setupTrackPlayer = async () => {
    try {
      // Attempt to check if TrackPlayer is ready
      await TrackPlayer.setupPlayer();
      console.log('TrackPlayer setup successfully.');
    } catch (error) {
      console.error('Error setting up TrackPlayer:', error);
    }
  };

  const pickAudio = async () => {
    try {
      await TrackPlayer.add({
        id: 'track1',
        url: require('./files/Willpower.mp3'), // Adjust the path accordingly
        title: 'Willpower',
        artist: 'Artist Name',
      });

      setIsPlaying(false);
    } catch (err) {
      console.error('Error picking audio:', err);
    }
  };

  const togglePlayback = async () => {
    try {
      if (isPlaying) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }

      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Music Player App</Text>
      <Button title="Pick Audio" onPress={pickAudio} />
      <Button title={isPlaying ? 'Pause' : 'Play'} onPress={togglePlayback} />
    </View>
  );
};

export default App;
