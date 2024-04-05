import React from 'react';
import {Alert, Text} from 'react-native';
import Menu from '../../components/myPage/Menu';
import ScreenLayout from '../../components/common/ScreenLayout';
import authStore from '../../stores/AuthStore';
import {ROUTE_NAME} from '../../Strings';
import {MenuContainer} from './MyPage';
import DeviceInfo from 'react-native-device-info';
import {MenuBar} from '../../components/myPage/Menu';
import {MenuTitle} from '../../components/myPage/Menu';
import {Colors} from '../../Config';
import {Ionicons} from '@expo/vector-icons';
import {RowContainer} from '../../components/common/Common';
import {openURL} from '../../helper';

export default function Settings({navigation, route: {params}}) {
  return (
    <ScreenLayout>
      <MenuContainer>
        <MenuBar
          onPress={() =>
            openURL(
              Platform.OS === 'android'
                ? 'https://play.google.com/store/apps/details?id=com.wooriga.appservice'
                : 'https://apps.apple.com/us/app/%EC%9A%B0%EB%A6%AC%EA%B0%80/id1665530266',
            )
          }>
          <RowContainer style={{flex: 1}}>
            <Text style={{fontFamily: 'nanum-regular', flex: 1}}>버전</Text>
            <Text style={{fontFamily: 'nanum-regular', marginRight: 10}}>
              {DeviceInfo.getVersion()}
            </Text>
          </RowContainer>
          <Ionicons
            name="chevron-forward"
            size={15}
            color={Colors.borderDark}
          />
        </MenuBar>

        <Menu
          payload="정보"
          action={() => navigation.navigate(ROUTE_NAME.INFOS)}
        />
        <Menu
          payload="1 : 1  문의"
          action={() => navigation.navigate(ROUTE_NAME.USER_INQUIRY_LIST)}
        />
        <Menu
          payload="알림 설정"
          action={() => navigation.navigate(ROUTE_NAME.PUSH_NOTIF_SETTINGS)}
        />
        <Menu
          payload="로그아웃"
          action={async () => {
            authStore.logoutAction();
          }}
        />
        <Menu
          payload="회원탈퇴"
          action={() => navigation.navigate(ROUTE_NAME.QUIT)}
        />
      </MenuContainer>
    </ScreenLayout>
  );
}
