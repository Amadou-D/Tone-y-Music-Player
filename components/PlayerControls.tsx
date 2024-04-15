import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PanResponder } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlay, faPause, faCircle } from '@fortawesome/free-solid-svg-icons';
import TrackPlayer, { State } from 'react-native-track-player';
import { useSelectedFile } from './SelectedFileContext';

const PlayerControls: React.FC = () => {
  const { selectedFile } = useSelectedFile();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [timelineWidth, setTimelineWidth] = useState(0);  // Store timeline width

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const newPosition = (evt.nativeEvent.locationX / timelineWidth) * duration;
      TrackPlayer.seekTo(newPosition);
    },
    onPanResponderMove: (evt) => {
      const newPosition = (evt.nativeEvent.locationX / timelineWidth) * duration;
      TrackPlayer.seekTo(newPosition);
    }
  });

  useEffect(() => {
    const fetchProgress = async () => {
      const playbackState = await TrackPlayer.getState();
      setIsPlaying(playbackState === State.Playing);

      const currentProgress = await TrackPlayer.getPosition();
      const currentDuration = await TrackPlayer.getDuration();

      setProgress(currentProgress);
      setDuration(currentDuration);
    };

    fetchProgress();
    const progressInterval = setInterval(fetchProgress, 1000);
    return () => clearInterval(progressInterval);
  }, []);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
  };

  const playPauseToggle = async () => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.songTitle}>{selectedFile ? selectedFile.name : 'No Song Selected'}</Text>
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={playPauseToggle} style={styles.playPauseButton}>
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} color="#fff" size={28} />
        </TouchableOpacity>
        <View 
          style={styles.timelineContainer}
          onLayout={(event) => setTimelineWidth(event.nativeEvent.layout.width)}
          {...panResponder.panHandlers}>
          <View style={[styles.timelineBar, { width: `${(progress / duration) * 100}%` }]} />
          <View
            style={[styles.timelineKnob, { left: `${(progress / duration) * 100}%` }]}
          >
            <FontAwesomeIcon icon={faCircle} color="#fff" />
          </View>
        </View>
        <Text style={styles.timeDisplay}>{formatTime(progress)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: '25%',
    left: 10,
    right: 10,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  songTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  playPauseButton: {
    marginHorizontal: 10,
  },
  timelineContainer: {
    flex: 1,
    height: 2,
    marginHorizontal: 10,
    backgroundColor: '#3d3d3d',
  },
  timelineBar: {
    height: 2,
    backgroundColor: '#fff',
  },
  timelineKnob: {
    position: 'absolute',
    top: -6,
  },
  timeDisplay: {
    marginHorizontal: 10,
    color: '#fff',
  },
});

export default PlayerControls;
