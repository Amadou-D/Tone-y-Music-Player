import { AppRegistry } from 'react-native';
import App from './App'; 
import { name as appName } from './app.json';
import TrackPlayer from 'react-native-track-player';
import PlaybackService from './PlaybackService';

AppRegistry.registerComponent(appName, () => App);

TrackPlayer.registerPlaybackService(() => require('./PlaybackService'));
