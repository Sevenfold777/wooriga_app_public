import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabIcon from '../components/nav/TabIcon';
import {Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import MyPageNav from './MyPageNav';
import PhotoHome from '../screens/Photo/PhotoHome';
import MessageHome from '../screens/Message/Family/MessageHome';
import {ROUTE_NAME} from '../Strings';
import FamilyPediaHome from '../screens/FamilyPedia/FamilyPediaHome';
import LetterHome from '../screens/Letter/LetterHome';
import {Colors} from '../Config';
import Test from '../screens/Test';
import {MainTabParams} from './types';

const Tab = createBottomTabNavigator<MainTabParams>();

export default function MainTabNav() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerTitleAlign: 'left',
        headerShadowVisible: false,
        headerTitleStyle: {fontFamily: 'nanum-bold'},
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        name={'MessageHome'}
        component={MessageHome}
        options={({navigation}) => ({
          // headerTitle: "메세지",
          headerTitle: '오늘의 우리가',
          tabBarIcon: ({focused}) => (
            <TabIcon iconName="chatbubbles" isFocused={focused} />
          ),
        })}
      />

      <Tab.Screen
        name={'PhotoHome'}
        component={PhotoHome}
        options={({navigation}) => ({
          headerTitle: '가족앨범',
          tabBarIcon: ({focused}) => (
            <TabIcon iconName="images" isFocused={focused} />
          ),
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons
                name="add"
                size={24}
                style={{paddingRight: 15, paddingLeft: 7}}
                onPress={() => {
                  navigation.navigate(ROUTE_NAME.PHOTO_SELECT);
                }}
              />
            </TouchableOpacity>
          ),
        })}
      />

      <Tab.Screen
        name={'LetterHome'}
        component={LetterHome}
        options={({navigation}) => ({
          headerTitle: '편지',
          tabBarIcon: ({focused}) => (
            <TabIcon iconName="mail" isFocused={focused} />
          ),
        })}
      />

      <Tab.Screen
        name={'FamilyPediaHome'}
        component={FamilyPediaHome}
        options={{
          headerTitle: '인물사전',
          // headerShown: false,
          tabBarIcon: ({focused}) => (
            // <TabIcon iconName="file-tray-full" isFocused={focused} />
            <TabIcon iconName="newspaper" isFocused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name={'MyPageNav'}
        component={MyPageNav}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon iconName="person" isFocused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
