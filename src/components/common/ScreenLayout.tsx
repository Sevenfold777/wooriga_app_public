/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

type Props = {
  children: React.ReactNode;
  safeAreaColor?: string;
};

export default function ScreenLayout({children, safeAreaColor}: Props) {
  const route = useRoute();

  const mainTabScreens = [
    'Home',
    'LectureHome',
    'QuizHome',
    'InterviewHome',
    'MyPage',
  ];

  // for ios tab nav screens
  if (mainTabScreens.includes(route.name)) {
    return <View style={{flex: 1, backgroundColor: 'white'}}>{children}</View>;
  }

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{flex: 1, backgroundColor: safeAreaColor || 'white'}}>
      {children}
    </SafeAreaView>
  );
}

ScreenLayout.propTypes = {
  safeAreaColor: PropTypes.string,
};
