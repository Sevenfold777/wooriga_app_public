import React from 'react';
import WebView from 'react-native-webview';
import ScreenLayout from '../../components/ScreenLayout';

export default function PrivacyPolicy() {
  return (
    <ScreenLayout>
      <WebView
        source={{uri: 'https://wool2ga.com/policy/privacy_policy/'}}
        bounces={false}
      />
    </ScreenLayout>
  );
}
