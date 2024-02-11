import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { PermissionsAndroid } from 'react-native';
import TrackPlayer from 'react-native-track-player'; 

const LocalPlayerScreen = ({ navigation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
  requestStoragePermission();
  TrackPlayer.setupPlayer().then(() => {
    console.log('TrackPlayer setup successfully.');
  }).catch(error => {
    console.error('Error setting up TrackPlayer:', error);
  });

  return async () => {
    await TrackPlayer.stop(); // Stop the player
    await TrackPlayer.remove('local_audio'); // Remove the current track
    console.log('TrackPlayer stopped and track removed successfully.');
  };
}, []);


  // request storage permission yada yada the permissions popup
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

  // select a file
  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.audio],
      });
      console.log('Selected File:', res);
      setSelectedFile(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('cancelled');
      } else {
        console.error('error', err);
      }
    }
  };

  // play  and pause
  const playFile = async () => {
    if (!selectedFile) {
      console.warn('NO FILE SELECTED');
      return;
    }
  
    try {
      if (isPlaying) {
        await TrackPlayer.pause();
        setIsPlaying(false);
      }
  
      // Reset the player to clear the current queue
      await TrackPlayer.reset();
  
      const track = {
        id: 'local_audio',
        url: selectedFile.uri,
        title: selectedFile.name,
        artist: '',
      };
  
      // Add the new track to the queue
      await TrackPlayer.add([track]);
  
      // Play the new track
      await TrackPlayer.play();
  
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing local audio:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Local Player Screen</Text>
      <Button title="Select File" onPress={selectFile} />
      {selectedFile && (
        <View>
          <Text style={styles.selectedFile}>Selected File: {selectedFile.name}</Text>
          <Button title={isPlaying ? 'Pause' : 'Play'} onPress={playFile} />
        </View>
      )}
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
  selectedFile: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default LocalPlayerScreen;
