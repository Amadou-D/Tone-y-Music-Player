import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import DocumentPicker from 'react-native-document-picker';

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setupTrackPlayer();
  }, []);

  const setupTrackPlayer = async () => {
    await TrackPlayer.setupPlayer();
  };

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });

      await TrackPlayer.add({
        id: 'track1',
        url: result.uri,
        title: 'Sample Track',
        artist: 'Sample Artist',
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        throw err;
      }
    }
  };

  const togglePlayback = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
    setIsPlaying(!isPlaying);
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
