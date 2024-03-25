import React from 'react';
import MainTabNav from './MainTabNav';
import BannersPayload from '../screens/BannersPayload';
import ChangeNickname from '../screens/ChangeNickname';
import FamilyPediaMember from '../screens/FamilyPedia/FamilyPediaMember';
import {createStackNavigator} from '@react-navigation/stack';
import FamilyJoin from '../screens/FamilyJoin';
import {Platform, Text, TouchableOpacity} from 'react-native';
import SelectProfilePhoto from '../screens/FamilyPedia/SelectProfilePhoto';
import Report from '../screens/Report';
import TermsOfUse from '../screens/Policy/TermsOfUse';
import OperationPolicy from '../screens/Policy/OperationPolicy';
import PrivacyPolicy from '../screens/Policy/PrivacyPolicy';
import {Ionicons} from '@expo/vector-icons';
import MessageFamily from '../screens/Message/Family/MessageFamily';
import MessageSend from '../screens/Message/Family/MessageSend';
import PhotoSelect from '../screens/Photo/PhotoSelect';
import PhotoUpload from '../screens/Photo/PhotoUpload';
import Notifications from '../screens/Home/Notifications';
import {Photo} from '../screens/Photo/Photo';
import PhotoComments from '../screens/Photo/PhotoComments';
import MessagePast from '../screens/Message/Family/MessagePast';
import {ROUTE_NAME} from '../Strings';
import {Colors} from '../Config';
import UserInquirySend from '../screens/UserInquiry/UserInquirySend';
import UserInquiryList from '../screens/UserInquiry/UserInquiryList';
import UserInquiry from '../screens/UserInquiry/UserInquiry';
import LetterSend from '../screens/Letter/LetterSend';
import LetterCompleted from '../screens/Letter/LetterCompleted';
import LetterSent from '../screens/Letter/LetterSent';
import LetterReceived from '../screens/Letter/LetterReceived';
import LetterBoxNav from './LetterBoxNav';
import TimeCapsulesNav from './TimeCapsulesNav';
import {SignedInParams} from './types';

const Stack = createStackNavigator<SignedInParams>();

export default function SignedInNav({}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerTintColor: '#23222b',
        headerTitleStyle: {fontFamily: 'nanum-bold'},
        headerTitleAlign: 'left',
        ...(Platform.OS === 'ios' && {
          // animationEnabled: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          gestureResponseDistance: 400,
          gestureVelocityImpact: 1,
        }),
      }}
      // initialRouteName={initialRoute}
    >
      <Stack.Screen
        name={'MainTabNav'}
        component={MainTabNav}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={'MessageFamily'}
        component={MessageFamily}
        options={({}) => ({
          //headerTitle: "오늘의 이야기",
          headerTitle: '오늘의 이야기',
          // presentation: "transparentModal",
          animation: 'fade_from_bottom',
        })}
      />
      <Stack.Screen
        name={'MessageSend'}
        component={MessageSend}
        options={{
          headerTitle: '이야기 보내기',
          // animation: 'slide_from_right',
          ...(Platform.OS === 'ios' && {gestureResponseDistance: 200}),
        }}
      />
      <Stack.Screen
        name={'PhotoSelect'}
        component={PhotoSelect}
        options={() => ({
          headerTitle: '사진 선택',
          animation: 'slide_from_right',
          ...(Platform.OS === 'ios' && {gestureResponseDistance: 150}),
          // headerRight은 Screen에서
        })}
      />

      <Stack.Screen
        name={'PhotoUpload'}
        component={PhotoUpload}
        options={{
          headerTitle: '사진 업로드',
          // animation: 'slide_from_right',
          // headerRight은 Screen에서
        }}
      />

      <Stack.Screen name={'BannersPayload'} component={BannersPayload} />

      <Stack.Screen
        name={'Photo'}
        component={Photo}
        options={{headerTitle: '가족앨범'}}
      />
      <Stack.Screen
        name={'PhotoComments'}
        component={PhotoComments}
        options={{headerTitle: '가족앨범'}}
      />

      <Stack.Screen
        name={'MessagePast'}
        component={MessagePast}
        options={{headerTitle: '지난 이야기'}}
      />

      <Stack.Screen
        name={'ChangeNickname'}
        component={ChangeNickname}
        options={{headerTitle: '가족 이름 변경'}}
      />
      <Stack.Screen
        name={'Notifications'}
        component={Notifications}
        options={{headerTitle: '알림'}}
      />

      <Stack.Screen
        name={'FamilyJoin'}
        component={FamilyJoin}
        options={{headerTitle: '가족가입'}}
      />

      <Stack.Screen
        name={'FamilyPediaMember'}
        component={FamilyPediaMember}
        options={{
          headerTitle: '인물사전',
          // animation: 'slide_from_right',
        }}
      />

      <Stack.Screen
        name={'FamilyPediaSelectPhoto'}
        component={SelectProfilePhoto}
        options={{
          headerTitle: '사진 선택',
          // animation: 'slide_from_right',
          ...(Platform.OS === 'ios' && {gestureResponseDistance: 150}),
        }}
      />

      <Stack.Screen
        name={'Report'}
        component={Report}
        options={{headerTitle: '신고하기'}}
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

      <Stack.Screen
        name={'UserInquirySend'}
        component={UserInquirySend}
        options={{headerTitle: '1 : 1 문의 작성'}}
      />

      <Stack.Screen
        name={'UserInquiryList'}
        component={UserInquiryList}
        options={{headerTitle: '1 : 1 문의 사항'}}
      />

      <Stack.Screen
        name={'UserInquiry'}
        component={UserInquiry}
        options={{headerTitle: '1 : 1 문의 사항'}}
      />

      <Stack.Screen
        name={'LetterSend'}
        component={LetterSend}
        options={{
          headerTitle: '편지 보내기',
          ...(Platform.OS === 'ios' && {gestureResponseDistance: 150}),
        }}
      />

      <Stack.Screen
        name={'LetterCompleted'}
        component={LetterCompleted}
        options={{headerTitle: '편지 보내기'}}
      />

      <Stack.Screen
        name={'LetterReceived'}
        component={LetterReceived}
        options={{headerTitle: '받은 편지'}}
      />

      <Stack.Screen
        name={'LetterSent'}
        component={LetterSent}
        options={{headerTitle: '보낸 편지'}}
      />

      <Stack.Screen
        name={'LetterBoxNav'}
        component={LetterBoxNav}
        options={({navigation}) => ({
          headerTitle: '편지',

          headerRight: () => (
            <TouchableOpacity
              style={{
                backgroundColor: Colors.main,
                padding: 8,
                borderRadius: 5,
                marginHorizontal: 15,
              }}
              onPress={() => navigation.navigate(ROUTE_NAME.LETTER_SEND)}>
              <Text style={{color: 'white', fontFamily: 'nanum-regular'}}>
                보내기
              </Text>
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name={'TimeCapsulesNav'}
        component={TimeCapsulesNav}
        options={({navigation}) => ({
          headerTitle: '타임캡슐',

          headerRight: () => (
            <TouchableOpacity
              style={{
                backgroundColor: Colors.main,
                padding: 8,
                borderRadius: 5,
                marginHorizontal: 15,
              }}
              onPress={() => navigation.navigate(ROUTE_NAME.LETTER_SEND)}>
              <Text style={{color: 'white', fontFamily: 'nanum-regular'}}>
                보내기
              </Text>
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
