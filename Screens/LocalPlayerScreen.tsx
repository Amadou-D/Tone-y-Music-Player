import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native'; // Import Image component
import { PermissionsAndroid } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import PlayerControls from '../components/PlayerControls';
import { Bordertop } from '../components/Bordertop'; 
import DocumentPicker from 'react-native-document-picker';
import { useSelectedFile } from '../components/SelectedFileContext';


const LocalPlayerScreen: React.FC = () => {
    const [isTrackPlayerInitialized, setIsTrackPlayerInitialized] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const { selectedFile, setSelectedFile } = useSelectedFile();

  useEffect(() => {
    requestStoragePermission();

    if (!isTrackPlayerInitialized) {
      setupTrackPlayer();
      setIsTrackPlayerInitialized(true);
    }
  }, [isTrackPlayerInitialized]);


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
  
  
  const setupTrackPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      console.log('TrackPlayer setup successfully.');
    } catch (error) {
      console.error('Error setting up TrackPlayer:', error);
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

  return (
    <View style={styles.overlay}>
      <Bordertop />
      <TouchableOpacity style={styles.button} onPress={selectFile}>
        <Text style={styles.buttonText}>SELECT FILE</Text>
      </TouchableOpacity>
      <View style={styles.albumArtPlaceholder} />
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
