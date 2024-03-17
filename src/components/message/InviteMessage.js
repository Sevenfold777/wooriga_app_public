import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, View } from "react-native";
import { TouchableWithoutFeedback, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { BGColors, BottomPhrases, Colors } from "../../Config";
import assetStore from "../../stores/AssetStore";
import { ROUTE_NAME } from "../../Strings";
import { Indicator, IndicatorWrapper } from "../CarouselIndicator";
import ActionIcon from "./ActionIcon";
import {
  Container,
  MessageContainer,
  MessageBackground,
  MessagePayload,
  PromotePayload,
  Actions,
  CommentNum,
  SharedCountContainer,
  SharedCountText,
  Action,
} from "./Message";
import { Ionicons } from "@expo/vector-icons";
import propTypes from "prop-types";
import Clipboard from "@react-native-clipboard/clipboard";
import KakaoShareLink from "@utae/react-native-kakao-share-link";

const InviteText = styled.Text`
  font-family: "nanum-regular";
  padding: 5px 10px;
`;

export default function InviteMessage({ inviteLink }) {
  const { width: pageWidth } = useWindowDimensions();

  const emotion = "comfort";

  const sendKakaoMessage = async () => {
    try {
      const response = await KakaoShareLink.sendFeed({
        content: {
          title: "우리가",
          imageUrl:
            "https://wooriga-dev.s3.ap-northeast-2.amazonaws.com/emotions/invitation.jpeg",
          link: { webUrl: inviteLink, mobileWebUrl: inviteLink },
          description: "우리가족에 초대되었습니다.",
        },
        buttons: [
          {
            title: "초대 확인하기",
            link: { webUrl: inviteLink, mobileWebUrl: inviteLink },
          },
        ],
      });
    } catch (e) {
      console.error(e);
      console.error(e.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => sendKakaoMessage()}>
      <Container>
        <MessageContainer style={{ width: pageWidth }}>
          <MessageBackground
            style={{
              backgroundColor: BGColors[emotion],
            }}
          >
            <View
              style={{
                flex: 1,
                width: "100%",
                // justifyContent: "center",
                alignItems: "center",
                paddingTop: 60,
              }}
            >
              <View style={{ flex: 2 }}>
                <Image
                  source={{ uri: assetStore.messageEmotions[emotion] }}
                  resizeMode="contain"
                  style={{
                    width: 50,
                    height: 50,
                    margin: 12,
                  }}
                />
              </View>
              <View style={{ flex: 5 }}>
                <MessagePayload numberOfLines={2} allowFontScaling={false}>
                  {"가족을 초대하여\n우리가에서 이야기 해요"}
                </MessagePayload>

                <View
                  style={{
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SharedCountContainer>
                    <SharedCountText
                      allowFontScaling={false}
                    >{`초대 링크 보내기`}</SharedCountText>
                    <Ionicons
                      name="paper-plane"
                      color={Colors.white}
                      style={{ marginLeft: 5 }}
                    />
                  </SharedCountContainer>
                </View>
              </View>

              {/* <PromotePayload>{BottomPhrases[emotion]}</PromotePayload> */}
            </View>
          </MessageBackground>
        </MessageContainer>

        <Actions
          style={{
            borderBottomColor: Colors.borderDark,
            borderBottomWidth: 0.3,
          }}
        >
          <Action
            style={{
              flex: 1,
              flexDirection: "row",
              borderRightWidth: 0.5,
              borderRightColor: Colors.borderLight,
              alignItems: "center",
            }}
            onPress={() => {
              Clipboard.setString(inviteLink);
            }}
          >
            <Ionicons name="copy-outline" size={25} style={{ margin: 5 }} />
            <InviteText>초대 링크 복사</InviteText>
          </Action>

          <Action
            style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            onPress={() => sendKakaoMessage()}
          >
            <Image
              source={require("../../../assets/images/kakao.png")}
              //   style={{ width: 22, height: 26 }}
              style={{ width: 24, height: 20 }}
              resizeMode="contain"
            />
            <InviteText>카카오톡 공유</InviteText>
          </Action>
        </Actions>
      </Container>
    </TouchableWithoutFeedback>
  );
}

InviteMessage.propTypes = {
  inviteLink: propTypes.string.isRequired,
};
