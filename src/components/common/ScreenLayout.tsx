import {useRoute} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

export const ActivityIndicatorWrapper = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: center;
  align-items: center;
`;

type Props = {
  children?: React.ReactNode;
  safeAreaColor?: string;
};

export default function ScreenLayout({children, safeAreaColor}: Props) {
  const TabNavRoutes = [
    'MessageHome',
    'PhotoHome',
    'LetterHome',
    'FamilyPediaHome',
    'MyPageNavHome',
  ];
  const route = useRoute();

  if (TabNavRoutes.includes(route.name)) {
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
