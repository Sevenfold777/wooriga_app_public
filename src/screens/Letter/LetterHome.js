import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import { BGColors, Colors } from "../../Config";
import { ROUTE_NAME } from "../../Strings";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { findBannersBarApi } from "../../api/BannerApi";
import BannerBar from "../../components/BannerBar";
import assetStore from "../../stores/AssetStore";
import {
  EmotionImg,
  HeaderContainer,
  HeaderText,
  LetterContainer,
  LetterText,
} from "../../components/letter/Letter";
import { getLetterGuideApi } from "../../api/LetterApi";

const MailBoxContainer = styled.View`
  justify-content: center;
  align-items: center;
  background-color: ${Colors.sub};
  padding: 10px 0px;
  margin: 10px 10px;

  border-radius: 10px;
`;

const MailBox = styled.TouchableOpacity`
  flex: 1;
  padding: 10px 0px;
  margin: 0px 7px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: ${Colors.sub};
`;

const MenuText = styled.Text`
  /* font-family: "nanum-bold"; */
  font-family: "nanum-regular";
`;

export default function LetterHome({ navigation, route }) {
  const now = new Date();
  const { width: pageWidth } = useWindowDimensions();

  const [title, setTitle] = useState(
    `# ${new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`
  );
  const [payload, setPayload] = useState("사랑하는 우리가족에게\n보내는 편지");
  const [emotion, setEmotion] = useState("happy");

  /** react-query */
  const {
    data: bannersBar,
    isLoading: bannersBarLoading,
    refetch: refetchBars,
  } = useQuery(["BannersBar", ROUTE_NAME.LETTER_HOME], () =>
    findBannersBarApi({ screen: ROUTE_NAME.LETTER_HOME })
  );

  const { data: letterGuide, isLoading: guideLoading } = useQuery(
    ["LetterHomeGuide"],
    getLetterGuideApi,
    {
      onSuccess: ({ data }) => {
        setTitle(data.title);
        setPayload(data.payload);
        setEmotion(data.emotion);
      },
    }
  );

  if (bannersBarLoading || guideLoading) {
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <View>
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

        <MailBoxContainer style={{ backgroundColor: "white" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <MailBox
              onPress={() => navigation.navigate(ROUTE_NAME.LETTER_BOX_NAV)}
            >
              <Image
                source={require("../../../assets/images/mailbox.png")}
                style={{
                  width: 30,
                  height: 60,
                }}
                resizeMode="contain"
              />
              <MenuText allowFontScaling={false}>나의 편지함</MenuText>
            </MailBox>

            <MailBox
              onPress={() => navigation.navigate(ROUTE_NAME.TIME_CAPSULES_NAV)}
            >
              <Image
                source={require("../../../assets/images/timeCapsule.png")}
                style={{
                  width: 40,
                  height: 60,
                }}
                resizeMode="contain"
              />
              <MenuText allowFontScaling={false}>타임캡슐</MenuText>
            </MailBox>

            <MailBox
              onPress={() => navigation.navigate(ROUTE_NAME.LETTER_SEND)}
            >
              <Image
                source={require("../../../assets/images/letterSend.png")}
                style={{
                  width: 35,
                  height: 60,
                }}
                resizeMode="contain"
              />
              <MenuText allowFontScaling={false}>편지 보내기</MenuText>
            </MailBox>
          </View>
        </MailBoxContainer>
      </View>

      <TouchableWithoutFeedback
        onPress={() => navigation.navigate(ROUTE_NAME.LETTER_SEND)}
      >
        <LetterContainer
          style={{
            backgroundColor: BGColors[emotion],
            flex: 1,
          }}
        >
          <HeaderContainer>
            <HeaderText allowFontScaling={false} style={{ flex: 1 }}>
              {title}
            </HeaderText>
          </HeaderContainer>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: Colors.borderDark,
              width: "100%",
              height: 10,
              marginBottom: 10,
            }}
          />
          <LetterText allowFontScaling={false}>{payload}</LetterText>

          <EmotionImg
            source={{ uri: assetStore.messageEmotions[emotion] }}
            resizeMode="contain"
          />
        </LetterContainer>
      </TouchableWithoutFeedback>
    </ScreenLayout>
  );
}
