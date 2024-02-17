// index.js or App.js
import { AppRegistry } from 'react-native';
import App from './App'; // Your main component
import PlaybackService from './PlaybackService'; // Path to your PlaybackService file
import { name as appName } from './app.json';
import TrackPlayer from 'react-native-track-player';

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => PlaybackService);
