/**
 * @format
 */

import {AppRegistry, Text, TextInput} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

// disallow font scaling by Device Preferences
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.maxFontSizeMultiplier = 1.25;
// Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.maxFontSizeMultiplier = 1.25;
// TextInput.defaultProps.allowFontScaling = false;

messaging().setBackgroundMessageHandler(async remoteMessage => {
  //  remoteMessage.data로 메세지에 접근가능
  //  remoteMessage.from 으로 topic name 또는 message identifier
  //  remoteMessage.messageId 는 메시지 고유값 id
  //  remoteMessage.notification 메시지와 함께 보내진 추가 데이터
  //  remoteMessage.sentTime 보낸시간
  // console.log("Message handled in the background!", remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
