import { View, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import PagerView from "react-native-pager-view";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../Config";
import { useRef } from "react";

const PageContainer = styled.View`
  position: absolute;
  right: 20px;
  top: 10px;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.5);
`;

const PageText = styled.Text`
  font-family: "nanum-regular";
  color: white;
`;

const NextBtn = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
  top: 80%;
  justify-content: center;
  align-items: center;
  opacity: 0.2;
  padding: 10px 3px;
`;

const PrevBtn = styled.TouchableOpacity`
  position: absolute;
  left: 0px;
  top: 80%;
  justify-content: center;
  align-items: center;
  opacity: 0.2;
  padding: 10px 3px;
`;

export default function Tutorial({ width }) {
  const pagerViewRef = useRef();

  const prefix =
    "https://wooriga-prod.s3.ap-northeast-2.amazonaws.com/intro/intro_";

  const urls = [
    "cover.png",
    "message.png",
    "emotion.png",
    "photo.png",
    "letter_send.png",
    "time_capsule.png",
    // "theme.png",
    // "letter_helper.png",
  ];

  return (
    <PagerView
      initialPage={0}
      style={{ width, aspectRatio: 1 }}
      ref={pagerViewRef}
    >
      {urls.map((url, index) => (
        <View key={index}>
          <FastImage
            source={{ uri: prefix + url }}
            style={{ aspectRatio: 1 }}
          />
          <PageContainer>
            <PageText
              style={{ fontFamily: "nanum-regular", color: "white" }}
            >{`${index + 1} / ${urls.length}`}</PageText>
          </PageContainer>

          {index !== urls.length - 1 && (
            <NextBtn onPress={() => pagerViewRef?.current.setPage(index + 1)}>
              <Ionicons name="chevron-forward" size={40} />
            </NextBtn>
          )}

          {index !== 0 && (
            <PrevBtn onPress={() => pagerViewRef?.current.setPage(index - 1)}>
              <Ionicons name="chevron-back" size={40} />
            </PrevBtn>
          )}
        </View>
      ))}
    </PagerView>
  );
}
