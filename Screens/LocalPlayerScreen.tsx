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
    // reusing amadous initialization
    TrackPlayer.setupPlayer().then(() => {
      console.log('TrackPlayer setup successfully.');
    }).catch(error => {
      console.error('Error setting up TrackPlayer:', error);
    });

    // destroy the current track when new song is selected, currently not working [find a working method]
    return () => {
      TrackPlayer.destroy();
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

    if (isPlaying) {
      await TrackPlayer.pause();
      setIsPlaying(false);
    } else {
      // track details for ui to display. not implemented yet
      const track = {
        id: 'local_audio',
        url: selectedFile.uri, //local location
        title: selectedFile.name,
        artist: '', // need to read the artists' metadeta, not implemented yet
      };

      // add to queue, not implemented yet
      await TrackPlayer.add([track]);

      // play track
      await TrackPlayer.play();

      // update song playing state
      setIsPlaying(true);
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
