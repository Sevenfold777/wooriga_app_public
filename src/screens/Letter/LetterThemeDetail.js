import React, { useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  Image,
} from "react-native";
import WebView from "react-native-webview";
import styled from "styled-components/native";
import { RowContainer } from "../../components/Common";
import { ChgHashTagText } from "../../components/letter/LetterTheme";
import ScreenLayout from "../../components/ScreenLayout";
import { Colors } from "../../Config";
import letterStore from "../../stores/LetterStore";
import { ROUTE_NAME } from "../../Strings";
import { Prompt, PromptText } from "../../components/letter/Letter";
import { useQuery } from "@tanstack/react-query";
import { findLetterThemeApi } from "../../api/LetterApi";
import Toast from "../../components/Toast";

const Wrapper = styled.View`
  margin: 0px 10px;
  /* flex: 1; */
`;

const HashTagText = styled(ChgHashTagText)`
  font-size: 14px;
  /* color: black; */
`;

const StartBtn = styled.TouchableOpacity`
  /* position: absolute;
  width: 100%;
  bottom: 10px; */
  justify-content: center;
  align-items: center;
  background-color: ${Colors.main};
  margin: 10px;
  padding: 12px;
  border-radius: 10px;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
`;

const StartBtnText = styled.Text`
  font-size: 16px;
  font-family: "nanum-bold";
`;

export default function LetterThemeDetail({ navigation, route: { params } }) {
  const { width: pageWidth } = useWindowDimensions();

  const { data: theme, isLoading: themeLoading } = useQuery(
    ["LetterTheme", params?.themeId],
    () => findLetterThemeApi({ id: params?.themeId }),
    {
      onSuccess: ({ data }) => {
        if (!data) {
          Toast({ message: "주제를 열 수 없습니다" });
          navigation.goBack();
        }
      },
    }
  );

  if (themeLoading || !theme.data) {
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      {/* <ScrollView showsVerticalScrollIndicator={false} bounces={false}> */}
      <Wrapper style={{ marginBottom: 5 }}>
        <Prompt>
          <PromptText>{theme.data.title}</PromptText>
        </Prompt>

        <RowContainer
          style={{
            alignItems: "center",
            marginVertical: 5,
            marginHorizontal: 20,
          }}
        >
          {theme.data.hashtags.map((tag, index) => (
            <HashTagText key={index}>{`#${tag.name} `}</HashTagText>
          ))}
        </RowContainer>

        {/* <FastImage
          source={{
            uri: theme.data.payload,
          }}
          style={{
            marginTop: 5,
            width: pageWidth,
            height:
            (pageWidth * theme.data.payloadHeight) / theme.data.payloadWidth,
          }}
          resizeMode="contain"
        /> */}
      </Wrapper>

      <WebView
        source={{ uri: theme.data.payload }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        style={{ backgroundColor: Colors.white }}
      />
      {/* </ScrollView> */}

      <StartBtn
        onPress={() => {
          letterStore.setTheme({
            id: theme.data.id,
            title: theme.data.title,
            examples: theme.data.examples.map((example) => example.payload),
          });
          navigation.navigate(ROUTE_NAME.LETTER_SEND, {
            helpModal: params?.isSelect,
          });
        }}
      >
        <StartBtnText>{params?.isSelect ? "선택" : "편지 보내기"}</StartBtnText>
      </StartBtn>
    </ScreenLayout>
  );
}
