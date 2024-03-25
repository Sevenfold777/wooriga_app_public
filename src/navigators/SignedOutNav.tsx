import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Auth/Login';
import SignUp from '../screens/Auth/SignUp';
import OperationPolicy from '../screens/Policy/OperationPolicy';
import PrivacyPolicy from '../screens/Policy/PrivacyPolicy';
import TermsOfUse from '../screens/Policy/TermsOfUse';
import {ROUTE_NAME} from '../Strings';
import {Platform} from 'react-native';
import {SignedOutParams} from './types';

/* create Stack Navigator */
const Stack = createStackNavigator<SignedOutParams>();

export default function SignedOutNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        // animation: 'default',
        headerTitleStyle: {fontFamily: 'nanum-bold'},
        headerTintColor: '#23222b',
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerTitleAlign: 'left',
        ...(Platform.OS === 'ios' && {
          // animationEnabled: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          gestureResponseDistance: 400,
        }),
      }}>
      <Stack.Screen
        name={'SignIn'}
        component={Login}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={'SignUp'}
        component={SignUp}
        options={{
          headerTitle: '회원가입',
        }}
      />

      <Stack.Screen
        name={'TermsOfUse'}
        component={TermsOfUse}
        options={{headerTitle: '이용약관'}}
      />

      <Stack.Screen
        name={'OperationPolicy'}
        component={OperationPolicy}
        options={{headerTitle: '운영정책'}}
      />

      <Stack.Screen
        name={'PrivacyPolicy'}
        component={PrivacyPolicy}
        options={{headerTitle: '개인정보처리방침'}}
      />
    </Stack.Navigator>
  );
}
