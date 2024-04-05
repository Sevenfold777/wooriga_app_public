import {useMutation, useQuery} from '@tanstack/react-query';
import React, {useState} from 'react';
import styled from 'styled-components/native';
import DailyEmotion from '../../components/DailyEmotion';
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from '../../components/common/ScreenLayout';
import {Ionicons} from '@expo/vector-icons';
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import {inviteFamilyApi} from '../../api/FamilyApi';
import {INVITATION_URL, SERVER_URL} from '../../api/ApiConfig';
import Clipboard from '@react-native-clipboard/clipboard';
import Menu from '../../components/myPage/Menu';
import Modal from 'react-native-modal';
import {useWindowDimensions} from 'react-native';
import RNKakaoAdfit, {KakaoAdfit} from '../../components/RNKakaoAdfit';
import {MenuContainer} from './MyPage';
import {StatusBar} from 'react-native';
import {ROUTE_NAME} from '../../Strings';
import {Colors} from '../../Config';
import BannerBar from '../../components/BannerBar';
import {findBannersBarApi} from '../../api/BannerApi';
import InviteModal from '../../components/InviteModal';

export default function FamilyPage({navigation}) {
  const now = new Date().getTime();

  const {
    data: bannersBar,
    isLoading: bannersBarLoading,
    refetch: refetchBars,
  } = useQuery(['BannersBar', ROUTE_NAME.MYPAGE_FAMILY], () =>
    findBannersBarApi({screen: ROUTE_NAME.MYPAGE_FAMILY}),
  );

  const [inviteModal, setInviteModal] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  const inviteFamily = useMutation(inviteFamilyApi, {
    onSuccess: data => {
      setInviteLink(`${INVITATION_URL}/?family=${data?.data.token}`);
    },
  });

  const {width: pageWidth, height: pageHeight} = useWindowDimensions();

  if (bannersBarLoading) {
    return (
      <ScreenLayout>
        <ActivityIndicatorWrapper>
          <ActivityIndicator />
        </ActivityIndicatorWrapper>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <DailyEmotion />
        <MenuContainer>
          {/* <Menu payload={"우리 가족 온도"} /> */}
          <Menu
            // style={{ flex: 1 }}
            action={() => {
              inviteFamily.mutate();
              setInviteModal(!inviteModal);
            }}
            payload={'가족 초대하기'}
          />

          {/* <Menu action={() => {}} payload="기프티콘 보관함" /> */}
          <Menu
            action={() => navigation.navigate(ROUTE_NAME.EDIT_FAMILY_PROFILE)}
            payload="가족 이름 변경"
          />
          <Menu
            action={() => navigation.navigate(ROUTE_NAME.DAILY_EMOTIONS_PAST)}
            payload="그날의 우리가"
          />
        </MenuContainer>

        {/** 배너 광고 */}
        {bannersBar?.data && (
          <BannerBar
            width={pageWidth}
            url={bannersBar.data[now % bannersBar.data.length].url}
            payloadType={
              bannersBar.data[now % bannersBar.data.length].payloadType
            }
            payloadPath={
              bannersBar.data[now % bannersBar.data.length].payloadPath
            }
            description={
              bannersBar.data[now % bannersBar.data.length].description
            }
          />
        )}
        {/* <KakaoAdfit /> */}
      </ScrollView>

      <InviteModal
        inviteModal={inviteModal}
        setInviteModal={setInviteModal}
        inviteLink={inviteLink}
      />
    </ScreenLayout>
  );
}
