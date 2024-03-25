import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {TabBar} from './MyPageNav';
import TimeCapsulesReceived from '../screens/Letter/TimeCapsulesReceived';
import TimeCapsulesSent from '../screens/Letter/TimeCapsulesSent';
import {TimeCapsuleParams} from './types';

const Tab = createMaterialTopTabNavigator<TimeCapsuleParams>();

export default function TimeCapsulesNav() {
  return (
    <Tab.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        swipeEnabled: true,
        headerTitleStyle: {fontFamily: 'nanum-bold'},
      }}>
      <Tab.Screen
        name={'TimeCapsuleReceivd'}
        component={TimeCapsulesReceived}
      />
      <Tab.Screen name={'TimeCapsuleSent'} component={TimeCapsulesSent} />
    </Tab.Navigator>
  );
}
