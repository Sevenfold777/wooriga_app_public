import React, {useEffect} from 'react';
import {Image, ScrollView, useWindowDimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import WebView from 'react-native-webview';

import ScreenLayout from '../components/common/ScreenLayout';
import {Colors} from '../Config';
import {SignedInScreenProps} from '../navigators/types';

export default function BannersPayload({
  navigation,
  route: {params},
}: SignedInScreenProps<'BannersPayload'>) {
  const url = params?.url;

  useEffect(() => {
    navigation.setOptions({headerTitle: params?.title || '공지'});
  }, []);

  if (!url) {
    return <ScreenLayout />;
  }

  return (
    <ScreenLayout>
      <WebView
        source={{uri: url}}
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: Colors.borderLight}}
      />
    </ScreenLayout>
  );
}
