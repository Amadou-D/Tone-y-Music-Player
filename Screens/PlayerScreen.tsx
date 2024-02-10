import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
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

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Music Player App</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, padding: 5 }}
        placeholder="Enter Online Audio URL"
        onChangeText={(text) => setOnlineUrl(text)}
        value={onlineUrl}
      />
      <Button title="Play Online Track" onPress={playOnlineTrack} />
      <Button title={isPlaying ? 'Pause' : 'Play'} onPress={togglePlayback} />
    </View>
  );
};

export default PlayerScreen;
