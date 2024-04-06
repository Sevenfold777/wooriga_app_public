import {useQuery} from '@tanstack/react-query';
import React from 'react';
import {ActivityIndicator, ScrollView, useWindowDimensions} from 'react-native';
import styled from 'styled-components/native';
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from '../../components/common/ScreenLayout';
import Menu from '../../components/myPage/Menu';
import {findMyEmotionTodayApi} from '../../api/DailyEmotionApi';
import DailyEmotion from '../../components/DailyEmotion';
import {ROUTE_NAME} from '../../Strings';
import {findBannersBarApi} from '../../api/BannerApi';
import BannerBar from '../../components/BannerBar';
import {MyPageScreenProps} from '../../navigators/types';

export const ProfileContainer = styled.View`
  padding: 0px 15px;
  align-items: center;
  justify-content: center;
  /* margin-bottom: 20px; */
`;
export const ProfileImage = styled.Image`
  border-radius: 100px;
  width: 100px;
  height: 100px;
`;
export const ProfileName = styled.Text`
  /* padding: 15px; */
  font-size: 18px;
  font-family: 'nanum-bold';
  margin-bottom: 20px;
`;

export const MenuContainer = styled.View`
  padding: 20px 15px;
  margin: 0px 0px;
`;

export default function MyPage({navigation}: MyPageScreenProps<'MyPage'>) {
  const now = new Date().getTime();

  const {data: bannersBar, isLoading: bannersBarLoading} = useQuery(
    ['BannersBar', ROUTE_NAME.MYPAGE_MY],
    () => findBannersBarApi({screen: ROUTE_NAME.MYPAGE_MY}),
  );

  // window dimensions
  const {width: pageWidth} = useWindowDimensions();

  // react-query: myProfile with Emotion
  const {data: me, isLoading: meIsLoading} = useQuery(
    ['MeWithEmotion'],
    findMyEmotionTodayApi,
  );

  if (bannersBarLoading || meIsLoading) {
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
        <ProfileContainer>
          <DailyEmotion isMyPage={true} />
          <ProfileName>{me?.data[0].userName}</ProfileName>
        </ProfileContainer>
        <MenuContainer>
          <Menu
            payload="내 정보 보기"
            action={() => navigation.navigate('EditMyProfile')}
          />
          <Menu
            payload="이야기 보관함"
            action={() => navigation.navigate('MessageKeep')}
          />
          <Menu
            payload="편지 보관함"
            action={() => navigation.navigate('LetterReceivedKept')}
          />
          <Menu payload="설정" action={() => navigation.navigate('Settings')} />
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
    </ScreenLayout>
  );
}
