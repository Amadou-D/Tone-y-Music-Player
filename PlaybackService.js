// PlaybackService.js
import TrackPlayer from 'react-native-track-player';
import { Event } from 'react-native-track-player';

export default async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  // Add more event listeners as needed

  // Additional configuration and event listeners can be added here

  // This is required to start the service
  TrackPlayer.updateOptions({
    stopWithApp: true,
  });
}
