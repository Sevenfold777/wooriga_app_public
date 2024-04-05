import React from 'react';
import WebView from 'react-native-webview';
import ScreenLayout from '../../components/common/ScreenLayout';

export default function OperationPolicy() {
  return (
    <ScreenLayout>
      <WebView
        source={{uri: 'https://wool2ga.com/policy/op_policy/'}}
        bounces={false}
      />
    </ScreenLayout>
  );
}
