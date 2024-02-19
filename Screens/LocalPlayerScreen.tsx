import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native'; // Import Image component
import { PermissionsAndroid } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import PlayerControls from '../components/PlayerControls';
import { Bordertop } from '../components/Bordertop'; 
import DocumentPicker from 'react-native-document-picker';
import { useSelectedFile } from '../components/SelectedFileContext';
import { State } from 'react-native-track-player';


const LocalPlayerScreen: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const { selectedFile, setSelectedFile } = useSelectedFile();
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

  useEffect(() => {
    requestStoragePermission();

    TrackPlayer.setupPlayer().then(() => {
      console.log('TrackPlayer setup successfully.');
      }).catch(error => {
          console.error('Error setting up TrackPlayer:', error);
      });

  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      const position = await TrackPlayer.getPosition();
      const duration = await TrackPlayer.getDuration();
      const playbackState = await TrackPlayer.getState();
      setProgress(position);
      setDuration(duration);
      setIsPlaying(playbackState === State.Playing);
    };
    
    fetchProgress();

    // fetch progress in song timeline
    const progressInterval = setInterval(fetchProgress, 1000);
    return () => clearInterval(progressInterval);
  }, []);

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'PERMISSION REQUIRED',
          message: 'LET US LOOK',
          buttonNeutral: 'MAYBE',
          buttonNegative: 'NO',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('WE IN');
      } else {
        console.log('WE NOT IN');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  
  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.audio],
      });
  
      if (isPlaying) {
        await TrackPlayer.pause();
        setIsPlaying(false);
      }
  
      await TrackPlayer.reset(); // Clear the current queue
  
      const title = res.name || 'Unknown Title'; // Provide a default title if res.name is null
      const track = {
        id: 'local_audio',
        url: res.uri,
        title: title,
        artist: '',
      };
  
      await TrackPlayer.add([track]);
  
      setSelectedFile(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('cancelled');
      } else {
        console.error('error', err);
      }
    }
  };
  

  const playFile = async () => {
    if (!selectedFile) {
      console.warn('NO FILE SELECTED');
      return;
    }

    if (isPlaying) {
      await TrackPlayer.pause();
      setIsPlaying(false);
    } else {
      const track = {
        id: 'local_audio',
        url: selectedFile.uri,
        title: selectedFile.name,
        artist: '',
      };

      await TrackPlayer.add([track]);
      await TrackPlayer.play();

      setIsPlaying(true);
    }
  };

  const swapTrack = () => {
    selectFile();
  };

  // need to implement seeking within the track
  const handleSeek = async (value) => {
    await TrackPlayer.seekTo(value);
  };
  
  return (
    <View style={styles.overlay}>
      <Bordertop/>
    <TouchableOpacity style={styles.button} onPress={selectFile}>
      <Text style={styles.buttonText}>SELECT FILE</Text>
    </TouchableOpacity>
      <View style={styles.albumArtPlaceholder} />
      <PlayerControls
        isPlaying={isPlaying}
        selectedFile={selectedFile}
        progress={progress}
        duration={duration}
        onPlayPause={playFile}
        onSeek={handleSeek}
      />
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
