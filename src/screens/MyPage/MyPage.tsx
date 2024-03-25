import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from "../../components/ScreenLayout";
import Menu from "../../components/myPage/Menu";
import { findMyEmotionTodayApi } from "../../api/DailyEmotionApi";
import DailyEmotion from "../../components/DailyEmotion";
import RNKakaoAdfit, { KakaoAdfit } from "../../components/RNKakaoAdfit";
import { ROUTE_NAME } from "../../Strings";
import { Colors } from "../../Config";
import { findBannersBarApi } from "../../api/BannerApi";
import BannerBar from "../../components/BannerBar";

const Container = styled.View``;
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
  font-family: "nanum-bold";
  margin-bottom: 20px;
`;

const EditProfileBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: ${Colors.main};
  width: 100px;
  padding: 15px;
  border-radius: 10px;
  margin: 10px;
  font-family: "nanum-regular";
`;

const EditProfileText = styled.Text`
  color: white;
`;

export const MenuContainer = styled.View`
  padding: 20px 15px;
  margin: 0px 0px;
`;

export default function MyPage({ navigation }) {
  const now = new Date().getTime();

  const {
    data: bannersBar,
    isLoading: bannersBarLoading,
    refetch: refetchBars,
  } = useQuery(["BannersBar", ROUTE_NAME.MYPAGE_MY], () =>
    findBannersBarApi({ screen: ROUTE_NAME.MYPAGE_MY })
  );

  // window dimensions
  const { width: pageWidth } = useWindowDimensions();

  // react-query: myProfile with Emotion
  const {
    data: me,
    refetch: refetchMe,
    isLoading: meIsLoading,
  } = useQuery(["MeWithEmotion"], findMyEmotionTodayApi);

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
            action={() => navigation.navigate(ROUTE_NAME.EDIT_MY_PROFILE)}
          />
          <Menu
            payload="이야기 보관함"
            action={() => navigation.navigate(ROUTE_NAME.MESSAGE_KEEP)}
          />
          <Menu
            payload="편지 보관함"
            action={() => navigation.navigate(ROUTE_NAME.LETTER_RECEIVEVD_KEPT)}
          />
          <Menu
            payload="설정"
            action={() => navigation.navigate(ROUTE_NAME.SETTINGS)}
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
    </ScreenLayout>
  );
}
