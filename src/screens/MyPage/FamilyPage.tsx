import {useMutation, useQuery} from '@tanstack/react-query';
import React, {useState} from 'react';
import DailyEmotion from '../../components/DailyEmotion';
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from '../../components/common/ScreenLayout';
import {ActivityIndicator, ScrollView} from 'react-native';
import {inviteFamilyApi} from '../../api/FamilyApi';
import {INVITATION_URL} from '../../api/ApiConfig';
import Menu from '../../components/myPage/Menu';
import {useWindowDimensions} from 'react-native';
import {MenuContainer} from './MyPage';
import {ROUTE_NAME} from '../../Strings';
import BannerBar from '../../components/BannerBar';
import {findBannersBarApi} from '../../api/BannerApi';
import InviteModal from '../../components/InviteModal';
import {MyPageScreenProps} from '../../navigators/types';

export default function FamilyPage({
  navigation,
}: MyPageScreenProps<'FamilyPage'>) {
  const now = new Date().getTime();

  const {data: bannersBar, isLoading: bannersBarLoading} = useQuery(
    ['BannersBar', ROUTE_NAME.MYPAGE_FAMILY],
    () => findBannersBarApi({screen: ROUTE_NAME.MYPAGE_FAMILY}),
  );

  const [inviteModal, setInviteModal] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  const inviteFamily = useMutation(inviteFamilyApi, {
    onSuccess: data => {
      setInviteLink(`${INVITATION_URL}/?family=${data?.data.token}`);
    },
  });

  const {width: pageWidth} = useWindowDimensions();

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
            action={() => {
              inviteFamily.mutate();
              setInviteModal(!inviteModal);
            }}
            payload={'가족 초대하기'}
          />

          <Menu
            action={() => navigation.navigate('EditFamilyProfile')}
            payload="가족 이름 변경"
          />
          <Menu
            action={() => navigation.navigate('DailyEmotionsPast')}
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
      </ScrollView>

      <InviteModal
        inviteModal={inviteModal}
        setInviteModal={setInviteModal}
        inviteLink={inviteLink}
      />
    </ScreenLayout>
  );
}
