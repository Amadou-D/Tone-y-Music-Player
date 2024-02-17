import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import TrackPlayer, { Event, usePlaybackState } from 'react-native-track-player';
import { Bordertop } from '../components/Bordertop';
import PlayerControls from '../components/PlayerControls';

const PlayerScreen = ({ navigation }) => {
  const [onlineUrl, setOnlineUrl] = useState('');
  const [trackLoaded, setTrackLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const playbackState = usePlaybackState();

  useEffect(() => {
    const setupTrackPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer();
        console.log('TrackPlayer setup successfully.');
        TrackPlayer.addEventListener(Event.PlaybackState, handlePlaybackState);
        TrackPlayer.addEventListener(Event.Progress, handleProgress);
      } catch (error) {
        console.error('Error setting up TrackPlayer:', error);
      }
    };

    setupTrackPlayer();

    return () => {
      TrackPlayer.destroy();
    };
  }, []);

  const handlePlaybackState = async () => {
    // Handle playback state changes if needed
  };

  const handleProgress = ({ position, duration }) => {
    setTrackProgress(position);
  };

  const playOrPause = useCallback(async () => {
    try {
      if (!onlineUrl || loading) {
        console.warn('Invalid online audio URL or already loading');
        return;
      }

      if (playbackState === TrackPlayer.STATE_PLAYING) {
        await TrackPlayer.pause();
      } else {
        if (trackLoaded) {
          await TrackPlayer.play();
        } else {
          setLoading(true);
          await TrackPlayer.reset();
          await TrackPlayer.add({
            id: 'track1',
            url: onlineUrl,
            title: 'Online Track',
            artist: 'Artist Name',
          });

          await TrackPlayer.play();
          setTrackLoaded(true);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  }, [onlineUrl, loading, playbackState, trackLoaded]);

  return (
    <View style={styles.container}>
      <Bordertop />
      <Text style={styles.title}>Tone-y Music Player</Text>

      <View style={styles.logoContainer}>
        <Image source={{ uri: 'https://i.ibb.co/8XvtKYj/toney.png' }} style={styles.logo} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter Online Audio URL"
        onChangeText={(text) => setOnlineUrl(text)}
        value={onlineUrl}
        editable={!loading && !trackLoaded}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={playOrPause}
        disabled={loading || trackLoaded}>
        <Text style={styles.buttonText}>
          {loading ? 'Loading...' : trackLoaded ? 'Track Loaded' : 'Load Online Track'}
        </Text>
      </TouchableOpacity>

      {/* Integrate PlayerControls component */}
      {trackLoaded && (
        <PlayerControls
          isPlaying={playbackState === TrackPlayer.STATE_PLAYING}
          selectedFile={null} // Assuming selectedFile is not used for online tracks
          progress={trackProgress}
          duration={0} // Set duration as needed
          onPlayPause={playOrPause}
          onSeek={(value) => {
            // You can handle seeking logic here if needed for online tracks
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
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
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playPauseButton: {
    marginHorizontal: 10,
  },
  timelineContainer: {
    flex: 1,
    height: 2,
    marginHorizontal: 10,
    backgroundColor: '#3d3d3d',
    flexDirection: 'row',
  },
  timelineBar: {
    height: 2,
    backgroundColor: '#fff',
    flex: 1,
  },
  timelineProgress: {
    height: 2,
    backgroundColor: '#008080',
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
