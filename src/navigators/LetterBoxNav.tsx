import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import LetterBoxReceived from '../screens/Letter/LetterBoxReceived';
import LetterBoxSent from '../screens/Letter/LetterBoxSent';
import {ROUTE_NAME} from '../Strings';
import {TabBar} from './MyPageNav';
import {LetterBoxParams} from './types';

const Tab = createMaterialTopTabNavigator<LetterBoxParams>();

export default function LetterBoxNav() {
  return (
    <Tab.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        swipeEnabled: true,
        headerTitleStyle: {fontFamily: 'nanum-bold'},
      }}>
      <Tab.Screen name={'LetterBoxReceived'} component={LetterBoxReceived} />
      <Tab.Screen name={'LetterBoxSent'} component={LetterBoxSent} />
    </Tab.Navigator>
  );
}
