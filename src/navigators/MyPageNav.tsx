import React from 'react';
import {
  MaterialTopTabBarProps,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import {Colors} from '../Config';
import LetterReceivedKept from '../screens/Letter/LetterReceivedKept';
import DailyEmotionsPast from '../screens/MyPage/DailyEmotionsPast';
import EditFamilyProfile from '../screens/MyPage/EditFamilyProfile';
import EditMyProfile from '../screens/MyPage/EditMyProfile';
import FamilyPage from '../screens/MyPage/FamilyPage';
import Infos from '../screens/MyPage/Infos';
import MyPage from '../screens/MyPage/MyPage';
import PushNofitSettings from '../screens/MyPage/PushNotifSettings';
import Quit from '../screens/MyPage/Quit';
import Settings from '../screens/MyPage/Settings';
import PhotosMy from '../screens/Photo/PhotosMy';
import OpenSourceLicense from '../screens/Policy/OpenSourceLicense';
import OpenSourceLicensePayload from '../screens/Policy/OpenSourceLicensePayload';
import MessageKeep from '../screens/Message/Family/MessageKeep';
import {Platform} from 'react-native';
import {MyPageParams, SignedInParams} from './types';

const Tab = createMaterialTopTabNavigator<MyPageParams>();
const Stack = createStackNavigator<SignedInParams>();

export default function MyPageNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerTintColor: '#23222b',
        // animation: 'none',
        headerTitleStyle: {fontFamily: 'nanum-bold'},
        headerTitleAlign: 'left',
        ...(Platform.OS === 'ios' && {
          // animationEnabled: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          gestureResponseDistance: 400,
        }),
      }}>
      <Stack.Screen name={'MyPageNav'} options={{headerShown: false}}>
        {() => (
          <SafeAreaProvider>
            <SafeAreaView style={{backgroundColor: 'white'}} />
            <Tab.Navigator
              tabBar={props => <TabBar {...props} />}
              screenOptions={{
                swipeEnabled: true,
                headerTitleStyle: {fontFamily: 'nanum-bold'},
              }}>
              <Tab.Screen name={'FamilyPage'} component={FamilyPage} />
              <Tab.Screen name={'MyPage'} component={MyPage} />
            </Tab.Navigator>
          </SafeAreaProvider>
        )}
      </Stack.Screen>

      <Stack.Screen
        name={'EditMyProfile'}
        component={EditMyProfile}
        options={{headerTitle: '내 정보 보기'}}
      />

      <Stack.Screen
        name={'EditFamilyProfile'}
        component={EditFamilyProfile}
        options={{headerTitle: '가족 이름 변경'}}
      />

      <Stack.Screen
        name={'DailyEmotionsPast'}
        component={DailyEmotionsPast}
        options={{
          headerTitle: '그날의 우리가',
          ...(Platform.OS === 'ios' && {
            gestureResponseDistance: 200,
          }),
        }}
      />

      <Stack.Screen
        name={'PhotosMy'}
        component={PhotosMy}
        options={{headerTitle: '업로드한 사진'}}
      />

      <Stack.Screen
        name={'MessageKeep'}
        component={MessageKeep}
        options={{headerTitle: '이야기 보관함'}}
      />

      <Stack.Screen
        name={'LetterReceivedKept'}
        component={LetterReceivedKept}
        options={{headerTitle: '편지 보관함'}}
      />

      <Stack.Screen
        name={'Settings'}
        component={Settings}
        options={{headerTitle: '설정'}}
      />

      <Stack.Screen
        name={'Infos'}
        component={Infos}
        options={{headerTitle: '정보'}}
      />

      <Stack.Screen
        name={'OpenSourceLicense'}
        component={OpenSourceLicense}
        options={{headerTitle: '오픈소스라이센스'}}
      />

      <Stack.Screen
        name={'OpenSourceLicensePayload'}
        component={OpenSourceLicensePayload}
        options={{headerTitle: '오픈소스라이센스'}}
      />

      <Stack.Screen
        name={'PushNotifSettings'}
        component={PushNofitSettings}
        options={{headerTitle: '알림 설정'}}
      />

      <Stack.Screen
        name={'Quit'}
        component={Quit}
        options={{headerTitle: '회원탈퇴'}}
      />
    </Stack.Navigator>
  );
}

/** Toggle Tabbar Config */

const Container = styled.View`
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 10px 0px;
`;

const TabWrapper = styled.View`
  flex-direction: row;
  display: flex;
  align-items: center;
  border-radius: 30px;
  background-color: ${Colors.borderLight};
`;

const TabButton = styled.TouchableOpacity<{isFocused: boolean}>`
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0px 16px;
  border-radius: 30px;
  background-color: ${props => (props.isFocused ? Colors.main : 'transparent')};
`;

const TabText = styled.Text<{isFocused: boolean}>`
  font-family: 'nanum-bold';
  color: ${props => (props.isFocused ? Colors.white : Colors.black)};
`;

export function TabBar({
  state,
  descriptors,
  navigation,
}: MaterialTopTabBarProps) {
  const label = {
    MyPage: '내 프로필',
    FamilyPage: '우리 가족',
    LetterBoxSent: '보낸 편지함',
    LetterBoxReceived: '받은 편지함',
    TimeCapsuleSent: '보낸 타임캡슐',
    TimeCapsuleReceivd: '받은 타임캡슐',
  };

  return (
    <Container>
      <TabWrapper>
        {state.routes.map((route, index) => {
          const title = label[route.name];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          return (
            <TabButton
              isFocused={isFocused}
              onPress={onPress}
              key={`tab_${index}`}>
              <TabText isFocused={isFocused}>{title}</TabText>
            </TabButton>
          );
        })}
      </TabWrapper>
    </Container>
  );
}
