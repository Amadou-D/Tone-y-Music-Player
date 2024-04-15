import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import PlayerControls from '../components/PlayerControls';
import { Bordertop } from '../components/Bordertop';
import DocumentPicker from 'react-native-document-picker';
import { useSelectedFile } from '../components/SelectedFileContext';

const LocalPlayerScreen: React.FC = () => {
  const [isTrackPlayerInitialized, setIsTrackPlayerInitialized] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const { selectedFile, setSelectedFile } = useSelectedFile();
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    requestStoragePermission();
    setupTrackPlayer();
    const trackChange = TrackPlayer.addEventListener('playback-track-changed', async (data) => {
        const track = await TrackPlayer.getTrack(data.nextTrack);
        setCurrentTrack(track);
    });

    return () => {
        trackChange.remove();
    };
  }, []);

  const setupTrackPlayer = async () => {
    if (!isTrackPlayerInitialized) {
      await TrackPlayer.setupPlayer();
      setIsTrackPlayerInitialized(true);
    }
  };

  const requestStoragePermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Permission Required',
        message: 'This application needs access to your storage to download music.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'No',
        buttonPositive: 'OK',
      },
    );
    console.log(granted === PermissionsAndroid.RESULTS.GRANTED ? 'We in' : 'We not in');
  };

  const addFileToPlaylist = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.audio],
      });
      if (res) {
        const newTrack = {
          id: res.uri,
          url: res.uri,
          title: res.name || 'Unknown Title',
          artist: '',
        };
        setPlaylist(oldPlaylist => [...oldPlaylist, newTrack]);
        setSelectedFile(res);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('File selection cancelled');
      } else {
        console.error('Error selecting file:', err);
      }
    }
  };

  const playPlaylist = async () => {
    if (!playlist.length) {
      alert('No tracks in the playlist');
      return;
    }
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add(playlist);
      await TrackPlayer.play();
    } catch (error) {
      console.error('Error playing playlist:', error);
    }
  };

  const skipToNext = async () => {
    try {
        await TrackPlayer.skipToNext();
    } catch (error) {
        console.error('Error skipping to next track:', error);
        alert('No more tracks in the playlist!');
        setCurrentTrack(null);
    }
  };

  return (
    <View style={styles.overlay}>
      <Bordertop />
      <TouchableOpacity style={styles.button} onPress={addFileToPlaylist}>
        <Text style={styles.buttonText}>Add to Playlist</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={playPlaylist}>
        <Text style={styles.buttonText}>Play Playlist</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={skipToNext}>
        <Text style={styles.buttonText}>Skip Next</Text>
      </TouchableOpacity>
      {currentTrack && (
          <View style={styles.currentTrackInfo}>
              <Text style={styles.trackDetails}>
                  Now Playing: {currentTrack.title} - {currentTrack.artist}
              </Text>
          </View>
      )}
      <PlayerControls/>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  currentTrackInfo: {
    marginTop: 10,
  },
  trackDetails: {
    fontSize: 16,
    color: '#fff',
  },
  albumArtPlaceholder: {
    width: 300,
    height: 300,
    backgroundColor: 'transparent',
    borderColor: '#000',
    borderWidth: 2,
    marginTop: 25,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LocalPlayerScreen;
