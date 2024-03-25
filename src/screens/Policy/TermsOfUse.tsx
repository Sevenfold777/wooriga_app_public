import React from 'react';
import WebView from 'react-native-webview';
import ScreenLayout from '../../components/ScreenLayout';

export default function TermsOfUse() {
  return (
    <ScreenLayout>
      <WebView
        source={{uri: 'https://wool2ga.com/policy/terms_of_use/'}}
        bounces={false}
      />
    </ScreenLayout>
  );
}
