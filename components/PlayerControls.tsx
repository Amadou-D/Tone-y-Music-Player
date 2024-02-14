import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay';
import { faPause } from '@fortawesome/free-solid-svg-icons/faPause';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';

interface PlayerControlsProps {
  isPlaying: boolean;
  selectedFile: any;
  progress: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (value: number) => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  selectedFile,
  progress,
  duration,
  onPlayPause,
  onSeek,
}) => {
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
  };

  return (
    <>
      {selectedFile && (
        <View style={styles.container}>
          <View style={styles.controlsContainer}>
            <TouchableOpacity onPress={onPlayPause} style={styles.playPauseButton}>
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} color="#fff" size={28}/>
            </TouchableOpacity>
            <View style={styles.timelineContainer}>
              <View style={[styles.timelineBar, { width: `${(progress / duration) * 100}%` }]} />
              <TouchableOpacity
                style={[styles.timelineKnob, { left: `${(progress / duration) * 100}%` }]}
                onPress={(event) => onSeek((event.nativeEvent.locationX / event.currentTarget.offsetWidth) * duration)}
              >
                <FontAwesomeIcon icon={faCircle} color="#fff"/>
              </TouchableOpacity>
            </View>
            <Text>{formatTime(progress)}</Text>
          </View>
        </View>
      )}
    </>
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
  
});

export default PlayerControls;
